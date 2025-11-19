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

  // IMAGE SLIDER
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

  // SEND OTP
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

  // OTP LOGIC
  const handleOtpChange = (element, index) => {
    let value = element.value.replace(/\D/, "");
    const newOtp = [...otp];

    if (!value) {
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < 5) inputRefs.current[index + 1].focus();
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
      if (idx < 6 && /\d/.test(char)) newOtp[idx] = char;
    });

    setOtp(newOtp);
    const nextIndex = pasteData.length < 6 ? pasteData.length : 5;
    inputRefs.current[nextIndex].focus();
  };

  // VERIFY OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const otpString = otp.join("");
      const res = await toast.promise(
        axios.post("/api/auth/verify-otp", { email, otp: otpString }),
        {
          loading: "Verifying OTP...",
          success: "OTP verified!",
          error: "OTP verification failed",
        }
      );

      loginUser(res.data.user);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.msg || "OTP verification failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <Toaster />

      <div className="flex flex-col md:flex-row w-full max-w-4xl h-auto md:h-[520px] rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden bg-white">

        {/* LEFT IMAGE – NO GAP */}
        <div className="w-full md:w-1/2 h-64 md:h-full">
          <img
            src={images[currentImage]}
            alt="Login Illustration"
            className={`w-full h-full object-cover transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-1/2 bg-white/80 backdrop-blur-xl p-10 flex flex-col justify-center">

          {error && <p className="text-green-700 mb-4">{error}</p>}

          {step === 1 && (
            <form onSubmit={handleLoginSubmit} className="space-y-7">
              <h2 className="text-4xl font-extrabold text-green-700 mb-4 tracking-tight">Login</h2>

              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-green-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-lg shadow-inner
                  focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold 
                shadow-lg hover:shadow-green-300/40 hover:scale-[1.02] transition-all duration-300"
              >
                Send OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-7">
              <h2 className="text-4xl font-extrabold text-green-700 mb-4 tracking-tight">Enter OTP</h2>

              <div className="flex justify-between gap-3">
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
                    className="w-14 h-14 text-center text-xl font-semibold border border-gray-200 rounded-2xl
                    bg-white/70 backdrop-blur-xl shadow-inner focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none 
                    transition-all duration-300 hover:scale-105"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold 
                shadow-lg hover:shadow-green-300/40 hover:scale-[1.02] transition-all duration-300"
              >
                Verify OTP
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default LoginFlow;