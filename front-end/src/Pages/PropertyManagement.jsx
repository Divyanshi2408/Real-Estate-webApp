import React, { useEffect, useState } from "react";
import { useLocation,useNavigate} from "react-router-dom";

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch properties");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response format");

        // ✅ Check if user clicked "Active Properties"
        const queryParams = new URLSearchParams(location.search);
        const isActive = queryParams.get("active") === "true";

        const filteredProperties = isActive
          ? data.filter(property => property.approvalStatus === "approved")
          : data;

        setProperties(filteredProperties);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties.");
      }
    };

    fetchProperties();
  }, [location.search]);

  const handleApproval = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/properties/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedProperties = properties.map((property) =>
          property._id === id ? { ...property, approvalStatus: status } : property
        );
        setProperties(updatedProperties);
      } else {
        setError("Failed to approve/reject property.");
      }
    } catch (err) {
      setError("Error updating property status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/properties/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setProperties(properties.filter((property) => property._id !== id));
      } else {
        setError("Failed to delete property.");
      }
    } catch (err) {
      setError("Error deleting property.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-md mb-4 text-center">
          Error: {error}
        </p>
      )}

      {properties.length === 0 ? (
        <p className="text-center text-gray-500">No properties found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice().reverse().map((property) => (
            <div
              key={property._id}
              className="bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 p-5"
            >
              <p className="text-gray-700 font-medium">
                <span className="font-bold">Owner:</span> {property.ownerId?.name} <br /><span className="font-bold">Email:</span> {property.ownerId?.email}
              </p>
              {property.photos && property.photos.length > 0 && (
                <img
                  src={property.photos[0].startsWith("http") ? property.photos[0] : `http://localhost:5000/uploads/${property.photos[0]}`}
                  alt={property.name}
                  onClick={() => navigate(`/details/${property._id}`)}
                  className="w-full h-60 object-cover hover:scale-102 transition hover:cursor-pointer"
                  onError={(e) => e.target.src = errorImage} // Fallback for broken images
                />
              )}

              <div className="p-5">
                <h3 className="text-2xl font-semibold text-gray-900">{property.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{property.description?.slice(0, 80)}...</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-700 font-medium">
                    <span className="font-bold">City:</span> {property.city}
                  </p>
                  <p className="text-green-600 font-bold text-lg">${property.price}</p>
                </div>
                <p className="text-gray-500 text-sm mt-2">Status: {property.approvalStatus}</p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleApproval(property._id, "approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(property._id, "rejected")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
