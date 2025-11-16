import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const AcharBannerTwo = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("/api/smallbanners");
        console.log("Fetched banners:", res.data);

        // Map backend response to frontend-friendly structure
        const mapped = res.data.map((b) => ({
          _id: b._id,
          img: b.image,            // backend field
          links: b.link,           // backend field
          title: b.title || "",    // fallback empty
          btnText: b.btnText || "Shop Now", // fallback default
        }));

        setBanners(mapped);
      } catch (error) {
        console.error(
          "Error fetching banners:",
          error.response?.data || error.message
        );
      }
    };
    fetchBanners();
  }, []);

  if (banners.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading banners...
      </div>
    );
  }

  // Separate main banners for desktop hero grid
  const mainBanners = banners.slice(0, 2);
  const extraBanners = banners.slice(2);

  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));

  return (
    <div className="px-4 md:px-16 py-8">
      {/* Desktop Hero Grid */}
      {mainBanners.length > 0 && (
        <div className="hidden md:grid grid-cols-3 gap-6 h-[380px] mb-8">
          {mainBanners.map((banner, index) => (
            <div
              key={banner._id}
              className={`relative rounded-2xl overflow-hidden shadow-lg group bg-white ${
                index === 0 ? "col-span-2" : "col-span-1"
              }`}
            >
              <img
                src={banner.img}
                alt={banner.title || "Banner"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
                <h2 className={`text-white font-extrabold mb-4 drop-shadow-lg ${index === 0 ? "text-4xl" : "text-3xl"}`}>
                  {banner.title || ""}
                </h2>
                <a href={banner.links || "#"}>
                  <button className="bg-[#7ED957] hover:bg-[#008031] text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-md">
                    {banner.btnText || "Shop Now"} <ArrowRight size={20} />
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extra Banners Desktop */}
      {extraBanners.length > 0 && (
        <div className="hidden md:grid grid-cols-3 gap-6 h-[320px]">
          {extraBanners.map((banner) => (
            <div
              key={banner._id}
              className="relative rounded-2xl overflow-hidden shadow-lg group bg-white"
            >
              <img
                src={banner.img}
                alt={banner.title || "Banner"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 flex items-end justify-start p-6">
                <a href={banner.links || "#"}>
                  <button className="border border-white text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition hover:bg-white hover:text-black">
                    {banner.btnText || "Shop Now"} <ArrowRight size={18} />
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Slider */}
      <div className="relative md:hidden overflow-hidden">
        <motion.div
          className="flex"
          animate={{ x: `-${current * 100}%` }}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
        >
          {banners.map((banner) => (
            <div key={banner._id} className="min-w-full px-2">
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white">
                <img
                  src={banner.img}
                  alt={banner.title || "Banner"}
                  className="w-full h-[300px] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
                  <h2 className="text-white text-2xl font-bold mb-4 drop-shadow-lg">
                    {banner.title || ""}
                  </h2>
                  <a href={banner.links || "#"}>
                    <button className="bg-[#7ED957] hover:bg-[#008031] text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md">
                      {banner.btnText || "Shop Now"} <ArrowRight size={18} />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default AcharBannerTwo;
