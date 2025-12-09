import React from "react";
import { motion } from "framer-motion";

// Clean Coming Soon Page — Gausamvardhan Organic & Handcrafted
export default function GausamvardhanOrganicHandcrafted() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#062E1F] via-[#0D5F3B] to-[#063E2A] text-gray-100 flex flex-col">
      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#4ade80] to-[#16a34a] mr-2 shadow-md" />
            <span className="text-xs font-semibold tracking-wide">Premium • Organic • Ethical</span>
          </motion.span>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-white">
            COMING SOON
          </h1>

          <p className="text-green-50/80 max-w-md mx-auto text-sm sm:text-base">
            We are crafting something organic, handcrafted and premium just for you.
          </p>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="mt-6 inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] font-semibold shadow-lg text-white"
          >
            Stay Tuned
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
