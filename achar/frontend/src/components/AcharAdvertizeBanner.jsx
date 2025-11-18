import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://i.pinimg.com/1200x/62/02/16/6202162f9e548efbd2cf04c7ca532252.jpg",
  "https://i.pinimg.com/1200x/c1/14/77/c11477b0fe742bca11438e2b36eda749.jpg",
  "https://i.pinimg.com/originals/78/fe/2b/78fe2bcd59ad949015135c8db05d4953.jpg",
];

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
