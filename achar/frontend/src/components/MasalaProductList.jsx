import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

// ---------------- Product Card ----------------
const MasalaProductCard = ({ product, selectedWeight, setSelectedWeight }) => {
  const { addToCart } = useContext(CartContext);

  const getPriceByWeight = (product, weight) => {
    if (!weight) return parseFloat(product.current_price) || 0;

    if (product.pricepergram) {
      const priceMap = {};
      product.pricepergram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        priceMap[w.trim()] = parseFloat(v.trim());
      });
      return priceMap[weight] || parseFloat(product.current_price) || 0;
    }

    return parseFloat(product.current_price) || 0;
  };

  const selectedPrice = getPriceByWeight(product, selectedWeight);

  const discount =
    product.cut_price && selectedPrice
      ? Math.round(((parseFloat(product.cut_price) - selectedPrice) / parseFloat(product.cut_price)) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!selectedWeight) return toast.error("❌ Please select a weight");
    if (!product.stock) return toast.error("❌ This product is out of stock!");

    addToCart({
      _id: product._id,
      productName: product.title,
      selectedWeight,
      quantity: 1,
      selectedPrice,
      cutPrice: parseFloat(product.cut_price) || 0,
      productImages: product.images || [],
    });

    toast.success(`🛒 ${product.title} (${selectedWeight}) added to cart!`);
  };

  return (
    <div
      className="relative border rounded-xl h-[350px] sm:h-[380px] md:h-[420px] lg:h-[420px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform cursor-pointer bg-white p-4 flex flex-col w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0"
    >
      {discount > 0 && (
        <div className="absolute top-2 left-2 z-50">
          <div className="relative bg-yellow-600 text-white text-[10px] font-bold px-2 py-1 shadow-md">
            {discount}% OFF
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-600 rotate-45"></div>
          </div>
        </div>
      )}

      <div className="w-full h-48 lg:h-56 mb-4 flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden">
        <Link to={`/masala-product/${product.slug}/${product._id}`}>
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="max-h-48 lg:max-h-56 object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>

      <h3 className="text-base lg:text-md font-medium line-clamp-2 mb-3">
        <Link
          to={`/masala-product/${product.slug}/${product._id}`}
          className="hover:text-yellow-700 transition-colors duration-200"
        >
          {product.title}
        </Link>
      </h3>

      {product.pricepergram && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
          {product.pricepergram.split(",").map((p) => {
            const weight = p.split("=")[0].trim();
            return (
              <button
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  selectedWeight === weight
                    ? "border-yellow-700 text-yellow-700 bg-yellow-50"
                    : "border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900"
                }`}
                disabled={!product.stock}
              >
                {weight}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-semibold text-gray-800">₹{selectedPrice}</span>
        {product.cut_price && parseFloat(product.cut_price) > selectedPrice && (
          <span className="text-sm line-through text-gray-400">₹{product.cut_price}</span>
        )}
      </div>

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
        disabled={!product.stock}
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

// ---------------- Skeleton Loader ----------------
const MasalaProductSkeleton = () => (
  <div className="border rounded-xl shadow-sm p-4 flex flex-col animate-pulse bg-white w-44 flex-shrink-0">
    <div className="h-32 mb-3 bg-gray-200 rounded-md"></div>
    <div className="h-4 mb-2 bg-gray-200 rounded w-3/4"></div>
    <div className="h-3 mb-1 bg-gray-200 rounded w-1/2"></div>
    <div className="h-8 bg-gray-200 rounded-lg mt-auto"></div>
  </div>
);

// ---------------- Product List ----------------
const MasalaProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // ⭐ Animated Title List
  const animatedTitlesMasala = ["Masala", "मसाला", "Spices", "मसाले"];
  const [titleIndex, setTitleIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // ⭐ Animation Logic (every 5 sec)
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % animatedTitlesMasala.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/masala-products");
        setProducts(data);

        const defaults = {};
        data.forEach((product) => {
          if (product.pricepergram) {
            const first = product.pricepergram.split(",")[0].split("=")[0].trim();
            defaults[product._id] = first;
          } else {
            defaults[product._id] = "";
          }
        });
        setSelectedWeights(defaults);
      } catch (err) {
        toast.error("❌ Masala products load failed");
      } finally {
        setLoading(false);
      }
    };
    load();
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

      {/* ⭐ Smooth Animated Heading */}
      <h2
        className={`text-2xl font-bold transition-all duration-500 ease-in-out transform mb-6 ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        <span className="font-[cursive] text-yellow-700">
          {animatedTitlesMasala[titleIndex]}
        </span>{" "}
        Products
      </h2>

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

        {/* Product Row */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 py-2 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <MasalaProductSkeleton key={i} />)
            : products.map((product) => (
                <MasalaProductCard
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

export default MasalaProductList;
