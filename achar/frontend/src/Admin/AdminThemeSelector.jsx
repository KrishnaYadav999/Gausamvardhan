import React from "react";
import { useTheme } from "../context/ThemeContext";
import { GiCampfire } from "react-icons/gi";
import { Sparkles, TreePine, Sun, Gift } from "lucide-react";

const themeOptions = [
  { id: "chrome", name: "Chrome", icon: <span className="text-blue-500 text-lg">🖥️</span> },
  { id: "diwali", name: "Diwali", icon: <GiCampfire className="text-yellow-400" /> },
  { id: "newyear", name: "New Year", icon: <Sparkles className="text-cyan-400" /> },
  { id: "christmas", name: "Christmas", icon: <TreePine className="text-green-500" /> },
  { id: "pongal", name: "Pongal", icon: <Sun className="text-orange-400" /> },
  { id: "rakhi", name: "Rakhi", icon: <Gift className="text-pink-400" /> },
];

const AdminThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative bg-white/10 p-4 rounded-2xl border border-yellow-400/30 shadow-lg backdrop-blur-md mb-6 overflow-hidden">
      {/* Diwali Fairy Lights */}
      {theme === "diwali" && (
        <>
          {[...Array(10)].map((_, i) => (
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

      <h3 className="text-yellow-300 font-semibold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
        🎨 Select Admin Theme
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
                transform duration-300 relative
              `}
            >
              <div className="text-lg">{t.icon}</div>
              <span className="text-xs font-semibold">{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminThemeSelector;
