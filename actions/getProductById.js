import prisma from "@/libs/prismadb";

export default async function getProductById(params) {
    try {
        const {productId} = params;

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                reviews: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        createdDate: "desc"
                    },
                },
            },
        });

        if(!product){
            return null;
        }

        return product;
    } catch (error) {
        throw new Error(error);
        
    }
}