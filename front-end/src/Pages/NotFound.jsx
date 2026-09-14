import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 mt-20">
      <p className="text-8xl font-bold text-red-700">404</p>
      <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page not found</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 bg-red-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-red-800 transition"
        >
          <FaHome /> Back to Home
        </Link>
        <Link
          to="/propertyPage"
          className="flex items-center gap-2 bg-white text-red-700 border border-red-700 px-5 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
        >
          <FaSearch /> Browse Properties
        </Link>
      </div>
    </div>
  );
};

export default NotFound;