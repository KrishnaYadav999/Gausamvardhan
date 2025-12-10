// GanpatiProductList.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import { FaHeart, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

/* ---------------------------------------------------
   GANPATI CARD
----------------------------------------------------*/
const GanpatiCard = ({ product, selectedPack, updatePack }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const isOutOfStock = !product.stock || product.stockQuantity <= 0;

  // Always use selected pack price
  const currentPrice = product.packs?.find((p) => p.name === selectedPack)
    ?.price
    ? Number(product.packs.find((p) => p.name === selectedPack).price)
    : 0;
  const cutPrice = product.cut_price ? Number(product.cut_price) : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Product is out of stock");
    if (!selectedPack) return toast.error("Select a pack");

    addToCart({
       ...product,
      productName: product.title,
      selectedPack,
      quantity: 1,
      selectedPrice: currentPrice,
      cutPrice: cutPrice,
      productImages: product.images,
    });

    toast.success(`${product.title} added to cart`);
  };

  const goToDetail = () => {
    if (isOutOfStock) return;
    navigate(`/ganpati-product/${product.slug}/${product._id}`);
  };

  const avgRating = product.reviews?.length
    ? (
        product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
        product.reviews.length
      ).toFixed(1)
    : "0.0";

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
      {/* IMAGE */}
      <div className="relative h-[260px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.images?.[0]}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
            hovered && product.images?.[1] ? "opacity-0" : "opacity-100"
          }`}
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

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

        {/* HEART */}
        {!isOutOfStock && (
          <span
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
          >
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] leading-tight line-clamp-2">
            {product.title}
          </h3>

          {/* PRICE + CUT PRICE */}
          <div className="text-right">
            <p className="text-[20px] font-bold text-gray-900">
              ₹{currentPrice}
            </p>
            {cutPrice > 0 && (
              <p className="text-sm text-gray-500 line-through">₹{cutPrice}</p>
            )}
          </div>
        </div>

        {/* RATING */}
        <div className="flex items-center gap-1 mb-3">
          <FaStar className="text-yellow-500 text-sm" />
          <span className="text-sm font-medium text-gray-700">{avgRating}</span>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Ganpati Decoration • Premium
        </p>

        {/* PACK SELECT */}
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
                {pack.name} - ₹{pack.price}
              </option>
            ))}
          </select>
        )}

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
const GanpatiSkeleton = () => (
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
   MAIN LIST + HERO BANNER + SLIDER
----------------------------------------------------*/
const GanpatiProductList = ({ limit }) => {
  const [products, setProducts] = useState([]);
  const [selectedPack, setSelectedPack] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get("/api/ganpati/all");
        const items = Array.isArray(data) ? data : [];

        setProducts(limit ? items.slice(0, limit) : items);

        const defaultPacks = {};
        items.forEach((p) => {
          if (p.packs && p.packs.length > 0) {
            defaultPacks[p._id] = p.packs[0].name;
          }
        });

        setSelectedPack(defaultPacks);
      } catch (err) {
        toast.error("Failed to load Ganpati products");
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
                  Ganpati
                </h2>
              </div>
    
              {/* Shop More Button */}
            <Link to="/ganpati-category/ganpati">
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
</Link>
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
      >
        {(loading ? Array(6).fill(null) : products).map((item, index) =>
          loading ? (
            <GanpatiSkeleton key={index} />
          ) : (
            <div key={item._id} className="snap-start w-[280px] h-full">
              <GanpatiCard
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

export default GanpatiProductList;
