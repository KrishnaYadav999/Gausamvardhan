/* ---------------------------------------------------
    IMPORTS
----------------------------------------------------*/
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ---------------------------------------------------
    CARD COMPONENT (Ganpati Style)
----------------------------------------------------*/
const GheeProductCard = ({ product, selectedWeight, updateWeight }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const getPriceByWeight = (weight) => {
    const base = parseFloat(product.currentPrice || 0);
    const cut = parseFloat(product.cutPrice || 0);

    if (!product.pricePerGram) return base;

    const map = {};
    const cutMap = {};
    product.pricePerGram.split(",").forEach((p) => {
      const [w, v] = p.split("=");
      if (w && v) map[w.trim()] = parseFloat(v.trim());
      // optional: cutPrice per weight (if you store it in "weight=cutPrice")
      if (w && cut) cutMap[w.trim()] = cut;
    });

    return map[weight] || base;
  };

  const currentPrice = getPriceByWeight(selectedWeight);
  const cutPrice = parseFloat(product.cutPrice || 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    addToCart({
       ...product,
      productName: product.title,
      selectedWeight,
      quantity: 1,
      selectedPrice: currentPrice,
      cutPrice: cutPrice,
      productImages: product.images,
    });

    toast.success(`${product.title} added to cart`);
  };

  const goToDetail = () => {
    navigate(`/ghee-product/${product.slug}/${product._id}`);
  };

  const avgRating =
    product?.reviews?.length > 0
      ? (
          product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          product.reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div
      onClick={goToDetail}
      className="min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col relative"
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

        {/* HEART */}
        <span
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
        >
          <FaHeart size={16} className="text-green-700" />
        </span>
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] leading-tight line-clamp-2">
            {product.title}
          </h3>
          <div className="flex flex-col items-end">
            {cutPrice > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ₹{cutPrice}
              </span>
            )}
            <p className="text-[20px] font-bold text-green-700">
              ₹{currentPrice}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Pure Bilona Ghee • A2 Quality
        </p>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-green-700 text-lg">★</span>
          <span className="text-sm font-semibold text-gray-800">
            {avgRating}
          </span>
          <span className="text-xs text-gray-500">
            ({product?.reviews?.length || 0}+)
          </span>
        </div>

        {product.pricePerGram && (
          <select
            value={selectedWeight}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateWeight(e.target.value)}
            className="w-full border px-4 py-2 text-sm font-medium text-gray-700 border-gray-300"
          >
            {product.pricePerGram.split(",").map((i) => {
              const weight = i.split("=")[0].trim();
              return (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              );
            })}
          </select>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full py-3 font-semibold text-sm tracking-wide mt-4 bg-green-700 hover:bg-green-800 text-white"
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
      <div className="h-4 bg-gray-300 w-3/4"></div>
      <div className="h-3 bg-gray-300 w-1/2"></div>
      <div className="h-10 bg-gray-300 rounded-lg"></div>
    </div>
  </div>
);

/* ---------------------------------------------------
    MAIN + HERO BANNER + SLIDER (Ganpati Style)
----------------------------------------------------*/
const GheeProductList = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/ghee-products");
        const items = Array.isArray(data) ? data : data.products;

        setProducts(limit ? items.slice(0, limit) : items);

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
  }, [limit]);

  const scrollLeft = () =>
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });

  const scrollRight = () =>
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="p-6 relative" style={{ fontFamily: "Inter" }}>
     

       <div className="relative w-full mb-6">
             {/* Full Background Image */}
             <div
               className="
           relative w-full 
           h-[120px] sm:h-[140px] md:h-[160px] lg:h-[170px]
           bg-cover bg-center
         "
               style={{
                 backgroundImage:
                   "url('https://res.cloudinary.com/dtvihyts8/image/upload/v1765003639/Untitled_design_1_jcllwz.png')",
                 backgroundPosition: "center top",
               }}
             ></div>
     
             {/* CONTENT - Image + Title + Button */}
             <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6">
               {/* Product Icon + Title */}
               <div className="flex items-center gap-3 sm:gap-4 drop-shadow-xl">
                 <h2
                   className="
               text-xl sm:text-2xl md:text-3xl lg:text-4xl 
               font-extrabold text-emerald-500 drop-shadow-lg
             "
                   style={{ fontFamily: "Playfair Display" }}
                 >
                   Ghee
                 </h2>
               </div>
     
               {/* Shop More Button */}
               <button
                 className="
             bg-green-600/90 hover:bg-green-700
             text-white rounded-full font-semibold shadow-lg
             px-3 py-1
             sm:px-4 sm:py-1.5
             md:px-5 md:py-2
             transition-all
             text-[10px] sm:text-[12px]
           "
                 style={{ fontFamily: "Poppins" }}
               >
                 Shop More →
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
            <GheeProductSkeleton key={index} />
          ) : (
            <div key={item._id} className="snap-start w-[280px] h-full">
              <GheeProductCard
                product={item}
                selectedWeight={selectedWeights[item._id]}
                updateWeight={(w) =>
                  setSelectedWeights((p) => ({ ...p, [item._id]: w }))
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
