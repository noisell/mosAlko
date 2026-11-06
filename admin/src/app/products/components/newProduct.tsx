import React, {useEffect, useState} from 'react';
import {Category, ProductType, SpecificationsCategoryType, SpecificationsSimpleNewType} from "@/app/products/types";
import {CustomInput} from "@/app/components/customInput";
import {Switch, Modal, AutoComplete, Input, message, ConfigProvider, Select} from "antd";
import type { AutoCompleteProps } from 'antd';
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import {createProduct, deleteSpecificationProduct, getSpecificationsCategory} from "@/app/products/api";
import {error, success} from "@/app/utils";
import {categories, categoriesTranslate} from "@/app/products/datas";

type Props = {
    showModalNewProducts: boolean;
    setShowModalNewProducts: React.Dispatch<React.SetStateAction<boolean>>;
    callback: (product: ProductType) => void;
}

export function NewProduct(props: Props) {
    const [messageApi, contextHolder] = message.useMessage()
    const {showModalNewProducts, setShowModalNewProducts, callback} = props;

    const [disabled, setDisabled] = useState<boolean>(false);

    const [category, setCategory] = useState<Category>();
    const [price, setPrice] = useState<string>("");
    const [oldPrice, setOldPrice] = useState<string>("");
    const [size, setSize] = useState<string>("");
    const [active, setActive] = useState<boolean>(true);
    const [hit, setHit] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [specifications, setSpecifications] = useState<SpecificationsSimpleNewType[]>([]);
    const [image, setImage] = useState<string>("");
    const [specificationsNames, setSpecificationsNames] = useState<SpecificationsCategoryType[]>([]);

    const [optionsSpecification, setOptionsSpecification] = useState<AutoCompleteProps['options']>([]);
    const [newSpecificationValue, setNewSpecificationValue] = useState<string>("");
    const [newSpecificationName, setNewSpecificationName] = useState<string>("");
    const [isModalSpecificationOpen, setIsModalSpecificationOpen] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);


    const handleDeleteSpecification = (name: string) => {
        setSpecifications(prevState => (prevState.filter(specification => specification.name !== name)))
    }

    const handleOkSpecification = async () => {
        if (!category) return error(messageApi, "Сначала выберите категорию")
        if (!newSpecificationName || !newSpecificationValue) return error(messageApi, "Заполните все данные")
        setConfirmLoading(true);
        setSpecifications(prevState => [...prevState, {name: newSpecificationName, value: newSpecificationValue}]);
        setSpecificationsNames(prevState => prevState.filter(item => item.value.toLowerCase() === newSpecificationName.toLowerCase()).length > 0 ? prevState : [...prevState, {value: newSpecificationName}])
        setIsModalSpecificationOpen(false);
        setNewSpecificationName("");
        setNewSpecificationValue("");
        setConfirmLoading(false);
    };

    const handleCancelSpecification = () => {
        setIsModalSpecificationOpen(false);
        setNewSpecificationName("");
        setNewSpecificationValue("");
    };

    const getPanelValue = (searchText: string) => specificationsNames.filter(item => item.value.toLowerCase().includes(searchText.toLowerCase()));

    const handleOpenModal = async () => {
        if (!category) return error(messageApi, "Сначала выберите категорию")
        setIsModalSpecificationOpen(true)
        if (specificationsNames.length === 0) {
            setSpecificationsNames(await getSpecificationsCategory(category));
        }
    }

    const handleChangeCategory = (value: Category) => {
        setCategory(value);
    }

    const handleOk = async () => {
        // --
        if (!category) return error(messageApi, "Выберите категорию");
        if (!name) return error(messageApi, "Введите название товара");
        if (!image) return error(messageApi, "Добавьте изображение");
        if (!price) return error(messageApi, "Добавьте цену");
        if (!price) return error(messageApi, "Добавьте объем или вес или кол-во");
        setDisabled(true);
        const product = await createProduct({
            name: name,
            category: category,
            price: Number(price),
            old_price: oldPrice ? Number(oldPrice) : null,
            size: size,
            image: image,
            hit: hit,
            active: active,
            specifications: specifications
        })
        callback(product);
        setName("");
        setCategory(undefined);
        setPrice("");
        setOldPrice("");
        setSize("");
        setImage("");
        setHit(false);
        setActive(true);
        setSpecifications([])
        // --
        setDisabled(false);
        setShowModalNewProducts(false);
    }

    const handleCancel = () => {
        setShowModalNewProducts(false);
    }

    return (
        <Modal title="Создание товара" open={showModalNewProducts} onOk={handleOk} onCancel={handleCancel} confirmLoading={disabled}>
            <div className="flex flex-col w-full font-sans">
                <ConfigProvider theme={{
                    components:
                        {
                            Message: {contentBg: '#F2F2F2', colorText: '#141414'},
                            Select: {
                                colorBgContainer: 'transparent',
                                colorBorder: 'transparent',
                                colorText: '#000000',
                                colorTextDisabled: '#757575',
                                colorTextPlaceholder: '#757575',

                                colorPrimary: 'transparent',
                                colorBgElevated: '#FFF',

                                controlOutlineWidth: 0,
                                colorPrimaryHover: 'transparent',
                                paddingSM: 0,
                            },
                        }
                }}>
                    {contextHolder}
                    <div className="flex w-full items-center border-b-[0.5px] border-[#757575]">
                        <Select
                            placeholder={"Категория"}
                            value={category}
                            style={{width: "100%", marginTop: "10px"}}
                            onChange={handleChangeCategory}
                            options={categories.map(category => ({value: category, label: categoriesTranslate[category]}))}
                        />
                    </div>

                </ConfigProvider>
                <div
                    className="flex w-full items-center mt-5">
                    <CustomInput placeholder={"Название"} value={name} setValue={setName}/>
                </div>
                <div
                    className="flex w-full items-center mt-5">
                    <CustomInput placeholder={"Ссылка на изображение"} value={image} setValue={setImage}/>
                </div>
                <div className="flex w-full items-center mt-5 gap-3">
                    <div className="flex w-1/3 items-center gap-1">
                        <CustomInput placeholder={"Цена"} value={price} setValue={setPrice}/>
                    </div>
                    <div className="flex w-1/3 items-center gap-1">
                        <CustomInput placeholder={"Старая цена"} value={oldPrice} setValue={setOldPrice}/>
                    </div>
                    <div className="flex w-1/3 items-center gap-1">
                        <CustomInput placeholder={"Объем или кол-во"} value={size} setValue={setSize}/>
                    </div>
                </div>
                <div className="flex w-full items-center text-xs leading-3 mt-5 gap-2 overflow-x-scroll">
                    {specifications.map((specification, index) => (
                        <div key={index} className="flex items-center rounded-xl bg-[#efefef]">
                            <div
                                className="flex items-center justify-start text-blue-700 py-2 px-3 text-nowrap border-r-[0.5px] border-[#CCCCCC]">
                                <p>{specification.name}:</p>
                            </div>
                            <div
                                className="flex items-center justify-center text-black py-2 px-3 text-nowrap border-r-[0.5px] border-[#CCCCCC]">
                                <p>{specification.value}</p>
                            </div>
                            <div
                                className="flex items-center justify-center text-black py-2 px-2 text-nowrap cursor-pointer"
                                onClick={() => handleDeleteSpecification(specification.name)}
                            >
                                <CloseOutlined style={{fontSize: "12px", color: "rgb(29 78 216)"}}/>
                            </div>
                        </div>
                    ))}
                    <div
                        className="flex items-center rounded-full bg-[#efefef] py-2 px-2 border-[0.5px] border-blue-700 cursor-pointer"
                        onClick={handleOpenModal}
                    >
                        <PlusOutlined style={{fontSize: "12px", color: "rgb(29 78 216)"}}/>
                    </div>
                </div>
                <div className="flex items-center w-full text-[14px] leading-[14px] mt-5 gap-5">
                    <div className={`flex items-center gap-2 ${active ? "text-blue-700" : "text-[#757575]"}`}>
                        <Switch value={active} onChange={() => setActive(!active)}/>
                        <p>В наличии</p>
                    </div>
                    <div className={`flex items-center gap-2 ${hit ? "text-blue-700" : "text-[#757575]"}`}>
                        <Switch value={hit} onChange={() => setHit(!hit)}/>
                        <p>Хит</p>
                    </div>
                </div>
                <Modal title="Создание характеристики" open={isModalSpecificationOpen} onOk={handleOkSpecification}
                       onCancel={handleCancelSpecification} confirmLoading={confirmLoading}>
                    <div className="flex w-full items-center gap-3">
                        <AutoComplete
                            options={optionsSpecification}
                            style={{width: "50%"}}
                            value={newSpecificationName}
                            onChange={(value) => setNewSpecificationName(value)}
                            onSearch={(text) => setOptionsSpecification(getPanelValue(text))}
                            placeholder="Характеристика"
                        />
                        <Input value={newSpecificationValue}
                               onChange={(e) => setNewSpecificationValue(e.currentTarget.value)} placeholder={"Значение"}
                               style={{width: "50%"}}/>
                    </div>
                </Modal>
            </div>
        </Modal>
    );
}