import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

const handleCategoryClick = (cat) => {
  const nameLower = cat.name.toLowerCase();

  if (nameLower.includes("ghee")) {
    navigate(`/ghee/${cat.slug}`);
  } else if (nameLower.includes("masala")) {
    navigate(`/masala-category/${cat.slug}`);
  }else if (nameLower.includes("oil")) {
  navigate(`/oil/category/${cat.slug}`);
}
   else {
    navigate(`/achar-category/${cat.slug}`);
  }
};

  return (
    <div className="px-6 py-12 lg:ml-40">
      <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat)}
            className="relative group cursor-pointer overflow-hidden rounded-2xl 
                       bg-white/60 backdrop-blur-lg border border-gray-300/40 
                       shadow-md hover:shadow-xl transition-all duration-500"
          >
            {/* Image */}
            <div className="w-full h-36 sm:h-40 md:h-44 overflow-hidden rounded-2xl">
              <img
                src={cat.image || "https://via.placeholder.com/300"}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition duration-500"></div>

            {/* Category Name */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white font-semibold text-sm sm:text-base drop-shadow-md group-hover:scale-105 transition-transform">
                {cat.name}
              </p>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-yellow-400/70 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] transition-all duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;