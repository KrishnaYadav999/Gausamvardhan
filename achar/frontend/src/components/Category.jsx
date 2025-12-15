import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
      <Helmet>
        {/* =========================
       CATEGORY PAGE TITLE
  ========================== */}
        <title>
          Shop by Category – Homemade Achar, Desi Ghee, Agarbatti, Pooja
          Products | Gausamvardhan
        </title>

        {/* =========================
      META DESCRIPTION
  ========================== */}
        <meta
          name="description"
          content="Explore categories at Gausamvardhan – homemade achar, pure desi cow ghee, agarbatti, dhoop, ganpati murti, pooja essentials, masala & oils. Traditional Indian products made naturally with no chemicals or preservatives."
        />

        {/* =========================
       CANONICAL
  ========================== */}
        <link rel="canonical" href="https://www.gausamvardhan.com/" />

        {/* =========================
       OPEN GRAPH
  ========================== */}
        <meta property="og:title" content="Shop by Category – Gausamvardhan" />
        <meta
          property="og:description"
          content="Browse homemade achar, pure desi ghee, pooja samagri, agarbatti, dhoop & traditional Indian products by category."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.gausamvardhan.com/" />
        <meta property="og:site_name" content="Gausamvardhan" />
        <meta
          property="og:image"
          content="https://www.gausamvardhan.com/images/category-og.jpg"
        />

        {/* =========================
       TWITTER
  ========================== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Shop Indian Homemade Products by Category | Gausamvardhan"
        />
        <meta
          name="twitter:description"
          content="Find homemade achar, desi ghee, agarbatti, dhoop, ganpati murti & pooja essentials by category."
        />
        <meta
          name="twitter:image"
          content="https://www.gausamvardhan.com/images/category-og.jpg"
        />

        {/* =========================
      ROBOTS
  ========================== */}
        <meta name="robots" content="index, follow" />

        {/* =========================
       CATEGORY KEYWORDS (INDIAN SEARCH INTENT)
  ========================== */}
        <meta
          name="keywords"
          content="
    shop by category india,
    indian product categories online,
    homemade products category,

    achar category, homemade achar, desi achar,
    ghee category, pure cow ghee, a2 ghee,
    pooja products category, pooja samagri online,
    agarbatti category, dhoop sticks, cow dung dhoop,
    ganpati murti category, eco friendly ganesh murti,
    masala category, indian spices online,
    oil category, cold pressed oil india,

    traditional indian products,
    village style products,
    gaav ka saman online,
    bharatiya paramparik utpad,

    अचार कैटेगरी, देसी घी,
    पूजा सामग्री, अगरबत्ती,
    धूप, गणपति मूर्ति,
    घर का बना सामान,

    gausamvardhan categories
    "
        />

        {/* =========================
       GEO TARGET
  ========================== */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="English,Hindi" />
      </Helmet>

      {/*  CSS FIX for unwanted scrolling lines / focus highlights */}
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
      <h2
        className="
    text-2xl sm:text-3xl
    font-semibold
    text-green-700
    mb-8
    text-center
    font-poppins
    tracking-tight
  "
      >
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
                  src={cat.image || "https://via.placeholder.com/300"}
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
