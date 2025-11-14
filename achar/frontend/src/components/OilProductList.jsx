import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

// ---------------- Product Card ----------------
const OilProductCard = ({ product, selectedVolume, setSelectedVolume }) => {
  const { addToCart } = useContext(CartContext);

  // ✅ Price for selected volume
  const getPriceByVolume = (product, volume) => {
    if (!volume) return parseFloat(product.currentPrice) || 0;

    if (product.perPriceLiter?.length) {
      const found = product.perPriceLiter.find((p) => p.volume === volume);
      return found ? parseFloat(found.price) : parseFloat(product.currentPrice) || 0;
    }

    return parseFloat(product.currentPrice) || 0;
  };

  const selectedPrice = getPriceByVolume(product, selectedVolume);

  const discount =
    product.cutPrice && selectedPrice
      ? Math.round(((product.cutPrice - selectedPrice) / product.cutPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!selectedVolume) return toast.error("❌ Please select a volume");
    if (product.stock <= 0) return toast.error("❌ This product is out of stock!");

    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedVolume,
      quantity: 1,
      selectedPrice,
      cutPrice: parseFloat(product.cutPrice) || 0,
      productImages: product.productImages || [],
    });

    toast.success(`🛒 ${product.productName} (${selectedVolume}) added to cart!`);
  };

  return (
    <div className="relative border rounded-xl shadow-sm hover:shadow-lg transition bg-white p-4 flex flex-col w-44 flex-shrink-0">
      {/* ✅ Offer Badge (styled like Ghee UI) */}
      {discount > 0 && (
        <div className="absolute top-2 left-2">
          <div className="relative bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 shadow-md">
            {discount}% OFF
            <div className="absolute -bottom-1 left-0 w-full h-1 flex">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rotate-45 -ml-[2px]"></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="w-full h-32 mb-3 flex justify-center items-center">
        <Link to={`/oil-product/${product.slug}/${product._id}`}>
          <img
            src={product.productImages?.[0] || "https://via.placeholder.com/150"}
            alt={product.productName}
            className="max-h-28 object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* Product Name */}
      <h3 className="text-sm font-medium line-clamp-2 mb-2">
        <Link
          to={`/oil-product/${product.slug}/${product._id}`}
          className="hover:text-yellow-600"
        >
          {product.productName}
        </Link>
      </h3>

      {/* Volume Selector */}
      {product.perPriceLiter && product.perPriceLiter.length > 0 && (
        <div className="flex space-x-2 mb-1 flex-wrap">
          {product.perPriceLiter.map((p) => (
            <button
              key={p.volume}
              onClick={() => setSelectedVolume(p.volume)}
              className={`px-2 py-1 border rounded text-xs ${
                selectedVolume === p.volume
                  ? "border-yellow-600 text-yellow-600"
                  : "border-gray-300 text-gray-700"
              }`}
              disabled={product.stock <= 0}
            >
              {p.volume}
            </button>
          ))}
        </div>
      )}

      {/* Price Section */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-semibold text-gray-800">₹{selectedPrice}</span>
        {product.cutPrice && product.cutPrice > selectedPrice && (
          <span className="text-sm line-through text-gray-400">₹{product.cutPrice}</span>
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

// ---------------- Skeleton Loader ----------------
const OilProductSkeleton = () => (
  <div className="border rounded-xl shadow-sm p-4 flex flex-col animate-pulse bg-white w-44 flex-shrink-0">
    <div className="h-32 mb-3 bg-gray-200 rounded-md"></div>
    <div className="h-4 mb-2 bg-gray-200 rounded w-3/4"></div>
    <div className="h-3 mb-1 bg-gray-200 rounded w-1/2"></div>
    <div className="h-8 bg-gray-200 rounded-lg mt-auto"></div>
  </div>
);

// ---------------- Product List with Slider ----------------
const OilProductList = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedVolumes, setSelectedVolumes] = useState({});
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:5000/api/oils";
        if (slug) url = `http://localhost:5000/api/oils/category/${slug}`;

        const { data } = await axios.get(url);
        setProducts(data);

        // Default volume selection
        const defaults = {};
        data.forEach((product) => {
          if (product.perPriceLiter?.length) {
            defaults[product._id] = product.perPriceLiter[0].volume;
          }
        });
        setSelectedVolumes(defaults);
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

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
        <h2 className="text-2xl font-bold capitalize">
          {slug ? `${slug} Oil Products` : "Oil Products"}
        </h2>
      </div>

      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
        >
          &#10094;
        </button>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
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
            ? Array.from({ length: 12 }).map((_, i) => <OilProductSkeleton key={i} />)
            : products.map((product) => (
                <OilProductCard
                  key={product._id}
                  product={product}
                  selectedVolume={selectedVolumes[product._id]}
                  setSelectedVolume={(volume) =>
                    setSelectedVolumes((prev) => ({ ...prev, [product._id]: volume }))
                  }
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default OilProductList;
