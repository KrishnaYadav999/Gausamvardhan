/* ---------------------------------------------------
   IMPORTS
----------------------------------------------------*/
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FaHeart, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

/* ---------------------------------------------------
    ACHAR STYLE CARD (WITH PRICE & RATING)
----------------------------------------------------*/
const AgarbattiCard = ({ product, selectedPack, updatePack }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock === false || product.stockQuantity <= 0;

  const currentPack =
    product.packs?.find((x) => x.name === selectedPack) || product.packs?.[0];

  const currentPrice = currentPack?.price || product.current_price || 0;
  const oldPrice = product.cut_price || currentPack?.oldPrice || null;

  const goToDetail = () => {
    if (!isOutOfStock)
      navigate(`/agarbatti-product/${product.slug}/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Out of stock");

    addToCart({
       ...product,
      productName: product.title,
      quantity: 1,
      selectedPrice: currentPrice,
      cutPrice: oldPrice,
      selectedPack,
      productImages: product.images,
    });

    toast.success(`${product.title} added to cart`);
  };

  return (
    <div
      onClick={goToDetail}
      className={`min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col relative ${
        isOutOfStock ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: "Inter" }}
    >
      {/* IMAGE BOX */}
      <div className="relative h-[260px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.images?.[0]}
          className={`w-full h-full object-cover absolute inset-0 transition duration-500 z-10 ${
            hovered && product.images?.[1] ? "opacity-0" : "opacity-100"
          }`}
          alt=""
        />

        {product.images?.[1] && (
          <img
            src={product.images[1]}
            className={`w-full h-full object-cover absolute inset-0 transition duration-500 z-20 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
            alt=""
          />
        )}
      </div>

      {/* OUT OF STOCK */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
            OUT OF STOCK
          </span>
        </div>
      )}

      {/* TAG */}
      {product.tag && !isOutOfStock && (
        <span className="absolute top-4 left-4 bg-[#A54B4B] text-white px-3 py-1 text-xs rounded-md shadow font-medium">
          {product.tag}
        </span>
      )}

      {/* WISHLIST */}
      {!isOutOfStock && (
        <span
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
        >
          <FaHeart size={16} className="text-gray-700" />
        </span>
      )}

      {/* DETAILS */}
      <div className="px-4 py-4 flex flex-col h-full">
        {/* Title + Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] leading-tight line-clamp-2">
            {product.title}
          </h3>

          <div className="text-right">
            <p className="text-[20px] font-bold text-gray-900">
              ₹{currentPrice}
            </p>
            {oldPrice && (
              <p className="text-[13px] text-gray-500 line-through -mt-1">
                ₹{oldPrice}
              </p>
            )}
          </div>
        </div>

        {/* ⭐ Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2 text-yellow-500 text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                size={12}
                className={
                  i < product.rating ? "text-yellow-500" : "text-gray-300"
                }
              />
            ))}
            <span className="text-gray-600 ml-1 text-xs">
              ({product.rating})
            </span>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-3">Premium Fragrance</p>

        {/* PACK SELECTOR */}
        {product.packs && (
          <select
            value={selectedPack}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updatePack(e.target.value)}
            className={`w-full border px-4 py-2 text-sm font-medium ${
              isOutOfStock
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {product.packs.map((pack) => (
              <option key={pack.name} value={pack.name}>
                {pack.name}
              </option>
            ))}
          </select>
        )}

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 font-semibold text-sm tracking-wide mt-4 ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#A54B4B] hover:bg-[#903E3E] text-white"
          }`}
        >
          {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
   SKELETON
----------------------------------------------------*/
const AgarbattiSkeleton = () => (
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
   MAIN LIST
----------------------------------------------------*/
const AgarbattiProductList = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const [selectedPack, setSelectedPack] = useState({});
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get("/api/agarbatti/all");

        const items = Array.isArray(data) ? data : [];
        setProducts(limit ? items.slice(0, limit) : items);

        const defaults = {};
        items.forEach((p) => {
          if (p.packs?.length > 0) defaults[p._id] = p.packs[0].name;
        });

        setSelectedPack(defaults);
      } catch {
        toast.error("Failed to load Agarbatti products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [limit]);

  const scrollLeft = () =>
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });

  const scrollRight = () =>
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="p-6 relative" style={{ fontFamily: "Inter" }}>
      <Toaster />

      {/* HERO */}
      {/* HERO + WAVE */}
      <div className="relative w-full mb-6">
        <div className="relative w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[160px] overflow-hidden">
          <svg
            viewBox="0 0 1440 320"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            style={{ opacity: 0.4 }}
          >
            <path
              fill="#F7E1E1"
              d="M0,256L48,229.3C96,203,192,149,288,149.3C384,149,480,203,576,224C672,245,768,235,864,218.7C960,203,1056,181,1152,149.3C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* TITLE + IMAGE + BUTTON */}
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src="https://res.cloudinary.com/dtvihyts8/image/upload/v1764356460/Gemini_Generated_Image_r8u5ldr8u5ldr8u5-removebg-preview_1_zjsqje.png"
              alt="Achar Icon"
              className="
          h-20 w-20
          sm:h-24 sm:w-24
          md:h-28 md:w-28
          lg:h-32 lg:w-32
          object-contain
          transition-transform
          duration-300
          hover:scale-105
        "
            />

            <h2
              className="
          text-2xl font-extrabold 
          text-[#A74B4B]
          sm:text-3xl
          md:text-4xl
        "
              style={{ fontFamily: "Playfair Display" }}
            >
              Pooja Essentials
            </h2>
          </div>

          <button
            className="
        bg-[#BF5757] hover:bg-[#A94848]
        text-white rounded-md font-semibold shadow-md
        px-3 py-1 text-[10px]
        sm:px-4 sm:py-1.5 sm:text-[12px]
        md:px-5 md:py-2 md:text-[13px]
        lg:px-6 lg:py-2 lg:text-[14px]
        transition-all
      "
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
            <AgarbattiSkeleton key={index} />
          ) : (
            <div key={item._id} className="snap-start w-[280px] h-full">
              <AgarbattiCard
                product={item}
                selectedPack={selectedPack[item._id]}
                updatePack={(p) =>
                  setSelectedPack((prev) => ({ ...prev, [item._id]: p }))
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AgarbattiProductList;
