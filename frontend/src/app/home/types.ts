export type Category = "whiskey" | "beer" | "champagne" | "vodka" | "vermouth" | "cognac" | "liquor" | "tequila" | "wine" | "rum" | "gin" | "necessary";
export type CategoryRus = "Виски" | "Пиво" | "Шампанское" | "Водка" | "Вермут" | "Коньяк" | "Ликер" | "Текила" | "Вино" | "Ром" | "Джин" | "Нужное";

export type SpecificationsSimpleType = {
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

export type ProductsType = {
    category: Category;
    products: ProductType[];
}

export type CategoryColorType = "#FFFFFF" | "#757575";

export type CategoriesColorsType = Record<Category, CategoryColorType>

export type CategoriesTranslateType = Record<Category, CategoryRus>;

export type BlockVisibilityType = Record<Category, number>;


export type HintType = {
    id: number;
    name: string;
    image: string;
    size: string;
    price: number;
    matchScore: number;
}
