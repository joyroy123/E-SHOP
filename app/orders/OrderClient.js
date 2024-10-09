"use client";

import ActionBtn from "@/app/components/ActionBtn";
import Heading from "@/app/components/Heading";
import Status from "@/app/components/Status";
import { formatPrice } from "@/utils/formatPrice";
import {DataGrid} from "@mui/x-data-grid"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";
import moment from "moment";

const OrderClient = ({orders}) => {

    const router = useRouter();
    let rows = [];

    if(orders){
        rows = orders.map((order) =>{
            return {
                id: order.id,
                customer: order.user.name,
                amount: formatPrice(order.amount),
                paymentStatus: order.status,
                date: moment(order.createDate).fromNow(),
                deliveryStatus: order.deliveryStatus,
            };
        });
    }

    const columns = [
        {field: "id", headerName: "ID", width: 220},

        {field: "customer", headerName: "Customer Name", width: 130},

        {field: "amount", headerName: "Amount", width: 130, renderCell: (params) =>{return(<div className="font-bold text-slate-800">{params.row.amount}</div>)}},


        {field: "paymentStatus", headerName: "Payment Status", width: 130, renderCell: (params) =>{return(<div>{params.row.paymentStatus === "pending" ? (<Status text="Pending" icon={MdAccessTimeFilled} bg="bg-slate-200" color="text-slate-700" />) : params.row.paymentStatus === "complete" ? (<Status text="Completed" icon={MdDone} bg="bg-green-200" color="text-green-700" />): <></>}</div>)}},

        {field: "deliveryStatus", headerName: "Delivery Status", width: 130, renderCell: (params) =>{return(<div>{params.row.deliveryStatus === "pending" ? (<Status text="Pending" icon={MdAccessTimeFilled} bg="bg-slate-200" color="text-slate-700" />) : params.row.deliveryStatus === "dispatched" ? (<Status text="Dispatched" icon={MdDeliveryDining} bg="bg-purple-200" color="text-purple-700" />): params.row.deliveryStatus === "delivered" ? (<Status text="Delivered" icon={MdDone} bg="bg-green-200" color="text-greem-700" />): <></>}</div>)}},

        {field: "date", headerName: "Date", width: 130},

        {field: "action", headerName: "Action", width: 200, renderCell: (params) =>{return(<div className="flex justify-between gap-4 w-full mt-[10px]">

            <ActionBtn icon={MdRemoveRedEye} onClick={()=> {router.push(`/order/${params.row.id}`)}} />
        </div>)}},
    ];



    return ( 
        <div className="max-w-[1150px] m-auto text-xl">
            <div className="mb-4 mt-8">
                <Heading title="Manage Orders" center />
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
 
export default OrderClient;