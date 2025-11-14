import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton for banner loading
const BannerSkeleton = () => (
  <div className="relative w-full max-w-6xl mx-auto h-[30vh] md:h-[40vh] overflow-hidden rounded-xl shadow-md bg-gray-200 animate-pulse"></div>
);

const AcharBanner = ({ className = "" }) => {
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

  // Auto-slide
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
  if (banners.length === 0) return null;

  const currentBanner = banners[currentBannerIndex];
  const images = currentBanner.images || [];
  const currentImage = images[currentImageIndex] || "";

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto h-[30vh] md:h-[40vh] overflow-hidden rounded-xl shadow-md bg-black ${className} mt-5`}
    >
      {/* Animated Image with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage} // ensures unique animation on change
          src={currentImage}
          alt={`Banner ${currentBannerIndex} - Image ${currentImageIndex}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

      {/* Button */}
      <div className="absolute bottom-3 left-3 z-10">
        <a href={currentBanner.buttonLink}>
          <button className="bg-white text-black px-4 py-1.5 text-xs md:text-sm font-medium rounded-full hover:bg-gray-100 transition shadow">
            {currentBanner.buttonText}
          </button>
        </a>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 right-3 flex gap-2 z-10">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx === currentImageIndex ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AcharBanner;
