/* ---------------------------------------------------
    IMPORTS
----------------------------------------------------*/
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ---------------------------------------------------
    PRODUCT CARD (Masala)
----------------------------------------------------*/
const MasalaProductCard = ({ product, selectedWeight, setSelectedWeight }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  // price logic
  const getPriceByWeight = (product, weight) => {
    if (!product) return 0;

    const basePrice = parseFloat(product?.current_price || 0);
    if (!weight) return basePrice;

    if (product?.pricepergram) {
      const map = {};
      product.pricepergram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        if (w && v) map[w.trim()] = parseFloat(v.trim());
      });
      return map[weight] || basePrice;
    }

    return basePrice;
  };

  const selectedPrice = getPriceByWeight(product, selectedWeight);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedWeight) return toast.error("Please select weight");

    addToCart({
      _id: product._id,
      productName: product.title,
      selectedWeight,
      quantity: 1,
      selectedPrice,
      cutPrice: product.cut_price || 0,
      productImages: product.images || [],
    });

    toast.success(`${product.title} added to cart`);
  };

  const avgRating =
    product?.reviews?.length > 0
      ? (
          product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          product.reviews.length
        ).toFixed(1)
      : "0.0";

  const navigateToProduct = () => {
    const slug = product.slug || "masala";
    navigate(`/masala-product/${slug}/${product._id}`);
  };

  return (
    <div
      onClick={navigateToProduct}
      className="min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: "Inter" }}
    >
      {/* IMAGE */}
      <div className="relative h-[260px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.images?.[0]}
          className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
            hovered && product.images?.[1] ? "opacity-0" : "opacity-100"
          }`}
        />

        {product.images?.[1] && (
          <img
            src={product.images[1]}
            className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {product.tag && (
          <span className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 text-xs rounded-md shadow font-medium">
            {product.tag}
          </span>
        )}

        <span
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
        >
          <FaHeart size={16} className="text-gray-700" />
        </span>
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="text-[20px] font-bold text-gray-900">₹{selectedPrice}</p>
        </div>

        <p className="text-sm text-gray-500 mb-3">Premium spices • Freshly ground</p>

        <div className="flex items-center gap-1 mb-4">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="text-sm font-semibold text-gray-800">{avgRating}</span>
          <span className="text-xs text-gray-500">
            ({product?.reviews?.length || 0}+)
          </span>
        </div>

        {product.pricepergram && (
          <select
            value={selectedWeight}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700"
          >
            {product.pricepergram.split(",").map((item) => {
              const weight = item.split("=")[0].trim();
              return (
                <option value={weight} key={weight}>
                  {weight}
                </option>
              );
            })}
          </select>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold text-sm tracking-wide hover:bg-green-800 mt-4"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
    SKELETON
----------------------------------------------------*/
const MasalaProductSkeleton = () => (
  <div className="min-w-[280px] bg-white rounded-2xl border shadow-sm animate-pulse">
    <div className="h-[260px] bg-gray-200 rounded-t-2xl"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 w-3/4"></div>
      <div className="h-3 bg-gray-200 w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

/* ---------------------------------------------------
    MAIN LIST + SLIDER
----------------------------------------------------*/
const MasalaProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/masala-products");

        setProducts(data);

        const defaults = {};
        data.forEach((p) => {
          if (p.pricepergram) {
            defaults[p._id] = p.pricepergram.split(",")[0].split("=")[0].trim();
          }
        });

        setSelectedWeights(defaults);
      } catch {
        toast.error("Failed to load masala products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const scrollLeft = () =>
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });

  const scrollRight = () =>
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="p-6 relative" style={{ fontFamily: "Inter" }}>
      <Toaster />

      {/* HERO SECTION */}
      <div className="relative w-full mb-10">
        <div className="w-full h-[150px] overflow-hidden relative">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full absolute top-0 left-0"
            preserveAspectRatio="none"
          >
            <path
              fill="#D6F8E4"
              fillOpacity="1"
              d="M0,96L60,101.3C120,107,240,117,360,138.7C480,160,600,192,720,202.7C840,213,960,203,1080,165.3C1200,128,1320,64,1380,32L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-6">
          <h2
            className="text-4xl font-bold text-green-700"
            style={{
              fontFamily: "Playfair Display",
              letterSpacing: "0.5px",
            }}
          >
            Masala & Spices
          </h2>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow"
          >
            Shop More
          </button>
        </div>
      </div>

      {/* SLIDER BUTTONS */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-20"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-20"
      >
        <FaChevronRight />
      </button>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-4 snap-x snap-mandatory whitespace-nowrap"
        style={{ scrollBehavior: "smooth" }}
      >
        {(loading ? [...Array(6)] : products).map((item, index) =>
          loading ? (
            <MasalaProductSkeleton key={index} />
          ) : (
            <div key={item._id} className="snap-start w-[280px] h-full">
              <MasalaProductCard
                product={item}
                selectedWeight={selectedWeights[item._id]}
                setSelectedWeight={(w) =>
                  setSelectedWeights((prev) => ({ ...prev, [item._id]: w }))
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MasalaProductList;
