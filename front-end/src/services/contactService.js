// NEW FILE — save as: src/services/contactService.js
import { API_BASE_URL } from "../config";
import axios from "axios";

const API_URL = `${API_BASE_URL}/api/contact`;

export const sendContactMessage = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Admin: fetch every contact submission (newest first)
export const fetchContactMessages = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Admin: mark a submission as read / resolved
export const updateContactMessageStatus = async (id, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};