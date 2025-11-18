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
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ⭐ GOOGLE LOGIN HANDLER
  const handleGoogleResponse = async (response) => {
    try {
      const googleToken = response.credential;

      const res = await axios.post(
        "/googleauth/google",
        { token: googleToken }
      );

      loginUser(res.data.user, res.data.token);

      toast.success("Google Login Successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google Login Failed");
    }
  };

  // ⭐ GOOGLE ONE TAP INITIALIZE
  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginButton"),
        {
          theme: "outline",
          size: "large",
          width: 350,
        }
      );
    }
  }, [GOOGLE_CLIENT_ID]);

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
        axios.post("/api/auth/register", {
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

      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const msg = err.response?.data?.msg || "Signup failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <Toaster />

      {/* FULL CARD */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl h-auto md:h-[560px] rounded-3xl
      shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden bg-white">

        {/* LEFT IMAGE (ATTACHED) */}
        <div className="w-full md:w-1/2 h-64 md:h-full">
          <img
            src={images[currentImage]}
            alt="SignUp Illustration"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* RIGHT FORM CARD */}
        <div className="w-full md:w-1/2 bg-white/80 backdrop-blur-xl p-10 flex flex-col justify-center">
          
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <h2 className="text-4xl font-extrabold text-green-700 mb-6 tracking-tight">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-6">

            {/* NAME */}
            <div className="relative">
              <FaUser className="absolute top-3.5 left-3 text-green-500 text-lg" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 
                bg-white/60 backdrop-blur-lg shadow-inner focus:border-green-600 
                focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <FaUser className="absolute top-3.5 left-3 text-green-500 text-lg" />
              <input
                type="email"
                placeholder="E-mail Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 
                bg-white/60 backdrop-blur-lg shadow-inner focus:border-green-600 
                focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <FaLock className="absolute top-3.5 left-3 text-green-500 text-lg" />
              <input
                type="password"
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 
                bg-white/60 backdrop-blur-lg shadow-inner focus:border-green-600 
                focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 
              text-white font-semibold shadow-lg hover:shadow-green-300/40 hover:scale-[1.02] 
              transition-all duration-300"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-green-700 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </form>

          {/* GOOGLE LOGIN BUTTON */}
          <div id="googleLoginButton" className="mt-6 flex justify-center"></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
