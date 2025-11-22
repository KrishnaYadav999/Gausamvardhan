// Category.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Hindi translations
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

// Route mapping
const routeMapping = {
  ghee: (slug) => `/ghee/${slug}`,
  masala: (slug) => `/masala-category/${slug}`,
  oil: (slug) => `/oil/category/${slug}`,
  tel: (slug) => `/oil/category/${slug}`,
  "pooja-essentials": (slug) => `/agarbatti-category/${slug}`, // NEW
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
  const navigate = useNavigate();

  // Fetch categories
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

  // Hindi-English rotate
  useEffect(() => {
    if (categories.length === 0) return;

    const interval = setInterval(() => {
      const newDisplayNames = {};
      const newFadeState = {};

      categories.forEach((cat) => {
        const eng = cat.name;
        const key = eng.toLowerCase().replace(/\s/g, "");
        const hindi = translations[key] || eng;

        const currentName = displayNames[cat._id] || eng;
        const nextName = currentName === eng ? hindi : eng;

        newDisplayNames[cat._id] = nextName;
        newFadeState[cat._id] = false;
      });

      setFadeState(newFadeState);

      setTimeout(() => {
        setDisplayNames(newDisplayNames);

        const fadeIn = {};
        categories.forEach((cat) => (fadeIn[cat._id] = true));
        setFadeState(fadeIn);
      }, 350);
    }, 5000);

    return () => clearInterval(interval);
  }, [categories, displayNames]);

  // Navigation
  const handleCategoryClick = (cat) => {
    const slugLower = cat.slug.toLowerCase(); // use slug from DB
    console.log("Clicked category:", cat.name, "Slug:", slugLower);

    // Use slug key instead of name to find route
    const matchedKey = Object.keys(routeMapping).find((key) => key === slugLower);

    if (matchedKey) {
      const route = routeMapping[matchedKey](slugLower);
      console.log("Navigating to:", route);
      navigate(route);
      return;
    }

    // Default to achar
    console.log("Default navigating to:", `/achar-category/${slugLower}`);
    navigate(`/achar-category/${slugLower}`);
  };

  // UI
  return (
    <div className="px-4 py-10">
      <div className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className="flex flex-col items-center cursor-pointer snap-start group"
          >
            {/* Circle Card */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-md bg-white hover:scale-105 hover:shadow-xl transition-all duration-500 flex items-center justify-center shrink-0">
              <img
                src={cat.image || "https://via.placeholder.com/300"}
                alt={cat.name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>

            {/* Name */}
            <p
              className={`text-[#25421C] font-semibold text-sm sm:text-base mt-3 transition-all duration-500 text-center ${
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
  );
};

export default Category;
