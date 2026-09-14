import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowUp, FaThLarge, FaList, FaBuilding, FaSmile, FaCity } from "react-icons/fa";
import { fetchAllProperties } from "../services/propertyService";
import heroBg from "../assets/hero-section.png";
import { FaShieldAlt, FaStar, FaLightbulb, FaEye, FaUsers } from "react-icons/fa";
import PropertyCard from "../components/PropertyCard";
import BrowseByCity from "../components/BrowseByCity";
import BrowseByType from "../components/BrowseByType";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";


const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", type: "", location: "", size: "", price: 300000 });
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const propertiesSectionRef = useRef(null);
  const [size, setSize] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [view, setView] = useState("grid"); // "grid" | "list"

  const values = [
    { title: "Integrity", desc: "Upholding the highest professional and ethical standards.", icon: <FaShieldAlt /> },
    { title: "Excellence", desc: "Delivering top-tier service in every interaction.", icon: <FaStar /> },
    { title: "Innovation", desc: "Utilizing the latest technology for better results.", icon: <FaLightbulb /> },
    { title: "Transparency", desc: "Keeping our clients informed every step of the way.", icon: <FaEye /> },
    { title: "Community", desc: "Actively contributing to the neighborhoods we serve.", icon: <FaUsers /> },
    { title: "Luxury", desc: "random content which needs to be changed later by developers.", icon: <FaStar /> }
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProperties();
        setTimeout(() => {
          setProperties(data);
          setFilteredProperties(data.slice(0, 9));
          setLoading(false);
        }, 100);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (e) => {
    setFilters({ ...filters, price: Number(e.target.value) });
  };

  const handleSizeChange = (e) => {
    setFilters({ ...filters, size: Number(e.target.value) });
  };

  const handleSearch = () => {
    let filtered = properties;
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase().trim();
      filtered = filtered.filter(
        (prop) =>
          prop.title?.toLowerCase().includes(kw) ||
          prop.city?.toLowerCase().includes(kw) ||
          prop.locality?.toLowerCase().includes(kw)
      );
    }
    if (filters.type) filtered = filtered.filter((prop) => prop.type.toLowerCase().trim() === filters.type.toLowerCase().trim());
    if (filters.location) filtered = filtered.filter((prop) => prop.city.toLowerCase().trim() === filters.location.toLowerCase().trim());
    if (filters.size) filtered = filtered.filter((prop) => prop.size === filters.size);
    if (filters.price) filtered = filtered.filter((prop) => prop.price <= filters.price);
    setFilteredProperties(sortProperties(filtered).slice(0, 9));
    propertiesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sortProperties = (list) => {
    const sorted = [...list];
    if (sortBy === "priceLow") sorted.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHigh") sorted.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (sortBy === "sizeLarge") sorted.sort((a, b) => b.size - a.size);
    return sorted;
  };

  useEffect(() => {
    setFilteredProperties((prev) => sortProperties(prev));
  }, [sortBy]);

  const stats = [
    { icon: <FaBuilding />, value: properties.length ? `${properties.length}+` : "—", label: "Properties Listed" },
    { icon: <FaCity />, value: new Set(properties.map((p) => p.city)).size || "—", label: "Cities Covered" },
    { icon: <FaSmile />, value: "500+", label: "Happy Clients" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="flex flex-row justify-between px-60 items-center text-center text-white mt-15 py-32 max-sm:px-10 max-md:flex-col"
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center", height: "fit-content" }}
      >
        <h2 className="text-left text-4xl mb-5 text-gray-100 drop-shadow-md shadow stroke-1 max-sm:text-2xl max-md:text-center">
          <span className="text-white text-7xl font-bold max-sm:text-4xl">Bricks & Beams</span>
          <br />
          Made Easy to<br />Buy & Sell Property
        </h2>
        <div className="bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm border border-white/10 bg-opacity-50 rounded-lg px-10 py-5 text-xl flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              name="keyword"
              placeholder="Search by title, city, or locality..."
              value={filters.keyword}
              onChange={handleFilterChange}
              className="w-full py-2 pl-9 pr-4 text-base font-medium text-white bg-white/10 border border-white/20 rounded outline-none placeholder:text-gray-300"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
          </div>
          <select name="type" className="py-2 pr-4 font-semibold text-white  rounded outline-none" onChange={handleFilterChange}>
            <option className="bg-black" value="">Type</option>
            <option className="bg-black" value="Home">Home</option>
            <option className="bg-black" value="Apartment">Apartment</option>
            <option className="bg-black" value="Villa">Villa</option>
          </select>
          <select name="location" className="py-2 pr-4 font-semibold text-white rounded outline-none" onChange={handleFilterChange}>
            <option className="bg-black" value="">Location</option>
            <option className="bg-black" value="Agra">Agra</option>
            <option className="bg-black" value="Delhi">Delhi</option>
            <option className="bg-black" value="Mumbai">Mumbai</option>
          </select>

          {/* <div className="flex flex-col items-center px-4">
            <label className="text-sm font-semibold text-gray-800">Min Size: {filters.size.toLocaleString()} sq ft</label>
            <input
              type="range"
              name="size"
              min="500"
              max="5000"
              step="100"
              value={filters.size}
              onChange={handleSizeChange}
              className="w-full accent-red-700 cursor-pointer"
            />
          </div> */}
          {filters.type === "Apartment" ? (
          <select name="size" className="py-2 pr-4 font-semibold text-white rounded outline-none" onChange={handleSizeChange}>
            <option className="bg-black"  value="">Select BHK</option>
            <option  className="bg-black" value="1BHK">1 BHK</option>
            <option  className="bg-black" value="2BHK">2 BHK</option>
            <option  className="bg-black" value="3BHK">3 BHK</option>
            <option  className="bg-black" value="4BHK">4 BHK</option>
          </select>
        ) : (
          <div className="flex flex-col items-start pr-4">
            <label className="text-sm text-left font-semibold text-white">Min Size: {filters.size.toLocaleString()} sq ft</label>
            <input
              type="range"
              name="size"
              min="0"
              max="5000"
              step="100"
              value={filters.size}
              onChange={handleSizeChange}
              className="w-full accent-red-700 cursor-pointer"
            />
          </div>
        )}


          {/* Price Range Slider */}
          <div className="flex flex-col items-center pr-4">
            <label className="text-sm font-semibold text-white">Max Price: ${filters.price.toLocaleString()}</label>
            <input
              type="range"
              name="price"
              min="100000"
              max="500000"
              step="10000"
              value={filters.price}
              onChange={handlePriceChange}
              className="w-full accent-red-700 cursor-pointer"
            />
          </div>

          <button onClick={handleSearch} className="flex items-center justify-center space-x-2 font-semibold bg-red-700 hover:bg-red-600 text-white px-4 py-1 rounded-full">
            
            <span>Search</span>
            <FaSearch className="text-md" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-red-700 text-white py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 px-6 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-3xl font-bold max-sm:text-xl">{stat.value}</p>
              <p className="text-sm text-red-100 uppercase tracking-wide max-sm:text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/*About us*/}
      <div className="text-center mt-10 mb-10">
        <h2 className="text-4xl text-gray-600 max-md:text-xl px-2">Discover Your Perfect Space with Bricks & Beams, Where Dreams Find Their Foundation
        </h2>
      </div>

      {/*Cards*/}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-5xl font-semibold text-gray-900 mb-6 text-center max-md:text-3xl">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div key={index} className="relative overflow-hidden bg-white p-6 rounded-lg shadow-lg group">
              {/* Sliding Red Background Effect */}
              <div className="absolute inset-0 bg-red-700 transform translate-x-200 group-hover:translate-x-0 transition-transform duration-500"></div>

              {/* Icon inside Circle with 360° Rotation Effect */}
              <div className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full border-4 border-red-700 text-red-700 
                          group-hover:text-white group-hover:border-white transition-all duration-700 
                          transform group-hover:rotate-[360deg]">
                  {value.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-white transition-colors duration-500">
                  {value.title}
                </h3>
                <p className="mt-2 text-gray-700 group-hover:text-white transition-colors duration-500 px-4">
                  {value.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Browse by City / Type */}
      <BrowseByCity properties={properties} />
      <BrowseByType properties={properties} />

      {/* How It Works */}
      <HowItWorks />

      {/* Property Listings */}
      <div ref={propertiesSectionRef} className="flex flex-col justify-center items-center max-w-7xl mx-auto p-6">
        <h2 className="text-4xl font-bold text-red-700 mb-6 text-center">Featured Properties</h2>

        {/* Sort + view toggle */}
        <div className="w-full flex flex-wrap gap-3 justify-end items-center mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">Sort: Default</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="sizeLarge">Size: Largest First</option>
          </select>
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 transition ${view === "grid" ? "bg-red-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              aria-label="Grid view"
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 transition ${view === "list" ? "bg-red-700 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              aria-label="List view"
            >
              <FaList />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
          </div>
        ) : (
          <div className={view === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full" : "flex flex-col gap-6 w-full"}>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} variant={view} />
              ))
            ) : (
              <p className="text-center text-gray-500">No properties found.</p>
            )}
          </div>
        )}
        <Link to={"/propertyPage"}><button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-lg mt-10 item-center hover:bg-white hover:text-red-700">View All Properties</button></Link>
      </div>

      {/* Testimonials */}
      <Testimonials />

      {/* Back to Top Button */}
      {showScrollButton && (
        <button onClick={scrollToTop} className="animate-bounce fixed bottom-8 right-8 bg-red-700 text-white p-3 rounded-full shadow-lg hover:bg-red-800 transition">
          <FaArrowUp className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default HomePage;
