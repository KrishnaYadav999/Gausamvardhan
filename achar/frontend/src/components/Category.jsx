import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const translations = {
  achar: "अचार",
  ghee: "घी",
  masala: "मसाला",
  oil: "तेल",
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [displayNames, setDisplayNames] = useState({});
  const [fadeState, setFadeState] = useState({}); // smooth animation
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
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 🔄 Smooth Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      categories.forEach((cat) => {
        const eng = cat.name;
        const key = eng.toLowerCase();
        const hindi = translations[key] || eng;

        // FIRST: fade-out
        setFadeState((prev) => ({ ...prev, [cat._id]: false }));

        setTimeout(() => {
          // CHANGE TEXT
          setDisplayNames((prev) => ({
            ...prev,
            [cat._id]: prev[cat._id] === eng ? hindi : eng,
          }));

          // THEN: fade-in
          setFadeState((prev) => ({ ...prev, [cat._id]: true }));
        }, 400); // fade-out duration
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [categories]);

  const handleCategoryClick = (cat) => {
    const nameLower = cat.name.toLowerCase();

    if (nameLower.includes("ghee")) navigate(`/ghee/${cat.slug}`);
    else if (nameLower.includes("masala")) navigate(`/masala-category/${cat.slug}`);
    else if (nameLower.includes("oil")) navigate(`/oil/category/${cat.slug}`);
    else navigate(`/achar-category/${cat.slug}`);
  };

  return (
    <div className="px-6 py-12 lg:ml-40">
      <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className="
              relative group cursor-pointer overflow-hidden rounded-3xl 
              bg-white/40 backdrop-blur-xl border border-white/50
              shadow-[0_4px_20px_rgba(0,0,0,0.08)]
              hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
              hover:-translate-y-2 transition-all duration-500
            "
          >

            {/* Image */}
            <div className="w-full h-40 sm:h-44 md:h-48 overflow-hidden rounded-3xl">
              <img
                src={cat.image || 'https://via.placeholder.com/300'}
                alt={cat.name}
                className="
                  w-full h-full object-cover 
                  transition-transform duration-700 
                  group-hover:scale-110
                "
              />
            </div>

            {/* Overlay */}
            <div className="
              absolute inset-0 
              bg-gradient-to-t from-black/70 via-black/30 to-transparent 
              opacity-70 group-hover:opacity-90 
              transition duration-500
            "></div>

            {/* SMOOTH ANIMATED NAME */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <p
                className={`
                  text-white font-semibold 
                  text-sm sm:text-base md:text-lg 
                  tracking-wide drop-shadow-lg
                  transition-all duration-500
                  ${fadeState[cat._id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                `}
              >
                {displayNames[cat._id]}
              </p>
            </div>

            {/* Glow */}
            <div className="
              absolute inset-0 rounded-3xl 
              border border-transparent 
              group-hover:border-green-400/80 
              group-hover:shadow-[0_0_25px_rgba(74,222,128,0.5)]
              transition-all duration-500
            "></div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Category;
