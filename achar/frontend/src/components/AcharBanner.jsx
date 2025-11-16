import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BannerSkeleton = () => (
  <div className="relative w-full h-[55vh] md:h-[80vh] overflow-hidden bg-gray-200 animate-pulse"></div>
);

const AcharBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get("/api/banners");
        setBanners(data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      const images = banners[currentBannerIndex]?.images || [];
      if (images.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        setCurrentImageIndex(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [banners, currentBannerIndex]);

  if (loading) return <BannerSkeleton />;
  if (!banners.length) return null;

  const currentBanner = banners[currentBannerIndex];
  const images = currentBanner.images || [];
  const currentImage = images[currentImageIndex] || "";

  return (
    <div
      className="
        relative 
        w-full 
        h-[55vh] md:h-[80vh]   /* 🔥 BIG HEIGHT HERE */
        overflow-hidden 
        bg-black 
        mt-0
      "
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={currentImage}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.25, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

      {/* Button */}
      <div className="absolute bottom-8 left-8 z-10">
        <a href={currentBanner.buttonLink}>
          <button className="bg-white text-black px-6 py-2 text-sm md:text-base font-semibold rounded-full shadow-md hover:bg-gray-100 transition">
            {currentBanner.buttonText}
          </button>
        </a>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 right-8 flex gap-3 z-10">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition ${
              i === currentImageIndex ? "bg-white shadow-md scale-125" : "bg-white/40"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AcharBanner;
