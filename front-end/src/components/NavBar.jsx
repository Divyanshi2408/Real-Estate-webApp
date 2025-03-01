import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import the context
import { fetchAllProperties } from "../services/propertyService";
import logo from "../assets/logo.png";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { MdHomeWork } from "react-icons/md";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await fetchAllProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = properties.filter((prop) =>
        prop.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties([]);
    }
  }, [searchQuery, properties]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/dashboard";
    if (user?.role === "owner") return "/owner-Dashboard";
    if (user?.role === "user") return "/userDashboard";
    return "/";
  };

  return (
    <nav className="fixed top-0 w-full bg-red-700 p-4 text-white flex justify-between items-center z-10 shadow-lg">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold">Brick & Beams</h1>
      </Link>

      {/* Search Bar (Hidden on Mobile) */}
      <div className="hidden md:flex relative w-64">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white text-black pl-10 pr-4 py-2 rounded-full outline-none"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-800 text-lg" />
        {filteredProperties.length > 0 && (
          <div className="absolute bg-white text-black w-full mt-2 rounded shadow-lg z-10">
            {filteredProperties.slice(0, 5).map((prop) => (
              <Link
                key={prop._id}
                to={`/property/${prop._id}`}
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => setSearchQuery("")}
              >
                {prop.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/propertyPage" className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition flex gap-2">
        <MdHomeWork className="w-6 h-6 "/>Properties
        </Link>
        <Link to="/AboutPage" className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition">
          About Us
        </Link>
        <Link to="/contact" className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition">
          Contact us
        </Link>

        {user ? (
          <>
            <Link to={getDashboardLink()} className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition">
              Login →
            </Link>
            <Link to="/register" className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition">
              Register →
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full z-500 bg-red-800 shadow-lg flex flex-col items-center py-4 md:hidden">
          <Link to="/propertyPage" className="py-2 w-full text-center hover:bg-red-600" onClick={() => setMenuOpen(false)}>
            Properties
          </Link>
          <Link to="/AboutPage" className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition" onClick={() => setMenuOpen(false)}>
          About Us
        </Link>
        <Link to="/contact" className="px-4 py-2 font-bold rounded-full hover:bg-white hover:text-red-700 transition" onClick={() => setMenuOpen(false)}>
          Contact us
        </Link>

          {user ? (
            <>
              <Link to={getDashboardLink()} className="py-2 w-full text-center hover:bg-red-600" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="py-2 w-full text-center hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 w-full text-center hover:bg-red-600" onClick={() => setMenuOpen(false)}>
                Login →
              </Link>
              <Link to="/register" className="py-2 w-full text-center hover:bg-red-600" onClick={() => setMenuOpen(false)}>
                Register →
              </Link>
            </>
          )}

          {/* Mobile Search Bar */}
          <div className="w-11/12 mt-4 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-black pl-10 pr-4 py-2 rounded-full outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-800 text-lg" />
            {filteredProperties.length > 0 && (
              <div className="absolute bg-white text-black w-full mt-2 rounded shadow-lg z-10">
                {filteredProperties.slice(0, 5).map((prop) => (
                  <Link
                    key={prop._id}
                    to={`/property/${prop._id}`}
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => {
                      setSearchQuery("");
                      setMenuOpen(false);
                    }}
                  >
                    {prop.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
