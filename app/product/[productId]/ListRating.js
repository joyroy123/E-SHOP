"use client";

import Avater from "@/app/components/Avater";
import Heading from "@/app/components/Heading";
import { Rating } from "@mui/material";
import moment from "moment";

const ListRating = ({product}) => {
    if (product.reviews.length === 0) {
        return null;
    }
    return ( 
        <div>
            <Heading title="Product Review" />
            <div className="text-sm mt-2">
                {
                    product.reviews && product.reviews.map((review) => {
                        return(
                            <div key={review.id} className="max-w-[300px]">
                                <div className="flex gap-2 items-center">
                                    <Avater src={review?.user.image} />
                                    <div className="font-semibold">{review?.user.name}</div>
                                    <div className="font-light">{moment(review.createdDate).fromNow()}</div>
                                </div>
                                <div className="mt-2">
                                    <Rating value={review.rating} readOnly />
                                    <div className="ml-2">{review.comment}</div>
                                    <hr className="mt-4 mb-4" />
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
     );
}
 
export default ListRating;