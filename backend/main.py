
from schemas import (
    RestaurantCreate,
    RestaurantResponse,
    RestaurantUpdate,
    RestaurantInfoCreate,
    RestaurantInfoResponse,
    RestaurantInfoUpdate,
)
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Restaurant, RestaurantInfo

app = FastAPI(
    title="Zappit API",
    description="Restaurant comparison and bill estimation",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database tables exist
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {
        "message": "Welcome to Zappit API",
        "status": "running",
    }


@app.get("/api/restaurants")
def get_restaurants(
    city: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Restaurant)

    if city:
        query = query.filter(Restaurant.city.ilike(city))

    results = query.order_by(Restaurant.id).all()

    return {
        "count": len(results),
        "restaurants": [
            {
                "id": restaurant.id,
                "name": restaurant.name,
                "cuisine": restaurant.cuisine,
                "cost_for_two": restaurant.cost_for_two,
                "rating": restaurant.rating,
                "discount_percent": restaurant.discount_percent,
                "discount_cap": restaurant.discount_cap,
                "city": restaurant.city,
                "source": restaurant.source,
            }
            for restaurant in results
        ],
    }


@app.get("/api/restaurants/{restaurant_id}")
def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
):
    restaurant = (
        db.query(Restaurant)
        .filter(Restaurant.id == restaurant_id)
        .first()
    )

    if restaurant is None:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found",
        )

    return {
        "id": restaurant.id,
        "name": restaurant.name,
        "cuisine": restaurant.cuisine,
        "cost_for_two": restaurant.cost_for_two,
        "rating": restaurant.rating,
        "discount_percent": restaurant.discount_percent,
        "discount_cap": restaurant.discount_cap,
        "city": restaurant.city,
        "source": restaurant.source,
    }

@app.post(
    "/api/restaurants",
    response_model=RestaurantResponse,
    status_code=201,
)
def create_restaurant(
    restaurant_data: RestaurantCreate,
    db: Session = Depends(get_db),
):
    restaurant = Restaurant(**restaurant_data.model_dump())

    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)

    return restaurant

@app.put("/api/restaurants/{restaurant_id}")
def update_restaurant(
    restaurant_id: int,
    restaurant_data: RestaurantUpdate,
    db: Session = Depends(get_db),
):
    restaurant = (
        db.query(Restaurant)
        .filter(Restaurant.id == restaurant_id)
        .first()
    )

    if restaurant is None:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found",
        )

    update_data = restaurant_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(restaurant, field, value)

    db.commit()
    db.refresh(restaurant)

    return {
        "message": "Restaurant updated successfully",
        "restaurant": {
            "id": restaurant.id,
            "name": restaurant.name,
            "cuisine": restaurant.cuisine,
            "cost_for_two": restaurant.cost_for_two,
            "rating": restaurant.rating,
            "discount_percent": restaurant.discount_percent,
            "discount_cap": restaurant.discount_cap,
            "city": restaurant.city,
            "source": restaurant.source,
        },
    }


@app.delete("/api/restaurants/{restaurant_id}")
def delete_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
):
    restaurant = (
        db.query(Restaurant)
        .filter(Restaurant.id == restaurant_id)
        .first()
    )

    if restaurant is None:
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found",
        )

    db.delete(restaurant)
    db.commit()

    return {
        "message": "Restaurant deleted successfully",
        "id": restaurant_id,
    }


# ==========================================
# RESTAURANT INFORMATION APIs
# ==========================================

# 1. Get all restaurant information
@app.get(
    "/api/restaurant-info",
    response_model=list[RestaurantInfoResponse]
)
def get_restaurant_info(
    city: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(RestaurantInfo)

    if city:
        query = query.filter(RestaurantInfo.city.ilike(city))

    return query.order_by(RestaurantInfo.id).all()


# 2. Get a single restaurant's information
@app.get(
    "/api/restaurant-info/{restaurant_id}",
    response_model=RestaurantInfoResponse
)
def get_single_restaurant_info(
    restaurant_id: int,
    db: Session = Depends(get_db)
):
    restaurant = (
        db.query(RestaurantInfo)
        .filter(RestaurantInfo.id == restaurant_id)
        .first()
    )

    if restaurant is None:
        raise HTTPException(
            status_code=404,
            detail="Restaurant information not found"
        )

    return restaurant


# 3. Add a new restaurant
@app.post(
    "/api/restaurant-info",
    response_model=RestaurantInfoResponse,
    status_code=201
)
def create_restaurant_info(
    restaurant_data: RestaurantInfoCreate,
    db: Session = Depends(get_db)
):
    restaurant = RestaurantInfo(**restaurant_data.model_dump())

    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)

    return restaurant


# 4. Update restaurant information
@app.put(
    "/api/restaurant-info/{restaurant_id}",
    response_model=RestaurantInfoResponse
)
def update_restaurant_info(
    restaurant_id: int,
    restaurant_data: RestaurantInfoUpdate,
    db: Session = Depends(get_db)
):
    restaurant = (
        db.query(RestaurantInfo)
        .filter(RestaurantInfo.id == restaurant_id)
        .first()
    )

    if restaurant is None:
        raise HTTPException(
            status_code=404,
            detail="Restaurant information not found"
        )

    update_data = restaurant_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(restaurant, field, value)

    db.commit()
    db.refresh(restaurant)

    return restaurant