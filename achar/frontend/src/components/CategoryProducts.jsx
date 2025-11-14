import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import Filter from "./Filter";

const CategoryProducts = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  // Fetch products by category slug
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/category/${slug}`
        );
        setProducts(data);
        setFilteredProducts(data);

        // Set default selected weights
        const defaults = {};
        data.forEach((p) => {
          if (p.pricePerGram) {
            const weights = p.pricePerGram.split(",");
            defaults[p._id] = weights[0].split("=")[0].trim();
          } else {
            defaults[p._id] = p.weightOptions?.split(",")[0] || "";
          }
        });
        setSelectedWeights(defaults);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("❌ Failed to load products");
      }
    };
    fetchProducts();
  }, [slug]);

  // ✅ Memoized filter handler to prevent infinite loops
  const handleFilterChange = useCallback(
    (filters) => {
      let temp = [...products];

      if (filters.category) {
        temp = temp.filter((p) => p.category?._id === filters.category);
      }

      temp = temp.filter((p) => {
        const price =
          p.pricePerGram && p.pricePerGram.includes("=")
            ? Number(
                p.pricePerGram
                  .split(",")[0]
                  .split("=")[1]
                  .replace(/[^\d.]/g, "")
              )
            : parsePrice(p.currentPrice);
        return price >= filters.price[0] && price <= filters.price[1];
      });

      if (filters.rating > 0) {
        temp = temp.filter((p) => p.rating >= filters.rating);
      }

      if (filters.stock) {
        temp = temp.filter((p) => p.stock === true);
      }

      setFilteredProducts(temp);
    },
    [products]
  );

  const handleAddToCart = (product) => {
    if (product.stock <= 0)
      return toast.error("❌ This product is out of stock!");

    const weight = selectedWeights[product._id];
    if (!weight) return toast.error("Please select a weight first");

    let price = product.currentPrice;
    if (product.pricePerGram) {
      const priceMap = {};
      product.pricePerGram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        priceMap[w.trim()] = v.trim();
      });
      if (priceMap[weight]) price = priceMap[weight];
    }

    addToCart({ ...product, selectedWeight: weight, selectedPrice: price });
    toast.success(`🛒 ${product.productName} (${weight}) added to cart!`);
  };

  const parsePrice = (price) => {
    if (!price) return 0;
    return Number(price.replace(/[^\d.]/g, ""));
  };

  const calculateDiscount = (cutPrice, currentPrice) => {
    const cp = parsePrice(cutPrice);
    const curr = parsePrice(currentPrice);
    if (!cp || !curr) return null;
    return Math.round(((cp - curr) / cp) * 100);
  };

  return (
    <div className="px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">
          Products in {slug}
        </h2>

        {/* Mobile Filter Button */}
        <button
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
          onClick={() => setFilterOpen(true)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar Filter */}
        <div className="hidden md:block w-64 shrink-0">
          <Filter
            categories={[]} // fetch if needed
            minPrice={0}
            maxPrice={5000}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Mobile Drawer Filter */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="flex-1 bg-black bg-opacity-50"
              onClick={() => setFilterOpen(false)}
            ></div>

            <div className="w-72 max-w-sm bg-white dark:bg-gray-900 h-full shadow-lg p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setFilterOpen(false)}
                >
                  <FiX size={20} />
                </button>
              </div>
              <Filter
                categories={[]}
                minPrice={0}
                maxPrice={5000}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-600 text-center mt-10 col-span-full">
              No products found with selected filters.
            </p>
          ) : (
            filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              return (
                <div
                  key={product._id}
                  className={`relative bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col ${
                    isOutOfStock ? "opacity-50" : ""
                  }`}
                >
                  {product.cutPrice && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {calculateDiscount(
                        product.cutPrice,
                        product.currentPrice
                      )}
                      % OFF
                    </span>
                  )}

                  <Link
                    to={`/products/${slug}/${product._id}`}
                    className="overflow-hidden"
                  >
                    <img
                      src={
                        product.productImages?.[0] ||
                        "https://dummyimage.com/400x400/ccc/000.png&text=No+Image"
                      }
                      alt={product.productName}
                      className="w-full h-44 object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </Link>

                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                      {product.productName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                      {product.tasteDescription}
                    </p>

                    {product.pricePerGram && (
                      <div className="flex space-x-2 mt-2 flex-wrap">
                        {product.pricePerGram.split(",").map((p) => {
                          const weight = p.split("=")[0].trim();
                          return (
                            <button
                              key={weight}
                              onClick={() =>
                                setSelectedWeights((prev) => ({
                                  ...prev,
                                  [product._id]: weight,
                                }))
                              }
                              className={`px-2 py-1 border rounded text-xs ${
                                selectedWeights[product._id] === weight
                                  ? "border-blue-600 text-blue-600"
                                  : "border-gray-300 text-gray-700"
                              }`}
                              disabled={isOutOfStock}
                            >
                              {weight}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 font-bold text-sm sm:text-base">
                          {selectedWeights[product._id]
                            ? product.pricePerGram
                                .split(",")
                                .find((p) =>
                                  p.startsWith(selectedWeights[product._id])
                                )
                                ?.split("=")[1]
                            : product.currentPrice}
                          ₹
                        </p>
                        {product.cutPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            {product.cutPrice}₹
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm transition ${
                          isOutOfStock
                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                        disabled={isOutOfStock}
                      >
                        {isOutOfStock ? "Out of Stock" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;