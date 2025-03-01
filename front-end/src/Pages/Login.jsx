import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { loginUser } from "../services/userService";
import heroBg from "../assets/Login-Hero.png";
import { FaRegUser } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Access login function from context

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            const userData = { email: data.email, role: data.role };
            localStorage.setItem("token", data.token);
            login(userData);
    
            if (data.role === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
        
            if (err.response) {
        
                if (err.response.status === 403) {
                    setError("Your account has been banned due to some unusual activities.");
                } else if (err.response.status === 400) {
                    setError("Invalid credentials.");
                } else if (err.response.status === 404) {
                    setError("User not found.");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else if (err.request) {
                setError("Could not connect to the server. Please try again.");
            } else {
                setError("Network error. Please check your connection.");
            }
        }
        
    };
    
    return (
        <div className="w-full min-h-screen bg-black">
            <div className="flex items-center justify-center w-full h-9/10" style={{
                backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center", height: "90vh",
                borderBottomRightRadius: 20, borderBottomLeftRadius: 20,
            }}>
                <div className="w-80 h-90 flex flex-col mx-auto my-100 text-white p-4 gap-5 bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg">
                    <h2 className="flex ml-23 text-3xl text-center font-semibold mt-2 mb-8">
                        Login <FaRegUser className="ml-1" />
                    </h2>

                    {error && <p className="text-red-500">{error}</p>}

                    <form className="flex flex-col gap-3" onSubmit={handleLogin}>
                        <input className="border-gray-300 border-1 focus:outline-none w-full text-lg p-2 rounded-lg" 
                            type="email" placeholder="Email" value={email} 
                            onChange={(e) => setEmail(e.target.value)} required 
                        />
                        <input className="border-gray-300 border-1 focus:outline-none w-full text-lg p-2 rounded-lg" 
                            type="password" placeholder="Password" value={password} 
                            onChange={(e) => setPassword(e.target.value)} required 
                        />
                        <button className="bg-gradient-to-r  w-full text-xl font-semibold px-6 py-2 rounded-lg text-white hover:bg-gradient-to-l from-white/60 to-white/10" 
                            type="submit">
                            Login →
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-200">
                        Don't have an account? <Link to="/register" className="text-blue-400">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
