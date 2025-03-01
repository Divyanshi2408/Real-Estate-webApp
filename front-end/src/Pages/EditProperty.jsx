import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyById, updateProperty } from "../services/propertyService";
import editBg from "../assets/editProp.jpg"

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [property, setProperty] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    locality: "",
    contact: "",
    type: "",
    size: "",
    amenities: [],
    photos: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


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
            contact: data.contact || "",
            type: data.type || "",
            size: data.size || "",
            amenities: data.amenities || [],
            photos: data.photos || []
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
      setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 1000);
    };
  
    getProperty();
    return () => { isMounted = false; };
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
      </div>
    );
  }
  

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amenities") {
      setProperty({ ...property, [name]: value.split(",") });
    } else {
      setProperty({ ...property, [name]: value });
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    setProperty({ ...property, photos: e.target.files });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in property) {
      if (key === "photos") {
        for (let i = 0; i < property.photos.length; i++) {
          formData.append("photos", property.photos[i]);
        }
      } else {
        formData.append(key, property[key]);
      }
    }

    try {
      await updateProperty(id, formData, token);
      navigate(`/property/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${editBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "130vh",
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
      }}
    >
      <div className="relative mt-5 w-full max-w-lg p-8 rounded-2xl bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm border border-white/10">
        <h2 className="text-2xl font-bold text-white text-center mb-4">Edit Property</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label className="block text-white mt-2">Title:</label>
          <input type="text" name="title" value={property.title} onChange={handleChange} className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2" />

          <label className="block text-white mt-2">Description:</label>
          <textarea name="description" value={property.description} onChange={handleChange} className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2" />

          <label className="block text-white mt-2">Price:</label>
          <input type="number" name="price" value={property.price} onChange={handleChange} className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2" />

          <label className="block text-white mt-2">City:</label>
          <input type="text" name="city" value={property.city} onChange={handleChange} className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2" />

          <label className="block text-white mt-2">Locality:</label>
          <input type="text" name="locality" value={property.locality} onChange={handleChange} className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2" />

          <label className="block text-white mt-2">Contact:</label>
          <input type="text" name="contact" value={property.contact} onChange={handleChange} className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2" />

          <label className="block text-white mt-2">Amenities (comma-separated):</label>
          <input type="text" name="amenities" value={property.amenities.join(",")} onChange={handleChange} className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2" />

          <label className="block text-white mt-2">Upload Photos:</label>
          <input type="file" multiple name="photos" onChange={handleFileChange} className="w-full p-2 border border-white/30 rounded bg-transparent text-white placeholder-white focus:ring-2" />

          <button type="submit" className="bg-gradient-to-r from-white/60 to-white/10 w-full text-xl font-semibold px-6 py-2 rounded-lg text-white hover:bg-gradient-to-l ">Update Property</button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
