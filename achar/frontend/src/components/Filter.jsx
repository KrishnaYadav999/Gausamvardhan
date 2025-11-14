import React, { useState, useEffect } from "react";
import { FaStar, FaChevronDown } from "react-icons/fa";
import { FiBox } from "react-icons/fi";

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

  // Accordion open/close states
  const [openSection, setOpenSection] = useState("category");

  // 🔑 Sync with parent only when filter states change
  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      price: priceRange,
      rating: minRating,
      stock: inStockOnly,
    });
  }, [selectedCategory, priceRange, minRating, inStockOnly, onFilterChange]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("");
    setPriceRange([minPrice, maxPrice]);
    setMinRating(0);
    setHoverRating(0);
    setInStockOnly(false);
  };

  return (
    <div className="w-full md:w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 space-y-5 border border-gray-200 dark:border-gray-800 sticky top-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Filters
        </h2>
        <button
          onClick={resetFilters}
          className="text-sm text-orange-500 hover:underline"
        >
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() =>
            setOpenSection(openSection === "category" ? "" : "category")
          }
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Categories
          </h3>
          <FaChevronDown
            className={`transition-transform ${
              openSection === "category" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "category" && (
          <div className="mt-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div>
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() =>
            setOpenSection(openSection === "price" ? "" : "price")
          }
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Price Range
          </h3>
          <FaChevronDown
            className={`transition-transform ${
              openSection === "price" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "price" && (
          <div className="mt-3">
            <div className="relative w-full h-12 flex items-center">
              {/* Track */}
              <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              {/* Selected Range */}
              <div
                className="absolute h-2 bg-orange-500 rounded-lg"
                style={{
                  left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                  right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                }}
              ></div>
              {/* Min Slider */}
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([
                    Math.min(Number(e.target.value), priceRange[1] - 100),
                    priceRange[1],
                  ])
                }
                className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
              />
              {/* Max Slider */}
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Math.max(Number(e.target.value), priceRange[0] + 100),
                  ])
                }
                className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div>
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() =>
            setOpenSection(openSection === "rating" ? "" : "rating")
          }
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Minimum Rating
          </h3>
          <FaChevronDown
            className={`transition-transform ${
              openSection === "rating" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "rating" && (
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setMinRating(star)}
                className={`cursor-pointer transition ${
                  (hoverRating || minRating) >= star
                    ? "text-orange-500 scale-110"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        )}
        {minRating > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {minRating} stars & up
          </p>
        )}
      </div>

      {/* Stock Filter */}
      <div>
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() =>
            setOpenSection(openSection === "stock" ? "" : "stock")
          }
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Stock
          </h3>
          <FaChevronDown
            className={`transition-transform ${
              openSection === "stock" ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSection === "stock" && (
          <div className="mt-3">
            <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              <FiBox /> In Stock Only
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;