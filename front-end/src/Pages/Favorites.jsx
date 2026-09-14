import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchLikedProperties, fetchSavedProperties, toggleLikeProperty, toggleSaveProperty } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import { AuthContext } from "../context/AuthContext";
import { FaHeart, FaBookmark } from "react-icons/fa";

const Favorites = () => {
  const { user, authLoading } = useContext(AuthContext);
  const [tab, setTab] = useState("liked"); // "liked" | "saved"
  const [liked, setLiked] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [likedData, savedData] = await Promise.all([
        fetchLikedProperties(),
        fetchSavedProperties(),
      ]);
      setLiked(likedData);
      setSaved(savedData);
    } catch (err) {
      setError(err.message || "Failed to load your favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  // Wait for AuthContext to finish checking localStorage before deciding whether
  // to redirect — otherwise a page refresh always bounces logged-in users to /login.
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleUnlike = async (id) => {
    try {
      await toggleLikeProperty(id);
      setLiked((prev) => prev.filter((p) => p._id !== id));
    } catch {
      // Non-critical — list just won't update if this fails
    }
  };

  const handleUnsave = async (id) => {
    try {
      await toggleSaveProperty(id);
      setSaved((prev) => prev.filter((p) => p._id !== id));
    } catch {
      // Non-critical — list just won't update if this fails
    }
  };

  const activeList = tab === "liked" ? liked : saved;

  return (
    <div className="mt-24 max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-gray-900 mb-2 text-center">My Favorites</h2>
      <p className="text-gray-500 text-center mb-8">Properties you've liked and saved for later</p>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setTab("liked")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition ${
            tab === "liked" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaHeart /> Liked ({liked.length})
        </button>
        <button
          onClick={() => setTab("saved")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition ${
            tab === "saved" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaBookmark /> Saved ({saved.length})
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-md mb-6 text-center">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
        </div>
      ) : activeList.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeList.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              variant="grid"
              onUnlike={tab === "liked" ? handleUnlike : undefined}
              onUnsave={tab === "saved" ? handleUnsave : undefined}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          {tab === "liked" ? "You haven't liked any properties yet." : "You haven't saved any properties yet."}
        </p>
      )}
    </div>
  );
};

export default Favorites;