import { getCurrentUser } from "@/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function DELETE(request, {params}) {
    // const currentUser = await getCurrentUser();

    // if (!currentUser) {
    //     return NextResponse.error();
    // }

    // if (currentUser !== "USER") {
    //     return NextResponse.error();
    // }

    const product = await prisma?.product.delete({
        where: {id: params.id},
        include: {
            reviews: true,
            
        }
    });

    return NextResponse.json(product);
}