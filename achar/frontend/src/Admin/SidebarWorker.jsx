import React from "react";
import { GiCampfire } from "react-icons/gi"; // ✅ Works as Diya / festive lamp

const SidebarWorker = ({ setActive }) => {
  return (
    <div
      className="w-64 h-screen text-white p-5 relative shadow-2xl uppercase"
      style={{
        background: "linear-gradient(180deg, #2E0057 0%, #4B0082 50%, #5E17EB 100%)",
        boxShadow: "inset 0 0 40px rgba(255, 215, 0, 0.15)",
        borderRight: "3px solid #FFD700",
      }}
    >
      {/* Header */}
      <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
        <GiCampfire className="text-yellow-400 animate-glow" />
        WORKER PANEL
      </h2>

      {/* Menu Items */}
      <ul className="space-y-2">
        {[
          "DASHBOARD",
          "STOCK QUANTITY",
          "ALL USER",
          "USER ORDERS",
          "BANNER",
          "SMALL BANNER",
          "ACHAR CATEGORY",
          "ACHAR PRODUCT",
          "ACHAR PRODUCT DELETE UPDATE",
          "GHEE PRODUCT CREATE",
          "GHEE PRODUCT UPDATE DELETE",
          "MASALA PRODUCT CREATE",
          "MASALA PRODUCT UPDATE DELETE",
          "OIL PRODUCT CREATE",
          "OIL PRODUCT UPDATE DELETE",
          "USERS",
        ].map((item) => (
          <li
            key={item}
            onClick={() => setActive(item.toLowerCase().replace(/\s+/g, ""))}
            className="cursor-pointer px-4 py-2 rounded-md bg-[#ffffff0d] hover:bg-[#FFD700] hover:text-[#2E0057] font-semibold transition-all duration-300 border border-transparent hover:border-yellow-400 shadow-md hover:shadow-[0_0_12px_rgba(255,215,0,0.8)]"
          >
            {item}
          </li>
        ))}
      </ul>

      {/* Decorative Diyas */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-6">
        <GiCampfire className="text-yellow-300 text-3xl animate-glow" />
        <GiCampfire className="text-yellow-400 text-3xl animate-glow delay-150" />
        <GiCampfire className="text-yellow-500 text-3xl animate-glow delay-300" />
      </div>
    </div>
  );
};

export default SidebarWorker;
