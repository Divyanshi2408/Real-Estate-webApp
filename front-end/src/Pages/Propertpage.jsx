import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAllProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "home", label: "Home" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Land" },
];

// Public "browse all properties" page. Anyone can view this — it only ever
// shows approved listings (the backend's GET /api/properties already filters
// to approvalStatus: "approved"), and it never touches the admin endpoints.
const PropertyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters mirror the URL so links like the Home page's "Browse by City"
  // tiles (/propertyPage?city=Delhi) work, and so a search here is shareable.
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const filters = useMemo(
    () => ({ city, type, q, minPrice, maxPrice }),
    [city, type, q, minPrice, maxPrice]
  );

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAllProperties(filters);
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, type, q, minPrice, maxPrice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (city) next.city = city;
    if (type) next.type = type;
    if (q) next.q = q;
    if (minPrice) next.minPrice = minPrice;
    if (maxPrice) next.maxPrice = maxPrice;
    setSearchParams(next);
  };

  const clearFilters = () => {
    setCity("");
    setType("");
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});
  };

  const hasActiveFilters = city || type || q || minPrice || maxPrice;

  return (
    <div className="mt-24 max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">
        Browse Properties
      </h2>
      <p className="text-gray-500 text-center mb-8">
        {properties.length} propert{properties.length === 1 ? "y" : "ies"} available
      </p>

      {/* Filters */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 items-center justify-center mb-10 bg-gray-50 border border-gray-200 rounded-xl p-4"
      >
        <input
          type="text"
          placeholder="Search by title, city, or locality..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-700"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-red-700"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-red-700"
        >
          {PROPERTY_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          min="0"
          onChange={(e) => setMinPrice(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-red-700"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          min="0"
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-red-700"
        />
        <button
          type="submit"
          className="bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 transition"
        >
          Search
        </button>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-gray-500 hover:text-red-700 transition px-2"
          >
            Clear filters
          </button>
        )}
      </form>

      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg mb-6 text-center">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} variant="grid" />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">
          No properties found{hasActiveFilters ? " for these filters." : "."}
        </p>
      )}
    </div>
  );
};

export default PropertyPage;
