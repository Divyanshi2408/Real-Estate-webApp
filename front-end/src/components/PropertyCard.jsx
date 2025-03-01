import React from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ property, onUnlike, onUnsave }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <img
        src={
          property.photos.length > 0
            ? property.photos[0].startsWith("http")
              ? property.photos[0] // Use directly if already a full URL
              : `http://localhost:5000/uploads/${property.photos[0]}` // Add correct prefix
            : errorImage
        }
        alt={property.title}
        className="w-full h-60 object-cover"
      />
      <h3 className="text-xl font-semibold">{property.title}</h3>
      <p className="text-gray-600">{property.city}</p>
      <p className="text-gray-800 font-semibold">${property.price}</p>
      <div className="mt-4 flex justify-between">
        {onUnlike && (
          <button
            className="bg-red-700 text-white px-4 py-2 rounded"
            onClick={() => onUnlike(property._id)}
          >
            Unlike
          </button>
        )}
        {onUnsave && (
          <button
            className="bg-red-700 text-white px-4 py-2 rounded"
            onClick={() => onUnsave(property._id)}
          >
            Unsave
          </button>
        )}
      </div>
      <Link
        to={`/property/${property._id}`} key={property._id}
        className="text-red-700 hover:underline mt-4 block"
      >
        View Details
      </Link>
    </div>
  );
};

export default PropertyCard;
