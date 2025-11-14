import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

// #FCF6EF old color 

export const ThemeProvider = ({ children }) => {
  // Load theme from localStorage or default to 'chrome'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("adminTheme") || "chrome";
  });

  const themes = {
    chrome: {
      name: "Chrome",
      gradient: "from-[#e0e0e0] via-[#ffffff] to-[#c0c0c0]",
      accent: "#4285F4",
      text: "#1A1A1A",
      overlay:
        "bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]",
      decoration: "🖥️",
    },
    diwali: {
      name: "Diwali",
      gradient: "from-[#2E0057] via-[#4B0082] to-[#5E17EB]",
      accent: "#FFD700",
      text: "#f5e7c6",
      overlay:
        "bg-[url('https://www.transparenttextures.com/patterns/golden-fabric.png')]",
      decoration: "🪔",
    },
    newyear: {
      name: "New Year",
      gradient: "from-[#000428] via-[#004e92] to-[#000428]",
      accent: "#00FFFF",
      text: "#E0FFFF",
      overlay:
        "bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]",
      decoration: "🎆",
    },
    christmas: {
      name: "Christmas",
      gradient: "from-[#145A32] via-[#1E8449] to-[#145A32]",
      accent: "#E74C3C",
      text: "#FDF2E9",
      overlay:
        "bg-[url('https://www.transparenttextures.com/patterns/giftly.png')]",
      decoration: "🎄",
    },
    pongal: {
      name: "Pongal",
      gradient: "from-[#ffb347] via-[#ffcc33] to-[#ffb347]",
      accent: "#FF6F00",
      text: "#FFF5E1",
      overlay:
        "bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]",
      decoration: "☀️",
    },
    rakhi: {
      name: "Rakhi",
      gradient: "from-[#FF4081] via-[#F06292] to-[#FF4081]",
      accent: "#FFC107",
      text: "#FFF5E1",
      overlay:
        "bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]",
      decoration: "🎁",
    },
  };

  // Persist theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
