'use client'

import React, {useEffect, useState} from 'react';
import {otherHook} from "@/app/hooks/main";
import {Category, ProductType} from "@/app/home/types";
import {getProductsByCategory} from "@/app/categories/api";
import {categories, categoriesTranslate} from "@/app/home/datas";
import Loading from "@/app/loading";
import {ProductsNotFound} from "@/app/categories/[slug]/productsNotFound";
import {CardProduct} from "@/app/home/components/cardProduct";
import {getDataForOrders} from "@/app/basket/api";

export default function PageCategoryItems({ params }: { params: { slug: Category } }) {
    otherHook("/categories");

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductType[]>([]);

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
        if (categories.includes(params.slug)) {
            getProductsByCategory(params.slug).then(r => {
                setProducts(r);
                setLoading(false);
            })
        }
    }, [])

    if (loading) return <Loading />;
    else if (products.length < 1) return <main><ProductsNotFound/></main>
    return (
        <main style={{paddingBottom: 150}}>
            <p className="w-full text-left font-semibold ml-4">{categoriesTranslate[params.slug]}</p>
            <div className="w-full grid grid-cols-2 items-center gap-1 justify-between mt-3">
                {products.map((product, index) => (
                    <CardProduct {...product} key={index} priceInMKAD={priceInMKAD} priceOutMKAD={priceOutMKAD} priceUpToLevel={priceUpToLevel} minOrderAmount={minOrderAmount}/>
                ))}
            </div>
        </main>
    );
}