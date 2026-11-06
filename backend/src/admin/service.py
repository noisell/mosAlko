from fastapi import HTTPException
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST

from bot.handlers.system import create_admin
from src.admin.models import SystemDataNames
from src.admin.schemas import SimpleAdminScheme, UpdateSystemDataSchema, ChangeProductImageSchema, ChangeProductSchema, \
    StatsSchema, StatsBaseSchema, StatsOtherSchema
from src.auth.service import generate_password
from src.orders.schemas import PromoCodeSchema, PromoCodeCreateSchema, OrderSchema, OrderHistoryAdminSchema
from src.products.models import Category
from src.products.schemas import ProductSchema, SpecificationsSimpleSchema, ProductsSchema, ProductsAdminSchema, \
    ProductAdminSchema, SpecificationsSimpleAdminSchema, SpecificationBaseSchema, SpecificationGetAllSchema, \
    ProductCreateSchema, SearchTagCreateBaseSchema
from src.schemas import StatusScheme, category_list
from src.unit_of_work import UnitOfWork
from src.users.schemas import UserSchema, UserUpdateAdminSchema


class AdminService:

    @classmethod
    async def create_admin(cls, uow: UnitOfWork, data: SimpleAdminScheme) -> StatusScheme:
        async with uow:
            user = await uow.user.get_by_id(item_id=data.user_id)
            if not user:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Пользователь не найден")
            password, salt, hashed_password = generate_password()
            send = await create_admin(user_id=data.user_id, login=data.user_id, password=password)
            if send is not True:
                raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"Пользователь заблокировал бота. {send}")
            await uow.admin.add({"id": data.user_id, "level": data.level, "password": hashed_password, "salt": salt})
            await uow.commit()
        return StatusScheme(success=True)


    @classmethod
    async def get_all_users(cls, uow: UnitOfWork) -> list[UserSchema]:
        async with uow:
            return await uow.user.get_all(schema=UserSchema)


    @classmethod
    async def update_user(cls, uow: UnitOfWork, data: UserUpdateAdminSchema) -> None:
        async with uow:
            await uow.user.update(item_id=data.id, first_name=data.first_name, phone_number=data.phone_number, banned=data.banned)
            await uow.commit()

    @classmethod
    async def update_system_data(cls, uow: UnitOfWork, data: UpdateSystemDataSchema) -> None:
        async with uow:
            await uow.system_data.update_system_data(name=SystemDataNames.price_in_MKAD, value=str(data.price_in_MKAD))
            await uow.system_data.update_system_data(name=SystemDataNames.price_out_MKAD, value=str(data.price_out_MKAD))
            await uow.system_data.update_system_data(name=SystemDataNames.price_up_to_level, value=str(data.price_up_to_level))
            await uow.system_data.update_system_data(name=SystemDataNames.min_order_amount, value=str(data.min_order_amount))
            await uow.commit()

    @classmethod
    async def get_all_products(cls, uow: UnitOfWork) ->  list[ProductsAdminSchema]:
        async with uow:
            products = await uow.product.get_products(active=None)
        sort_products: dict[Category, list[ProductAdminSchema]] = {}
        for product in products:
            specifications: list[SpecificationsSimpleAdminSchema] = []
            for specification in product.specifications:
                specifications.append(SpecificationsSimpleAdminSchema.model_validate(
                    {"id": specification.id, "value": specification.value, "name": specification.specification.name}))

            if product.category not in list(sort_products.keys()):
                sort_products[product.category] = [
                    ProductAdminSchema.model_validate({**product.__dict__, "specifications": specifications, "search_tags": [tag.value for tag in product.search_tags]})]
            else:
                sort_products[product.category].append(
                    ProductAdminSchema.model_validate({**product.__dict__, "specifications": specifications, "search_tags": [tag.value for tag in product.search_tags]}))

        result: list[ProductsAdminSchema] = []
        sorted_product: dict[Category, list[ProductAdminSchema]] = {}
        sort_products_keys = list(sort_products.keys())

        for i in category_list:
            if i in sort_products_keys:
                sorted_product[i] = sort_products[i]

        for category, product in sorted_product.items():
            result.append(ProductsAdminSchema.model_validate({"category": category, "products": product}))

        return result

    @classmethod
    async def get_all_specifications_names(cls, uow: UnitOfWork, category: Category) -> list[SpecificationGetAllSchema]:
        async with uow:
            specifications = await uow.specification.get_by_category(category=category)
            return [SpecificationGetAllSchema(value=i.name) for i in specifications]

    @classmethod
    async def add_specification(cls, uow: UnitOfWork, data: SpecificationsSimpleAdminSchema) -> int:
        async with uow:
            product = await uow.product.get_by_id(item_id=data.id)
            specifications = await uow.specification.get_by_category(category=product.category)

            added = False
            specification_product_id: int | None = None
            for specification in specifications:
                if specification.name.lower() == data.name.lower():
                    specification_product_id = await uow.specification_product.add_and_return_id({
                        "product_id": data.id, "specification_id": specification.id, "value": data.value
                    })
                    added = True
                    break
            if not added:
                specification_id = await uow.specification.add_and_return_id({"category": product.category, "name": data.name})
                specification_product_id = await uow.specification_product.add_and_return_id({
                    "product_id": data.id, "specification_id": specification_id, "value": data.value
                })
            await uow.commit()
        return specification_product_id

    @classmethod
    async def delete_specification(cls, uow: UnitOfWork, specification_id: int) -> None:
        async with uow:
            await uow.specification_product.delete(specification_id)
            await uow.commit()

    @classmethod
    async def change_product_image(cls, uow: UnitOfWork, data: ChangeProductImageSchema) -> None:
        async with uow:
            await uow.product.update(item_id=data.product_id, image=data.image)
            await uow.commit()

    @classmethod
    async def change_product(cls, uow: UnitOfWork, data: ChangeProductSchema) -> None:
        async with uow:
            await uow.product.update(
                item_id=data.product_id,
                name=data.name,
                price=data.price,
                price_trade=data.price_trade,
                old_price=data.old_price,
                size=data.size,
                hit=data.hit,
                active=data.active,
                description=data.description
            )
            await uow.commit()

    @classmethod
    async def create_product(cls, uow: UnitOfWork, data: ProductCreateSchema) -> ProductAdminSchema:
        specifications_old = data.specifications
        specifications_new: list[SpecificationsSimpleAdminSchema] = []
        data_dict = data.model_dump()
        del data_dict['specifications']
        async with uow:
            product_id = await uow.product.add_and_return_id(data_dict)
            for i in specifications_old:
                specifications = await uow.specification.get_by_category(category=data.category)
                added = False
                specification_product_id: int | None = None
                for specification in specifications:
                    if specification.name.lower() == data.name.lower():
                        specification_product_id = await uow.specification_product.add_and_return_id({"product_id": product_id, "specification_id": specification.id, "value": i.value})
                        added = True
                        break
                if not added:
                    specification_id = await uow.specification.add_and_return_id({"category": data.category, "name": i.name})
                    specification_product_id = await uow.specification_product.add_and_return_id({"product_id": product_id, "specification_id": specification_id, "value": i.value})

                specifications_new.append(SpecificationsSimpleAdminSchema(id=specification_product_id, name=i.name, value=i.value))
            await uow.commit()
        return ProductAdminSchema.model_validate({**data_dict, "id": product_id, "specifications": specifications_new})

    @classmethod
    async def delete_product(cls, uow: UnitOfWork, product_id: int) -> None:
        async with uow:
            await uow.product.delete(product_id)
            await uow.commit()

    @classmethod
    async def get_all_promo_codes(cls, uow: UnitOfWork) -> list[PromoCodeSchema]:
        async with uow:
            return await uow.promo_code.get_all(schema=PromoCodeSchema)

    @classmethod
    async def create_promo_code(cls, uow: UnitOfWork, data: PromoCodeCreateSchema) -> int:
        async with uow:
            promo_code_id = await uow.promo_code.add_and_return_id(data.model_dump())
            await uow.commit()
        return promo_code_id

    @classmethod
    async def delete_promo_code(cls, uow: UnitOfWork, promo_code_id: int) -> None:
        async with uow:
            await uow.promo_code.delete(promo_code_id)
            await uow.commit()

    @classmethod
    async def get_all_orders(cls, uow: UnitOfWork) -> list[OrderHistoryAdminSchema]:
        async with uow:
            return await uow.order.get_all_history()

    @classmethod
    async def get_stats(cls, uow: UnitOfWork) -> StatsSchema:
        async with uow:
            user_stats = await uow.user.get_stats()
            order_stats = await uow.order.get_stats()

        return StatsSchema(
            orders=order_stats,
            users=StatsBaseSchema(today=user_stats.today, mouth=user_stats.mouth, all=user_stats.all),
            users_order=StatsOtherSchema(count=user_stats.count, percent=user_stats.percent),
            users_basket=StatsOtherSchema(count=user_stats.count_basket, percent=user_stats.percent_basket)
        )

    @classmethod
    async def delete_search_tag(cls, uow: UnitOfWork, product_id: int, tag: str) -> None:
        async with uow:
            await uow.search_tag.delete_tag(product_id=product_id, tag=tag)
            await uow.commit()

    @classmethod
    async def create_search_tag(cls, uow: UnitOfWork, data: SearchTagCreateBaseSchema) -> None:
        async with uow:
            await uow.search_tag.add(data.model_dump())
            await uow.commit()