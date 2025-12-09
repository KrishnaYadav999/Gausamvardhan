import React, { useState, useEffect } from "react";
import { FaStar, FaChevronDown } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Filter = ({
  categories = [],
  minPrice = 0,
  maxPrice = 5000,
  onFilterChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [minRating, setMinRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [openSection, setOpenSection] = useState("category");

  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      price: priceRange,
      rating: minRating,
      stock: inStockOnly,
    });
  }, [selectedCategory, priceRange, minRating, inStockOnly]);

  const resetFilters = () => {
    setSelectedCategory("");
    setPriceRange([minPrice, maxPrice]);
    setMinRating(0);
    setHoverRating(0);
    setInStockOnly(false);
  };

  const sectionAnimation = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.35, ease: "easeInOut" },
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full md:w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-6 border border-gray-200 dark:border-gray-800 sticky top-20"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">Filters</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={resetFilters}
          className="text-sm text-orange-500 hover:underline"
        >
          Reset
        </motion.button>
      </div>

      {/* Category */}
      <div>
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() => setOpenSection(openSection === "category" ? "" : "category")}
        >
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Categories</h3>
          <FaChevronDown className={`transition-transform ${openSection === "category" ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {openSection === "category" && (
            <motion.div {...sectionAnimation} className="mt-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 transition"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price */}
      <div>
        <button
          className="flex justify-between items-center w-full"
          onClick={() => setOpenSection(openSection === "price" ? "" : "price")}
        >
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Price Range</h3>
          <FaChevronDown className={`transition-transform ${openSection === "price" ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {openSection === "price" && (
            <motion.div {...sectionAnimation} className="mt-3">
              <div className="relative h-10">
                <div className="absolute w-full h-2 bg-gray-300 rounded-full"></div>
                <div
                  className="absolute h-2 bg-orange-500 rounded-full"
                  style={{
                    left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  }}
                ></div>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 100), priceRange[1]])
                  }
                  className="absolute w-full range-thumb cursor-pointer bg-transparent"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 100)])
                  }
                  className="absolute w-full range-thumb cursor-pointer bg-transparent"
                />
              </div>

              <div className="flex justify-between mt-2 text-gray-600 dark:text-gray-400 text-sm">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating */}
      <div>
        <button
          className="flex justify-between items-center w-full"
          onClick={() => setOpenSection(openSection === "rating" ? "" : "rating")}
        >
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Minimum Rating</h3>
          <FaChevronDown className={`transition-transform ${openSection === "rating" ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {openSection === "rating" && (
            <motion.div {...sectionAnimation} className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div key={star} whileHover={{ scale: 1.2 }}>
                  <FaStar
                    size={22}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setMinRating(star)}
                    className={`cursor-pointer transition ${
                      (hoverRating || minRating) >= star
                        ? "text-orange-500"
                        : "text-gray-400 dark:text-gray-600"
                    }`}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {minRating > 0 && (
          <p className="text-sm text-gray-500 mt-1">{minRating} Stars & Up</p>
        )}
      </div>

      {/* Stock */}
      <div>
        <button
          className="flex justify-between items-center w-full"
          onClick={() => setOpenSection(openSection === "stock" ? "" : "stock")}
        >
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Stock</h3>
          <FaChevronDown className={`transition-transform ${openSection === "stock" ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {openSection === "stock" && (
            <motion.div {...sectionAnimation} className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <FiBox /> In Stock Only
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Filter;
