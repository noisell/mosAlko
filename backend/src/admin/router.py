from typing import Annotated

from fastapi import APIRouter, Depends, Body, HTTPException, Query
from starlette.status import HTTP_201_CREATED

from src.admin.schemas import SimpleAdminScheme, SystemDataCreateSchema, UpdateSystemDataSchema, \
    ChangeProductImageSchema, ChangeProductSchema, StatsSchema
from src.admin.service import AdminService
from src.dependencies import responses, UOWDepends, AdminLevelChecker
from src.orders.schemas import PromoCodeSchema, PromoCodeCreateSchema, OrderHistoryAdminSchema
from src.orders.service import OrderService
from src.products.models import Category
from src.products.schemas import ProductsSchema, ProductsAdminSchema, SpecificationsSimpleAdminSchema, \
    SpecificationGetAllSchema, ProductCreateSchema, ProductAdminSchema, SearchTagCreateBaseSchema
from src.products.service import ProductService
from src.schemas import StatusScheme, AdminPayload
from src.users.schemas import UserUpdateAdminSchema

router = APIRouter(
    prefix="/admin",
    tags=["Admins"]
)

@router.post(path="", name="Создание администратора (3)", status_code=HTTP_201_CREATED, responses=responses(400, 401, 403, 404))
async def create_admin(
        uow: UOWDepends,
        # _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))],
        data: SimpleAdminScheme = Body()
) -> StatusScheme:
    return await AdminService().create_admin(uow=uow, data=data)


@router.get(path="/users", name="Получение всех пользователей", responses=responses(401, 403))
async def get_all_users(uow: UOWDepends, ):
    return await AdminService().get_all_users(uow=uow)


@router.patch(path="/user", name="Изменение данных о пользователе", responses=responses(401, 403))
async def update_user(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: UserUpdateAdminSchema = Body()) -> None:
    return await AdminService().update_user(uow=uow, data=data)


@router.get(path="/dataForOrders", name="Получение полезных данных для заказа", responses=responses(401))
async def get_data_for_orders(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[SystemDataCreateSchema]:
    return await OrderService().get_data_for_orders(uow=uow)


@router.put(path="/systemData", name="Обновление данных", responses=responses(401, 403))
async def update_system_data(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: UpdateSystemDataSchema) -> None:
    await AdminService().update_system_data(uow=uow, data=data)


@router.get("/products", name="Получение товаров", responses=responses(401))
async def get_products(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[ProductsAdminSchema]:
    return await AdminService().get_all_products(uow=uow)


@router.post(path="/specification", name="Добавление характеристики к товару", status_code=HTTP_201_CREATED, responses=responses(401))
async def add_specification(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: SpecificationsSimpleAdminSchema = Body()) -> int:
    return await AdminService().add_specification(uow=uow, data=data)


@router.get(path="/specification")
async def get_all_specifications(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], category: Category = Query()) -> list[SpecificationGetAllSchema]:
    return await AdminService().get_all_specifications_names(uow=uow, category=category)


@router.delete(path="/specification", name="Удаление")
async def delete_specification(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], specification_id: int) -> None:
    await AdminService().delete_specification(uow=uow, specification_id=specification_id)


@router.patch(path="/product/image")
async def change_product_image(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: ChangeProductImageSchema = Body()) -> None:
    await AdminService().change_product_image(uow=uow, data=data)


@router.patch(path="/product")
async def change_product(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: ChangeProductSchema = Body()) -> None:
    await AdminService().change_product(uow=uow, data=data)


@router.post(path="/product")
async def create_product(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: ProductCreateSchema = Body()) -> ProductAdminSchema:
    return await AdminService().create_product(uow=uow, data=data)


@router.delete(path="/product")
async def delete_product(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], product_id: int = Query()) -> None:
    await AdminService().delete_product(uow=uow, product_id=product_id)


@router.get(path="/promoCode")
async def get_all_promo_codes(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[PromoCodeSchema]:
    return await AdminService().get_all_promo_codes(uow=uow)


@router.post(path="/promoCode")
async def create_promo_code(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: PromoCodeCreateSchema = Body()) -> int:
    return await AdminService().create_promo_code(uow=uow, data=data)


@router.delete(path="/promoCode")
async def delete_promo_code(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], promo_code_id: int = Query()) -> None:
    await AdminService().delete_promo_code(uow=uow, promo_code_id=promo_code_id)

@router.get(path="/orders")
async def get_all_orders(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> list[OrderHistoryAdminSchema]:
    return await AdminService().get_all_orders(uow=uow)


@router.get(path="/stats")
async def get_stats(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))]) -> StatsSchema:
    return await AdminService().get_stats(uow=uow)


@router.delete(path="/searchTag")
async def delete_search_tag(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], product_id: int = Query(), tag: str = Query()) -> None:
    await AdminService().delete_search_tag(uow=uow, product_id=product_id, tag=tag)


@router.post(path="/searchTag")
async def create_search_tag(uow: UOWDepends, _: Annotated[AdminPayload, Depends(AdminLevelChecker(required_level=1))], data: SearchTagCreateBaseSchema) -> None:
    await AdminService().create_search_tag(uow=uow, data=data)