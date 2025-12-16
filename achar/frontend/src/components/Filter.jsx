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
  }, [selectedCategory, priceRange, minRating, inStockOnly, onFilterChange]);

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
    transition: { duration: 0.3 },
  };

  return (
    <motion.div className="w-full md:w-72 bg-white rounded-2xl shadow-xl p-6 space-y-6 sticky top-20">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Filters</h2>
        <button onClick={resetFilters} className="text-orange-500 text-sm">
          Reset
        </button>
      </div>

      {/* CATEGORY */}
      <div>
        <button
          className="flex justify-between w-full"
          onClick={() =>
            setOpenSection(openSection === "category" ? "" : "category")
          }
        >
          <h3 className="font-semibold">Category</h3>
          <FaChevronDown
            className={openSection === "category" ? "rotate-180" : ""}
          />
        </button>

        <AnimatePresence>
          {openSection === "category" && (
            <motion.div {...sectionAnimation} className="mt-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PRICE */}
      <div>
        <button
          className="flex justify-between w-full"
          onClick={() =>
            setOpenSection(openSection === "price" ? "" : "price")
          }
        >
          <h3 className="font-semibold">Price</h3>
          <FaChevronDown
            className={openSection === "price" ? "rotate-180" : ""}
          />
        </button>

        <AnimatePresence>
          {openSection === "price" && (
            <motion.div {...sectionAnimation} className="mt-3">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([+e.target.value, priceRange[1]])
                }
                className="w-full"
              />
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], +e.target.value])
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RATING */}
      <div>
        <button
          className="flex justify-between w-full"
          onClick={() =>
            setOpenSection(openSection === "rating" ? "" : "rating")
          }
        >
          <h3 className="font-semibold">Rating</h3>
          <FaChevronDown
            className={openSection === "rating" ? "rotate-180" : ""}
          />
        </button>

        <AnimatePresence>
          {openSection === "rating" && (
            <motion.div {...sectionAnimation} className="flex gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar
                  key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setMinRating(s)}
                  className={`cursor-pointer ${
                    (hoverRating || minRating) >= s
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* STOCK */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          <FiBox /> In stock only
        </label>
      </div>
    </motion.div>
  );
};

export default Filter;
