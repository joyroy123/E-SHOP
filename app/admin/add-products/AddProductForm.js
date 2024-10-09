"use client";

import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import CustomCheckbox from "@/app/components/inputs/CustomCheckbox";
import Input from "@/app/components/inputs/Input";
import SelectColor from "@/app/components/inputs/SelectColor";
import TextArea from "@/app/components/inputs/TextArea";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Colors";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import firebaseapp from "@/libs/firebase";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddProductForm = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState();
    const [isProductCreated, setIsProductCreated] = useState(false);

    const {register, handleSubmit, setValue, watch, reset, formState: {errors}} = useForm({
        defaultValues: {
            name: "",
            description: "",
            brand: "",
            category: "",
            isStock: false,
            images: [],
            price: "",
        },
    });


    useEffect(() => {
        setCustomValue("images", images);
    }, [images]);

    useEffect(() => {
        if(isProductCreated){
            reset();
            setImages(null);
            setIsProductCreated(false);
        }
    }, [isProductCreated]);

    const onSubmit = async(data) => {
        console.log("Product Data", data);
        // upload images to firebase
        // save product to mongodb
        setIsLoading(true);
        let uploadedImages = [];

        if(!data.category){
            setIsLoading(false);
            return toast.error("Category is not selected!");
        }

        if(!data.images || data.images.length === 0){
            setIsLoading(false);
            return toast.error("No selected images!");
        }

        const handleImageUploads = async ()=> {
            toast("Creating product, please wait...");

            try {
                for(const item of data.images){
                    if(item.image){
                        const fileName = new Date().getTime() + "-" + item.image.name;
                        const storage = getStorage(firebaseapp);
                        const storageRef = ref(storage, `products/${fileName}`);
                        const uploadTask = uploadBytesResumable(storageRef, item.image);

                        await new Promise((resolve, reject) => {
                            uploadTask.on(
                                "state_changed",
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log("Upload is: " + progress + "% done");
                                    switch(snapshot.state){
                                        case "paused":
                                            console.log("Upload is paused");
                                        break;
                                        case "running":
                                            console.log("Upload is running");
                                        break;
                                    }
                                },
                                (error) => {
                                    // Handle unsuccessful uploads
                                    console.log("Error uploading image", error);
                                    reject(error);
                                },
                                ()=> {
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                        uploadedImages.push({
                                            ...item,
                                            image: downloadURL,
                                        });
                                        console.log("File available at", downloadURL);
                                        resolve();
                                    }).catch((error) =>{
                                        console.log("Error getting the download URL", error);
                                        reject(error);
                                    });
                                }
                            );
                        })
                    }
                }
            } catch (error) {
                setIsLoading(false);
                console.log("Error handling image uploads", error);
                return toast.error("Error handling image uploads");
            }
        };

        await handleImageUploads();
        const productData = {...data, images: uploadedImages};
        console.log("productData", productData);

        axios.post("/api/product", productData).then(() =>{
            toast.success("Product Created");
            setIsProductCreated(true);
            router.refresh();
        }).catch((error) =>{
            console.log(error);
            toast.error("Somthing went wrong when saving product to db");
        }).finally(()=>{
            setIsLoading(false);
        });

    };

    const category = watch("category");

    const setCustomValue = (id, value) =>{
        setValue(id, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    };


    const addImageToState = useCallback((value) => {
        setImages((prev) =>{
            if(!prev){
                return[value];
            }

        return [...prev, value];
        });
    }, []);


    const removeImageFromState = useCallback((value) => {
        setImages((prev) => {
            if(prev){
                const filteredImages = prev.filter((item) => item.color !== value.color);
                return filteredImages;
            }

            return prev;
        });
    }, []);


    return ( 
        <>
            <Heading title="Add a Product" center />

            <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required />

            <Input id="price" label="Price" disabled={isLoading} register={register} errors={errors} type="number" required />

            <Input id="brand" label="Brand" disabled={isLoading} register={register} errors={errors} required />

            <TextArea id="description" label="Description" disabled={isLoading} register={register} errors={errors} required />

            <CustomCheckbox id="inStock" register={register} label="This product is InStock" />

            <div className="w-full font-medium">
                <div className="mb-2 font-semibold">Select a Category</div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-auto">
                    {categories.map((item) => {
                        if(item.label === "All"){
                            return null;
                        }

                        return <div key={item.label} className="col-span">
                            <CategoryInput onClick={(category)=> setCustomValue("category", category)} selected={category === item.label} label={item.label} icon={item.icon} />
                        </div>;
                    })}
                </div>
            </div>

            <div className="w-full flex flex-col flex-wrap gap-4">
                <div>
                    <div className="font-bold">
                        Select the available product colors and upload their images.
                    </div>
                    <div className="text-sm">
                        You must upload an image for each of color selected otherwise your color selection will be ignored.
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {colors.map((item, index) => {
                        return <SelectColor key={index} item={item} addImageToState={ addImageToState} removeImageFromState={removeImageFromState} isProductCreated={isProductCreated} />
                    })}
                </div>
            </div>

            <Button label={isLoading ? "Loading..." : "Add Product"} onClick={handleSubmit(onSubmit)} />

        </>
     );
}
 
export default AddProductForm;