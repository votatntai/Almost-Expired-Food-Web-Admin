import { Branch } from "./branch.type";
import { Customer } from "./customer.type";
import { OrderDetail } from "./order-detail.type";
import { Store } from "./store.type";

export interface Order {
    id: string,
    amount: number,
    store: Store,
    branch: Branch,
    isPayment: boolean,
    createAt: string,
    status: string,
    paymentMethod?: string,
    orderDetails: OrderDetail[],
    customer: Customer
}