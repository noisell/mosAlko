import {Category, ProductType} from "@/app/home/types";
import {productInstance} from "@/app/home/api";


export async function getProductsByCategory(category: Category): Promise<ProductType[]> {
    const instance = await productInstance();
    const response = await instance.get("/byCategory", {params: {category: category}})
    return response.data;
}