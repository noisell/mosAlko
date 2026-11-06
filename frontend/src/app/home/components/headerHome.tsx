import React, {useState} from 'react';
import {SearchDrinkInput} from "@/app/components/searchDrink/searchDrinkInput";
import {CategoriesColorsType, Category, ProductsType} from "@/app/home/types";
import {CategoryTag} from "@/app/home/components/categoryTag";

type Props = {
    categoriesColors: CategoriesColorsType
    handleClick: (id: Category) => void;
    products: ProductsType[];
}

export function HeaderHome(props: Props) {
    const {categoriesColors, handleClick} = props;

    return (
        <div className="sticky flex flex-col w-full top-0 bg-[#171717] py-2" id={"header"} style={{zIndex: 100}}>
            <SearchDrinkInput products={props.products}/>
            <div className="w-full flex items-center overflow-x-auto gap-1 mt-2 text-xs font-medium">
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"whiskey"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"beer"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"champagne"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"vodka"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"vermouth"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"cognac"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"liquor"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"tequila"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"wine"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"rum"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"gin"} />
                <CategoryTag categoriesColors={categoriesColors} handleClick={handleClick} category={"necessary"} />
            </div>
        </div>
    );
}