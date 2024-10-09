"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import { Rating } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddRating = ({product, user}) => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {register, handleSubmit, setValue, reset, formState: {errors}} = useForm({
        defaultValues:{
            comment:"",
            rating: 0
        }
    });

    const setCustomValue = (id, value)=> {
        setValue(id,value, {
            shouldTouch: true,
            shouldDirty: true,
            shouldValidate: true
        })
    }

    const onSubmit = async(data)=> {
        setIsLoading(true);

        // if (data.rating === 0) {
        //     setIsLoading(false);
        //     return toast.error("No rating selected");
        // }
        const ratingData = {...data, userId: user?.id, product: product}

        axios.post("/api/rating", ratingData).then(()=>{
            toast.success("Rating Submitted");
            router.refresh();
            reset();
        }).catch((error)=>{
            toast.error("Something went wrong");
        }).finally(()=>{
            setIsLoading(false);
        })
    }

    if (!user || !product) {
        return null;
    }

    const  deliveryOrder = user?.orders.some(order => order.products.find(item => item.id === product.id) && order.deliveryStatus === "delivered");

    const userReview = product?.reviews.find(((review) =>{
        return review.userId === user.id
    }))

    if (userReview || !deliveryOrder) {
        return null;
    }

    return ( 
        <div className="flex flex-col gap-2 max-w-[500px]">
            <Heading title="Rate this product" />
            <Rating onChange={(event, newValue) => {
                setCustomValue("Rating", newValue)
            }} />

            <Input id="comment" label="Comment" disabled={isLoading} register={register} errors={errors} required />

            <Button label={isLoading ? "Loading" : "Rate Product"} onClick={handleSubmit(onSubmit)} />
        </div>
    );
}
 
export default AddRating;