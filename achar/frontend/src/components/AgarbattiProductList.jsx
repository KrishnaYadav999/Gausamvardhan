// AgarbattiProductList.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ---------------------------------------------------
    CARD COMPONENT
----------------------------------------------------*/
const AgarbattiCard = ({ product, selectedPack, setSelectedPack }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [hovered, setHovered] = useState(false);
  const isOutOfStock = !product.stock;

  const currentPackName = selectedPack[product._id];
  const currentPack = product.packs?.find((p) => p.name === currentPackName);
  const currentPrice = currentPack?.price || 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Out of stock");
    if (!currentPackName) return toast.error("Select a pack");

    addToCart({
      ...product,
      selectedPack: currentPackName,
      selectedPrice: currentPrice,
      quantity: 1,
    });

    toast.success(`${product.title} (${currentPackName}) added to cart`);
  };

  const navigateToProduct = () => {
    if (!isOutOfStock)
      navigate(`/agarbatti-product/${product.slug}/${product._id}`);
  };

  return (
    <div
      onClick={navigateToProduct}
      className={`min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col relative ${
        isOutOfStock ? "opacity-70 cursor-not-allowed" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: "Inter" }}
    >
      {/* IMAGE SECTION */}
      <div className="relative h-[260px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.images?.[0]}
          alt=""
          className={`w-full h-full object-contain absolute inset-0 transition duration-500 ${
            hovered && product.images?.[1] ? "opacity-0" : "opacity-100"
          }`}
        />

        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt=""
            className={`w-full h-full object-contain absolute inset-0 transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* OUT OF STOCK BANNER */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* TAG */}
        {product.tag && !isOutOfStock && (
          <span className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 text-xs rounded-md shadow font-medium">
            {product.tag}
          </span>
        )}

        {/* HEART ICON */}
        {!isOutOfStock && (
          <span
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
          >
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div className="px-4 py-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] leading-tight line-clamp-2">
            {product.title}
          </h3>

          <p className="text-[20px] font-bold text-gray-900">₹{currentPrice}</p>
        </div>

        <p className="text-sm text-gray-500 mb-3">Premium Fragrance</p>

        {/* PACK SELECTION DROPDOWN */}
        {product.packs && (
          <select
            value={currentPackName}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              setSelectedPack((prev) => ({
                ...prev,
                [product._id]: e.target.value,
              }))
            }
            className={`w-full border rounded-xl px-4 py-2 text-sm font-medium ${
              isOutOfStock
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {product.packs.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {/* ADD BUTTON */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-xl font-semibold text-sm tracking-wide mt-4 ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
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
      <div className="h-4 bg-gray-200 w-3/4"></div>
      <div className="h-3 bg-gray-200 w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

/* ---------------------------------------------------
    MAIN LIST + SLIDER
----------------------------------------------------*/
const AgarbattiProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedPack, setSelectedPack] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/agarbatti/all");

        setProducts(data);

        const defaults = {};
        data.forEach((p) => {
          if (p.packs && p.packs.length > 0) {
            defaults[p._id] = p.packs[0].name;
          }
        });

        setSelectedPack(defaults);
      } catch {
        toast.error("Failed to load products");
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
              fill="#D6E3F8"
              d="M0,96L60,101.3C120,107,240,117,360,138.7C480,160,600,192,720,202.7C840,213,960,203,1080,165.3C1200,128,1320,64,1380,32L1440,0L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-6">
          <h2
            className="text-4xl font-bold text-blue-800"
            style={{ fontFamily: "Playfair Display" }}
          >
            Premium Agarbatti
          </h2>

          <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow">
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
                selectedPack={selectedPack}
                setSelectedPack={setSelectedPack}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AgarbattiProductList;
