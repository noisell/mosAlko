from pydantic import BaseModel, Field

from src.products.models import Category


class SpecificationCreateBaseSchema(BaseModel):
    category: Category = Field(description="Category", title="")
    name: str = Field(description="Name of the specification", title="", max_length=256)


class SpecificationBaseSchema(SpecificationCreateBaseSchema):
    id: int = Field(description="Specification ID", title="")


class SpecificationSchema(BaseModel):
    id: int = Field(description="Specification ID", title="")
    name: str = Field(description="Name of the specification", title="", max_length=256)


class SpecificationProductBaseCreateSchema(BaseModel):
    product_id: int = Field(description="Product ID", title="")
    specification_id: int = Field(description="Specification ID", title="")
    value: str = Field(description="Value of the specification product", title="", max_length=256)


class SpecificationProductBaseSchema(SpecificationProductBaseCreateSchema):
    id: int = Field(description="Specification Product ID", title="")


class SpecificationProductSchema(BaseModel):
    id: int = Field(description="Specification product ID", title="")
    value: str = Field(description="Value of the specification product", title="", max_length=256)
    specification: SpecificationSchema = Field(description="Specification", title="")


class SearchTagCreateBaseSchema(BaseModel):
    product_id: int = Field(description="Product ID", title="")
    value: str = Field(description="Value of the search tag", title="", max_length=256)


class SearchTagBaseSchema(SearchTagCreateBaseSchema):
    id: int = Field(description="Search Tag ID", title="")


class SearchTagSchema(BaseModel):
    value: str = Field(description="Value of the search tag", title="", max_length=256)


class ProductBaseSchema(BaseModel):
    id: int = Field(description="Product ID", title="")
    category: Category = Field(description="Category of the product", title="")
    name: str = Field(description="Name of the product", title="", max_length=256)
    price: float = Field(description="Price of the product", title="")
    old_price: float | None = Field(description="Old price of the product", title="")
    size: str = Field(description="Size of the product", title="", max_length=32)
    image: str = Field(description="Image of the product", title="", max_length=512)
    hit: bool = Field(description="Hit of the product", title="")
    active: bool = Field(description="Active of the product", title="")


class ProductFullSchema(ProductBaseSchema):
    specifications: list[SpecificationProductSchema] = Field(description="Specifications of the product", title="")
    search_tags: list[SearchTagSchema] = Field(description="Search tags of the product", title="")


class SpecificationsSimpleSchema(BaseModel):
    value: str = Field(description="Value of the specification product", title="", max_length=256)
    name: str = Field(description="Name of the specification", title="", max_length=256)


class SpecificationsSimpleAdminSchema(BaseModel):
    id: int = Field(description="ID", title="")
    value: str = Field(description="Value of the specification product", title="", max_length=256)
    name: str = Field(description="Name of the specification", title="", max_length=256)

class SpecificationsForHistorySchema(BaseModel):
    value: str = Field(description="Value of the specification product", title="", max_length=256)


class ProductSchema(ProductBaseSchema):
    specifications: list[SpecificationsSimpleSchema] = Field(description="Specifications of the product", title="")
    search_tags: list[str] = Field(description="Search tags of the product", title="")


class ProductAdminSchema(ProductBaseSchema):
    specifications: list[SpecificationsSimpleAdminSchema] = Field(description="Specifications of the product", title="")
    search_tags: list[str] = Field(description="Search tags of the product", title="")


class ProductsSchema(BaseModel):
    category: Category = Field(description="Category of the product", title="")
    products: list[ProductSchema] = Field(description="List of products", title="")


class ProductsAdminSchema(BaseModel):
    category: Category = Field(description="Category of the product", title="")
    products: list[ProductAdminSchema] = Field(description="List of products", title="")


class ProductForBasketSchema(BaseModel):
    id: int = Field(description="Product ID", title="")
    name: str = Field(description="Name of the product", title="", max_length=256)
    price: float = Field(description="Price of the product", title="")
    old_price: float | None = Field(description="Old price of the product", title="")
    size: str = Field(description="Size of the product", title="", max_length=32)
    image: str = Field(description="Image of the product", title="", max_length=512)
    active: bool = Field(description="Active of the product", title="")


class ProductForHistorySchema(BaseModel):
    id: int = Field(description="Product ID", title="")
    name: str = Field(description="Name of the product", title="", max_length=256)
    image: str = Field(description="Image of the product", title="", max_length=512)
    size: str = Field(description="Size of the product", title="", max_length=32)
    specifications: list[SpecificationsForHistorySchema] = Field(description="Specifications of the product", title="")


class SpecificationGetAllSchema(BaseModel):
    value: str = Field(description="Value of the specification product", title="", max_length=256)


class ProductCreateSchema(BaseModel):
    category: Category = Field(description="Category of the product", title="")
    name: str = Field(description="Name of the product", title="", max_length=256)
    price: float = Field(description="Price of the product", title="")
    old_price: float | None = Field(description="Old price of the product", title="")
    size: str = Field(description="Size of the product", title="", max_length=32)
    image: str = Field(description="Image of the product", title="", max_length=512)
    hit: bool = Field(description="Hit of the product", title="")
    active: bool = Field(description="Active of the product", title="")
    specifications: list[SpecificationsSimpleSchema] = Field(description="Specifications of the product", title="")

