// AnimatedText.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaGift } from "react-icons/fa";

const texts = [
  { icon: <FaGift />, text: "New customers save 10% with code GET10!" },
  { icon: <FaGift />, text: "Trending now: Free shipping on orders over $50!" },
  { icon: <FaGift />, text: "Exclusive deals for a limited time only!" },
];

const AnimatedText = () => {
  const containerRef = useRef(null);
  const textWrapperRef = useRef(null);
  const tweenRef = useRef(null); // Store GSAP instance

  useEffect(() => {
    const wrapper = textWrapperRef.current;
    const totalWidth = wrapper.scrollWidth;

    // Create GSAP animation and store it in ref
    tweenRef.current = gsap.fromTo(
      wrapper,
      { x: 0 },
      {
        x: -totalWidth / 2,
        duration: 25,
        repeat: -1,
        ease: "linear",
      }
    );

    // Cleanup on unmount
    return () => tweenRef.current.kill();
  }, []);

  // Pause/play on hover
  const handleMouseEnter = () => tweenRef.current.pause();
  const handleMouseLeave = () => tweenRef.current.play();

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        relative overflow-hidden border border-green-700 h-[52px] flex items-center
        sm:h-[64px] bg-gradient-to-r from-[#328E6E] via-[#67AE6E] to-[#328E6E]
        text-white font-semibold text-[12px] sm:text-[14px] px-4 
      "
    >
      <div ref={textWrapperRef} className="flex whitespace-nowrap gap-x-8 items-center">
        {texts.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            {item.icon}
            {item.text}
          </span>
        ))}
        {texts.map((item, index) => (
          <span key={`dup-${index}`} className="flex items-center gap-2">
            {item.icon}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnimatedText;
