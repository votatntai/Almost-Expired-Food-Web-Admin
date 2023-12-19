import { StoreOwner } from "./store-owner.type";

export interface WithdrawRequest {
    id: string,
    storeOwner: StoreOwner,
    amount: number,
    createAt: string,
    status: string,
    bankAccount: string,
    bankName: string
}