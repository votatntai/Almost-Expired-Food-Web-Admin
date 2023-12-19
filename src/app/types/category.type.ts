import { CategoryGroup } from "./category-group.type";

export interface Category {
    id: string,
    name: string,
    thumbnailUrl: string,
    categoryGroup: CategoryGroup
}