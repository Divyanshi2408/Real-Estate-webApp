import axios from "axios";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/properties`; // Base URL for properties

// Add a new property
export const addProperty = async (propertyData, token) => {
  try {
    const response = await axios.post(API_URL, propertyData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Property creation failed");
  }
};

// Get all properties. Pass filters to have the backend do the filtering
// (e.g. { city: "Delhi", type: "villa", minPrice: 50000, maxPrice: 900000, q: "sunny" })
export const fetchAllProperties = async (filters = {}) => {
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined && value !== 0)
    );
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get a property by ID
export const fetchPropertyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Update a property (Requires Authorization)
export const updateProperty = async (id, propertyData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, propertyData, {
      headers: {
        "Content-Type": propertyData instanceof FormData ? "multipart/form-data" : "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Property update failed");
  }
};

// Delete a property (Requires Authorization)
export const deleteProperty = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Property deletion failed");
  }
};
export const likeProperty = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/like/${id}`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming the token is stored in localStorage
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Like failed");
  }
};

// Save a property
export const saveProperty = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/save/${id}`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming the token is stored in localStorage
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Save failed");
  }
};
export const fetchLikedProperties = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/properties/userDashboard/liked`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming you store the token in localStorage
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch liked properties.");
  }
};

// Fetch saved properties
export const fetchSavedProperties = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/properties/userDashboard/saved`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming you store the token in localStorage
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch saved properties.");
  }
};
export const toggleLikeProperty = async (id) => {
  try {
      const response = await axios.post(`${API_URL}/like/${id}`, null, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || "Like/Unlike failed");
  }
};

// Save/Unsave Property (Frontend)
export const toggleSaveProperty = async (id) => {
  try {
      const response = await axios.post(`${API_URL}/save/${id}`, null, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || "Save/Unsave failed");
  }
};

export const fetchOwnerProperties = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/properties/owner/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch owner properties.");
  }
};
// export const fetchMessagesByPropertyId = async (propertyId) => {
//   const token = localStorage.getItem("token");
//   const response = await axios.get(`${API_BASE_URL}/api/messages/${propertyId}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };
