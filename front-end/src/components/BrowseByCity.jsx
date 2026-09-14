import React, { useMemo } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import errorImage from "../assets/ErrorImage.png";

// Shows the distinct cities present in the current property data as clickable tiles.
// No new backend endpoint needed — it derives the list from properties already fetched
// on the Home page.
const BrowseByCity = ({ properties = [] }) => {
  const navigate = useNavigate();

  const cities = useMemo(() => {
    const map = new Map();
    properties.forEach((p) => {
      if (!p.city) return;
      if (!map.has(p.city)) {
        map.set(p.city, { name: p.city, count: 0, photo: p.photos?.[0] });
      }
      map.get(p.city).count += 1;
    });
    return Array.from(map.values()).slice(0, 6);
  }, [properties]);

  if (cities.length === 0) return null;

  const getPhoto = (photo) => {
    if (!photo) return errorImage;
    return photo.startsWith("http") ? photo : `${API_BASE_URL}/uploads/${photo}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center max-md:text-3xl">
        Browse by City
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Explore listings in the locations our clients search for most
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => navigate(`/propertyPage?city=${encodeURIComponent(city.name)}`)}
            className="relative h-44 rounded-lg overflow-hidden group text-left"
          >
            <img
              src={getPhoto(city.photo)}
              alt={city.name}
              onError={(e) => (e.target.src = errorImage)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-white text-xl font-semibold">{city.name}</h3>
              <p className="text-gray-200 text-sm">
                {city.count} {city.count === 1 ? "property" : "properties"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrowseByCity;
