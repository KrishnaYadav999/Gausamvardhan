import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const images = [
  "https://i.pinimg.com/736x/32/b4/b7/32b4b75ae1460ff10c121c32a079bae7.jpg",
  "https://i.pinimg.com/736x/50/41/b4/5041b4eb0ce8dca2eb388045e0aaf754.jpg"
];

const LoginFlow = () => {
  const { loginUser } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await toast.promise(
        axios.post("/api/auth/request-otp", { email }),
        {
          loading: "Sending OTP...",
          success: "OTP sent! Check your email.",
          error: "Failed to send OTP",
        }
      );
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to send OTP";
      setError(msg);
      toast.error(msg);
    }
  };

  const handleOtpChange = (element, index) => {
    let value = element.value.replace(/\D/, ""); // allow only numbers
    const newOtp = [...otp];

    if (!value) {
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    const newOtp = [...otp];

    if (e.key === "Backspace") {
      e.preventDefault();
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key >= "0" && e.key <= "9") {
      newOtp[index] = e.key;
      setOtp(newOtp);
      if (index < 5) inputRefs.current[index + 1].focus();
      e.preventDefault();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    const newOtp = [...otp];
    pasteData.split("").forEach((char, idx) => {
      if (idx < 6 && /\d/.test(char)) {
        newOtp[idx] = char;
      }
    });
    setOtp(newOtp);
    const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
    inputRefs.current[nextIndex].focus();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const otpString = otp.join("");
      const res = await toast.promise(
        axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp: otpString }),
        {
          loading: "Verifying OTP...",
          success: "OTP verified! Logging you in...",
          error: "OTP verification failed",
        }
      );

      loginUser(res.data.user);
      navigate("/"); // redirect after login
    } catch (err) {
      const msg = err.response?.data?.msg || "OTP verification failed";
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
          alt="Login Illustration"
          className={`w-full max-w-xs md:max-w-sm h-auto object-contain transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="w-full md:w-1/2 max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-lg">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-red-700 mb-4">Login</h2>
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
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-600 shadow-md transition-all duration-300"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-red-700 mb-4">Enter OTP</h2>
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={data}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  onPaste={handleOtpPaste}
                  className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all duration-300"
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-600 shadow-md transition-all duration-300"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginFlow;
