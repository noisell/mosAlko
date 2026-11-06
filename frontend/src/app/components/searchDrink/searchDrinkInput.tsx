import React, {useEffect, useState} from 'react';
import {SearchIcon} from "@/app/icons/searchIcon";
import {HintType, ProductsType} from "@/app/home/types";
import {RightOutlined} from '@ant-design/icons';
import {useRouter} from "next/navigation";
import {numberFormat} from "@/app/utils";

type Props = {
    products: ProductsType[];
}

export function SearchDrinkInput(props: Props) {
    const router = useRouter();

    const [value, setValue] = useState<string>("");
    const [focused, setFocused] = useState(false);
    const [hints, setHints] = useState<HintType[]>([]);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        if (value) {
            const matchedHints: HintType[] = [];
            props.products.forEach((productCategory) => {
                productCategory.products.forEach((product) => {
                    const lowerCaseValue = value.toLowerCase();
                    const lowerCaseName = product.name.toLowerCase();

                    if (lowerCaseName.includes(lowerCaseValue) || product.search_tags.filter(tag => tag.toLowerCase().includes(lowerCaseValue)).length > 0) {
                        // Calculate match score (prioritize start of string matches)
                        const matchIndex = lowerCaseName.indexOf(lowerCaseValue);
                        const matchScore = matchIndex === 0 ? 2 : 1;  // Start of string match is better

                        matchedHints.push({
                            id: product.id,
                            name: product.name,
                            image: product.image,
                            size: product.size,
                            price: product.price,
                            matchScore: matchScore, // Add the score to the hint object
                        });
                    }
                });
            });

            // Sort hints by match score (descending)
            matchedHints.sort((a, b) => b.matchScore - a.matchScore);

            setHints(matchedHints);
            setNoResults(matchedHints.length === 0); // Set noResults state if no matches
        } else {
            setHints([]);
            setNoResults(false); // Reset noResults state when input is empty
        }
    }, [value, props.products]);

    const handleClickProduct = (hint: HintType) => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light");
        router.push(`/product/${hint.id}`);
    }

    return (
        <div className={`flex flex-col w-full items-center rounded-3xl`}>
            <div className={`flex w-full items-center ${(focused || hints.length > 0) && value !== "" ? 'rounded-t-3xl' : 'rounded-3xl'} bg-[#111111] px-4`}>
                <div className={`flex w-full items-center py-3 ${(focused || hints.length > 0) && value !== "" ? 'border-b-[0.5px] border-[#202020]' : ''}`}>
                    <SearchIcon color="#707178"/>
                    <input
                        type={""}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={"Поиск"}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className={`w-full ml-3 bg-transparent border-none focus:outline-none placeholder-[#707178] font-medium`}
                    />
                </div>
            </div>
            <div className="relative w-full flex items-center ">
                {
                    (focused || hints.length > 0) && value !== ""
                        ?
                        <div className="absolute top-0 left-0 w-full flex flex-col items-center bg-[#111111] px-4 py-3 rounded-b-3xl z-10 gap-3 font-sans shadow-lg shadow-black max-h-[330px] overflow-y-scroll">
                            {hints.map((hint) =>
                                <div className="flex items-start w-full gap-3 text-xs leading-3 h-[60px] cursor-pointer"
                                     onClick={() => handleClickProduct(hint)}
                                >
                                    <div className="flex w-1/6 py-2 items-center justify-center bg-[#161616] rounded-xl h-full">
                                        <img src={hint.image} alt={""} style={{height: 50}}/>
                                    </div>
                                    <div className="flex w-4/6 flex-col py-1 justify-between h-full">
                                        <p>{hint.name}</p>
                                        <p className="text-[#757575]">{hint.size}</p>
                                        <p className="text-[#E1C272] font-semibold">{numberFormat(hint.price)}₽</p>
                                    </div>
                                    <div className="flex w-1/6 h-full items-center justify-end">
                                        <RightOutlined />
                                    </div>
                                </div>
                            )}
                            {noResults && focused && <p className="text-[#757575] text-xs">Ничего не найдено</p>}
                        </div>
                        : null
                }
            </div>

        </div>
    );
}