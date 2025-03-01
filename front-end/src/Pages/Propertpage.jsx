import React, { useEffect, useState } from "react";
import { fetchAllProperties } from "../services/propertyService";
import { Link } from "react-router-dom";
import errorImage from "../assets/ErrorImage.png";
import LandscapeCard from '../components/LandscapeCard';

const PropertyPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    size: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProperties();
        const approvedProperties = data
          .filter(property => property.approvalStatus === "approved")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first
          setTimeout(() => {
            setProperties(approvedProperties);
            setFilteredProperties(approvedProperties);
            setLoading(false);
          }, 300);
      } catch (err) {
        setTimeout(() => {
          setError(err.message);
          setLoading(false);
        }, 1000);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;
    if (filters.type) {
      filtered = filtered.filter(
        prop => prop.type.toLowerCase() === filters.type.toLowerCase()
      );
    }
    if (filters.location) {
      filtered = filtered.filter(
        prop => prop.city.toLowerCase() === filters.location.toLowerCase()
      );
    }
    if (filters.size > 0) {
      filtered = filtered.filter(prop => prop.size >= filters.size);
    }
    if (filters.price > 0) {
      filtered = filtered.filter(prop => prop.price <= filters.price);
    }
    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [filters, properties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e) => {
    setFilters({ ...filters, price: Number(e.target.value) });
  };

  const handleSizeChange = (e) => {
    setFilters({ ...filters, size: Number(e.target.value) });
  };

  const handleResetFilters = () => {
    setFilters({
      type: "",
      location: "",
      size: 0,
      price: 0,
    });
    setFilteredProperties(properties);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <div className="max-w-7xl mx-auto mt-20 p-6">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Property Listings
      </h2>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-md mb-4 text-center">
          Error: {error}
        </p>
      )}

      <div className="bg-white shadow-xl p-6 rounded-2xl flex flex-wrap gap-6 justify-center items-center border border-gray-200">
        <div className="flex flex-col">
          <select
            name="type"
            className="p-3 rounded-lg bg-white transition cursor-pointer outline-none"
            onChange={handleFilterChange}
            value={filters.type}
          >
            <option value="">All Types</option>
            <option value="Home">Home</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
          </select>
        </div>
        <div className="flex flex-col">
          <select
            name="location"
            className="p-3 rounded-lg bg-white transition cursor-pointer outline-none"
            onChange={handleFilterChange}
            value={filters.location}
          >
            <option value="">All Locations</option>
            <option value="Agra">Agra</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Gurgaon">Gurgaon</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Min Size: <span className="font-semibold text-red-700">{filters.size} sq ft</span></label>
          <input
            type="range"
            name="size"
            min="500"
            max="5000"
            step="100"
            value={filters.size}
            onChange={handleSizeChange}
            className="w-40 accent-red-700"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold">Max Price: <span className="font-semibold text-green-700">${filters.price}</span></label>
          <input
            type="range"
            name="price"
            min="50000"
            max="1000000"
            step="50000"
            value={filters.price}
            onChange={handlePriceChange}
            className="w-40 accent-red-700"
          />
        </div>
        <button
          onClick={handleResetFilters}
          className="px-6 py-2 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 shadow-md transition transform hover:scale-105"
        >
          Reset values
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
        </div>
      ) : (
        <div>
        <div className="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-12">
          {currentProperties.length > 0 ? (
            currentProperties.map((property) => (
              <Link to={`/property/${property._id}`} key={property._id}>
                <LandscapeCard property={property} />
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No properties found.</p>
          )}
        </div>
        <div className="flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`mx-1 px-4 py-2 rounded ${currentPage === i + 1 ? "bg-red-600 text-white" : "bg-gray-200"
                  }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPage;
