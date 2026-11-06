import {axiosBaseInstance} from "@/app/api";
import {ProductsType} from "@/app/home/types";

export async function productInstance() {
    return await axiosBaseInstance(false, "/product");
}

export async function getProducts(): Promise<ProductsType[]> {
    const instance = await productInstance();
    const response = await instance.get("")
    return response.data;
}