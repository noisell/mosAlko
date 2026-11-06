'use client'

import React, {useEffect, useState} from 'react';
import {mainHook} from "@/app/hooks/main";
import {SearchDrinkInput} from "@/app/components/searchDrink/searchDrinkInput";
import {Footer} from "@/app/components/footer";
import {CardCategory} from "@/app/categories/components/cardCategory";
import {getProducts} from "@/app/home/api";
import {ProductsType} from "@/app/home/types";

export default function Page() {
    mainHook("/categories")

    const [products, setProducts] = useState<ProductsType[]>([]);
    useEffect(() => {
        getProducts().then(r => {
            setProducts(r)
        })
    }, []);
    return (
        <main>
            <SearchDrinkInput products={products}/>
            <div className="w-full flex flex-col mt-6 gap-3">
                <CardCategory category={"whiskey"} photo="/whiskey.png" name="Виски" description="Крепкий алкогольный напиток, произведенный путем дистилляции зернового бражения и выдержанный в деревянных бочках."/>
                <CardCategory category={"beer"} photo="/beer.png" name="Пиво" description="Алкогольный напиток, произведенный путем брожения солодового зерна с использованием дрожжей и хмеля."/>
                <CardCategory category={"champagne"} photo="/champagne.png" name="Шампанское" description="Игристое вино, произведенное в регионе Шампань во Франции по определенной технологии."/>
                <CardCategory category={"vodka"} photo="/vodka.png" name="Водка" description="Крепкий алкогольный напиток, обычно производимый путем дистилляции ферментированного зерна или картофеля."/>
                <CardCategory category={"vermouth"} photo="/vermouth.png" name="Вермут" description="Крепленое вино, ароматизированное травами и специями."/>
                <CardCategory category={"cognac"} photo="/cognac.png" name="Коньяк" description="Крепкий алкогольный напиток, произведенный путем дистилляции виноградного вина и выдержанный в дубовых бочках."/>
                <CardCategory category={"liquor"} photo="/liquor.png" name="Ликер" description="Сладкий алкогольный напиток, ароматизированный фруктами, травами, специями, цветами, сливками или другими ингредиентами."/>
                <CardCategory category={"tequila"} photo="/tequila.png" name="Текила" description="Крепкий алкогольный напиток, произведенный из голубой агавы в определенных регионах Мексики."/>
                <CardCategory category={"wine"} photo="/wine.png" name="Вино" description="Алкогольный напиток, произведенный путем брожения виноградного сока."/>
                <CardCategory category={"rum"} photo="/rum.png" name="Ром" description="Крепкий алкогольный напиток, произведенный путем дистилляции продуктов переработки сахарного тростника."/>
                <CardCategory category={"gin"} photo="/gin.png" name="Джин" description="Крепкий алкогольный напиток, ароматизированный можжевельником и другими растительными компонентами."/>
                <CardCategory category={"necessary"} photo="/necessary.png" name="Нужное" description="Снеки, закуски и прочие - все, что будет идеально сочетаться с вашими любимыми напитками."/>
            </div>
            <Footer/>
        </main>
    );
}