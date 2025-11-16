import React from "react";
import { ShieldCheck, Truck, MessageCircle, Tag } from "lucide-react";
import { motion } from "framer-motion";

const ServicesNav = () => {
  const brand = {
    primary: "#328E6E",
    accent: "#67AE6E",
    soft: "#90C67C",
    cream: "#E1EEBC",
  };

  const backgroundImageUrl = "https://i.pinimg.com/736x/a4/7c/95/a47c95c5fe05cbc046f7436f359547a7.jpg";

  const services = [
    { icon: <ShieldCheck className="w-5 h-5 md:w-7 md:h-7" />, title: "WELL TRUSTED", subtitle: "100k+ Happy Customers" },
    { icon: <Truck className="w-5 h-5 md:w-7 md:h-7" />, title: "SUPER FAST", subtitle: "Express Festive Delivery" },
    { icon: <MessageCircle className="w-5 h-5 md:w-7 md:h-7" />, title: "EXPERT HELP", subtitle: "7 Days a Week" },
    { icon: <Tag className="w-5 h-5 md:w-7 md:h-7" />, title: "BEST PRICES", subtitle: "Special Offers 🎁" },
  ];

  return (
    <div
      className="relative py-5 md:py-7 px-2 sm:px-4 md:px-10 overflow-hidden transition-all duration-700 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div
        className="absolute inset-0 opacity-90 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.1)" }}
      ></div>

      <div className="relative flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 15px ${brand.accent}` }}
            className={`flex flex-col items-center justify-center rounded-xl p-2 sm:p-3 md:p-4 bg-[rgba(255,255,255,0.25)] border border-[${brand.accent}] transition-all duration-300 flex-1 min-w-[50px] sm:min-w-[22%] max-w-[100%] sm:max-w-[24%]`}
          >
            <div className="mb-1 text-[22px]" style={{ color: brand.primary }}>
              {service.icon}
            </div>

            <div className="hidden sm:flex flex-col items-center text-center">
              <h4 className="font-semibold text-[11px] sm:text-xs md:text-sm uppercase tracking-wide" style={{ color: brand.primary }}>
                {service.title}
              </h4>
              <p className="text-[9px] sm:text-[11px] md:text-xs mt-0.5" style={{ color: brand.primary }}>
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