import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request) {
    const currentUser = await getCurrentUser();

    // if (!currentUser) {
    //     return NextResponse.error();
    // }

    const body = await request.json();
    const {comment, rating, product, userId} = body;

    const  deliveryOrder = currentUser?.orders.some(order => order.products.find(item => item.id === product.id) && order.deliveryStatus === "delivered");

    const userReview = product?.reviews.find(((review) =>{
        return review.userId === currentUser.id
    }))

    if (userReview || !deliveryOrder) {
        return NextResponse.error();
    }

    const review = await prisma?.review.create({
        data: {
            comment,
            rating,
            productId: product.id,
            userId
        }
    })

    return NextResponse.json(review);
}