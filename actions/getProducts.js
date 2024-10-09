import prisma from "@/libs/prismadb";

export default async function getProducts(params) {
    try {
        const {category, searchTerm} = params;
        let searchString = searchTerm;

        if(!searchTerm){
            searchString = "";
        }

        let query = {};

        if (category) {
            query.category = category;
        }

        const products = await prisma.product.findMany({
            where: {
                ...query,
                OR: [
                    {
                        name: {
                            contains: searchString,
                            mode: "insensitive"
                        },
                        description: {
                            contains: searchString,
                            mode: "insensitive"
                        },
                    }
                ]
            },
            include: {
               reviews: {
                include:{
                    user: true
                },
                orderBy: {
                    createdDate: "desc"
                }
               } 
            }
        })

        return products;
    } catch (error) {
        throw new Error(error);
    }
}