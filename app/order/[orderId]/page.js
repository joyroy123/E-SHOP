import Container from "@/app/components/Container";
import OrderDetails from "./OrderDetails";
import getOrderById from "@/actions/getOrderById";
import NullData from "@/app/components/NullData";


const Order = async({params}) => {

    const order = await getOrderById(params);

    if(!order) return <NullData title="No Data"></NullData>

    return ( 
        <div className="p-8">
            <Container>
                <OrderDetails order={order} />
            </Container>
        </div>
    );
}
 
export default Order;