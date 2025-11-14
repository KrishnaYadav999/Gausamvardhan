// AnimatedText.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const texts = [
  "In Plastic & Glass Jars Both: Pickles & Chutneys.",
  "Available in Plastic & Glass Jars: Pickles & Chutneys",
  "Pickles & Chutneys – Packed in Plastic & Glass Jars",
  "Pickles & Chutneys in Both Glass & Plastic Jars",
  "Glass & Plastic Jar Options: Pickles & Chutneys",
];

const AnimatedText = () => {
  const textRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Background smooth animation between two colors
    gsap.to(containerRef.current, {
      backgroundColor: "#B49F72",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Text animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    textRefs.current.forEach((el) => {
      const letters = el.textContent.split("");
      el.textContent = "";

      letters.forEach((letter) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.display = "inline-block";
        el.appendChild(span);
      });

      tl.fromTo(
        el.querySelectorAll("span"),
        { opacity: 0, y: 2 },
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.2 }
      ).to(el, { opacity: 0, y: -2, duration: 0.4, delay: 0.8 });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative p-2 shadow-md overflow-hidden h-10 flex items-center justify-center"
      style={{ backgroundColor: "#008031" }} // start with green
    >
      {texts.map((text, index) => (
        <p
          key={index}
          ref={(el) => (textRefs.current[index] = el)}
          className="absolute text-white text-xs md:text-xs font-medium text-center"
        >
          {text}
        </p>
      ))}
    </div>
  );
};

export default AnimatedText;
