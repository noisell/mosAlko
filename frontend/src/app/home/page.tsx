'use client'

import React, {useState, useEffect, useRef} from 'react';
import {mainHook} from "@/app/hooks/main";
import {CardProduct} from "@/app/home/components/cardProduct";
import {Footer} from "@/app/components/footer";
import {BlockVisibilityType, CategoriesColorsType, Category, ProductsType} from "@/app/home/types";
import {getProducts} from "@/app/home/api";
import {categoriesColorsData, categoriesTranslate} from "@/app/home/datas";
import {HeaderHome} from "@/app/home/components/headerHome";
import {FirstHeaderHome} from "@/app/home/components/firstHeaderHome";
import {calculateVisibilityPercentage} from "@/app/utils";
import {getDataForOrders} from "@/app/basket/api";


export default function Page() {
    mainHook("/home")
    const [products, setProducts] = useState<ProductsType[]>([]);
    const [categoriesColors, setCategoriesColors] = useState<CategoriesColorsType>(categoriesColorsData);
    const mainRef = useRef<HTMLElement>(null);

    const [priceInMKAD, setPriceInMKAD] = useState<number>(0)
    const [priceOutMKAD, setPriceOutMKAD] = useState<number>(0)
    const [priceUpToLevel, setPriceUpToLevel] = useState<number>(0)
    const [minOrderAmount, setMinOrderAmount] = useState<number>(0)

    useEffect(() => {
        getDataForOrders().then(r => {
            r.forEach((value) => {
                if (value.name === "price_in_MKAD") setPriceInMKAD(Number(value.value))
                else if (value.name === "price_out_MKAD") setPriceOutMKAD(Number(value.value))
                else if (value.name === "price_up_to_level") setPriceUpToLevel(Number(value.value))
                else if (value.name === "min_order_amount") setMinOrderAmount(Number(value.value))
            })
        })
        getProducts().then(r => {
            setProducts(r)
        })
    }, []);

    const getMaxCategory = (cat: BlockVisibilityType): Category => {
        const maxEntry = Object.entries(cat).reduce((prev, curr) => {
            return curr[1] > prev[1] ? curr : prev; // Сравниваем текущую и предыдущую категории по значению
        });
        return maxEntry[0] as Category; // Возвращаем название категории (первый элемент)
    };

    const changeCategoryColor = (maxCategory: Category) => {
        setCategoriesColors({
            whiskey: maxCategory === "whiskey" ? "#FFFFFF": "#757575",
            beer: maxCategory === "beer" ? "#FFFFFF": "#757575",
            champagne: maxCategory === "champagne" ? "#FFFFFF": "#757575",
            vodka: maxCategory === "vodka" ? "#FFFFFF": "#757575",
            vermouth: maxCategory === "vermouth" ? "#FFFFFF": "#757575",
            cognac: maxCategory === "cognac" ? "#FFFFFF": "#757575",
            liquor: maxCategory === "liquor" ? "#FFFFFF": "#757575",
            tequila: maxCategory === "tequila" ? "#FFFFFF": "#757575",
            wine: maxCategory === "wine" ? "#FFFFFF": "#757575",
            rum: maxCategory === "rum" ? "#FFFFFF": "#757575",
            gin: maxCategory === "gin" ? "#FFFFFF": "#757575",
            necessary: maxCategory === "necessary" ? "#FFFFFF": "#757575",
        })
    }

    useEffect(() => {
        const updateVisibility = () => {
            const a = ({
                whiskey: calculateVisibilityPercentage(document.getElementById("whiskey")),
                beer: calculateVisibilityPercentage(document.getElementById("beer")),
                champagne: calculateVisibilityPercentage(document.getElementById("champagne")),
                vodka: calculateVisibilityPercentage(document.getElementById("vodka")),
                vermouth: calculateVisibilityPercentage(document.getElementById("vermouth")),
                cognac: calculateVisibilityPercentage(document.getElementById("cognac")),
                liquor: calculateVisibilityPercentage(document.getElementById("liquor")),
                tequila: calculateVisibilityPercentage(document.getElementById("tequila")),
                wine: calculateVisibilityPercentage(document.getElementById("wine")),
                rum: calculateVisibilityPercentage(document.getElementById("rum")),
                gin: calculateVisibilityPercentage(document.getElementById("gin")),
                necessary: calculateVisibilityPercentage(document.getElementById("necessary")),
            })
            const maxCategory = getMaxCategory(a)
            changeCategoryColor(maxCategory)
            const element = document.getElementById(maxCategory + "_title")
            if (element) {
                element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: "nearest" });
            }
        };
        updateVisibility()

        const handleScroll = () => {
            requestAnimationFrame(updateVisibility);
        };

        const mainElement = mainRef.current;

        if (mainElement) {
            updateVisibility();
            mainElement.addEventListener('scroll', handleScroll);

            return () => {
                mainElement.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    const handleClickTag = (id: Category) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light")
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView();
            mainRef.current?.scrollBy({top: -90});
        }
    };

    return (
        <main style={{paddingTop: 0}} ref={mainRef}>
            <FirstHeaderHome />
            <HeaderHome categoriesColors={categoriesColors} handleClick={handleClickTag} products={products} />
            {products.map((product, index) => (
                <div className="flex flex-col w-full gap-2 pt-4" key={index} id={product.category}>
                    <p className="font-semibold ml-4">{categoriesTranslate[product.category]}</p>
                    <div className="w-full grid grid-cols-2 items-center gap-1 justify-between">
                        {product.products.map((product, index) => (
                            <CardProduct {...product} key={index} priceInMKAD={priceInMKAD} priceOutMKAD={priceOutMKAD} priceUpToLevel={priceUpToLevel} minOrderAmount={minOrderAmount} />
                        ))}
                    </div>
                </div>
            ))}
            {products.length < 1 &&
                <div className="flex flex-col w-full gap-2 pt-4">
                    <p className="font-semibold ml-4 text-white">Виски</p>
                    <div className="w-full grid grid-cols-2 items-center gap-1 justify-between">
                        {[1, 2, 3, 4, 5, 6].map(number => (<div key={number} className="w-full h-[335px] rounded-[32px] animate-skeleton"/>))}
                    </div>
                </div>
            }
            <Footer/>
        </main>
    );
}