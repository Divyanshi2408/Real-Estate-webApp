import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../services/propertyService";
import addBg from "../assets/addProp.jpg";
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

const AddProperty = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [type, setType] = useState("home");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleRemoveImage = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    const token = localStorage.getItem("token");
    if (!token) {
      setFeedback({ type: "error", text: "Please log in first." });
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("city", city);
    formData.append("locality", locality);
    formData.append("type", type);
    formData.append("size", size);
    formData.append("price", price);
    amenities.forEach((a) => formData.append("amenities", a));
    photos.forEach((photo) => formData.append("photos", photo));

    try {
      setSubmitting(true);
      await addProperty(formData, token);
      setFeedback({ type: "success", text: "Property added! Waiting for admin approval." });
      setTimeout(() => navigate("/propertyPage"), 1200);
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "Error adding property. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen py-24 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${addBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="max-sm:p-5 relative w-full max-w-2xl p-8 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-1">List a Property</h2>
        <p className="text-white/70 text-center mb-6 text-sm">
          Fill in the details below — your listing goes live after admin approval.
        </p>

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
            <input
              type="text" placeholder="Title" value={title}
              onChange={(e) => setTitle(e.target.value)} required className={inputClass}
            />
          </div>

          <div className="relative">
            <FaAlignLeft className="absolute left-3 top-3 text-white/70" />
            <textarea
              placeholder="Description" value={description} rows={3}
              onChange={(e) => setDescription(e.target.value)} required className={inputClass}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text" placeholder="City" value={city}
                onChange={(e) => setCity(e.target.value)} required className={inputClass}
              />
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="text" placeholder="Locality" value={locality}
                onChange={(e) => setLocality(e.target.value)} required className={inputClass}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <select
              value={type} onChange={(e) => setType(e.target.value)}
              className="w-full p-2.5 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="home" className="text-black">Home</option>
              <option value="apartment" className="text-black">Apartment</option>
              <option value="villa" className="text-black">Villa</option>
              <option value="land" className="text-black">Land</option>
            </select>
            <div className="relative">
              <FaRulerCombined className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="number" placeholder="Size (sq ft)" value={size} min="0"
                onChange={(e) => setSize(e.target.value)} required className={inputClass}
              />
            </div>
            <div className="relative">
              <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
              <input
                type="number" placeholder="Price" value={price} min="0"
                onChange={(e) => setPrice(e.target.value)} required className={inputClass}
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-white/80 text-sm font-semibold mb-2 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                    amenities.includes(amenity)
                      ? "bg-red-600 border-red-600 text-white"
                      : "bg-white/10 border-white/30 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label
              htmlFor="propertyPhotos"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/30 rounded-xl py-6 cursor-pointer hover:bg-white/10 transition text-white/80"
            >
              <FaCloudUploadAlt className="text-3xl" />
              <span className="text-sm">Click to upload up to 5 photos</span>
              <input
                id="propertyPhotos" type="file" multiple accept="image/*"
                onChange={handleFileChange} className="hidden"
              />
            </label>

            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Property ${index + 1}`}
                      className="w-20 h-20 rounded-lg object-cover border border-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
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
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 w-full text-lg font-semibold px-6 py-3 rounded-lg text-white hover:from-red-700 hover:to-red-900 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (<><FaSpinner className="animate-spin" /> Submitting...</>) : "Add Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
