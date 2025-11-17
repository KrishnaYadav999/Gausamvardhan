import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const images = [
  "https://i.pinimg.com/736x/32/b4/b7/32b4b75ae1460ff10c121c32a079bae7.jpg",
  "https://i.pinimg.com/736x/50/41/b4/5041b4eb0ce8dca2eb388045e0aaf754.jpg",
];

const SignIn = () => {
  const { loginUser } = useContext(AuthContext);

  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ⭐ GOOGLE LOGIN HANDLER
  const handleGoogleResponse = async (response) => {
    try {
      const googleToken = response.credential;

      const res = await axios.post(
        "http://localhost:5000/api/googleauth/google",
        { token: googleToken }
      );

      localStorage.setItem("token", res.data.token);
      loginUser(res.data.user);

      toast.success("Google Login Successful!");
      navigate("/");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Google Login Failed (Unauthorized)";
      toast.error(msg);
    }
  };

  // ⭐ GOOGLE ONE TAP BUTTON (no secret or clientID here)
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // ✔ safe
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginButton"),
        { theme: "outline", size: "large", width: 350 }
      );
    }
  }, []);

  // ⭐ IMAGE SLIDER
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

  // ⭐ SIGNUP HANDLER
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await toast.promise(
        axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
        }),
        {
          loading: "Signing up...",
          success: "Signup successful! Redirecting...",
          error: "Signup failed",
        }
      );

      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.msg || "Signup failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white px-4 py-8">
      <Toaster position="top-right" />

      {/* LEFT IMAGE SECTION */}
      <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
        <img
          src={images[currentImage]}
          alt="Sign In Illustration"
          className={`w-full max-w-xs md:max-w-sm h-auto object-contain transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full md:w-1/2 max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-lg">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <h2 className="text-3xl font-bold text-red-700 mb-4 text-center md:text-left">
          Sign Up
        </h2>

        {/* GOOGLE LOGIN BUTTON */}
        <div id="googleLoginButton" className="mb-6 flex justify-center"></div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-red-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-red-200 outline-none transition-all"
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-red-200 outline-none transition-all"
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-red-200 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-600 shadow-md transition-all"
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
