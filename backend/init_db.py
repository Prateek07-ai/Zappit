try:
    from .database import engine, SessionLocal, Base
    from .models import Restaurant, RestaurantInfo

except ImportError:
    # Support running this file directly
    from database import engine, SessionLocal, Base
    from models import Restaurant, RestaurantInfo
# Create the database tables
Base.metadata.create_all(bind=engine)

# Open a database session
db = SessionLocal()

try:
    # Insert sample restaurants only if the table is empty
    if db.query(Restaurant).count() == 0:
        sample_restaurants = [
            Restaurant(
                name="Spice Garden",
                cuisine="North Indian",
                cost_for_two=800,
                rating=4.3,
                discount_percent=20,
                discount_cap=200,
                city="Ranchi",
                source="sample",
            ),
            Restaurant(
                name="Urban Biryani",
                cuisine="Biryani",
                cost_for_two=600,
                rating=4.1,
                discount_percent=15,
                discount_cap=150,
                city="Ranchi",
                source="sample",
            ),
            Restaurant(
                name="Green Bowl Cafe",
                cuisine="Cafe and Vegetarian",
                cost_for_two=500,
                rating=4.5,
                discount_percent=10,
                discount_cap=100,
                city="Ranchi",
                source="sample",
            ),
        ]

        db.add_all(sample_restaurants)
        db.commit()
        print("Sample restaurants added successfully!")
    else:
        print("Database already contains restaurants.")

finally:
    db.close()

print("Zappit database initialized successfully!")
