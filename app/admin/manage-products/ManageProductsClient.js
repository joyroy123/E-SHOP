"use client";

import ActionBtn from "@/app/components/ActionBtn";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { formatPrice } from "@/utils/formatPrice";
import {DataGrid} from "@mui/x-data-grid"
import axios from "axios";
import firebaseapp from "@/libs/firebase";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { MdCached, MdClose, MdDelete, MdDone, MdRemoveRedEye } from "react-icons/md";

const ManageProductsClient = ({products}) => {

    const router = useRouter();
    const storage = getStorage(firebaseapp);
    let rows = [];

    if(products){
        rows = products.map((product) =>{
            return {
                id: product.id,
                name: product.name,
                price: formatPrice(product.price),
                category: product.category,
                brand: product.brand,
                inStock: product.inStock,
                images: product.images,
            };
        });
    }

    const columns = [
        {field: "id", headerName: "ID", width: 220},
        {field: "name", headerName: "Name", width: 220},
        {field: "price", headerName: "Price", width: 100, renderCell: (params) =>{return(<div className="font-bold text-slate-800">{params.row.price}</div>)}},
        {field: "category", headerName: "Category", width: 100},
        {field: "brand", headerName: "Brand", width: 100},

        {field: "inStock", headerName: "InStock", width: 120, renderCell: (params) =>{return(<div>{params.row.inStock === true ? (<Status text="InStock" icon={MdDone} bg="bg-teal-200" color="text-teal-700" />) : (<Status text="Out of Stock" icon={MdClose} bg="bg-rose-200" color="text-rose-700" />)}</div>)}},

        {field: "action", headerName: "Action", width: 200, renderCell: (params) =>{return(<div className="flex justify-between gap-4 w-full mt-[10px]">
            <ActionBtn icon={MdCached} onClick={()=> {
                handleToggleStock(params.row.id, params.row.inStock);
            }} />
            <ActionBtn icon={MdDelete} onClick={()=> {
                handleDelete(params.row.id, params.row.images);
            }} />
            <ActionBtn icon={MdRemoveRedEye} onClick={()=> {router.push(`/product/${params.row.id}`)}} />
        </div>)}},
    ];

    const handleToggleStock = useCallback((id, inStock)=> {
        axios.put("/api/product", {
            id,
            inStock: !inStock,
        }).then((res) => {
            toast.success("Product Status Changed");
            router.refresh();
        }).catch((err) =>{
            toast.error("Oops! Something went wrong");
            console.log(err);
        })
    }, []);

    const handleDelete = useCallback(async(id, images) => {
        toast("Deleting product, please wait...");

        const handleImageDelete = async() =>{
            try {
                for(const item of images){
                    if (item.image) {
                        const imageRef = ref(storage, item.image);
                        await deleteObject(imageRef);
                        console.log("Image deleted", item.image);
                    }
                }
            } catch (error) {
                return console.log("Deleting images error", error)
            }
        };

        await handleImageDelete();

        axios.delete(`/api/product/${id}`).then((res)=> {
            toast.success("Product Deleted");
            router.refresh();
        }).catch((err)=>{
            toast.error("Failed to delete product");
            console.log(err);
        });

    }, []);

    return ( 
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Manage Products" center />
            </div>

            <div style={{height: 600, width: "100%"}}>
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 5},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    disableRowSelectionOnClick

                />
            </div>
            
        </div>
    );
}
 
export default ManageProductsClient;