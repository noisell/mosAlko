from sqlalchemy import update, select, func, delete
from sqlalchemy.orm import selectinload

from src.repository import SQLAlchemyRepository
from src.products.models import Product, SpecificationProduct, Category, Specification, SearchTag
from src.products.schemas import ProductBaseSchema, ProductFullSchema, SpecificationBaseSchema, \
    SpecificationProductBaseSchema, SearchTagBaseSchema


class ProductRepository(SQLAlchemyRepository[Product, ProductBaseSchema]):
    model = Product
    schema = ProductBaseSchema

    async def get_products(self, active: bool | None = True) -> list[ProductFullSchema]:
        if active is None:
            query = select(self.model)
        else:
            query = select(self.model).where(self.model.active == active)
        query = query.options(
            selectinload(self.model.specifications).options(
                selectinload(SpecificationProduct.specification)
            ),
            selectinload(self.model.search_tags)
        )

        query_result = await self.session.execute(query)
        products = query_result.scalars().all()
        return [ProductFullSchema.model_validate(product, from_attributes=True) for product in products]

    async def get_product_by_id(self, product_id: int) -> ProductFullSchema | None:
        query = select(self.model).where(self.model.id == product_id).options(
            selectinload(self.model.specifications).options(
                selectinload(SpecificationProduct.specification)
            ),
            selectinload(self.model.search_tags)
        )
        query_result = await self.session.execute(query)
        products = query_result.scalar_one_or_none()
        return ProductFullSchema.model_validate(products, from_attributes=True) if products else None

    async def get_products_by_category(self, category: Category, active: bool = True) -> list[ProductFullSchema]:
        query = select(self.model).where(self.model.category == category.value, self.model.active == active).options(
            selectinload(self.model.specifications).options(
                selectinload(SpecificationProduct.specification)
            ),
            selectinload(self.model.search_tags)
        )
        query_result = await self.session.execute(query)
        products = query_result.scalars().all()
        return [ProductFullSchema.model_validate(product, from_attributes=True) for product in products]

    async def get_products_by_ids(self, products: list[int]) -> list[ProductBaseSchema]:
        query = select(self.model).where(self.model.id.in_(products))
        query_result = await self.session.execute(query)
        products = query_result.scalars().all()
        return [ProductBaseSchema.model_validate(i, from_attributes=True) for i in products]


class SpecificationRepository(SQLAlchemyRepository[Specification, SpecificationBaseSchema]):
    model = Specification
    schema = SpecificationBaseSchema

    async def get_by_category(self, category: Category) -> list[SpecificationBaseSchema]:
        query = select(self.model).where(self.model.category == category.value)
        query_result = await self.session.execute(query)
        specifications = query_result.scalars().all()
        return [SpecificationBaseSchema.model_validate(i, from_attributes=True) for i in specifications]


class SpecificationProductRepository(SQLAlchemyRepository[SpecificationProduct, SpecificationProductBaseSchema]):
    model = SpecificationProduct
    schema = SpecificationProductBaseSchema


class SearchTagRepository(SQLAlchemyRepository[SearchTag, SearchTagBaseSchema]):
    model = SearchTag
    schema = SearchTagBaseSchema

    async def delete_tag(self, product_id: int, tag: str) -> None:
        stmt = delete(self.model).where(self.model.product_id == product_id, self.model.value == tag)
        await self.session.execute(stmt)