/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      /* ---------------- FONTS ---------------- */
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },

      /* ---------------- COLORS ---------------- */
      colors: {
        primary: "#FFD700", // luxury golden
      },

      /* ---------------- ANIMATIONS ---------------- */
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        popIn: "popIn 0.45s ease-out",
        fadeUp: "fadeUp 0.6s ease-out",
        shimmer: "shimmer 1.6s linear infinite",
        pulseGlow: "pulseGlow 1.8s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        popIn: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },

        fadeUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },

        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },

        pulseGlow: {
          "0%, 100%": {
            textShadow: "0 0 8px rgba(255,215,0,0.5)",
          },
          "50%": {
            textShadow: "0 0 22px rgba(255,215,0,0.95)",
          },
        },

        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
