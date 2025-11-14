import React from "react";
import { ShieldCheck, Truck, MessageCircle, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const ServicesNav = () => {
  const { theme, themes } = useTheme(); // fetch current theme
  const currentTheme = themes[theme];

  const services = [
    {
      icon: <ShieldCheck className="w-5 h-5 md:w-7 md:h-7" />,
      title: "WELL TRUSTED",
      subtitle: "100k+ Happy Customers",
    },
    {
      icon: <Truck className="w-5 h-5 md:w-7 md:h-7" />,
      title: "SUPER FAST",
      subtitle: "Express Festive Delivery",
    },
    {
      icon: <MessageCircle className="w-5 h-5 md:w-7 md:h-7" />,
      title: "EXPERT HELP",
      subtitle: "7 Days a Week",
    },
    {
      icon: <Tag className="w-5 h-5 md:w-7 md:h-7" />,
      title: "BEST PRICES",
      subtitle: "Special Offers 🎁",
    },
  ];

  return (
    <div
      className={`relative py-5 md:py-7 px-2 sm:px-4 md:px-10 overflow-hidden bg-gradient-to-r ${currentTheme.gradient} transition-all duration-700`}
    >
      {/* Overlay for festive effect */}
      <div
        className={`absolute inset-0 ${currentTheme.overlay} opacity-20 mix-blend-soft-light pointer-events-none`}
      ></div>

      {/* Diwali Fairy Lights */}
      {theme === "diwali" && (
        <>
          {[...Array(15)].map((_, i) => (
            <span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-400 animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.5 + Math.random()}s`,
              }}
            ></span>
          ))}
        </>
      )}

      <div className="relative flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 15px 2px ${currentTheme.accent}`,
            }}
            className={`flex flex-col items-center justify-center rounded-xl p-2 sm:p-3 md:p-4 backdrop-blur-md transition-all duration-300
              bg-[rgba(0,0,0,0.2)] border border-[${currentTheme.accent}]/40
              hover:bg-[rgba(0,0,0,0.3)]
              flex-1 min-w-[50px] sm:min-w-[22%] max-w-[100%] sm:max-w-[24%]`}
          >
            {/* Icon */}
            <div
              className="mb-1 text-[22px]"
              style={{ color: currentTheme.accent }}
            >
              {service.icon}
            </div>

            {/* Title & Subtitle - show only on md+ screens */}
            <div className="hidden sm:flex flex-col items-center text-center">
              <h4
                className="font-semibold text-[11px] sm:text-xs md:text-sm uppercase tracking-wide"
                style={{ color: currentTheme.accent }}
              >
                {service.title}
              </h4>
              <p
                className="text-[9px] sm:text-[11px] md:text-xs mt-0.5"
                style={{ color: currentTheme.text }}
              >
                {service.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesNav;
