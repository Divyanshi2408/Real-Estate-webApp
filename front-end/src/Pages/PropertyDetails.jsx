import React, { useEffect, useState, useContext } from "react";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyById, fetchAllProperties, likeProperty, saveProperty, deleteProperty } from "../services/propertyService";
import { sendMessage } from "../services/messageService";
import {
  FaHeart, FaBookmark, FaCity, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaCheckCircle, FaEdit, FaTrash,
} from "react-icons/fa";
import { FaHouseChimneyWindow } from "react-icons/fa6";
import { BiArea } from "react-icons/bi";
import PropertyMap from "../components/PropertyMap";
import PropertyCard from "../components/PropertyCard";
import errorImage from "../assets/ErrorImage.png";
import { AuthContext } from "../context/AuthContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const resolvePhoto = (photo) => (photo?.startsWith("http") ? photo : `${API_BASE_URL}/uploads/${photo}`);

  useEffect(() => {
    const getProperty = async () => {
      try {
        setLoading(true);
        const data = await fetchPropertyById(id);
        setProperty(data);
        setIsLiked(data.isLiked);
        setIsSaved(data.isSaved);
        if (data.photos?.length > 0) {
          setMainImage(resolvePhoto(data.photos[0]));
        }

        // Similar listings: same city, exclude the current property
        try {
          const all = await fetchAllProperties({ city: data.city });
          setSimilar(all.filter((p) => p._id !== data._id).slice(0, 3));
        } catch {
          // Non-critical — page still works without this section
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getProperty();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div className="max-w-4xl mx-auto p-6 mt-20">
        <p className="text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-md">
          Error: {error}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-red-700 mt-4 inline-block text-4xl hover:text-red-800 hover:scale-110"
        >
          ←
        </button>
      </div>
    );
  }

  const isNew =
    property.createdAt && Date.now() - new Date(property.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
  const badge = property.featured ? "Featured" : isNew ? "New" : null;
  const pricePerSqft = property.size ? Math.round(property.price / property.size) : null;
  // True when this person is here to manage the listing (owner/admin), not to browse it as
  // a buyer/renter — hides Like/Save/Message/Contact and shows Edit/Delete instead.
  const isManaging = user?.role === "owner" || user?.role === "admin";

  return (
    <div className="mt-20 max-w-7xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-red-700 mb-4 inline-block text-4xl hover:text-red-800 hover:scale-110 transition"
      >
        ←
      </button>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="relative">
            {badge && (
              <span className="absolute top-4 left-4 z-10 bg-red-700 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                {badge}
              </span>
            )}
            {mainImage && (
              <img
                src={mainImage}
                alt={property.title}
                onError={(e) => (e.target.src = errorImage)}
                className="w-full h-[420px] max-sm:h-[240px] object-cover rounded-lg shadow-md"
              />
            )}
          </div>

          {property?.photos?.length > 1 && (
            <div className="mt-4 grid grid-cols-4 md:grid-cols-6 gap-3">
              {property.photos.map((photo, index) => {
                const url = resolvePhoto(photo);
                return (
                  <img
                    key={index}
                    src={url}
                    alt={`${property.title} ${index + 1}`}
                    onError={(e) => (e.target.src = errorImage)}
                    onClick={() => setMainImage(url)}
                    className={`w-full h-20 object-cover rounded-md shadow cursor-pointer transition ${
                      mainImage === url ? "ring-2 ring-red-700" : "hover:opacity-80"
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Title & description */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-8">{property.title}</h2>
          <p className="text-gray-600 text-lg mt-2 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-700 shrink-0" /> {property.locality}, {property.city}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 bg-white p-5 rounded-lg shadow border border-gray-100">
            <div className="text-center">
              <BiArea className="mx-auto text-red-700 text-2xl mb-1" />
              <p className="font-semibold text-gray-900">{property.size} sqft</p>
              <p className="text-sm text-gray-500">Area</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <FaHouseChimneyWindow className="mx-auto text-red-700 text-2xl mb-1" />
              <p className="font-semibold text-gray-900 capitalize">{property.type}</p>
              <p className="text-sm text-gray-500">Type</p>
            </div>
            <div className="text-center">
              <FaCity className="mx-auto text-red-700 text-2xl mb-1" />
              <p className="font-semibold text-gray-900">{property.likes}</p>
              <p className="text-sm text-gray-500">Likes</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 bg-white border border-gray-100 rounded-md px-3 py-2 shadow-sm">
                    <FaCheckCircle className="text-red-700 shrink-0" /> {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Location</h3>
            <PropertyMap latitude={property.latitude} longitude={property.longitude} title={property.title} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-24 bg-white rounded-lg shadow-lg border border-gray-100 p-6 h-fit">
          <p className="text-3xl font-bold text-gray-900">${property.price?.toLocaleString()}</p>
          {pricePerSqft && (
            <p className="text-sm text-gray-500 mt-1">${pricePerSqft.toLocaleString()} per sqft</p>
          )}

          {isManaging ? (
            /* Owner/admin viewing this listing to manage it — liking, saving, and
               messaging/contacting "the owner" don't make sense on your own listing. */
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => navigate(`/edit-property/${property._id}`)}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={async () => {
                  if (!window.confirm("Delete this property? This cannot be undone.")) return;
                  try {
                    await deleteProperty(property._id, localStorage.getItem("token"));
                    navigate(-1);
                  } catch (err) {
                    alert(err.message || "Failed to delete property.");
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FaTrash /> Delete
              </button>
            </div>
          ) : (
            <>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={async () => {
                    if (!user) return alert("You must be logged in to like this property.");
                    await likeProperty(id);
                    setIsLiked((prev) => !prev);
                    setProperty((prev) => ({ ...prev, likes: prev.likes + (isLiked ? -1 : 1) }));
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                    isLiked ? "bg-red-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart /> {isLiked ? "Liked" : "Like"}
                </button>
                <button
                  onClick={async () => {
                    if (!user) return alert("You must be logged in to save this property.");
                    await saveProperty(id);
                    setIsSaved((prev) => !prev);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                    isSaved ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaBookmark /> {isSaved ? "Saved" : "Save"}
                </button>
              </div>

              <button
                onClick={() => setShowMessageBox((prev) => !prev)}
                className="mt-3 w-full px-4 py-2.5 bg-red-700 text-white font-semibold rounded-lg shadow hover:bg-red-800 transition flex items-center justify-center gap-2"
              >
                <FaEnvelope /> Message Owner
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="mt-3 w-full px-4 py-2.5 bg-white text-red-700 border border-red-700 font-semibold rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <FaPhoneAlt /> Contact Owner
              </button>
            </>
          )}

          {showMessageBox && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
                rows="4"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button
                onClick={async () => {
                  if (!message.trim()) return;
                  await sendMessage(property._id, message);
                  setMessage("");
                  alert("Message sent!");
                }}
                className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Similar Properties in {property.city}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similar.map((p) => (
              <PropertyCard key={p._id} property={p} variant="grid" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;