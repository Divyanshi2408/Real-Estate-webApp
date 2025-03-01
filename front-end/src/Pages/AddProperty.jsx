import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProperty } from "../services/propertyService";
import addBg from "../assets/addProp.jpg";

const AddProperty = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [type, setType] = useState("home");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setPhotos((prevPhotos) => [...prevPhotos, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
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
    photos.forEach((photo) => formData.append("photos", photo));

    try {
      await addProperty(formData, token);
      alert("Property added successfully, wait for admin approval");
      navigate("/propertyPage");
    } catch (err) {
      alert("Error adding property. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${addBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "120vh",
      }}
    >
      <div className="max-sm:p-4 relative w-full max-w-lg p-8 rounded-2xl bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm border border-white/10">
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Add Property
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2"
          />
          <input
            type="text"
            placeholder="Locality"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            required
            className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2"
          >
            <option value="home" className="text-black">Home</option>
            <option value="apartment" className="text-black">Apartment</option>
            <option value="villa" className="text-black">Villa</option>
            <option value="land" className="text-black">Land</option>
          </select>
          <input
            type="text"
            placeholder="Size (sq ft)"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2"
          />
          <input
            type="text"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2"
          />

          {/* File Upload Section */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2"
          />

          {/* Image Preview Section */}
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Property ${index + 1}`}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-white/60 to-white/10 w-full text-xl font-semibold px-6 py-2 rounded-lg text-white hover:bg-gradient-to-l"
          >
            Add Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
