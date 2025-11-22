import React, { useState, useEffect } from "react";
import { GiCampfire } from "react-icons/gi";
import { Sparkles, Gift, TreePine, Sun, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const themeOptions = [
  { id: "chrome", name: "Chrome", icon: <span className="text-blue-400 text-lg">🖥️</span> },
  { id: "diwali", name: "Diwali", icon: <GiCampfire className="text-yellow-400" /> },
  { id: "newyear", name: "New Year", icon: <Sparkles className="text-cyan-400" /> },
  { id: "christmas", name: "Christmas", icon: <TreePine className="text-green-400" /> },
  { id: "pongal", name: "Pongal", icon: <Sun className="text-orange-400" /> },
  { id: "rakhi", name: "Rakhi", icon: <Gift className="text-pink-400" /> },
];

const Sidebar = ({ setActive }) => {
  const [open, setOpen] = useState(true);
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  const currentGradient = themes[theme]?.gradient || "from-[#2E0057] via-[#4B0082] to-[#5E17EB]";

  const menuItems = [
    "WORKER CREATE",
    "WORKER TRACKING",
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
    "ADMINAGARBATICREATE",
    "ADMINAGARBATTIUPDATEDELETE",
    "ADMINCREATEADVERTIZE",
    "VIDEOADVERTIZEUPDATEDELETE",
    "adminganpaticreate",
    "adminganpatimanage",
    "cupcreate",
    "DASHBOARD",
    "USERS",
  ];

  return (
    <div
      className={`relative h-screen transition-all duration-300 ${open ? "w-64" : "w-16"} 
        text-white flex flex-col justify-between shadow-2xl`}
      style={{
        background: `linear-gradient(180deg, ${currentGradient.replace(/from-|via-|to-/g, "")})`,
        borderRight: "3px solid #FFD700",
      }}
    >
      {/* Toggle Button */}
      <button
        className="absolute top-3 right-3 text-yellow-400 md:hidden"
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>

      <div className="mt-4 px-2 flex-1 overflow-y-auto">
        {/* Header */}
        {open && (
          <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
            <GiCampfire className="text-yellow-400 animate-glow" /> ADMIN PANEL
          </h2>
        )}

        {/* Theme Selector */}
        {open && (
          <div className="mb-4 bg-white/10 p-4 rounded-2xl border border-yellow-400/40 shadow-lg backdrop-blur-md">
            <h3 className="text-yellow-300 font-semibold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
              🎨 Select Theme
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {themeOptions.map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`
                      flex items-center justify-center gap-2 p-3 rounded-xl border transition-all
                      ${isActive 
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-200 text-[#2E0057] shadow-xl scale-105 animate-pulse" 
                        : "bg-white/10 hover:bg-white/20 text-white border-white/20"}
                      transform duration-300
                    `}
                  >
                    <div className="text-lg">{t.icon}</div>
                    <span className="text-xs font-semibold">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => setActive(item.toLowerCase().replace(/\s+/g, ""))}
              className="cursor-pointer px-4 py-2 rounded-md bg-[#ffffff0d] hover:bg-[#FFD700] hover:text-[#2E0057] font-semibold transition-all duration-300 border border-transparent hover:border-yellow-400 shadow-md hover:shadow-[0_0_12px_rgba(255,215,0,0.8)]"
            >
              {open ? item : item[0]}
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative Diyas */}
      {open && (
        <div className="flex justify-center gap-4 mt-8">
          <GiCampfire className="text-yellow-300 text-3xl animate-glow" />
          <GiCampfire className="text-yellow-400 text-3xl animate-glow delay-150" />
          <GiCampfire className="text-yellow-500 text-3xl animate-glow delay-300" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
