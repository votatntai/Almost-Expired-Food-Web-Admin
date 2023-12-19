import { Category } from "./category.type";

export interface Product {
    id: string,
    name: string,
    description?: string,
    sold: number,
    quantity: number,
    price: number,
    promotionalPrice?: number,
    expiredAt: string,
    rated?: number,
    createAt: string,
    status: string,
    thumbnailUrl: string,
    productCategories: Category[]
}