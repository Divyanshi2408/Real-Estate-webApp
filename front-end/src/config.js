// Single source of truth for the backend URL.
// Locally, Vite falls back to your local backend on port 5000.
// In production (Vercel), set VITE_API_URL to your deployed Render URL,
// e.g. VITE_API_URL=https://your-app.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
