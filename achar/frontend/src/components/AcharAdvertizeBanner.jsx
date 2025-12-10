import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://res.cloudinary.com/dtvihyts8/image/upload/v1765353668/Gemini_Generated_Image_rxq6ilrxq6ilrxq6_yhcxn2.png",
]

const AcharAdvertizeBanner = () => {
  const [index, setIndex] = useState(0);

  // Auto slide every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [index]);

  return (
    <div className="relative w-full h-[220px] sm:h-[320px] lg:h-[420px] overflow-hidden bg-black">

      <AnimatePresence>
        <motion.img
          key={index}
          src={images[index]}
          alt="Banner"
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9 }}
        />
      </AnimatePresence>

    </div>
  );
};

export default AcharAdvertizeBanner;