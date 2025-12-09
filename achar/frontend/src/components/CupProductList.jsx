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
    STAR RATING COMPONENT
----------------------------------------------------*/
const RatingStars = ({ value }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`text-sm ${
          value >= i ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </span>
    );
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

/* ---------------------------------------------------
    CARD COMPONENT (MATCHED WITH ACHAR UI)
----------------------------------------------------*/
const CupProductCard = ({ product, selectedPack, setSelectedPack }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const isOutOfStock =
    product.stock === false || product.stockQuantity <= 0;

  const currentPackName = selectedPack || product.packs?.[0]?.name;
  const currentPack =
    product.packs?.find((p) => p.name === currentPackName) ||
    product.packs?.[0];

  const selectedPrice = currentPack?.price || product.current_price || 0;

  const navigateProduct = () => {
    if (isOutOfStock) return;
    navigate(`/cup-product/${product.slug}/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Product is out of stock");

    addToCart({
      _id: product._id,
      productName: product.title,
      quantity: 1,
      selectedPrice,
      cutPrice: product.cut_price || 0,
      selectedPack: currentPack?.name,
      productImages: product.images || [],
    });

    toast.success(`${product.title} added to cart`);
  };

  return (
    <div
      onClick={navigateProduct}
      className={`min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col relative ${
        isOutOfStock ? "opacity-70 cursor-not-allowed" : ""
      }`}
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
          alt=""
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
            alt=""
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
          <span className="absolute top-4 left-4 bg-green-700 text-white px-3 py-1 text-xs rounded-md shadow font-medium">
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
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-[18px] text-gray-900 leading-tight w-[70%] line-clamp-2">
            {product.title}
          </h3>

          <div className="text-right">
            {/* Current Price */}
            <p className="text-[20px] font-bold text-gray-900">₹{selectedPrice}</p>

            {/* Cut Price */}
            {product.cut_price && (
              <p className="text-sm line-through text-gray-400 -mt-1">
                ₹{product.cut_price}
              </p>
            )}
          </div>
        </div>

        {/* RATING */}
        <div className="mb-3">
          <RatingStars value={product.rating || 0} />
        </div>

        <p className="text-sm text-gray-500 mb-3">
          Premium Ceramic • Handmade
        </p>

        {/* PACK DROPDOWN (MATCHED STYLE) */}
        {product.packs?.length > 0 && (
          <select
            value={currentPackName}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedPack(e.target.value)}
            className={`w-full border px-4 py-2 text-sm font-medium ${
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
    SKELETON
----------------------------------------------------*/
const CupProductSkeleton = () => (
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
    MAIN LIST (MATCHED WITH ACHAR LIST)
----------------------------------------------------*/
const CupProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedPacks, setSelectedPacks] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/cup/all");
        const items = Array.isArray(data) ? data : data.products;

        setProducts(items);

        const defaults = {};
        items.forEach((p) => {
          if (p.packs?.length > 0) {
            defaults[p._id] = p.packs[0].name;
          }
        });

        setSelectedPacks(defaults);
      } catch {
        toast.error("Failed to load cup products");
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
    

      {/* ---------------------------------------------
          HERO SECTION (MATCHED WITH ACHAR)
      --------------------------------------------- */}
      <div className="relative w-full mb-10">
        <div className="relative w-full h-[130px] sm:h-[80px] overflow-hidden">
          <svg
            viewBox="0 0 1440 320"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            style={{ opacity: 0.35 }}
          >
            <path
              fill="#E8F1FF"
              d="M0,256L48,229.3C96,203,192,149,288,149.3C384,149,480,203,576,224C672,245,768,235,864,218.7C960,203,1056,181,1152,149.3C1248,117,1344,75,1392,53.3L1440,32V320H0Z"
            ></path>
          </svg>

          <div
            className="absolute bottom-0 w-full h-[90px]"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/dtvihyts8/image/upload/v1763637527/coe_achar_ysmiwo.jpg')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right bottom",
            }}
          ></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-6">
          <h2
            className="text-3xl font-extrabold text-[#3A4E74] sm:text-lg"
            style={{ fontFamily: "Playfair Display" }}
          >
            Cups
          </h2>

          <button className="bg-[#3A4E74] hover:bg-[#2E3E5A] text-white px-6 py-2 rounded-md font-semibold shadow-md sm:px-3 sm:py-1 sm:text-[11px]">
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
            <CupProductSkeleton key={index} />
          ) : (
            <div key={item._id} className="snap-start w-[280px] h-full">
              <CupProductCard
                product={item}
                selectedPack={selectedPacks[item._id]}
                setSelectedPack={(pack) =>
                  setSelectedPacks((prev) => ({
                    ...prev,
                    [item._id]: pack,
                  }))
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CupProductList;
