import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";


export async function POST(request) {
    // const currentUser = getCurrentUser();

    // if (!currentUser) {
    //     return NextResponse.error();
    // }

    // if (currentUser !== "USER") {
    //     return NextResponse.error();
    // }

    const body = await request.json();
    const {name, description, price, brand, category, inStock, images} = body;
    // console.log('body:' , body);

    const product = await prisma.product.create({
        data: {
            name, description, price: parseFloat(price), brand, category, inStock, images
        },
    });

    return NextResponse.json(product);
    
}


export async function PUT(request) {
    // const currentUser = getCurrentUser();

    // if (!currentUser || currentUser.role !== "USER") {
    //     return NextResponse.error();
    // }

    const body = await request.json();
    const {id, inStock} = body;

    const product = await prisma.product.update({
        where: {id: id},
        data: {inStock},
    });

    return NextResponse.json(product);
}