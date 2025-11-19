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
    CARD COMPONENT
----------------------------------------------------*/
const GheeProductCard = ({ product, selectedWeight, setSelectedWeight }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const getPriceByWeight = (product, weight) => {
    if (!product) return 0;
    const basePrice = parseFloat(product?.currentPrice || 0);
    if (!weight) return basePrice;

    if (product?.pricePerGram) {
      const map = {};
      product.pricePerGram.split(",").forEach((p) => {
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
      cutPrice: product.cutPrice || 0,
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
    navigate(`/ghee-product/${product.slug}/${product._id}`);
  };

  return (
    <div
      onClick={navigateToProduct}
      className="min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: 'Inter' }}
    >
      {/* IMAGE */}
      <div className="relative h-[260px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.images?.[0]}
          className={`w-full h-full object-contain absolute inset-0 transition duration-500 ${
            hovered && product.images?.[1] ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {product.images?.[1] && (
          <img
            src={product.images[1]}
            className={`w-full h-full object-contain absolute inset-0 transition duration-500 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        <span
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
        >
          <FaHeart size={16} className="text-green-600" />
        </span>
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="text-[20px] font-bold text-green-700">₹{selectedPrice}</p>
        </div>

        <p className="text-sm text-gray-600 mb-3">Pure Bilona Ghee • A2 Quality</p>

        <div className="flex items-center gap-1 mb-4">
          <span className="text-green-600 text-lg">★</span>
          <span className="text-sm font-semibold text-gray-800">{avgRating}</span>
          <span className="text-xs text-gray-500">
            ({product?.reviews?.length || 0}+)
          </span>
        </div>

        {product.pricePerGram && (
          <select
            value={selectedWeight}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium 
                       text-gray-700 focus:ring-2 focus:ring-green-500"
          >
            {product.pricePerGram.split(',').map((item) => {
              const weight = item.split('=')[0].trim();
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
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold 
                     text-sm tracking-wide hover:bg-green-700 active:scale-95 mt-4 transition"
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
const GheeProductSkeleton = () => (
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
    MAIN + SLIDER
----------------------------------------------------*/
const GheeProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/ghee-products");
        const items = Array.isArray(data) ? data : data.products;

        setProducts(items);

        const defaults = {};
        items.forEach((p) => {
          if (p.pricePerGram) {
            defaults[p._id] = p.pricePerGram.split(",")[0].split("=")[0].trim();
          }
        });

        setSelectedWeights(defaults);
      } catch {
        toast.error("Failed to load Ghee products");
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
    <div className="p-6 relative">
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
              fill="#D1FAE5"
              d="M0,96L80,117.3C160,139,320,181,480,176C640,171,800,117,960,90.7C1120,64,1280,64,1360,64L1440,64V320H0Z"
            ></path>
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-6">
          <h2
            className="text-4xl font-bold text-green-700"
            style={{ fontFamily: "Playfair Display" }}
          >
            Desi Ghee
          </h2>

          <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow">
            Shop More
          </button>
        </div>
      </div>

      {/* SLIDER BUTTONS */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-20 border border-green-200 hover:bg-green-50"
      >
        <FaChevronLeft className="text-green-700" />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-3 rounded-full z-20 border border-green-200 hover:bg-green-50"
      >
        <FaChevronRight className="text-green-700" />
      </button>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-4 snap-x snap-mandatory whitespace-nowrap"
      >
        {(loading ? [...Array(6)] : products).map((item, index) =>
          loading ? (
            <GheeProductSkeleton key={index} />
          ) : (
            <div key={item._id} className="snap-start w-[280px] h-full">
              <GheeProductCard
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

export default GheeProductList;
