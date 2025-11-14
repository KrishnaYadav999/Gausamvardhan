import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

// ---------------- Product Card ----------------
const MasalaProductCard = ({ product, selectedWeight, setSelectedWeight }) => {
  const { addToCart } = useContext(CartContext);

  // ✅ Price by selected weight
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
      ? Math.round(
          ((parseFloat(product.cut_price) - selectedPrice) /
            parseFloat(product.cut_price)) *
            100
        )
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
    <div className="relative border rounded-xl shadow-sm hover:shadow-lg transition bg-white p-4 flex flex-col w-44 flex-shrink-0">
      {/* ✅ Offer Badge (unchanged UI) */}
      {discount > 0 && (
        <div className="absolute top-2 left-2">
          <div className="relative bg-blue-500 text-white text-[10px] font-bold px-2 py-1 shadow-md">
            {discount}% OFF
            <div className="absolute -bottom-1 left-0 w-full h-1 flex">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rotate-45 -ml-[2px]"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image & Title */}
      <Link
        to={`/masala-product/${product.slug}/${product._id}`}
        className="flex flex-col items-center mb-2"
      >
        <div className="w-full h-32 mb-3 flex justify-center items-center">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="max-h-28 object-contain"
          />
        </div>
        <h3 className="text-sm font-medium line-clamp-2 text-center">{product.title}</h3>
      </Link>

      {/* Weight Selector */}
      {product.pricepergram && (
        <div className="flex space-x-2 mb-1 flex-wrap">
          {product.pricepergram.split(",").map((p) => {
            const weight = p.split("=")[0].trim();
            return (
              <button
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={`px-2 py-1 border rounded text-xs ${
                  selectedWeight === weight
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-300 text-gray-700"
                }`}
                disabled={!product.stock}
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
        {product.cut_price && parseFloat(product.cut_price) > selectedPrice && (
          <span className="text-sm line-through text-gray-400">
            ₹{product.cut_price}
          </span>
        )}
      </div>

      {/* Add to Cart */}
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
        {!product.stock ? "Out of Stock" : "ADD"}
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/masala-products");
        setProducts(data);

        // Default weight
        const defaults = {};
        data.forEach((product) => {
          if (product.pricepergram) {
            const firstWeight = product.pricepergram.split(",")[0].split("=")[0].trim();
            defaults[product._id] = firstWeight;
          }
        });
        setSelectedWeights(defaults);
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load masala products");
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
    <div className="p-6 lg:ml-36 relative">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Masala</h2>
      </div>

      <div className="relative">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
          bg-white/50 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
        >
          &#10094;
        </button>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
          bg-white/50 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
        >
          &#10095;
        </button>

        {/* Scrollable Product Row */}
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
