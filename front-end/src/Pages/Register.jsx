import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/userService";
import regisBg from "../assets/registerBg.jpg";
import { FaUserPlus } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify({ email: formData.email, role: formData.role }));

      navigate("/login");
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-black">
      <div
        className="flex items-center justify-center w-full h-9/10"
        style={{
          backgroundImage: `url(${regisBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "90vh",
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}
      >
        <div className="w-80 h-110 mt-110 flex flex-col mx-auto my-100 text-white p-4 gap-5 bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg">
          <h2 className="flex ml-18 text-3xl text-center font-semibold mt-2 mb-8">
            Register <FaUserPlus className="mt-1 ml-2" />
          </h2>

          {message && <p className="text-red-500 text-center">{message}</p>}

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              className="border-gray-300 border-1 focus:outline-none w-full text-lg p-2 rounded-lg"
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="border-gray-300 border-1 focus:outline-none w-full text-lg p-2 rounded-lg"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="border-gray-300 border-1 focus:outline-none w-full text-lg p-2 rounded-lg"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border-gray-300 border-1 focus:outline-none w-full text-lg p-2 rounded-lg bg-transparent text-white"
            >
              <option value="user" className="text-black">User</option>
              <option value="owner" className="text-black">Owner</option>
            </select>

            <button
              className="bg-gradient-to-r from-white/60 to-white/10 w-full text-xl font-semibold px-6 py-2 rounded-lg text-white hover:bg-gradient-to-l "
              type="submit"
            >
              Register →
            </button>
            <p className="text-center text-sm text-gray-200">
            Already have an account? <Link to="/login" className="text-blue-400">Login here</Link>
          </p>
          </form>


        </div>
      </div>
    </div>
  );
};

export default Register;
