
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Star,
  Utensils,
  SlidersHorizontal,
  IndianRupee,
  ArrowUpRight,
  LoaderCircle,
  TrendingDown,
  Trophy,
} from "lucide-react";
import "./index.css";

const API_URL = "http://127.0.0.1:8000";

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}


function estimateBill(restaurant, people) {
  const base = restaurant.cost_for_two * (people / 2);

  const discount = Math.min(
    base * restaurant.discount_percent / 100,
    restaurant.discount_cap
  );

  const billAfterOffer = base - discount;
  const convenienceFee = billAfterOffer * 0.05;
  const total = billAfterOffer + convenienceFee;

  return {
    base,
    discount,
    billAfterOffer,
    convenienceFee,
    total,
  };
}


export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantProfiles, setRestaurantProfiles] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [search, setSearch] = useState("");
  const [people, setPeople] = useState(2);
  const [sortBy, setSortBy] = useState("price");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const response = await fetch(`${API_URL}/api/restaurants?city=Ranchi`);

        if (!response.ok) {
          throw new Error("Could not load restaurants.");
        }

        const data = await response.json();
        setRestaurants(data.restaurants);
      } catch {
        setError(
          "Could not connect to the backend. Check that FastAPI is running on port 8000."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRestaurants();
  }, []);


  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        `${restaurant.name} ${restaurant.cuisine}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCuisine =
        selectedCuisine === "All" ||
        restaurant.cuisine === selectedCuisine;

      return matchesSearch && matchesCuisine;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      if (sortBy === "discount") {
        return b.discount_percent - a.discount_percent;
      }

      return (
        estimateBill(a, people).total -
        estimateBill(b, people).total
      );
    });


const availableCuisines = [
  "All",
  ...new Set(
    restaurants
      .map((restaurant) => restaurant.cuisine)
      .filter(Boolean)
  ),
];

const filteredProfiles = restaurantProfiles.filter((restaurant) => {
  const matchesSearch =
    `${restaurant.name} ${restaurant.cuisine || ""} ${restaurant.address || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesCuisine =
    selectedCuisine === "All" ||
    restaurant.cuisine === selectedCuisine;

  return matchesSearch && matchesCuisine;
});

useEffect(() => {
  async function loadRestaurantProfiles() {
    try {
      const response = await fetch(
        `${API_URL}/api/restaurant-info?city=Ranchi`
      );

      if (!response.ok) {
        throw new Error("Could not load restaurant profiles.");
      }

      const data = await response.json();
      setRestaurantProfiles(data);
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setProfileLoading(false);
    }
  }

  loadRestaurantProfiles();
}, []);


  const cheapest = filteredRestaurants.length > 0
    ? [...filteredRestaurants].sort(
        (a, b) =>
          estimateBill(a, people).total -
          estimateBill(b, people).total
      )[0]
    : null;

  const mostExpensive = filteredRestaurants.length > 0
    ? [...filteredRestaurants].sort(
        (a, b) =>
          estimateBill(b, people).total -
          estimateBill(a, people).total
      )[0]
    : null;


  const potentialSavings = cheapest && mostExpensive
      ? Math.max(
          0,
          estimateBill(mostExpensive, people).total -
            estimateBill(cheapest, people).total
        )
      : 0;
      const savingsPercentage =
