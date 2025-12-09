/* ---------------------------------------------------
    IMPORTS
----------------------------------------------------*/
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ---------------------------------------------------
    CARD COMPONENT
----------------------------------------------------*/
const AcharProductCard = ({ product, selectedWeight, setSelectedWeight }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock === false || product.stockQuantity <= 0;

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
    if (isOutOfStock) return toast.error("Product is out of stock");
    if (!selectedWeight) return toast.error("Please select weight");

    addToCart({
      ...product,
      productName: product.productName,
      selectedWeight,
      quantity: 1,
      selectedPrice,
      cutPrice: product.cutPrice || 0,
      productImages: product.productImages || [],
    });

    toast.success(`${product.productName} added to cart`);
  };

  const avgRating =
    product?.reviews?.length > 0
      ? (
          product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          product.reviews.length
        ).toFixed(1)
      : "0.0";

  const navigateToProduct = () => {
    if (isOutOfStock) return;
    const slug = product.categorySlug || "achar";
    navigate(`/products/${slug}/${product._id}`);
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
      <div className="relative h-[260px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.productImages?.[0]}
          className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
            hovered && product.productImages?.[1] ? "opacity-0" : "opacity-100"
          }`}
          alt=""
        />

        {product.productImages?.[1] && (
          <img
            src={product.productImages[1]}
            className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
            alt=""
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
              OUT OF STOCK
            </span>
          </div>
        )}

        {product.tag && !isOutOfStock && (
          <span className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 text-xs rounded-md shadow font-medium">
            {product.tag}
          </span>
        )}

        {!isOutOfStock && (
          <span
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
          >
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}
      </div>

      <div className="px-4 py-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] leading-tight line-clamp-2">
            {product.productName}
          </h3>

          <div className="flex flex-col items-end -mt-1">
            <p className="text-[20px] font-bold text-gray-900 leading-none">
              ₹{selectedPrice}
            </p>
            {product.cutPrice && (
              <p className="text-sm text-gray-400 line-through leading-none mt-[2px]">
                ₹{product.cutPrice}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Bilona-made • Small batches
        </p>

        <div className="flex items-center gap-1 mb-4">
          <span className="text-yellow-500 text-lg">★</span>
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
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className={`w-full border px-4 py-2 text-sm font-medium ${
              isOutOfStock
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {product.pricePerGram.split(",").map((item) => {
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
          disabled={isOutOfStock}
          className={`w-full py-3 font-semibold text-sm tracking-wide mt-4 ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800 text-white"
          }`}
        >
          {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
    SKELETON LOADER
----------------------------------------------------*/
const AcharProductSkeleton = () => (
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
    MAIN + SLIDER + HERO
----------------------------------------------------*/
const AcharProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/products");
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

      {/* 🌿 HERO - Farming Nature Banner */}
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
              Achar
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

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-4 snap-x snap-mandatory whitespace-nowrap"
        style={{ scrollBehavior: "smooth" }}
      >
        {(loading ? [...Array(6)] : products).map((item, index) =>
          loading ? (
            <AcharProductSkeleton key={index} />
          ) : (
            <div key={item._id} className="snap-start w-[280px] h-full">
              <AcharProductCard
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

export default AcharProductList;
