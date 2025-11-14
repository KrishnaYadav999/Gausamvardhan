import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

// ---------------- Product Card ----------------
const AcharProductCard = ({ product, selectedWeight, setSelectedWeight }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleClick = () => {
    const category = product.categorySlug || "achar";
    navigate(`/products/${category}/${product._id}`);
  };

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

  const selectedPrice = getPriceByWeight(product, selectedWeight);

  const discount =
    product.cutPrice && selectedPrice
      ? Math.round(((product.cutPrice - selectedPrice) / product.cutPrice) * 100)
      : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedWeight) return toast.error("❌ Please select a weight");
    if (product.stock <= 0) return toast.error("❌ This product is out of stock!");

    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedWeight,
      quantity: 1,
      selectedPrice,
      cutPrice: parseFloat(product.cutPrice) || 0,
      productImages: product.productImages || [],
    });

    toast.success(`🛒 ${product.productName} (${selectedWeight}) added to cart!`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative border rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform cursor-pointer bg-white p-4 flex flex-col w-44 flex-shrink-0"
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-50">
          <div className="relative bg-blue-500 text-white text-[10px] font-bold px-2 py-1 shadow-md">
            {discount}% OFF
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rotate-45"></div>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="w-full h-32 mb-3 flex justify-center items-center bg-gray-50 rounded-md overflow-hidden">
        <img
          src={product.productImages?.[0]}
          alt={product.productName}
          className="max-h-28 object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium line-clamp-2 mb-2">{product.productName}</h3>

      {/* Weight Selector */}
      {product.pricePerGram && (
        <div className="flex space-x-2 mb-3 flex-wrap">
          {product.pricePerGram.split(",").map((p) => {
            const weight = p.split("=")[0].trim();
            return (
              <button
                key={weight}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWeight(weight);
                }}
                className={`px-2 py-1 border rounded text-xs ${
                  selectedWeight === weight
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-300 text-gray-700"
                }`}
                disabled={product.stock <= 0}
              >
                {weight}
              </button>
            );
          })}
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-semibold text-gray-800">₹{selectedPrice}</span>
        {product.cutPrice && product.cutPrice > selectedPrice && (
          <span className="text-sm line-through text-gray-400">₹{product.cutPrice}</span>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-auto w-full flex items-center justify-center gap-2 
        bg-gradient-to-r from-yellow-400 to-yellow-600
        text-white py-2 px-3 font-semibold text-sm 
        shadow-md hover:shadow-lg
        hover:from-yellow-500 hover:to-yellow-700
        active:scale-95 transform 
        border border-yellow-600
        transition-all duration-300 ease-in-out rounded-lg"
        disabled={product.stock <= 0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {product.stock <= 0 ? "Out of Stock" : "ADD"}
      </button>
    </div>
  );
};

// Skeleton
const AcharProductSkeleton = () => (
  <div className="border rounded-xl shadow-sm p-4 flex flex-col animate-pulse bg-white w-44 flex-shrink-0">
    <div className="h-32 mb-3 bg-gray-200 rounded-md"></div>
    <div className="h-4 mb-2 bg-gray-200 rounded w-3/4"></div>
    <div className="h-3 mb-1 bg-gray-200 rounded w-1/2"></div>
    <div className="h-8 bg-gray-200 rounded-lg mt-auto"></div>
  </div>
);

// ---------------- Product List with Slider ----------------
const AcharProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);

        const defaults = {};
        data.forEach((product) => {
          if (product.pricePerGram) {
            const firstWeight = product.pricePerGram.split(",")[0].split("=")[0].trim();
            defaults[product._id] = firstWeight;
          } else {
            defaults[product._id] = product.weightOptions?.split(",")[0] || "";
          }
        });
        setSelectedWeights(defaults);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("❌ Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="p-6 max-w-7xl lg:ml-36 relative">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Achar & Pickles</h2>
      </div>

      <div className="relative">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
        >
          &#10094;
        </button>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
        >
          &#10095;
        </button>

        {/* Scrollable Product Cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 py-2 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <AcharProductSkeleton key={i} />)
            : products.map((product) => (
                <AcharProductCard
                  key={product._id}
                  product={product}
                  selectedWeight={selectedWeights[product._id]}
                  setSelectedWeight={(weight) =>
                    setSelectedWeights((prev) => ({ ...prev, [product._id]: weight }))
                  }
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default AcharProductList;
