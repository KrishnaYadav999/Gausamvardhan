import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BannerSkeleton = () => (
  <div
    className="relative w-full overflow-hidden bg-gray-200 animate-pulse"
    style={{ paddingTop: "56.18%" }}
  ></div>
);

const AcharBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  // Fetch banner list once
  useEffect(() => {
    const fetchBanners = async () => {
      const cached = localStorage.getItem("banners_cache");

      if (cached) {
        setBanners(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/api/banners");
        localStorage.setItem("banners_cache", JSON.stringify(data));
        setBanners(data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-switch banner images
  useEffect(() => {
    if (!banners.length) return;

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
  const currentImage = images[currentImageIndex];

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (containerRef.current && naturalWidth && naturalHeight) {
      const ratioPercent = (naturalHeight / naturalWidth) * 100;
      containerRef.current.style.paddingTop = `${ratioPercent}%`;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ paddingTop: "56.18%" }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={currentImage}
          alt="banner"
          onLoad={handleImageLoad}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      <div className="absolute bottom-6 right-8 flex gap-3 z-20">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full duration-300 ${
              i === currentImageIndex
                ? "bg-white shadow-md scale-125"
                : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AcharBanner;
