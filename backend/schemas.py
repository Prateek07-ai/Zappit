
from pydantic import BaseModel, Field, ConfigDict


class RestaurantCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    cuisine: str = Field(min_length=1, max_length=100)
    cost_for_two: int = Field(gt=0)
    rating: float = Field(ge=0, le=5)
    discount_percent: float = Field(ge=0, le=100)
    discount_cap: int = Field(ge=0)
    city: str = Field(min_length=1, max_length=100)
    source: str = "user-added"


class RestaurantResponse(RestaurantCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)

class RestaurantUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    cuisine: str | None = Field(default=None, min_length=1, max_length=100)
    cost_for_two: int | None = Field(default=None, gt=0)
    rating: float | None = Field(default=None, ge=0, le=5)
    discount_percent: float | None = Field(default=None, ge=0, le=100)
    discount_cap: int | None = Field(default=None, ge=0)
    city: str | None = Field(default=None, min_length=1, max_length=100)
    source: str | None = None

class RestaurantInfoCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    cuisine: str | None = None
    city: str = Field(min_length=1, max_length=100)
    address: str | None = None

    phone: str | None = None
    image_url: str | None = None
    website: str | None = None
    menu_url: str | None = None
    opening_hours: str | None = None

    is_verified: bool = False
    source: str = "manual"


class RestaurantInfoResponse(RestaurantInfoCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class RestaurantInfoUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    cuisine: str | None = None
    city: str | None = Field(default=None, min_length=1, max_length=100)
    address: str | None = None

    phone: str | None = None
    image_url: str | None = None
    website: str | None = None
    menu_url: str | None = None
    opening_hours: str | None = None

    is_verified: bool | None = None
    source: str | None = None
