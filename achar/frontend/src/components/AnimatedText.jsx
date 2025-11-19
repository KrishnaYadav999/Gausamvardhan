// AnimatedText.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const texts = [
  "Gausamvardhan – Premium Achar crafted with traditional recipes.",
  "Taste the purity of homemade-style Achar, made from natural ingredients.",
  "Gausamvardhan Ghee – Authentic, rich, and 100% pure for your family.",
  "Experience real Indian goodness with our traditionally churned Ghee.",
  "Our Masala blends – Fresh, aromatic, and crafted to enhance every dish.",
  "Bring home spices that add real flavor and fragrance to your cooking.",
  "Gausamvardhan Oils – Light, healthy, and naturally refined.",
  "Cook healthier meals with our pure and balanced cooking oils.",
  "Agarbatti – Natural fragrance for peace, purity, and a calm home.",
  "Handmade Agarbatti crafted with pure natural extracts.",
  "Ganpati Bappa Idols – Beautifully crafted from natural materials.",
  "Bring home divine blessings with eco-friendly Ganpati idols."
];

const AnimatedText = () => {
  const textRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Smooth animated gradient background
    gsap.to(containerRef.current, {
      background: "linear-gradient(90deg, #2F8F68, #4DB47F, #2F8F68)",
      backgroundSize: "300% 300%",
      duration: 8,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Text animation
    const tl = gsap.timeline({ repeat: -1 });

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
        { opacity: 0, y: 6, filter: "blur(3px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.03,
          duration: 0.25,
          ease: "power2.out",
        }
      ).to(el, {
        opacity: 0,
        y: -6,
        filter: "blur(3px)",
        duration: 0.5,
        delay: 1.2,
        ease: "power1.inOut",
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative p-3 border border-green-700 shadow-md overflow-hidden h-14 flex items-center justify-center"
      style={{
        background: "linear-gradient(90deg, #328E6E, #67AE6E, #328E6E)",
        backgroundSize: "300% 300%",
      }}
    >
      {texts.map((text, index) => (
        <p
          key={index}
          ref={(el) => (textRefs.current[index] = el)}
          className="absolute text-white text-[14px] font-semibold tracking-wide text-center drop-shadow-lg px-2"
        >
          {text}
        </p>
      ))}
    </div>
  );
};

export default AnimatedText;
