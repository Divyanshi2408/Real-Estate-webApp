import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AddProperty from "./Pages/AddProperty";
import PropertyDetails from "./Pages/PropertyDetails";
import Dashboard from "./Pages/Dashboard";
import PropertyManagement from "./Pages/PropertyManagement";
import UserManagement from "./Pages/UserManagement";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import UserDashboard from "./Pages/UserDashboard";
import EditProperty from "./Pages/EditProperty";
import { AuthProvider } from "./context/AuthContext";
import PropertyPage from "./Pages/Propertpage";
import "./App.css"
import OwnerDashboard from "./Pages/OwnerDashboard";
import Details from "./components/Details";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";



const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

const LoadingSpinner = () => (
  <div className="spinner">
    <div></div><div></div><div></div><div></div><div></div><div></div>
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<AddProperty />} />
          <Route path="/propertyPage" element={<PropertyPage />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          
          <Route path="/edit-property/:id" element={<EditProperty />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/AboutPage" element={<AboutPage/>}/>
          <Route path="/contact" element={<ContactPage/>}/>

          
          {/* Nested Admin Routes */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />}>
            <Route index element={<Navigate to="properties" replace />} />
            <Route path="properties" element={<PropertyManagement />} />
            <Route path="users" element={<UserManagement />} />
            
          </Route>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
