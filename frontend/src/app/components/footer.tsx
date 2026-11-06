import React from 'react';
import {MosAlkoLogoIcon} from "@/app/icons/mosAlkoLogoIcon";
import {PhoneIcon} from "@/app/icons/phoneIcon";
import {EmailIcon} from "@/app/icons/emailIcon";
import {Plus18Icon} from "@/app/icons/plus18Icon";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="flex w-screen flex-col mt-6 bg-[#0F0F0F] items-start pt-3 px-4 pb-28 font-sans">
            <div className="flex items-end justify-between w-full text-[12px] leading-3">
                <div className="flex w-1/2">
                    <MosAlkoLogoIcon/>
                </div>
                <div className="flex flex-col gap-2 text-[#f2f2f2]">
                    <div className="flex items-center w-full gap-2">
                        <PhoneIcon width={16} height={16} color={"#f2f2f2"}/>
                        <p className="font-sans">+7 985-485-44-55</p>
                    </div>
                    <div className="flex items-center w-full gap-2">
                        <EmailIcon width={16} height={16} color={"#f2f2f2"}/>
                        <p className="font-sans">admin@mos-alko.com</p>
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center gap-3 mt-4 text-[#757575] text-[12px] leading-3">
                <div className="flex">
                    <Plus18Icon color={"#757575"}/>
                </div>
                <div className="flex">
                    <p>Мы не доставляем алкогольную продукцию лицам моложе 18 лет. Не создавайте заказ, если вы моложе!</p>
                </div>
            </div>
            <p className="text-xs leading-3 text-[#757575] mt-2 font-medium">Чрезмерное употребление алкоголя вредит вашему здоровью!</p>
            <div
                className="flex flex-col font-sans text-[14px] w-full pt-4 mt-4 border-t-[0.5px] border-[#4E4E4E] leading-[14px]">
                <p className="w-full font-semibold text-[#CCCCCC]">© 2025 Интернет-магазин алкоголя «МосАлко»</p>
                <p className="w-full text-[#757575] mt-1">129336, г. Москва, ул. Стартовая, 12</p>
                <p className="w-full text-[#757575] mt-1">Все права защищены и охраняются законом.</p>
            </div>
            <Link target={"_blank"} className="w-full flex gap-1 text-[#E1C272] font-sans text-[14px] leading-[14px] mt-6" href={"https://mirry.ru?ref=MosAlko"}>
                <p className="text-[#757575]">Приложение разработано и поддерживается в</p> mirry dev
            </Link>
</footer>
)
    ;
}