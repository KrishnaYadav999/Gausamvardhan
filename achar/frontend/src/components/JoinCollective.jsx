import React from "react";
import { motion } from "framer-motion";

export default function JoinCollective() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05291C] via-[#0A5C3A] to-[#063E2A] text-white relative overflow-hidden">

      {/* Floating Glow Blobs */}
      <motion.div
        className="absolute -top-10 -left-10 w-60 h-60 bg-green-400/20 rounded-full blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-72 h-72 bg-green-300/10 rounded-full blur-2xl"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Coming Soon Center Text */}
      <div className="flex items-center justify-center h-screen relative z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent 
                     bg-gradient-to-r from-green-200 to-white tracking-wider drop-shadow-xl"
        >
          Coming Soon
        </motion.h1>
      </div>

    </div>
  );
}
