import { buffer } from "micro";
import Stripe from "stripe";
import prisma from "@/libs/prismadb";

export const config = {
    api: {
        bodyParser: false
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20"
})

export default async function handler(req, res){
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    if(!sig){
        return res.status(400).send("Missing the stripe signature");
    }

    let event;

    try{
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }catch(err) {
        return res.status(400).send("Webhook Error" + err);
    }

    switch (event.type) {
        case "charge.succeeded" :
            const charge = event.data.object;
            if( typeof charge.payment_intent === "string") {
                await prisma?.order.update({
                    where: {paymentIntentId: charge.payment_intent},
                    data: {status: "complete", address: charge.shipping?.address},
                });
            }
            break;
        default:
            console.log("Unhandled event type:" + event.type);
    }

    res.json({received: true});
}