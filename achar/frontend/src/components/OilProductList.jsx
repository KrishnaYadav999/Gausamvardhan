/* ---------------------------------------------------
    IMPORTS
----------------------------------------------------*/
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

/* ---------------------------------------------------
    PRODUCT CARD
----------------------------------------------------*/
const OilProductCard = ({ product, selectedVolume, setSelectedVolume }) => {
  const { addToCart } = useContext(CartContext);
  const [hover, setHover] = useState(false);

  const getPriceByVolume = (product, volume) => {
    if (!volume) return parseFloat(product.currentPrice) || 0;

    if (product.perPriceLiter?.length) {
      const found = product.perPriceLiter.find((p) => p.volume === volume);
      return found ? parseFloat(found.price) : parseFloat(product.currentPrice);
    }
    return parseFloat(product.currentPrice);
  };

  const selectedPrice = getPriceByVolume(product, selectedVolume);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedVolume) return toast.error("Select a volume first");

    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedVolume,
      quantity: 1,
      selectedPrice,
      cutPrice: parseFloat(product.cutPrice) || 0,
      productImages: product.productImages || [],
    });

    toast.success("Added to cart");
  };

  // Use main rating from model
  const mainRating = product.rating?.toFixed(1) || "0.0";
  const numberOfReviews = product.numberOfReviews || 0;

  return (
    <div
      className="min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ fontFamily: "Inter" }}
    >
      {/* IMAGE */}
      <Link to={`/oil-product/${product.slug}/${product._id}`}>
        <div className="relative h-[260px] rounded-t-2xl overflow-hidden bg-gray-50">
          {/* Main Image */}
          <img
            src={product.productImages?.[0]}
            alt=""
            className={`w-full h-full object-contain absolute inset-0 transition-all duration-500 ${
              hover ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Hover Image */}
          {product.productImages?.[1] && (
            <img
              src={product.productImages[1]}
              alt=""
              className={`w-full h-full object-contain absolute inset-0 transition-all duration-500 ${
                hover ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          <span className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
            <FaHeart size={16} className="text-gray-700" />
          </span>
        </div>
      </Link>

      {/* DETAILS */}
      <div className="px-4 py-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] leading-tight line-clamp-2">
            {product.productName}
          </h3>
          <div className="flex flex-col items-end">
            {product.cutPrice && (
              <p className="text-[16px] text-gray-500 line-through">
                ₹{parseFloat(product.cutPrice)}
              </p>
            )}
            <p className="text-[20px] font-bold text-gray-900">
              ₹{selectedPrice}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">Cold-pressed • Fresh Oils</p>

        <div className="flex items-center gap-1 mb-4">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="text-sm font-semibold text-gray-800">
            {mainRating}
          </span>
          <span className="text-xs text-gray-500">({numberOfReviews}+)</span>
        </div>

        {/* VOLUME SELECTOR */}
        {product.perPriceLiter?.length > 0 && (
          <select
            value={selectedVolume}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedVolume(e.target.value)}
            className="w-full border px-4 py-2 text-sm font-medium border-gray-300 text-gray-700"
          >
            {product.perPriceLiter.map((item) => (
              <option key={item.volume} value={item.volume}>
                {item.volume}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleAddToCart}
          className="w-full py-3 font-semibold text-sm tracking-wide mt-4 bg-green-600 hover:bg-green-700 text-white"
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
const OilProductSkeleton = () => (
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
const OilProductList = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedVolumes, setSelectedVolumes] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        let url = "/api/oils";
        if (slug) url = `/api/oils/category/${slug}`;
        const { data } = await axios.get(url);

        setProducts(data);

        // Set default selected volume for each product
        const defaults = {};
        data.forEach((p) => {
          if (p.perPriceLiter) {
            defaults[p._id] = p.perPriceLiter[0].volume;
          }
        });
        setSelectedVolumes(defaults);
      } catch {
        toast.error("Failed to load oil products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const scrollLeft = () =>
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });

  const scrollRight = () =>
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="p-6 relative" style={{ fontFamily: "Inter" }}>
      <Toaster />

      {/* HERO */}
      <div className="relative w-full mb-10">
        <div className="relative w-full h-[130px] sm:h-[80px] overflow-hidden">
          <svg
            viewBox="0 0 1440 320"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
            style={{ opacity: 0.35 }}
          >
            <path
              fill="#FFF3C9"
              d="M0,256L48,229.3C96,203,192,149,288,149.3C384,149,480,203,576,224C672,245,768,235,864,218.7C960,203,1056,181,1152,149.3C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
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
            className="text-3xl font-extrabold text-yellow-700 sm:text-lg"
            style={{ fontFamily: "Playfair Display" }}
          >
            Pure Cold-Pressed Oils
          </h2>

          <button
            className="
    bg-[#BF5757] hover:bg-[#A94848]
    text-white rounded-md font-semibold shadow-md

    /* Mobile (default) */
    px-3 py-1 text-[10px]

    /* Small Screen (sm ≥ 640px) */
    sm:px-4 sm:py-1.5 sm:text-[11px]

    /* Medium Screen (md ≥ 768px) */
    md:px-5 md:py-2 md:text-[13px]

    /* Large Screen (lg ≥ 1024px) */
    lg:px-6 lg:py-2 lg:text-[14px]
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
            <OilProductSkeleton key={index} />
          ) : (
            <div key={item._id} className="snap-start w-[280px] h-full">
              <OilProductCard
                product={item}
                selectedVolume={selectedVolumes[item._id]}
                setSelectedVolume={(v) =>
                  setSelectedVolumes((prev) => ({ ...prev, [item._id]: v }))
                }
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default OilProductList;
