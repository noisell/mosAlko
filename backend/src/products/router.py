from typing import Annotated

from fastapi import APIRouter, Depends, Query

from src.dependencies import UOWDepends, responses, get_current_user
from src.products.models import Category
from src.products.schemas import ProductsSchema, ProductSchema
from src.products.service import ProductService
from src.schemas import TokenPayload
from fastapi_cache.decorator import cache

router = APIRouter(
    prefix="/product",
    tags=["Products"]
)


@router.get("", name="Получение товаров", responses=responses(401))
@cache(expire=3600)
async def get_products(uow: UOWDepends) -> list[ProductsSchema]:
    return await ProductService().get_all_products(uow=uow)


@router.get(path="/byId", name="Получение товара по id", responses=responses(401))
@cache(expire=3600)
async def get_product_by_id(uow: UOWDepends, product_id: int = Query()) -> ProductSchema:
    return await ProductService().get_product_by_id(uow=uow, product_id=product_id)


@router.get(path="/byCategory", name="Получение товаров в категории", responses=responses(401))
@cache(expire=3600)
async def get_products_by_category(uow: UOWDepends, category: Category = Query()) -> list[ProductSchema]:
    return await ProductService().get_products_by_category(uow=uow, category=category)