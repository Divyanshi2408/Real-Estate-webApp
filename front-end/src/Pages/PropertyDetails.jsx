import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyById, likeProperty, saveProperty } from "../services/propertyService";
import { sendMessage } from "../services/messageService";
import { FaHeart, FaBookmark, FaCity, FaMapMarkerAlt, FaDollarSign, FaEnvelope, FaPhone, FaPhoneAlt } from 'react-icons/fa';
import { FaHouseChimneyWindow, FaPhoneFlip } from "react-icons/fa6";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Assuming you have an AuthContext


const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getProperty = async () => {
      try {
        setTimeout(async () => {
          const data = await fetchPropertyById(id);
          setProperty(data);
          setIsLiked(data.isLiked);
          setIsSaved(data.isSaved);
          if (data.photos.length > 0) {
            setMainImage(
              data.photos[0].startsWith("http") ? data.photos[0] : `http://localhost:5000/uploads/${data.photos[0]}`
            );
          }

          setLoading(false);
        }, 1000); // Simulating 1-second loading delay
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
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
          onClick={async () => {
            if (!user) {
              alert("You must be logged in to like this property.");
              return;
            }
            await likeProperty(id);
            setIsLiked((prev) => !prev);
            setProperty((prev) => ({
              ...prev,
              likes: prev.likes + (isLiked ? -1 : 1),
            }));
          }}
          className={`px-5 py-3 ${isLiked ? "bg-red-600" : "bg-gray-600"} text-white font-semibold rounded-lg shadow-lg hover:bg-${isLiked ? "red-700" : "gray-700"} transition flex items-center`}
        >
          <FaHeart className={`${isLiked ? "text-red-900" : "text-white"} mr-2`} />
          {isLiked ? "Liked" : "Like"}
        </button>

        <button
          onClick={async () => {
            if (!user) {
              alert("You must be logged in to save this property.");
              return;
            }
            await saveProperty(id);
            setIsSaved((prev) => !prev);
          }}
          className={`px-5 py-3 ${isSaved ? "bg-black text-white" : "bg-gray-600 text-black"} font-semibold rounded-lg shadow-lg hover:${isSaved ? "bg-gray-800" : "bg-blue-700 text-white"} transition flex items-center`}
        >
          <FaBookmark className={`${isSaved ? "text-white" : "text-white"} mr-2`} />
          {isSaved ? "Saved" : "Save"}
        </button>

      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setShowMessageBox(true)}
          className="max-sm:p-1 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition flex items-center"
        >
          <FaEnvelope className="mr-2" /> Send Message
        </button>
        <button
          onClick={() => navigate('/contact')}
          className="px-5 py-3 bg-white text-red-700 font-semibold rounded-lg shadow-lg hover:bg-red-600 hover:text-white transition flex items-center"
        >
           Contact Owner <FaPhoneAlt className="ml-1 w-4 h-4"/>
        </button>

      </div>

      {showMessageBox && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
          <textarea
            className="w-full p-2 border rounded-lg"
            rows="4"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button
            onClick={async () => {
              await sendMessage(property._id, message);
              alert("Message sent!");
            }}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;

