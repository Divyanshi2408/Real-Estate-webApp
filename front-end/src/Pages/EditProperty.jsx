import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyById, updateProperty } from "../services/propertyService";
import editBg from "../assets/editProp.jpg";
import {
  FaHome,
  FaAlignLeft,
  FaCity,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaDollarSign,
  FaCloudUploadAlt,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const AMENITY_OPTIONS = [
  "Parking", "WiFi", "Air Conditioning", "Swimming Pool",
  "Gym", "Security", "Power Backup", "Garden", "Lift", "Furnished",
];

const inputClass =
  "w-full pl-10 pr-3 py-2.5 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-red-500 transition";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [property, setProperty] = useState({
    title: "", description: "", price: "", city: "", locality: "",
    type: "home", size: "", amenities: [], photos: [],
  });
  const [newPhotos, setNewPhotos] = useState([]); // Only actual new files go here
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    let isMounted = true;

    const getProperty = async () => {
      try {
        const data = await fetchPropertyById(id);
        if (isMounted) {
          setProperty({
            title: data.title || "",
            description: data.description || "",
            price: data.price || "",
            city: data.city || "",
            locality: data.locality || "",
            type: data.type || "home",
            size: data.size || "",
            amenities: data.amenities || [],
            photos: data.photos || [], // Existing Cloudinary URLs, for preview only
          });
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getProperty();
    return () => { isMounted = false; };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setProperty((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleFileChange = (e) => {
    setNewPhotos((prev) => [...prev, ...Array.from(e.target.files)].slice(0, 5));
  };

  const handleRemoveNewPhoto = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    const formData = new FormData();
    formData.append("title", property.title);
    formData.append("description", property.description);
    formData.append("price", property.price);
    formData.append("city", property.city);
    formData.append("locality", property.locality);
    formData.append("type", property.type);
    formData.append("size", property.size);
    property.amenities.forEach((a) => formData.append("amenities", a));
    // Only send new files — the old Cloudinary URLs are not files and shouldn't be re-uploaded.
    // If no new photos are picked, the backend simply keeps the existing ones.
    newPhotos.forEach((photo) => formData.append("photos", photo));

    try {
      setSubmitting(true);
      await updateProperty(id, formData, token);
      setFeedback({ type: "success", text: "Property updated successfully!" });
      setTimeout(() => navigate(`/property/${id}`), 1000);
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "Failed to update property." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-24 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-24 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${editBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="max-sm:p-5 relative w-full max-w-2xl p-8 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Edit Property</h2>

        {feedback.text && (
          <div
            className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium ${
              feedback.type === "success" ? "bg-green-600/80 text-white" : "bg-red-600/80 text-white"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div className="relative">
            <FaHome className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
            <input type="text" name="title" placeholder="Title" value={property.title} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="relative">
            <FaAlignLeft className="absolute left-3 top-3 text-white/70" />
            <textarea name="description" placeholder="Description" rows={3} value={property.description} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input type="text" name="city" placeholder="City" value={property.city} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input type="text" name="locality" placeholder="Locality" value={property.locality} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
          <p className="text-white/50 text-xs -mt-2">Changing city or locality will re-pin this property's location on the map.</p>

          <div className="grid sm:grid-cols-3 gap-4">
            <select
              name="type" value={property.type} onChange={handleChange}
              className="w-full p-2.5 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="home" className="text-black">Home</option>
              <option value="apartment" className="text-black">Apartment</option>
              <option value="villa" className="text-black">Villa</option>
              <option value="land" className="text-black">Land</option>
            </select>
            <div className="relative">
              <FaRulerCombined className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input type="number" name="size" placeholder="Size (sq ft)" min="0" value={property.size} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="relative">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input type="number" name="price" placeholder="Price" min="0" value={property.price} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-white/80 text-sm font-semibold mb-2 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <button
                  type="button" key={amenity} onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                    property.amenities.includes(amenity)
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white/10 border-white/30 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Current photos */}
          {property.photos.length > 0 && (
            <div>
              <label className="text-white/80 text-sm font-semibold mb-2 block">Current Photos</label>
              <div className="flex flex-wrap gap-2">
                {property.photos.map((url, i) => (
                  <img key={i} src={url} alt={`Current ${i + 1}`} className="w-20 h-20 rounded-lg object-cover border border-white/20" />
                ))}
              </div>
              <p className="text-white/50 text-xs mt-1">Upload new photos below to replace all of these.</p>
            </div>
          )}

          {/* New photo upload */}
          <div>
            <label
              htmlFor="propertyPhotos"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/30 rounded-xl py-6 cursor-pointer hover:bg-white/10 transition text-white/80"
            >
              <FaCloudUploadAlt className="text-3xl" />
              <span className="text-sm">Click to upload new photos (up to 5)</span>
              <input id="propertyPhotos" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            {newPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {newPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(photo)} alt={`New ${index + 1}`} className="w-20 h-20 rounded-lg object-cover border border-white/20" />
                    <button
                      type="button" onClick={() => handleRemoveNewPhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit" disabled={submitting}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 w-full text-lg font-semibold px-6 py-3 rounded-lg text-white hover:from-red-700 hover:to-red-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (<><FaSpinner className="animate-spin" /> Saving...</>) : "Update Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;