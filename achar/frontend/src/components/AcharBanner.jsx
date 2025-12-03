import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const BannerSkeleton = () => (
  <div className="relative w-full overflow-hidden bg-gray-200 animate-pulse" style={{ paddingTop: "56.18%" }}></div>
  // 56.18% ~ (2016/3586)*100 for your image ratio fallback
);

const AcharBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

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

  // when image loads, set container padding-top to match image ratio
  const handleImageLoad = (e) => {
    try {
      const img = e.target;
      const { naturalWidth, naturalHeight } = img;
      if (naturalWidth && naturalHeight && containerRef.current) {
        const ratioPercent = (naturalHeight / naturalWidth) * 100; // padding-top %
        containerRef.current.style.paddingTop = `${ratioPercent}%`;
      }
    } catch (err) {
      // ignore
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black"
      // IMPORTANT: we don't set h-[] or aspect-[] here — we use padding-top dynamicaly
      style={{ paddingTop: "56.18%" }} // fallback: your image ratio ~ (2016/3586)*100
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={currentImage}
          alt="banner"
          onLoad={handleImageLoad}
          className="
            absolute inset-0
            w-full h-full
            object-contain      /* ensures whole image visible, no crop */
            bg-black
          "
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      {/* <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent"></div>

      Button
      <div className="absolute bottom-8 left-8 z-10">
        <a href={currentBanner.buttonLink || "#"}>
          <button className="bg-white text-black px-6 py-2 text-sm md:text-base font-semibold rounded-full shadow-md hover:bg-gray-100 transition">
            {currentBanner.buttonText || "Shop Now"}
          </button>
        </a>
      </div> */}

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
