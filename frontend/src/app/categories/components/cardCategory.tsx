import React from 'react';
import {useRouter} from "next/navigation";
import {Category} from "@/app/home/types";

type Props = {
    photo: string;
    name: string;
    description: string;
    category: Category;
}

export function CardCategory(props: Props) {
    const {name, description, photo, category} = props;
    const router = useRouter();

    const handleClick = () => {
        Telegram.WebApp.HapticFeedback.impactOccurred("light");
        router.push(`/categories/${category}`);
    }

    return (
        <div className="relative flex w-full items-start bg-[#111111] px-5 py-4 rounded-3xl overflow-hidden min-h-[130px] cursor-pointer"
             onClick={handleClick}
        >
            <div className="flex flex-col w-[65%]">
                <p className="font-semibold">{name}</p>
                <p className="font-normal text-xs text-[#757575] mt-2">{description}</p>
            </div>
            <img src={photo} alt="" width={"20%"} className="absolute right-8 top-4"/>
        </div>
    );
}