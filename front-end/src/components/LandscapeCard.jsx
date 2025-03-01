import React from "react";
import errorImage from "../assets/ErrorImage.png"
import { BiArea } from "react-icons/bi";
import { RiRoadMapLine } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { Link } from "react-router-dom";

const LandscapeCard = ({ property }) => {
  return (
    <div className="block mt-5" key={property._id}>
    <div className="relative bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 group">

      {/* Property Image */}
      {property.photos.length > 0 ? (
          <img
            src={property.photos[0].startsWith("http") ? property.photos[0] : `http://localhost:5000/uploads/${property.photos[0]}`}
            alt={property.title}
            className="w-full h-60 object-cover hover:scale-105 transition-all"
            onError={(e) => e.target.src = errorImage} // Handle broken image links
          />
        ) : (
          <img
            src={errorImage}
            alt={property.title}
            className="rounded-md object-cover w-90 h-60"
          />
        )}

      {/* Property Details */}
      <div className="p-5 relative">
        
        <h3 className="max-sm:text-xl text-2xl mt-2 font-semibold text-gray-900 flex justify-between">${property.price.toLocaleString()} <h4 className="text-xl mt-1 text-red-700 flex"><BiArea className="w-7 h-7 text-red" /> {property.size}sqft</h4> </h3>
        
        <p className="max-sm:text-l mt-3 text-gray-600 font-semibold text-lg flex "><RiRoadMapLine className="w-7 h-7  mr-1"/>{property.city}</p>


        {/* View Details Button (Hidden by default, appears on hover at bottom-right) */}
        <Link to={`/property/${property._id}`} key={property._id} className="max-sm:opacity-100 absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-lg hover:bg-red-700 transition flex gap-2">
            View Details <TbListDetails className="w-5 h-5"/>
          </button>
        </Link>
      </div>

    </div>
  </div>

  );
};

export default LandscapeCard;
