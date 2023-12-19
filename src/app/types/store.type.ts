import { Branch } from "./branch.type";
import { StoreOwner } from "./store-owner.type";

export interface Store {
    id: string,
    name: string,
    thumbnailUrl?: string,
    description?: string,
    rated?: string,
    createAt: string,
    storeOwner: StoreOwner,
    branches: Branch[]
}