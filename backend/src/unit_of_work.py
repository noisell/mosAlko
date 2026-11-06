from abc import ABC, abstractmethod
from typing import Type

from src.admin.repository import SystemDataRepository, AdminRepository
from src.database import session_factory
from src.orders.repository import PromoCodeRepository, OrderRepository, AmountOrderRepository, DeliveryRepository, OrderProductRepository
from src.products.repository import ProductRepository, SpecificationRepository, SpecificationProductRepository, \
    SearchTagRepository
from src.users.repository import UserRepository, AddressRepository, BasketRepository


class IUnitOfWork(ABC):
    user: Type[UserRepository]
    product: Type[ProductRepository]
    address: Type[AddressRepository]
    system_data: Type[SystemDataRepository]
    promo_code: Type[PromoCodeRepository]
    basket: Type[BasketRepository]
    order: Type[OrderRepository]
    amount_order: Type[AmountOrderRepository]
    delivery: Type[DeliveryRepository]
    order_product: Type[OrderProductRepository]
    admin: Type[AdminRepository]
    specification: Type[SpecificationRepository]
    specification_product: Type[SpecificationProductRepository]
    search_tag: Type[SearchTagRepository]

    @abstractmethod
    def __init__(self):
        ...

    @abstractmethod
    async def __aenter__(self):
        ...

    @abstractmethod
    async def __aexit__(self, *args):
        ...

    @abstractmethod
    async def commit(self):
        ...

    @abstractmethod
    async def rollback(self):
        ...


class UnitOfWork:
    def __init__(self):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session = self.session_factory()
        self.user = UserRepository(self.session)
        self.product = ProductRepository(self.session)
        self.address = AddressRepository(self.session)
        self.system_data = SystemDataRepository(self.session)
        self.promo_code = PromoCodeRepository(self.session)
        self.basket = BasketRepository(self.session)
        self.order = OrderRepository(self.session)
        self.amount_order = AmountOrderRepository(self.session)
        self.delivery = DeliveryRepository(self.session)
        self.order_product = OrderProductRepository(self.session)
        self.admin = AdminRepository(self.session)
        self.specification = SpecificationRepository(self.session)
        self.specification_product = SpecificationProductRepository(self.session)
        self.search_tag = SearchTagRepository(self.session)

        return self

    async def __aexit__(self, *args):
        await self.rollback()
        await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()