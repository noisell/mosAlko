'use client'

import React, {useEffect, useState} from 'react';
import {mainHook} from "@/app/hooks/main";
import {ProductsType, ProductType} from "@/app/products/types";
import {getProducts} from "@/app/products/api";
import {categoriesTranslate} from "@/app/products/datas";
import {CardProduct} from "@/app/products/components/cardProduct";
import {LoadingComponent} from "@/app/components/loading";
import {NewProduct} from "@/app/products/components/newProduct";
import {data} from "autoprefixer";

export default function ProductsPage() {
    mainHook("/products")

    const [showModalNewProducts, setShowModalNewProducts] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductsType[]>([]);
    useEffect(() => {
        getProducts().then(r => {
            setProducts(r);
            setLoading(false);
        })
    }, []);

    const handleCallback = (data: ProductType) => {
        setProducts(prevState => prevState.map(item => item.category === data.category ? {...item, products: item.products.map(product => product.id === data.id ? data : product)} : item))
    }

    const handleCallbackDelete = (id: number) => {
        setProducts(prevState => prevState.map(item => ({...item, products: item.products.filter(product => product.id !== id)})))
    }

    const handleCallbackCreateProduct = (product: ProductType) => {
        setProducts(prevState => prevState.map(item => item.category === product.category ? {...item, products: [...item.products, product]} : item));
    }

    if (loading) return <main><LoadingComponent/></main>;
    return (
        <main>
            <div className="flex flex-col w-full h-full pt-3">
                <div className="flex w-full items-center pl-5 gap-3 font-sans">
                    <h1 className="text-[20px] leading-5 font-semibold text-black">Товары</h1>
                    <div
                        className="flex items-center justify-center py-2 px-3 text-[16px] leading-4 font-normal bg-blue-500 text-white rounded-xl">
                        {products.reduce((a, b) => {
                            return a + b.products.length
                        }, 0)} шт
                    </div>
                    <div
                        className="flex items-center justify-center py-2 px-3 text-[16px] leading-4 font-normal bg-orange-500 text-white rounded-xl">
                        {products.reduce((a, b) => {
                            return a + b.products.filter(item => item.hit).length
                        }, 0)} хит
                    </div>
                    <div
                        className="flex items-center justify-center py-2 px-3 text-[16px] leading-4 font-normal bg-red-500 text-white rounded-xl">
                        {products.reduce((a, b) => {
                            return a + b.products.filter(item => !item.active).length
                        }, 0)} выкл
                    </div>
                    <button
                        className="flex ml-auto items-center justify-center py-2 px-5 text-[16px] leading-4 font-normal bg-green-500 text-white rounded-xl"
                        onClick={() => {
                            setShowModalNewProducts(true)
                        }}
                    >
                        Создать +
                    </button>
                </div>
                <div
                    className="flex flex-col w-full h-full rounded-[32px] bg-[#FFFFFF] mt-5 overflow-scroll px-7 py-7 font-sans">
                    {products.map((product, index) => (
                        <div className="flex flex-col w-full gap-3 mb-6" key={index} id={product.category}>
                            <p className="font-semibold ml-4">{categoriesTranslate[product.category]} • {product.products.length} шт</p>
                            <div className="w-full flex flex-col items-center gap-3">
                                {product.products.map((product, index) => (
                                    <CardProduct {...product} key={index} callback={handleCallback} callbackDelete={handleCallbackDelete}/>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <NewProduct showModalNewProducts={showModalNewProducts} setShowModalNewProducts={setShowModalNewProducts} callback={handleCallbackCreateProduct} />
        </main>
    );
}