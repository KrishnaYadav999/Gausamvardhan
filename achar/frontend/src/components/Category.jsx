// Category.jsx
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
  const [headingFade, setHeadingFade] = useState(true);

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

  // Hindi-English rotating names
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

  // Heading stays English only
  useEffect(() => {
    setHeading("Categories");
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

      {/* Heading English Only */}
      <h2
        className={`text-2xl sm:text-3xl font-bold text-green-700 mb-8 text-center transition-all duration-500 
        ${headingFade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
      >
        {heading}
      </h2>

      {/* Category Wrapper */}
      <div className="w-full flex justify-center">
        <div className="flex gap-10 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 justify-center">

          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center cursor-pointer snap-start group"
            >
              {/* Circle Image */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-md bg-white 
                hover:scale-105 hover:shadow-xl transition-all duration-500 flex items-center justify-center shrink-0">
                <img
                  src={cat.image || "https://via.placeholder.com/300"}
                  alt={cat.name}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              {/* Category Name */}
              <p
                className={`text-[#25421C] font-semibold text-sm sm:text-base mt-3 text-center transition-all duration-500
                  ${
                    fadeState[cat._id]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
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
