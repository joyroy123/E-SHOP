import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
// import { getCurrentUser } from "@/actions/getCurrentUser";


export async function PUT(request) {
    // const currentUser = getCurrentUser();

    // if (!currentUser) {
    //     return NextResponse.error();
    // }

    // if (currentUser !== "ADMIN") {
    //     return NextResponse.error();
    // }

    const body = await request.json();
    const {id, deliveryStatus} = body;

    const order = await prisma.order.update({
        where: {id: id},
        data: {deliveryStatus},
    });

    return NextResponse.json(order);
}