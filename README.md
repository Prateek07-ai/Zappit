# 🍽️ Zappit – Compare. Calculate. Dine.

**Zappit** is a restaurant discovery and bill-estimation platform that helps users compare dining options, explore restaurant information, and calculate estimated bills before visiting.

The goal is to make dining decisions easier by bringing restaurant comparisons, discount calculations, and budget estimation into one place.

## ✨ Features

- **Restaurant Discovery:** Browse restaurant listings with details such as cuisine, location, ratings, and pricing.
- **Smart Search:** Search restaurants by name or cuisine.
- **Restaurant Comparison:** Compare estimated dining costs and available discounts.
- **Bill Estimation:** Calculate estimated bills based on the number of people.
- **Discount Calculation:** Automatically calculate discounts while respecting maximum discount caps.
- **Convenience Fee:** Include a 5% Zappit convenience fee in the estimated final bill.
- **Cheapest Option:** Highlight the restaurant with the lowest estimated bill.
- **Best Deal:** Identify attractive dining options by balancing affordability and ratings.
- **Potential Savings:** Compare estimated costs to understand possible savings.
- **Restaurant Management:** Add and manage restaurant information through the application.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| API | REST API |
| Version Control | Git, GitHub |

## 🏗️ Project Structure

```text
Zappit/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── init_db.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── postcss.config.js
└── tailwind.config.js
```

## 🧮 Bill Calculation Logic

Zappit estimates the dining cost using the following calculations:

**1. Base Cost**

```text
Base Cost = Cost for Two × (Number of People / 2)
```

**2. Discount**

```text
Discount = Minimum of:
(Base Cost × Discount Percentage / 100)
Maximum Discount Cap
```

**3. Cost After Discount**

```text
After-Discount Cost = Base Cost - Discount
```

**4. Convenience Fee**

```text
Convenience Fee = After-Discount Cost × 5 / 100
```

**5. Final Estimated Bill**

```text
Final Bill = After-Discount Cost + Convenience Fee
```

The calculations provide an estimate. Actual restaurant bills may vary depending on offer eligibility, taxes, service charges, and other applicable fees.

## 🚀 Getting Started

Follow these steps to run Zappit locally.

### Prerequisites

Make sure you have installed:

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Prateek07-ai/Zappit.git
cd Zappit
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it using Git Bash on Windows:

```bash
source venv/Scripts/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Initialize the database with sample restaurants:

```bash
python init_db.py
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Set Up the Frontend

Open a **second Git Bash terminal** and navigate to the frontend:

```bash
cd ~/Zappit/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:5173
```

Make sure both the backend and frontend servers are running.

## 🔌 API Overview

The FastAPI backend provides REST endpoints for restaurant data.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/restaurants` | Retrieve restaurant listings |
| GET | `/api/restaurant-info` | Retrieve restaurant information |
| GET | `/api/restaurant-info/{id}` | Retrieve a restaurant by ID |
| POST | `/api/restaurant-info` | Add restaurant information |
| PUT | `/api/restaurant-info/{id}` | Update restaurant information |

Interactive API documentation is available at `/docs`.

## 📌 Current Project Scope

- Full-stack restaurant discovery and comparison application.
- Backend API built with FastAPI.
- Local database management using SQLite and SQLAlchemy.
- Dynamic bill estimation and discount calculations.
- Search, sorting, and restaurant comparison features.

**Note:** Restaurant listings and offers may include sample or manually entered data. Live integrations with third-party food delivery platforms are not currently claimed. Estimated prices and discounts should be independently verified with the restaurant.

## 🔮 Future Improvements

- Integration with authorized restaurant and food delivery APIs.
- Real-time restaurant offers and menu updates.
- User authentication and personalized profiles.
- Location-based restaurant discovery.
- Restaurant reviews and recommendations.
- Deployment with a publicly accessible frontend and backend.

## 👨‍💻 Author

**Prateek Mukherjee**

- GitHub: [@Prateek07-ai](https://github.com/Prateek07-ai)

## 📄 License

A license has not yet been added to this repository. All rights are reserved by the author unless a license is subsequently specified.

---

⭐ If you find this project interesting, consider starring the repository!

**Zappit – Compare. Calculate. Dine.**