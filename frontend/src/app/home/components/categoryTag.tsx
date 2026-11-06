import React from 'react';
import {CategoriesColorsType, Category} from "@/app/home/types";
import {categoriesTranslate} from "@/app/home/datas";

type Props = {
    categoriesColors: CategoriesColorsType
    handleClick: (id: Category) => void;
    category: Category
}

export function CategoryTag(props: Props) {
    const {categoriesColors, handleClick, category} = props;
    return (
        <span className="px-4 bg-[#111111] rounded-full py-2 cursor-pointer" id={`${category}_title`}
              style={{color: categoriesColors[category]}}
              onClick={() => handleClick(category)}>{categoriesTranslate[category]}</span>
    );
}