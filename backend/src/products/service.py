from starlette.exceptions import HTTPException
from starlette.status import HTTP_404_NOT_FOUND

from src.products.models import Category
from src.schemas import category_list
from src.unit_of_work import UnitOfWork
from src.products.schemas import ProductFullSchema, ProductSchema, SpecificationsSimpleSchema, ProductsSchema, \
    SearchTagCreateBaseSchema


class ProductService:

    @classmethod
    async def get_all_products(cls, uow: UnitOfWork, active: bool | None = True) -> list[ProductsSchema]:
        async with uow:
            products = await uow.product.get_products(active=active)
        sort_products: dict[Category, list[ProductSchema]] = {}
        for product in products:
            specifications: list[SpecificationsSimpleSchema] = []
            for specification in product.specifications:
                specifications.append(SpecificationsSimpleSchema.model_validate({"value": specification.value, "name": specification.specification.name}))

            if product.category not in list(sort_products.keys()):
                sort_products[product.category] = [ProductSchema.model_validate({**product.__dict__, "specifications": specifications, "search_tags": [tag.value for tag in product.search_tags]})]
            else:
                sort_products[product.category].append(ProductSchema.model_validate({**product.__dict__, "specifications": specifications, "search_tags": [tag.value for tag in product.search_tags]}))

        result: list[ProductsSchema] = []
        sorted_product: dict[Category, list[ProductSchema]] = {}
        sort_products_keys = list(sort_products.keys())

        for i in category_list:
            if i in sort_products_keys:
                sorted_product[i] = sort_products[i]

        for category, product in sorted_product.items():
            result.append(ProductsSchema.model_validate({"category": category, "products": product}))

        return result

    @classmethod
    async def get_product_by_id(cls, uow: UnitOfWork, product_id:  int) -> ProductSchema:
        async with uow:
            product = await uow.product.get_product_by_id(product_id)
            if product is None:
                raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Product not found")
            return ProductSchema.model_validate(
                {
                    **product.model_dump(),
                    "specifications": [SpecificationsSimpleSchema(value=i.value, name=i.specification.name) for i in product.specifications],
                    "search_tags": [tag.value for tag in product.search_tags]
                },
                from_attributes=True
            )

    @classmethod
    async def get_products_by_category(cls, uow: UnitOfWork, category: Category) -> list[ProductSchema]:
        async with uow:
            products = await uow.product.get_products_by_category(category=category)
            return [
                ProductSchema.model_validate(
                    {
                        **product.model_dump(),
                        "specifications": [
                            SpecificationsSimpleSchema(value=specification.value, name=specification.specification.name) for specification in product.specifications
                        ],
                        "search_tags": [tag.value for tag in product.search_tags]
                    },
                    from_attributes=True
                ) for product in products
            ]

