import { Spinner } from "react-bootstrap";
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

const DeliveryPath = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();
    if(isLoading) return <Spinner />
    return <div>
        {JSON.stringify(orders)}
    </div>;
}

export default DeliveryPath;