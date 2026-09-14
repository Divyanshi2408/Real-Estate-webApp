import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBuilding, FaHotel, FaMapMarkedAlt } from "react-icons/fa";

// Matches the `type` enum used on the backend: land, home, villa, apartment.
const TYPE_META = {
  home: { label: "Homes", icon: <FaHome /> },
  apartment: { label: "Apartments", icon: <FaBuilding /> },
  villa: { label: "Villas", icon: <FaHotel /> },
  land: { label: "Land", icon: <FaMapMarkedAlt /> },
};

const BrowseByType = ({ properties = [] }) => {
  const navigate = useNavigate();

  const counts = useMemo(() => {
    const map = {};
    properties.forEach((p) => {
      const t = p.type?.toLowerCase();
      if (!t) return;
      map[t] = (map[t] || 0) + 1;
    });
    return map;
  }, [properties]);

  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center max-md:text-3xl">
        Browse by Property Type
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Find exactly the kind of place you're looking for
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(TYPE_META).map(([type, meta]) => (
          <button
            key={type}
            onClick={() => navigate(`/propertyPage?type=${type}`)}
            className="flex flex-col items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-xl hover:border-red-700 transition group"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-50 text-red-700 text-2xl group-hover:bg-red-700 group-hover:text-white transition-colors">
              {meta.icon}
            </div>
            <span className="font-semibold text-gray-900">{meta.label}</span>
            <span className="text-sm text-gray-500">{counts[type] || 0} listed</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrowseByType;
