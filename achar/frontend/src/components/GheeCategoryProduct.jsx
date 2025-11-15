import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import Filter from "../components/Filter";

const GheeCategoryProduct = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [mainImages, setMainImages] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    price: [0, 5000],
    rating: 0,
    stock: false,
  });

  const { addToCart } = useContext(CartContext);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `/api/ghee-products/category/${slug}`
        );
        setProducts(data);
        setFilteredProducts(data);

        // Initialize weights & main images per product
        const defaults = {};
        const images = {};
        data.forEach((product) => {
          // Default weight: first weight from pricePerGram or weightVolume
          const firstWeight = product.pricePerGram
            ? product.pricePerGram.split(",")[0].split("=")[0].trim()
            : product.weightVolume?.split(",")[0] || "";
          defaults[product._id] = firstWeight;

          images[product._id] = product.images?.[0]
            ? product.images[0].startsWith("http")
              ? product.images[0]
              : `/${product.images[0]}`
            : "https://via.placeholder.com/300";
        });
        setSelectedWeights(defaults);
        setMainImages(images);
      } catch (error) {
        console.error(error);
        setProducts([]);
        setFilteredProducts([]);
        toast.error("❌ Failed to load products");
      }
    };
    fetchProducts();
  }, [slug]);

  // Get price based on selected weight
  const getPriceByWeight = (product, weight) => {
    if (!weight) return parseFloat(product.currentPrice) || 0;

    if (product.pricePerGram) {
      const priceMap = {};
      product.pricePerGram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        priceMap[w.trim()] = parseFloat(v.trim());
      });
      return priceMap[weight] || parseFloat(product.currentPrice) || 0;
    }

    return parseFloat(product.currentPrice) || 0;
  };

  // Discount %
  const calculateDiscount = (cutPrice, selectedPrice) => {
    const cp = parseFloat(cutPrice);
    const curr = parseFloat(selectedPrice);
    if (!cp || !curr) return null;
    return Math.round(((cp - curr) / cp) * 100);
  };

  // Add to cart
  const handleAddToCart = (product) => {
    const weight = selectedWeights[product._id];
    if (!weight) return toast.error("❌ Please select a weight");
    if (!product.stock) return toast.error("❌ This product is out of stock!");

    const selectedPrice = getPriceByWeight(product, weight);

    addToCart({
      _id: product._id,
      productName: product.title,
      selectedWeight: weight,
      quantity: 1,
      selectedPrice,
      cutPrice: parseFloat(product.cutPrice) || 0,
      productImages: product.images || [],
    });

    toast.success(`🛒 ${product.title} (${weight}) added to cart!`);
  };

  // Filter products
  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      let temp = [...products];

      temp = temp.filter((product) => {
        const selectedWeight = selectedWeights[product._id];
        const price = getPriceByWeight(product, selectedWeight);

        const inPriceRange =
          price >= newFilters.price[0] && price <= newFilters.price[1];
        const inStock = newFilters.stock ? product.stock : true;
        const meetsRating = newFilters.rating
          ? (product.rating || 0) >= newFilters.rating
          : true;

        return inPriceRange && inStock && meetsRating;
      });

      setFilteredProducts(temp);
    },
    [products, selectedWeights]
  );

  if (products.length === 0)
    return <p className="text-center py-10">No products found.</p>;

  return (
    <div className="px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">
          {slug} Ghee Products
        </h2>

        {/* Mobile Filter */}
        <button
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700"
          onClick={() => setFilterOpen(true)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <div className="hidden md:block md:w-72">
          <Filter
            categories={[]}
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
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isOutOfStock = !product.stock;
            const weights = product.pricePerGram
              ? product.pricePerGram.split(",").map((p) => p.split("=")[0].trim())
              : product.weightVolume?.split(",") || [];
            const selectedWeight = selectedWeights[product._id] || weights[0] || "";
            const selectedPrice = getPriceByWeight(product, selectedWeight);

            return (
              <div
                key={product._id}
                className={`relative bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col ${
                  isOutOfStock ? "opacity-50" : ""
                }`}
              >
                {/* Discount */}
                {product.cutPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {calculateDiscount(product.cutPrice, selectedPrice)}% OFF
                  </span>
                )}

                {/* Image */}
                <Link
                  to={`/ghee-product/${product.slug}/${product._id}`}
                  className="overflow-hidden"
                >
                  <img
                    src={mainImages[product._id]}
                    alt={product.title}
                    className="w-full h-44 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </Link>

                {/* Info */}
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>

                  {/* Weights */}
                  {weights.length > 0 && (
                    <div className="flex space-x-2 mt-2 flex-wrap">
                      {weights.map((weight) => (
                        <button
                          key={weight}
                          onClick={() =>
                            setSelectedWeights((prev) => ({
                              ...prev,
                              [product._id]: weight,
                            }))
                          }
                          className={`px-2 py-1 border rounded text-xs ${
                            selectedWeight === weight
                              ? "border-yellow-600 text-yellow-600"
                              : "border-gray-300 text-gray-700"
                          }`}
                          disabled={isOutOfStock}
                        >
                          {weight} ₹{getPriceByWeight(product, weight)}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price + Add */}
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 font-bold text-sm sm:text-base">
                        {selectedPrice}₹
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
                          : "bg-yellow-600 text-white hover:bg-yellow-700"
                      }`}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GheeCategoryProduct;
