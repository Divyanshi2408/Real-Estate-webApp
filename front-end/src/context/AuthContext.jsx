import React, { createContext, useState, useEffect } from "react";


// Create AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Tracks whether we've finished checking localStorage for a logged-in user yet.
  // Pages that guard themselves with `if (!user) redirect to login` must wait for
  // this to be false first, otherwise they redirect on the very first render
  // (before localStorage has been read) even when the user is actually logged in —
  // this is what was causing the "refresh kicks me to login" bug.
  const [authLoading, setAuthLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  // Function to log in user
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Function to log out user
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};