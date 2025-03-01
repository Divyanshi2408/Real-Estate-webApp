import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyById, likeProperty, saveProperty, deleteProperty } from "../services/propertyService";
import { FaEdit, FaHeart, FaBookmark, FaCity, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { FaHouseChimneyWindow } from "react-icons/fa6";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    setLoading(true); // Start loading
    setTimeout(async () => {
      try {
        const data = await fetchPropertyById(id);
        setProperty(data);
        setIsLiked(data.isLiked);
        setIsSaved(data.isSaved);
        if (data.photos.length > 0) {
          setMainImage(
            data.photos[0].startsWith("http") 
              ? data.photos[0] 
              : `http://localhost:5000/uploads/${data.photos[0]}`
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // End loading after 1 sec
      }
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-md">
          Error: {error}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-red-700 mb-2 inline-block text-5xl hover:text-red-800 hover:scale-110"
        >
          ←
        </button>
      </div>
    );
  }

  if (!property) {
    return <p className="text-center text-gray-700 text-lg mt-10">Loading property details...</p>;
  }

  return (
    <div className="mt-20 max-w-5xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="text-red-700 mb-2 inline-block text-5xl hover:text-red-800 hover:scale-110"
      >
        ←
      </button>

      {mainImage && (
        <img
          src={mainImage}
          alt="Main Property"
          className="max-sm:h-50 w-full h-130 object-cover rounded-md shadow-md cursor-pointer"
        />
      )}
      {property?.photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {property.photos.map((photo, index) => (
            <img
              key={index}
              src={photo.startsWith("http") ? photo : `http://localhost:5000/uploads/${photo}`}
              // Directly use the backend-provided URL
              alt={`Property ${index + 1}`}
              className="w-full h-32 object-cover rounded-md shadow-md cursor-pointer transition-transform transform hover:scale-110"
              onClick={() => setMainImage(photo)}
              onError={(e) => e.target.src = errorImage} // Fallback if image fails
            />
          ))}
        </div>
      )}

      <h2 className="text-4xl font-bold text-gray-800 mt-6">{property.title}</h2>
      <p className="text-gray-600 text-lg mt-2">{property.description}</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4 bg-white p-5 rounded-lg shadow">
        <p className="text-gray-700 text-lg flex items-center">
          <FaCity className="mr-2 text-gray-500" /> {property.city}
        </p>
        <p className="text-gray-700 text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2 text-gray-500" /> {property.locality}
        </p>
        <p className="text-gray-700 text-lg flex items-center">
          <FaDollarSign className="mr-2 text-gray-500" /> ${property.price}
        </p>
        <p className="text-gray-700 text-lg flex items-center">
          <FaHouseChimneyWindow className="mr-2 text-gray-500" /> {property.size} sqft
        </p>
      </div>

      <div className="mt-4">
        <p className="text-gray-700 text-lg">
          <span className="font-semibold">Likes:</span> {property.likes}
        </p>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`px-5 py-3 bg-${isLiked ? "red" : "gray"}-600 text-white font-semibold rounded-lg shadow-lg hover:bg-${isLiked ? "red" : "gray"}-700 transition`}
        >
          <FaHeart className={`${isLiked ? "text-red-900" : "text-white"} mr-2`} />
          {isLiked ? "Liked" : "Like"}
        </button>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`px-5 py-3 bg-${isSaved ? "black" : "white"} text-${isSaved ? "white" : "black"} font-semibold rounded-lg shadow-lg hover:bg-${isSaved ? "red" : "blue"}-700 transition`}
        >
          <FaBookmark className={`${isSaved ? "text-black" : "text-gray-600"} mr-2`} />
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
      <button
        onClick={() => navigate(`/edit-property/${property._id}`)}
        className="px-5 mt-5 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition flex items-center"
      >
        <FaEdit className="mr-2" /> Edit Property
      </button>

      <button
        onClick={() => alert("Delete function here")}
        className="px-5 mt-5 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition"
      >
        Delete Property
      </button>
    </div>
  );
};

export default Details;
