from enum import Enum

from sqlalchemy import BigInteger, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base, intPK, str512, str32, str256
from src.orders.models import OrderProduct
from src.users.models import Basket


class Category(Enum):
    whiskey = "whiskey"  # Виски
    beer = "beer"  # Пиво
    champagne = "champagne"  # Шампанское
    vodka = "vodka"  # Водка
    vermouth = "vermouth"  # Вермут
    cognac = "cognac"  # Коньяк
    liquor = "liquor"  # Ликер
    tequila = "tequila"  # Текила
    wine = "wine"  # Вино
    rum = "rum"  # Ром
    gin = "gin"  # Джин
    necessary = "necessary"  # Нужное


class Product(Base):
    __tablename__ = 'product'
    id: Mapped[intPK]
    category: Mapped[Category]  # Категория
    name: Mapped[str256]  # Название товара
    price: Mapped[float]  # Цена товара
    old_price: Mapped[float | None] = mapped_column(server_default=None)  # Стара цена товара для скидки
    size: Mapped[str32]  # Объем или любая другая единица измерения
    image: Mapped[str512]  # Картинка
    hit: Mapped[bool] = mapped_column(server_default="false")  # Имеет ли плашку "ХИТ"
    active: Mapped[bool] = mapped_column(server_default="true")  # Активен?

    specifications: Mapped[list["SpecificationProduct"]] = relationship(back_populates="product")
    basket_products: Mapped[list["Basket"]] = relationship(back_populates="product")
    order_products: Mapped[list["OrderProduct"]] = relationship(back_populates="product")
    search_tags: Mapped[list["SearchTag"]] = relationship(back_populates="product")


class Specification(Base):
    __tablename__ = "specification"
    id: Mapped[intPK]
    category: Mapped[Category]  # Категория
    name: Mapped[str256]  # Название характеристики, например "Страна производства"

    specifications_products: Mapped[list["SpecificationProduct"]] = relationship(back_populates="specification")


class SpecificationProduct(Base):
    __tablename__ = "specification_product"
    id: Mapped[intPK]
    product_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Product.id, ondelete="CASCADE"))  # Товар
    specification_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Specification.id, ondelete="CASCADE"))  # Характеристика
    value: Mapped[str256]  # Значение характеристики, например "Шотландия"

    product: Mapped["Product"] = relationship(back_populates="specifications")
    specification: Mapped["Specification"] = relationship(back_populates="specifications_products")


class SearchTag(Base):
    __tablename__ = 'search_tag'
    id: Mapped[intPK]
    product_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Product.id, ondelete="CASCADE"))  # Товар
    value: Mapped[str256]

    product: Mapped["Product"] = relationship(back_populates="search_tags")
