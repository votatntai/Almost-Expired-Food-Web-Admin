import { Branch } from "./branch.type";
import { StoreOwner } from "./store-owner.type";

export interface Campaign {
    id: string,
    storeOwner: StoreOwner,
    branch: Branch,
    name: string,
    thumbnailUrl: string,
    status: string,
    createAt: string,
    startTime: string,
    endTime: string
}