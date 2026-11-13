from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base


# Existing model - DO NOT CHANGE ITS STRUCTURE
class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    cuisine = Column(String, nullable=False)
    cost_for_two = Column(Integer, nullable=False)
    rating = Column(Float, default=0.0)
    discount_percent = Column(Float, default=0.0)
    discount_cap = Column(Integer, default=0)
    city = Column(String, nullable=False)
    source = Column(String, default="sample")


# New model - Restaurant information
class RestaurantInfo(Base):
    __tablename__ = "restaurant_info"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    cuisine = Column(String, nullable=True)
    city = Column(String, nullable=False)
    address = Column(String, nullable=True)

    phone = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    menu_url = Column(String, nullable=True)
    opening_hours = Column(String, nullable=True)

    is_verified = Column(Boolean, default=False)
    source = Column(String, default="manual")