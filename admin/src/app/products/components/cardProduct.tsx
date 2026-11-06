import React, {useEffect, useState} from 'react';
import {Category, ProductType, SpecificationsCategoryType, SpecificationsSimpleType} from "@/app/products/types";
import {CustomInput} from "@/app/components/customInput";
import {Switch, Modal, AutoComplete, Input, message, ConfigProvider, Spin} from "antd";
import type { AutoCompleteProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import {
    changeProduct,
    changeProductImage, createSearchTag,
    CreateSpecificationProduct, deleteProduct, deleteSearchTag,
    deleteSpecificationProduct,
    getSpecificationsCategory
} from "@/app/products/api";
import {success} from "@/app/utils";
import {TrashIcon} from "@/app/icons/trashIcon";

export function CardProduct(props: ProductType & {callback: (data: ProductType) => void, callbackDelete: (id: number) => void}) {
    const [messageApi, contextHolder] = message.useMessage()

    const [price, setPrice] = useState<string>(props.price+"");
    const [oldPrice, setOldPrice] = useState<string>(props.old_price ? props.old_price+"" : "");
    const [size, setSize] = useState<string>(props.size);
    const [active, setActive] = useState<boolean>(props.active);
    const [hit, setHit] = useState<boolean>(props.hit);
    const [name, setName] = useState<string>(props.name);
    const [specifications, setSpecifications] = useState<SpecificationsSimpleType[]>(props.specifications);
    const [searchTags, setSearchTags] = useState<string[]>(props.search_tags);
    const [image, setImage] = useState<string>(props.image);

    const [dataSaveShow, setDataSaveShow] = useState<boolean>(false);

    const [specificationsNames, setSpecificationsNames] = useState<SpecificationsCategoryType[]>([]);

    const [optionsSpecification, setOptionsSpecification] = useState<AutoCompleteProps['options']>([]);
    const [newSpecificationValue, setNewSpecificationValue] = useState<string>("");
    const [newSpecificationName, setNewSpecificationName] = useState<string>("");

    const [isModalSpecificationOpen, setIsModalSpecificationOpen] = useState(false);
    const [isModalSearchTagsOpen, setIsModalSearchTagsOpen] = useState(false);
    const [isModalImageOpen, setIsModalImageOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (
            Number(price.trim()) !== props.price
            || oldPrice.trim() !== (props.old_price ? props.old_price+"" : "")
            || size.trim() !== props.size
            || active !== props.active
            || hit !== props.hit
            || name.trim() !== props.name
        ) {
            setDataSaveShow(true);
        } else setDataSaveShow(false);
    }, [price, oldPrice, size, active, hit, name]);

    const handleDeleteSpecification = (id: number) => {
        setSpecifications(prevState => (prevState.filter(specification => specification.id !== id)))
        deleteSpecificationProduct(id).then()
        success(messageApi, "Характеристика удалена")
    }

    const handleOkSpecification = async () => {
        setConfirmLoading(true);
        const newSpecificationProductId = await CreateSpecificationProduct({id: props.id, name: newSpecificationName, value: newSpecificationValue});
        setSpecifications(prevState => [...prevState, {id: newSpecificationProductId, name: newSpecificationName, value: newSpecificationValue}]);
        setSpecificationsNames(prevState => prevState.filter(item => item.value.toLowerCase() === newSpecificationName.toLowerCase()).length > 0 ? prevState : [...prevState, {value: newSpecificationName}])
        setIsModalSpecificationOpen(false);
        setNewSpecificationName("");
        setNewSpecificationValue("");
        setConfirmLoading(false);
        success(messageApi, "Характеристика успешно добавлена")
    };

    const handleCancelSpecification = () => {
        setIsModalSpecificationOpen(false);
        setNewSpecificationName("");
        setNewSpecificationValue("");
    };

    const getPanelValue = (searchText: string) => specificationsNames.filter(item => item.value.toLowerCase().includes(searchText.toLowerCase()));

    const handleOpenModal = async () => {
        setIsModalSpecificationOpen(true)
        if (specificationsNames.length === 0) {
            setSpecificationsNames(await getSpecificationsCategory(props.category));
        }
    }

    const handleOkImage = async () => {
        setConfirmLoading(true);
        await changeProductImage({product_id: props.id, image: image});
        setIsModalImageOpen(false);
        setConfirmLoading(false);
        success(messageApi, "Изображение успешно обновлено")
    }
    const handleCancelImage = () => {
        setIsModalImageOpen(false);
    };

    const handleUpdateProduct = async () => {
        setConfirmLoading(true);
        await changeProduct({
            product_id: props.id,
            name: name.trim(),
            price: Number(price),
            old_price: oldPrice ? Number(oldPrice) : null,
            size: size.trim(),
            hit: hit,
            active: active
        })
        props.callback({
            id: props.id,
            category: props.category,
            name: name.trim(),
            price: Number(price),
            old_price: oldPrice ? Number(oldPrice) : null,
            size: size.trim(),
            hit: hit,
            active: active,
            image: image.trim(),
            specifications: specifications,
            search_tags: searchTags
        })
        setConfirmLoading(false);
        setDataSaveShow(false);
        success(messageApi, "Данные товара успешно обновлены")
    }

    const [showModalDelete, setShowModalDelete] = useState(false);
    const handleDeleteProduct = () => setShowModalDelete(true);
    const handleOkDeleteProduct = async () => {
        setConfirmLoading(true);
        await deleteProduct(props.id);
        props.callbackDelete(props.id);
        setShowModalDelete(false);
        setConfirmLoading(false);
    }
    const handleCancelDeleteProduct = () => setShowModalDelete(false);

    const handleDeleteSearchTag = async (tag: string) => {
        setSearchTags(prevState => prevState.filter(value => value !== tag));
        await deleteSearchTag({product_id: props.id, value: tag})
        success(messageApi, "Тег для поиска успешно удален")
    }

    const [newSearchTag, setNewSearchTag] = useState("");

    const handleSearchTagOk = async () => {
        setConfirmLoading(true);
        await createSearchTag({product_id: props.id, value: newSearchTag.toLowerCase()});
        setSearchTags(prevState => [...prevState, newSearchTag.toLowerCase()]);
        setNewSearchTag("");
        setIsModalSearchTagsOpen(false);
        setConfirmLoading(false);
        success(messageApi, "Тег для поиска успешно создан")
    }

    return (
        <div className="flex w-full items-center font-sans">
            <ConfigProvider theme={{components:
                    {Message: {contentBg: '#F2F2F2', colorText: '#141414'}
                    }}}>
                {contextHolder}
            </ConfigProvider>
            <div className="flex items-center w-1/6 justify-center py-3 rounded-3xl cursor-pointer" style={{background: "#efefef"}} onClick={() => setIsModalImageOpen(true)}>
                <img src={image} alt="" style={{height: 160}}/>
            </div>
            <div className="flex flex-col h-full pl-3 w-5/6 justify-between">
                <div className="flex w-full items-center justify-between font-medium text-[16px] leading-4">
                    <CustomInput placeholder={"Название"} value={name} setValue={setName} simpleStyle />
                    <div className="flex items-center gap-3">
                        <button
                            className={`flex min-w-[100px] items-center justify-center py-2 rounded-xl text-xs leading-3 bg-green-500 text-white font-medium text-nowrap ${dataSaveShow ? 'opacity-100' : 'opacity-0'}`}
                            onClick={handleUpdateProduct}
                            disabled={confirmLoading}
                        >
                            {
                                confirmLoading
                                    ? <Spin size={"small"} indicator={<LoadingOutlined spin style={{
                                        color: 'white',
                                        width: 12,
                                        height: 12
                                    }}/>}/>
                                    : <p>Сохранить</p>
                            }

                        </button>
                        <span onClick={handleDeleteProduct} className={"cursor-pointer"}><TrashIcon color={"#a30000"}/></span>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex w-full items-center text-xs leading-3 gap-2 overflow-x-scroll">
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
                                    onClick={() => handleDeleteSpecification(specification.id)}
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
                    <div className="flex w-full items-center text-xs leading-3 mt-2 gap-2 overflow-x-scroll">
                        {searchTags.map((tag, index) => (
                            <div key={index} className="flex items-center rounded-xl bg-[#efefef]">
                                <div
                                    className="flex items-center justify-center text-green-600 py-2 px-3 text-nowrap border-r-[0.5px] border-[#CCCCCC]">
                                    <p>{tag}</p>
                                </div>
                                <div
                                    className="flex items-center justify-center text-black py-2 px-2 text-nowrap cursor-pointer"
                                    onClick={() => {handleDeleteSearchTag(tag).then()}}
                                >
                                    <CloseOutlined style={{fontSize: "12px", color: "rgb(21 128 61)"}}/>
                                </div>
                            </div>
                        ))}
                        <div
                            className="flex items-center rounded-full bg-[#efefef] py-2 px-2 border-[0.5px] border-green-700 cursor-pointer"
                            onClick={() => setIsModalSearchTagsOpen(true)}
                        >
                            <PlusOutlined style={{fontSize: "12px", color: "rgb(21 128 61)"}}/>
                        </div>
                    </div>
                    <div className="flex w-1/2 items-center mt-6 pl-1 gap-3">
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
                    <div className="flex items-center w-full text-[14px] leading-[14px] mt-3 gap-5">
                        <div className={`flex items-center gap-2 ${active ? "text-blue-700" : "text-[#757575]"}`}>
                            <Switch value={active} onChange={() => setActive(!active)}/>
                            <p>В наличии</p>
                        </div>
                        <div className={`flex items-center gap-2 ${hit ? "text-blue-700" : "text-[#757575]"}`}>
                            <Switch value={hit} onChange={() => setHit(!hit)}/>
                            <p>Хит</p>
                        </div>
                    </div>
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
            <Modal title="Изменение фотографии" open={isModalImageOpen} onOk={handleOkImage}
                   onCancel={handleCancelImage} confirmLoading={confirmLoading}>
                <div className="flex w-full items-center">
                    <Input value={image} onChange={(e) => setImage(e.currentTarget.value)}
                           placeholder={"Ссылка на изображение"} style={{width: "100%"}}/>
                </div>
            </Modal>
            <Modal title="Вы уверены?" open={showModalDelete} onOk={handleOkDeleteProduct}
                   onCancel={handleCancelDeleteProduct} confirmLoading={confirmLoading}>
                <p>Удалив товар он пропадет из корзин и историй заказов пользователей</p>
            </Modal>
            <Modal title="Создание тега для поиска" open={isModalSearchTagsOpen} onOk={handleSearchTagOk}
                   onCancel={() => setIsModalSearchTagsOpen(false)} confirmLoading={confirmLoading}>
                <div className="flex w-full items-center mt-5">
                    <CustomInput placeholder={"Новый тег"} value={newSearchTag} setValue={setNewSearchTag}/>
                </div>
            </Modal>
        </div>
    );
}