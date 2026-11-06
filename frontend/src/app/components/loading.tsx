import React from 'react';
import {MosAlkoLogoIcon} from "@/app/icons/mosAlkoLogoIcon";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export function Loading() {
    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center">
            <div className="flex w-3/4 -mt-10 items-center justify-center mb-3">
                <MosAlkoLogoIcon/>
            </div>
            <Spin size="default" indicator={<LoadingOutlined spin style={{color: "#E1C272"}} />} />
        </main>
    );
}