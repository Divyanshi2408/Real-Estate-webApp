import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom";
import errorImage from "../assets/ErrorImage.png";
import { BiArea } from "react-icons/bi";
import { RiRoadMapLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { FaHeart, FaBookmark, FaRegHeart, FaRegBookmark } from "react-icons/fa";
import { toggleLikeProperty, toggleSaveProperty } from "../services/propertyService";

// Single reusable property card used across the Home page, Property listings page,
// and dashboards. `variant="grid"` (default) renders a tall image card; `variant="list"`
// renders a wider horizontal card for list views.
//
// `onUnlike`/`onUnsave` are for pages like Favorites/Dashboard that need to remove the
// card from a list once un-liked/un-saved. Everywhere else, the heart/bookmark icons on
// the image handle liking/saving on their own.
const PropertyCard = ({ property, variant = "grid", onUnlike, onUnsave }) => {
  const [isLiked, setIsLiked] = useState(!!property.isLiked);
  const [isSaved, setIsSaved] = useState(!!property.isSaved);

  const photo =
    property.photos?.length > 0
      ? property.photos[0].startsWith("http")
        ? property.photos[0]
        : `${API_BASE_URL}/uploads/${property.photos[0]}`
      : errorImage;

  const isNew =
    property.createdAt &&
    Date.now() - new Date(property.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

  const badge = property.featured ? "Featured" : isNew ? "New" : null;

  const requireLogin = () => {
    if (!localStorage.getItem("token")) {
      alert("Please log in to do this.");
      return false;
    }
    return true;
  };

  const handleLikeToggle = async (e) => {
    e.preventDefault();
    if (!requireLogin()) return;
    try {
      await toggleLikeProperty(property._id);
      setIsLiked((prev) => !prev);
    } catch {
      // Non-critical — button just won't flip if the request fails
    }
  };

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    if (!requireLogin()) return;
    try {
      await toggleSaveProperty(property._id);
      setIsSaved((prev) => !prev);
    } catch {
      // Non-critical — button just won't flip if the request fails
    }
  };

  return (
    <div
      className={`relative bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 group ${
        variant === "list" ? "flex flex-col sm:flex-row" : "block"
      }`}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-10 bg-red-700 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
          {badge}
        </span>
      )}

      {/* Like / Save quick actions */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          onClick={handleLikeToggle}
          aria-label={isLiked ? "Unlike" : "Like"}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-red-700 shadow hover:bg-white transition"
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button
          onClick={handleSaveToggle}
          aria-label={isSaved ? "Unsave" : "Save"}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-900 shadow hover:bg-white transition"
        >
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {/* Image */}
      <img
        src={photo}
        alt={property.title}
        onError={(e) => (e.target.src = errorImage)}
        className={`object-cover hover:scale-105 transition-all ${
          variant === "list" ? "w-full sm:w-72 h-56 sm:h-auto shrink-0" : "w-full h-60"
        }`}
      />

      {/* Details */}
      <div className="p-5 relative flex-1">
        {property.title && (
          <h4 className="text-lg font-semibold text-gray-900 truncate">{property.title}</h4>
        )}

        <h3 className="text-2xl mt-1 font-semibold text-gray-900 flex justify-between items-center">
          ${property.price?.toLocaleString()}
          <span className="text-lg text-red-700 flex items-center gap-1">
            <BiArea className="w-6 h-6" /> {property.size}sqft
          </span>
        </h3>

        <p className="mt-3 text-gray-600 font-semibold text-lg flex items-center">
          <RiRoadMapLine className="w-6 h-6 mr-1" />
          {property.city}
        </p>

        {/* Owner/dashboard actions */}
        {(onUnlike || onUnsave) && (
          <div className="mt-4 flex gap-3">
            {onUnlike && (
              <button
                onClick={() => onUnlike(property._id)}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-700 border border-red-700 px-3 py-1.5 rounded-md hover:bg-red-700 hover:text-white transition"
              >
                <FaHeart /> Unlike
              </button>
            )}
            {onUnsave && (
              <button
                onClick={() => onUnsave(property._id)}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-700 border border-red-700 px-3 py-1.5 rounded-md hover:bg-red-700 hover:text-white transition"
              >
                <FaBookmark /> Unsave
              </button>
            )}
          </div>
        )}

        <Link
          to={`/property/${property._id}`}
          className={`${
            variant === "list"
              ? "inline-flex mt-4"
              : "absolute bottom-5 right-5  duration-300"
          }`}
        >
          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-lg hover:bg-red-700 transition flex gap-2 items-center">
            View Details <TbListDetails className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;