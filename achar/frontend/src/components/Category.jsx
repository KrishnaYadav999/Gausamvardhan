import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const translations = {
  achar: "अचार",
  ghee: "घी",
  masala: "मसाला",
  oil: "तेल",
  agarbatti: "अगरबत्ती",
  dhoop: "धूप",
  ganpati: "गणपति",
  puja: "पूजा",
  cup: "कप",
};

const routeMapping = {
  ghee: (slug) => `/ghee/${slug}`,
  masala: (slug) => `/masala-category/${slug}`,
  oil: (slug) => `/oil/category/${slug}`,
  tel: (slug) => `/oil/category/${slug}`,
  "pooja-essentials": (slug) => `/agarbatti-category/${slug}`,
  dhoop: (slug) => `/dhoop-category/${slug}`,
  ganpati: (slug) => `/ganpati-category/${slug}`,
  puja: (slug) => `/ganpati-category/${slug}`,
  god: (slug) => `/ganpati-category/${slug}`,
  cup: (slug) => `/cup-category/${slug}`,
  achar: (slug) => `/achar-category/${slug}`,
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [displayNames, setDisplayNames] = useState({});
  const [fadeState, setFadeState] = useState({});
  const [heading, setHeading] = useState("Categories");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);

        const initNames = {};
        const initFade = {};
        data.forEach((cat) => {
          initNames[cat._id] = cat.name;
          initFade[cat._id] = true;
        });

        setDisplayNames(initNames);
        setFadeState(initFade);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categories.length) return;

    const interval = setInterval(() => {
      const newDisplay = {};
      const fadeOut = {};

      categories.forEach((cat) => {
        const eng = cat.name;
        const key = eng.toLowerCase().replace(/\s/g, "");
        const hindi = translations[key] || eng;

        const current = displayNames[cat._id] || eng;
        newDisplay[cat._id] = current === eng ? hindi : eng;

        fadeOut[cat._id] = false;
      });

      setFadeState(fadeOut);

      setTimeout(() => {
        setDisplayNames(newDisplay);
        const fadeIn = {};
        categories.forEach((cat) => (fadeIn[cat._id] = true));
        setFadeState(fadeIn);
      }, 350);
    }, 5000);

    return () => clearInterval(interval);
  }, [categories, displayNames]);

  useEffect(() => {
    setHeading("SHOP BY CATEGORY");
  }, []);

  const handleCategoryClick = (cat) => {
    const slugLower = cat.slug.toLowerCase();
    const matched = Object.keys(routeMapping).find((key) => key === slugLower);

    if (matched) {
      navigate(routeMapping[matched](slugLower));
      return;
    }
    navigate(`/achar-category/${slugLower}`);
  };

  return (
    <div className="px-4 py-10 font-[Poppins] flex flex-col items-center">

      {/* 🔥 CSS FIX for unwanted scrolling lines / focus highlights */}
      <style>
        {`
          * { outline: none !important; }
          .no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .category-item:active,
          .category-item:focus {
            outline: none !important;
          }
        `}
      </style>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-8 text-center">
        {heading}
      </h2>

      <div className="w-full flex justify-center">
        <div
          className="
            flex 
            gap-6 
            overflow-x-auto 
            no-scrollbar 
            snap-x snap-mandatory 
            pb-4 
            w-full
            md:justify-center
            md:flex-nowrap
            md:overflow-x-auto
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className="category-item flex flex-col items-center cursor-pointer snap-start min-w-[110px] md:min-w-[140px]"
            >
              <div
                className="
                  w-24 h-24 
                  sm:w-28 sm:h-28 
                  md:w-32 md:h-32
                  rounded-full 
                  overflow-hidden 
                  bg-white 
                  flex items-center justify-center
                  transition-all duration-500
                "
              >
                <img
                  src={cat.image || 'https://via.placeholder.com/300'}
                  className="w-full h-full object-cover"
                  alt={cat.name}
                />
              </div>

              <p
                className={`
                  text-[#25421C] font-semibold text-sm sm:text-base mt-2 text-center transition-all duration-300
                  ${
                    fadeState[cat._id]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }
                `}
              >
                {displayNames[cat._id]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
