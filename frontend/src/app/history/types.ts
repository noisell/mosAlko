
export type SpecificationsForHistoryType = {
    value: string;
}

export type ProductForHistoryType = {
    id: number;
    name: string;
    image: string;
    size: string;
    specifications: SpecificationsForHistoryType[];
}

export type ProductsHistoryType = {
    price: number;
    count: number;
    product: ProductForHistoryType;
}

export type OrderHistoryType = {
    id: number;
    amount: number;
    address: string;
    created_at: string;
    products: ProductsHistoryType[];
}

export type OrderRepeatType = {
    product_id: number;
    count: number;
}