mostExpensive && estimateBill(mostExpensive, people).total > 0
    ? (
        (potentialSavings /
          estimateBill(mostExpensive, people).total) *
        100
      ).toFixed(1)
    : "0.0";
    
  const bestDeal = filteredRestaurants.length > 0
    ? [...filteredRestaurants].sort((a, b) => {
        const maxRating = 5;
        const maxBill = Math.max(
          ...filteredRestaurants.map(
            (r) => estimateBill(r, people).total
          ),
          1
        );

        const score = (restaurant) => {
          const bill = estimateBill(restaurant, people).total;
          const affordability = 1 - bill / maxBill;
          const ratingScore = restaurant.rating / maxRating;

          return 0.6 * ratingScore + 0.4 * affordability;
        };

        return score(b) - score(a);
      })[0]
    : null;


  return (
    <div className="zappit-page min-h-screen bg-slate-50 text-slate-900">
      <header className="zappit-header border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white">
              <Utensils size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Zappit
              </h1>
              <p className="text-xs text-slate-500">
                Compare. Calculate. Dine.
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-800 sm:flex">
            <MapPin size={16} />
            Ranchi, Jharkhand
          </div>
        </div>
      </header>

      <main className="zappit-main mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="zappit-hero relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-green-300">
              YOUR DINING BUDGET, SORTED
            </span>

            <h2 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              Great food.
              <br />
              <span className="text-green-400">Smarter spending.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Compare restaurant offers and estimate what your meal could cost
              before you step out.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-500">
                <Search size={19} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search restaurant or cuisine"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white"
                >
                  {availableCuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-700">
                <span className="text-sm">People</span>
                <select
                  value={people}
                  onChange={(event) => setPeople(Number(event.target.value))}
                  className="bg-transparent text-sm font-bold outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full border-[45px] border-green-500/10" />
          <div className="pointer-events-none absolute -bottom-40 right-24 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
        </section>

        <section className="mt-9">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-green-700">
                EXPLORE YOUR OPTIONS
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                Restaurants near you
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Sample data for Ranchi · Estimated bills for your group
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm((isOpen) => !isOpen)}
                className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                {showAddForm ? "Close form" : "Add restaurant"}
              </button>
              <label className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm sm:self-auto">
                <SlidersHorizontal size={16} className="text-slate-500" />
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="bg-transparent font-semibold outline-none"
                >
                  <option value="price">Lowest estimated bill</option>
                  <option value="rating">Highest rating</option>
                  <option value="discount">Highest discount</option>
                </select>
              </label>
            </div>
          </div>

          {filteredRestaurants.length > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
              <span>Potential savings</span>
              <span className="font-extrabold text-green-900">
                {formatPrice(potentialSavings)}
              </span>
            </div>
          )}

          {showAddForm && (
            <form
              className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
              onSubmit={async (event) => {
                event.preventDefault();

                const form = event.currentTarget;
                const formData = new FormData(form);

                const restaurantData = {
                  name: formData.get("name").trim(),
                  cuisine: formData.get("cuisine").trim(),
                  cost_for_two: Number(formData.get("cost_for_two")),
                  rating: Number(formData.get("rating")),
                  discount_percent: Number(formData.get("discount_percent")),
                  discount_cap: Number(formData.get("discount_cap")),
                  city: formData.get("city").trim(),
                  source: "user-added",
                };

                try {
                  const response = await fetch(
                    "http://127.0.0.1:8000/api/restaurants",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(restaurantData),
                    }
                  );

                  if (!response.ok) {
                    const details = await response.text();
                    throw new Error(details || "Could not add restaurant");
                  }

                  window.alert("Restaurant added successfully!");
                  window.location.reload();
                } catch (error) {
                  window.alert(error.message || "Could not connect to Zappit API.");
                }
              }}
            >
              <h3 className="text-lg font-bold sm:col-span-2 lg:col-span-3">
                Add a restaurant
              </h3>

              <input name="name" placeholder="Restaurant name" required
                maxLength={150} className="rounded-xl border p-3" />

              <input name="cuisine" placeholder="Cuisine" required
                maxLength={100} className="rounded-xl border p-3" />

              <input name="city" placeholder="City" defaultValue="Ranchi" required
                maxLength={100} className="rounded-xl border p-3" />

              <input name="cost_for_two" type="number" placeholder="Cost for two (₹)"
                min="1" step="1" required className="rounded-xl border p-3" />

              <input name="rating" type="number" placeholder="Rating (0–5)"
                min="0" max="5" step="0.1" defaultValue="4" required
                className="rounded-xl border p-3" />

              <input name="discount_percent" type="number" placeholder="Discount (%)"
                min="0" max="100" step="0.1" defaultValue="0" required
                className="rounded-xl border p-3" />

              <input name="discount_cap" type="number" placeholder="Discount cap (₹)"
                min="0" step="1" defaultValue="0" required
                className="rounded-xl border p-3" />

              <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-3">
                <button type="submit"
                  className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">
                  Save Restaurant
                </button>

                <button type="button" onClick={() => setShowAddForm(false)}
                  className="rounded-xl border px-5 py-3 font-semibold hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          )}


          {loading && (
            <div className="flex items-center gap-3 py-16 text-slate-500">
              <LoaderCircle className="animate-spin" />
              Loading restaurants from Zappit API...
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && filteredRestaurants.length === 0 && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No restaurants match your search. Try another name or cuisine.
            </div>
          )}

          {/* Zappit Best Deal card goes here */}
          {bestDeal && (
            <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Trophy size={26} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold uppercase tracking-wide text-amber-800">
                    Zappit Best Deal
                  </p>

                  <h2 className="mt-1 text-xl font-black text-gray-900">
                    {bestDeal.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    {bestDeal.cuisine} · ⭐ {bestDeal.rating}/5
                  </p>

                  <p className="mt-3 text-2xl font-black text-green-700">
                    {formatPrice(estimateBill(bestDeal, people).total)}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Estimated bill for {people}{" "}
                    {people === 1 ? "person" : "people"}, after discounts.
                  </p>

                  <p className="mt-3 text-sm text-amber-900">
                    {bestDeal.rating >= 4.5
                      ? "Excellent rating makes this a strong choice."
                      : bestDeal.rating >= 4.0
                        ? "A good customer rating makes this a worthwhile option."
                        : "Compare the price and rating with other available options."}
                    {" "}
                    {estimateBill(bestDeal, people).total ===
                    estimateBill(cheapest, people).total
                      ? "It also has the lowest estimated bill."
                      : "Its recommendation balances rating and affordability."}
                  </p>

                </div>
              </div>
            </section>
          )}

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRestaurants.map((restaurant) => {
              const bill = estimateBill(restaurant, people);
              const isCheapest = cheapest?.id === restaurant.id;

              return (
                <article
                  key={restaurant.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <div className="flex h-36 items-center justify-center bg-gradient-to-br from-green-50 via-amber-50 to-orange-100">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/80 text-green-700 shadow-sm">
                      <Utensils size={35} />
                    </div>
                    {isCheapest && (
                      <span className="absolute ml-44 -mt-24 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white sm:ml-52 xl:ml-44">
                        LOWEST ESTIMATE
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold">
                          {restaurant.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {restaurant.cuisine}
                        </p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2 py-1.5 text-sm font-bold text-amber-700">
                        <Star size={14} fill="currentColor" />
                        {restaurant.rating}
                      </span>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Estimated total for {people}{" "}
                        {people === 1 ? "person" : "people"}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="text-2xl font-black">
                          {formatPrice(bill.total)}
                        </p>
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800">
                          {restaurant.discount_percent}% off*
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 text-sm">
                        <div className="flex justify-between text-slate-500">
                          <span>Estimated base cost</span>
                          <span>{formatPrice(bill.base)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-green-700">
                          <span>Potential discount</span>
                          <span>-{formatPrice(bill.discount)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-slate-500">
                          <span>Zappit convenience fee (5%)</span>
                          <span>{formatPrice(bill.convenienceFee)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <IndianRupee size={13} />
                        Cost for two: {formatPrice(restaurant.cost_for_two)}
                      </span>

                      <button
                      type="button"
                      className="flex items-center gap-1 cursor-pointer text-blue-600"
                      onClick={() => setSelectedRestaurant(restaurant)}
                    >
                        Details <ArrowUpRight size={14} />
                      </button>

                    </div>
                  </div>
                </article>
              );
            })}
          
            {selectedRestaurant && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-gray-900">
                      Restaurant Bill Details
                    </h2>
                    <button
                      onClick={() => setSelectedRestaurant(null)}
                      className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100"
                    >
                      ×
                    </button>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900">
                    {selectedRestaurant.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedRestaurant.cuisine} · ⭐ {selectedRestaurant.rating}/5
                  </p>

                  <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
                    <div className="flex justify-between">
                      <span>Estimated base cost</span>
                      <span>{formatPrice(estimateBill(selectedRestaurant, people).base)}</span>
                    </div>

                    <div className="flex justify-between text-green-700">
                      <span>Restaurant discount</span>
                      <span>-{formatPrice(estimateBill(selectedRestaurant, people).discount)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Bill after offer</span>
                      <span>{formatPrice(estimateBill(selectedRestaurant, people).billAfterOffer)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Zappit convenience fee (5%)</span>
                      <span>{formatPrice(estimateBill(selectedRestaurant, people).convenienceFee)}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-between border-t border-slate-200 pt-4">
                    <span className="font-bold">Estimated final bill</span>
                    <span className="text-xl font-black text-green-700">
                      {formatPrice(estimateBill(selectedRestaurant, people).total)}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-gray-500">
                    The convenience fee is charged by Zappit, not the restaurant.
                    Actual restaurant charges and taxes may vary.
                  </p>

                  <button
                    onClick={() => setSelectedRestaurant(null)}
                    className="mt-5 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-700"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            )}
  
          {filteredRestaurants.length > 1 && (
            <section className="zappit-restaurants mt-8 rounded-2xl border border-green-200 bg-green-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <TrendingDown size={24} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-800">
                    Potential Savings
                  </p>

                  <p className="mt-1 text-3xl font-black text-green-700">
                    {formatPrice(potentialSavings)}
                  </p>
                  
                  <p className="mt-2 text-sm font-bold text-green-800">
                    Save {savingsPercentage}% compared with the most expensive option
                  </p>
                  
                  <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-green-200">
                    <div
                      className="h-full rounded-full bg-green-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, Number(savingsPercentage)))}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-green-800">
                    {potentialSavings > 0
                      ? `You could save this amount by choosing ${cheapest.name} instead of ${mostExpensive.name}.`
                      : "The cheapest and most expensive restaurants have the same estimated bill."}
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-green-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                        Cheapest option
                      </p>
                      <p className="mt-1 font-bold text-gray-900">
                        {cheapest.name}
                      </p>
                      <p className="mt-1 text-lg font-black text-green-700">
                        {formatPrice(estimateBill(cheapest, people).total)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Most expensive option
                      </p>
                      <p className="mt-1 font-bold text-gray-900">
                        {mostExpensive.name}
                      </p>
                      <p className="mt-1 text-lg font-black text-gray-700">
                        {formatPrice(estimateBill(mostExpensive, people).total)}
                      </p>
                    </div>
                  </div>


                  <p className="mt-2 text-xs text-green-700">
                    Based on estimated bills for {people}{" "}
                    {people === 1 ? "person" : "people"}, after discounts.
                  </p>
                </div>
              </div>
            </section>
          )}

            
          {filteredRestaurants.length > 0 && (
            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900">
                Compare Restaurant Offers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Estimated prices for {people}{" "}
                {people === 1 ? "person" : "people"}, after applicable discounts.
              </p>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="px-3 py-3">Restaurant</th>
                      <th className="px-3 py-3">Base cost</th>
                      <th className="px-3 py-3">Discount</th>
                      <th className="px-3 py-3">Estimated bill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...filteredRestaurants]
                      .sort(
                        (a, b) =>
                          estimateBill(a, people).total -
                          estimateBill(b, people).total
                      )
                      .map((restaurant) => {
                        const bill = estimateBill(restaurant, people);
                        const isCheapest = cheapest?.id === restaurant.id;

                        return (
                          <tr
                            key={restaurant.id}
                            className={`border-b border-slate-100 ${
                              isCheapest ? "bg-green-50 font-semibold" : ""
                            }`}
                          >
                            <td className="px-3 py-4">
                              <div>{restaurant.name}</div>
                              {isCheapest && (
                                <span className="mt-1 inline-block rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                                  LOWEST ESTIMATE
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-4">
                              {formatPrice(bill.base)}
                            </td>
                            <td className="px-3 py-4 text-green-700">
                              -{formatPrice(bill.discount)}
                            </td>
                            <td className="px-3 py-4 font-bold">
                              {formatPrice(bill.total)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            *Estimates use temporary sample data and assume the listed
            percentage discount applies, subject to its cap. Actual restaurant
            bills may include taxes, service charges, eligibility rules, and
            other fees. Offers have not been verified with restaurants.
          </p>
        </section>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            <span className="font-bold text-slate-800">Zappit</span> ·
            Compare. Calculate. Dine.
          </p>
          <p>Built with React and FastAPI · Demo version</p>
        </div>
      </footer>
    </div>
  );
}
