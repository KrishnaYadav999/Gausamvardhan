import React from "react";
import { FaTruck, FaCalendarAlt, FaGift, FaHeadset, FaUndo } from "react-icons/fa";

const Features = () => {
  const features = [
    { icon: <FaTruck size={16} />, title: "100% Natural" },
    { icon: <FaCalendarAlt size={16} />, title: "No chemicals" },
    { icon: <FaGift size={16} />, title: "Secure payment" },
    { icon: <FaHeadset size={16} />, title: "24/7 support" },
    { icon: <FaUndo size={16} />, title: "30-day refund" },
  ];

  return (
    <div className="w-full bg-white py-4">
      <div className="max-w-6xl mx-auto flex justify-center gap-3 px-2">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center 
                       border border-dashed border-red-400 rounded-md p-2 w-24 h-20
                       bg-white"
          >
            <div className="text-red-700 mb-1">{item.icon}</div>
            <p className="text-red-700 font-medium text-[10px]">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
