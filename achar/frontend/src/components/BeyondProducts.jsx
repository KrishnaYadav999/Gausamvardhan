import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const slides = [
  {
    type: "image",
    title: "FARMER Stories",
    url: "https://res.cloudinary.com/dtvihyts8/image/upload/v1765394105/gheegausam_ecimsh.jpg",
    duration: 3000,
  },
  {
    type: "image",
    title: "Real Journeys",
    url: "https://res.cloudinary.com/dtvihyts8/image/upload/v1765397745/1d65608f-0069-45c2-8dfb-29f26a7e585e.png",
    duration: 3000,
  },
  {
    type: "video",
    title: "Organic Mission",
    url: "https://res.cloudinary.com/dtvihyts8/video/upload/v1765392351/WhatsApp_Video_2025-12-10_at_15.13.00_206f95d0_ice5ht.mp4",
  },
];

export default function BeyondProducts() {
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);

  // Auto slide controller
  useEffect(() => {
    let timer;
    if (slides[index].type === "video") {
      const v = videoRef.current;
      if (v && v.duration) {
        timer = setTimeout(() => {
          setIndex((prev) => (prev + 1) % slides.length);
        }, v.duration * 1000);
      }
    } else {
      timer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, slides[index].duration);
    }

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="relative overflow-hidden w-full bg-[#FFF8EB] py-28 px-6 lg:px-20">

      {/* ------- FLOATING CLOUDS ------- */}
      <motion.div
        animate={{ x: ["0%", "30%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-[-200px] w-[350px] opacity-40"
      >
        <img
          src="https://i.pinimg.com/1200x/9d/a5/88/9da588df1e185aa0c8349c16d22ddb59.jpg"
          alt="cloud"
          className="w-full"
        />
      </motion.div>

      <motion.div
        animate={{ x: ["0%", "-30%", "0%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-40 right-[-200px] w-[420px] opacity-35"
      >
        <img
          src="https://i.pinimg.com/1200x/9d/a5/88/9da588df1e185aa0c8349c16d22ddb59.jpg"
          alt="cloud"
          className="w-full"
        />
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">

        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Floating bird */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-6xl absolute -top-12 left-2"
          >
            🕊
          </motion.div>

          <h1 className="text-6xl lg:text-7xl font-extrabold text-[#5B3F1E] leading-tight drop-shadow-xl">
            Beyond <br /> our Products
          </h1>

          <p className="text-lg text-gray-700 mt-5 max-w-md leading-relaxed">
            Stories of real farmers, sustainable practices and the journey
            behind every pure, handcrafted product.
          </p>
        </motion.div>

        {/* ---------------- SLIDER CARD ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* GOLDEN OUTER GLOW */}
          <div className="absolute inset-0 blur-xl bg-[#C08E47]/30 rounded-3xl"></div>

          {/* SLIDE CONTENT */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl bg-white/20 border border-white/30 w-full h-[450px]"
          >
            {slides[index].type === "image" ? (
              <img
                src={slides[index].url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                src={slides[index].url}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>

          {/* GOLD TITLE STRIP */}
          <div className="absolute -bottom-1 w-full">
            <div className="bg-gradient-to-r from-[#8B5E2B] to-[#C08E47] text-white 
              py-4 text-3xl font-bold rounded-t-3xl text-center shadow-xl tracking-wide">
              {slides[index].title}
            </div>
          </div>

          {/* LEFT ARROW */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
            className="absolute top-1/2 left-4 -translate-y-1/2 
              bg-white/50 hover:bg-white/80 backdrop-blur-2xl p-3 rounded-full shadow-lg text-3xl"
          >
            ‹
          </motion.button>

          {/* RIGHT ARROW */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setIndex((index + 1) % slides.length)}
            className="absolute top-1/2 right-4 -translate-y-1/2 
              bg-white/50 hover:bg-white/80 backdrop-blur-2xl p-3 rounded-full shadow-lg text-3xl"
          >
            ›
          </motion.button>

          {/* DOTS */}
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex gap-4">
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer 
                ${index === i ? "bg-[#8B5E2B] scale-150" : "bg-[#8B5E2B]/40"}`}
              ></div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
