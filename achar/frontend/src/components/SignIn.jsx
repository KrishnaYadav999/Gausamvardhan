import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const images = [
  "https://i.pinimg.com/736x/32/b4/b7/32b4b75ae1460ff10c121c32a079bae7.jpg",
  "https://i.pinimg.com/736x/50/41/b4/5041b4eb0ce8dca2eb388045e0aaf754.jpg"
];

const SignIn = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Use toast.promise for async handling
      await toast.promise(
        axios.post("/api/auth/register", { name, email, password }),
        {
          loading: "Signing up...",
          success: "Signup successful! Redirecting to login...",
          error: "Signup failed"
        }
      );

      // Small delay before navigation so toast is visible
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.msg || "Signup failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white px-4 py-8">
      {/* React Hot Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
        <img
          src={images[currentImage]}
          alt="Sign In Illustration"
          className={`w-full max-w-xs md:max-w-sm h-auto object-contain transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="w-full md:w-1/2 max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-lg">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <h2 className="text-3xl font-bold text-red-700 mb-4 text-center md:text-left">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-red-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all duration-300"
            />
          </div>
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-red-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="E-mail"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all duration-300"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-red-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-600 shadow-md transition-all duration-300"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-500 text-sm mt-2">
            Already have an account?{" "}
            <a href="/login" className="text-red-700 font-medium hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
