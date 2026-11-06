import React from 'react';
import {MosAlkoLogoIcon} from "@/app/icons/mosAlkoLogoIcon";
import {PhoneIcon} from "@/app/icons/phoneIcon";
import {message, ConfigProvider} from "antd";
import {error, success} from "@/app/utils";

export function FirstHeaderHome() {
    const [messageApi, contextHolder] = message.useMessage()

    const handleClickPhoneNumber = async () => {
        try {
            await navigator.clipboard.writeText("+74959703147")
            success(messageApi, 'Номер телефона скопирован')
        } catch (err) {
            error(messageApi, 'Не удалось скопировать')
        }
    }

    return (
        <header>
            <ConfigProvider
                theme={{components: {Message: {contentBg: '#222', colorText: '#FFF', borderRadiusLG: 999}}}}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex w-[48%] flex-col gap-1 pt-4">
                <MosAlkoLogoIcon/>
            </div>
            <div className="flex w-[48%] items-center gap-3 bg-[#111111] px-4 py-2 rounded-2xl" onClick={handleClickPhoneNumber}>
                <PhoneIcon/>
                <div className="flex flex-col">
                        <span className="text-[13px] font-sans flex gap-1 text-nowrap">
                            <p className="">8 (495)</p>
                            <p className="text-[#E1C272]">970-31-47</p>
                        </span>
                    <p className="text-xs text-[#707178] -mt-0.5 font-sans">Ежедневно 24/7</p>
                </div>
            </div>
        </header>
    );
}