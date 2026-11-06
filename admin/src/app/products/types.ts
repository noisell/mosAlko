import {getSpecificationsCategory} from "@/app/products/api";

export type Category = "whiskey" | "beer" | "champagne" | "vodka" | "vermouth" | "cognac" | "liquor" | "tequila" | "wine" | "rum" | "gin" | "necessary";
export type CategoryRus = "Виски" | "Пиво" | "Шампанское" | "Водка" | "Вермут" | "Коньяк" | "Ликер" | "Текила" | "Вино" | "Ром" | "Джин" | "Нужное";

export type SpecificationsSimpleType = {
    id: number;
    value: string;
    name: string;
}

export type SpecificationsSimpleNewType = {
    value: string;
    name: string;
}

export type ProductType = {
    id: number;
    category: Category;
    name: string;
    price: number;
    old_price: number | null;
    size: string;
    image: string;
    hit: boolean;
    active: boolean;
    specifications: SpecificationsSimpleType[];
    search_tags: string[];
}

export type ProductCreateType = {
    category: Category;
    name: string;
    price: number;
    old_price: number | null;
    size: string;
    image: string;
    hit: boolean;
    active: boolean;
    specifications: SpecificationsSimpleNewType[];
}

export type ProductsType = {
    category: Category;
    products: ProductType[];
}

export type CategoriesTranslateType = Record<Category, CategoryRus>;

export type SpecificationsCategoryType = {
    value: string;
}

export type ChangeProductImageType = {
    image: string;
    product_id: number;
}

export type ChangeProductType = {
    product_id: number;
    name: string;
    price: number;
    old_price: number | null;
    size: string;
    hit: boolean;
    active: boolean;
}


export type SearchTagCreateType = {
    product_id: number;
    value: string;
}