// AnimatedText.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const texts = [
  "Achar – Taste of home in every bite. | अचार घर का स्वाद, हर कौर में।",
  "Achar – That perfect tangy twist! | अचार  खाने में वो खट्टा-मीठा जादू!",
  "Ghee – Purity you can trust. | घी  शुद्धता का भरोसा, हर चम्मच में।",
  "Ghee – Authentic desi richness. | घी देसी स्वाद, सीधी परंपरा से।",
  "Masala – The real hero of every dish. | मसाला हर डिश का असली हीरो।",
  "Masala – Aroma that awakens hunger. | मसाला  खुशबू ऐसी कि भूख बढ़ जाए।",
  "Oil – Light, healthy & pure. | तेल  हल्का, सेहतमंद और शुद्ध।",
  "Oil – Make every meal healthier. | तेल  हर भोजन को और पौष्टिक बनाएं।"
];


const AnimatedText = () => {
  const textRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Background breathing animation
    gsap.to(containerRef.current, {
      background: "linear-gradient(90deg, #2F8F68, #4DB47F, #2F8F68)",
      backgroundSize: "300% 300%",
      duration: 8,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Text animation timeline
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
      )
        .to(el, {
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
      className="relative p-2 shadow-md overflow-hidden h-12 flex items-center justify-center rounded-md"
      style={{
        background:
          "linear-gradient(90deg, #328E6E, #67AE6E, #328E6E)",
        backgroundSize: "300% 300%",
      }}
    >
      {texts.map((text, index) => (
        <p
          key={index}
          ref={(el) => (textRefs.current[index] = el)}
          className="absolute text-white text-sm font-semibold tracking-wide text-center drop-shadow-lg"
        >
          {text}
        </p>
      ))}
    </div>
  );
};

export default AnimatedText;
