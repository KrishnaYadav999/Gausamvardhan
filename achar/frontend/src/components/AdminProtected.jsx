import React, { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import Admin from "../Admin/Admin";

const AdminProtected = () => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const correctPassword = "Mangesh2004";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === correctPassword) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect password!");
      setEnteredPassword("");
    }
  };

  if (isAuthorized) return <Admin />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#121212] to-[#1b1b1b] relative overflow-hidden px-4">

      {/* Background Glow Circles */}
      <div className="absolute w-[450px] h-[450px] bg-green-500/20 blur-[160px] rounded-full top-10 left-10"></div>
      <div className="absolute w-[350px] h-[350px] bg-blue-500/20 blur-[180px] rounded-full bottom-10 right-10"></div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="
          relative z-10 w-full max-w-sm p-8 
          backdrop-blur-2xl bg-white/10 border border-white/20 
          rounded-2xl shadow-[0px_0px_35px_rgba(0,255,100,0.15)]
          animate-scaleFade
        "
      >

        {/* Header Icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-white/20 p-5 rounded-full border border-white/30 shadow-inner">
            <ShieldCheck size={40} className="text-green-400" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-white tracking-wide mb-8 drop-shadow-lg">
          Admin Login
        </h2>

        {/* Floating Label Input */}
        <div className="relative mb-6">
          <input
            type={showPass ? "text" : "password"}
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="
              w-full px-4 py-3 bg-transparent border border-white/30 rounded-lg 
              text-white placeholder-transparent outline-none transition 
              focus:border-green-400 peer
            "
            required
          />

          <label
            className="
              absolute left-4 top-3 text-gray-300 pointer-events-none 
              transition-all duration-300 
              peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-green-400
              peer-valid:top-[-10px] peer-valid:text-xs
            "
          >
            Enter Admin Password
          </label>

          {/* Eye Toggle */}
          <span
            onClick={() => setShowPass(!showPass)}
            className="
              absolute right-3 top-3 cursor-pointer 
              text-white/70 hover:text-white transition
            "
          >
            {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full py-3 font-semibold text-white bg-gradient-to-r 
            from-green-500 to-green-600 rounded-lg shadow-lg 
            hover:shadow-[0_0_20px_rgba(0,255,100,0.5)] 
            hover:scale-[1.02] active:scale-95 transition relative overflow-hidden
          "
        >
          <span className="relative z-10">Unlock Admin Panel</span>

          {/* Shine Effect */}
          <div className="
            absolute inset-0 bg-white/10 
            translate-x-[-100%] hover:translate-x-[100%] 
            transition-all duration-700
          "></div>
        </button>
      </form>

      {/* Animation Style */}
      <style>{`
        @keyframes scaleFade {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleFade {
          animation: scaleFade 0.6s ease-out;
        }
      `}</style>

    </div>
  );
};

export default AdminProtected;
