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

  return (
    <div
      className="min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ fontFamily: "Inter" }}
    >
      {/* IMAGE */}
      <Link to={`/oil-product/${product.slug}/${product._id}`}>
        <div className="relative h-[260px] rounded-t-2xl overflow-hidden bg-gray-50">
          {/* Primary Image */}
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
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-[18px] text-gray-900 w-[72%] line-clamp-2">
            {product.productName}
          </h3>
          <p className="text-lg font-bold text-gray-900">₹{selectedPrice}</p>
        </div>

        <p className="text-sm text-gray-500 mb-3">Cold-pressed • Pure Oils</p>

        {/* VOLUME SELECTOR */}
        {product.perPriceLiter?.length > 0 && (
          <select
            value={selectedVolume}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedVolume(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700"
          >
            {product.perPriceLiter.map((item) => (
              <option key={item.volume} value={item.volume}>
                {item.volume}
              </option>
            ))}
          </select>
        )}

        {/* ADD BUTTON */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-yellow-600 text-white py-3 rounded-xl font-semibold text-sm tracking-wide hover:bg-yellow-700 mt-4"
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
    MAIN + SLIDER
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

        const defaults = {};
        data.forEach((p) => {
          if (p.perPriceLiter) {
            defaults[p._id] = p.perPriceLiter[0].volume;
          }
        });

        setSelectedVolumes(defaults);
      } catch {
        toast.error("Failed to load products");
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

      {/* HERO SECTION */}
      <div className="relative w-full mb-10">
        <div className="w-full h-[150px] overflow-hidden relative">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full absolute"
            preserveAspectRatio="none"
          >
            <path
              fill="#FDE9B0"
              d="M0,96L80,122.7C160,149,320,203,480,202.7C640,203,800,149,960,122.7C1120,96,1280,96,1360,96L1440,96V320H1360C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320H0Z"
            />
          </svg>
        </div>

        <div className="absolute inset-0 flex items-center justify-between px-6">
          <h2
            className="text-4xl font-bold text-yellow-700"
            style={{ fontFamily: "Playfair Display" }}
          >
            Pure Cold-Pressed Oils
          </h2>

          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow">
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
        {(loading ? [...Array(6)] : products).map((item, i) =>
          loading ? (
            <OilProductSkeleton key={i} />
          ) : (
            <div key={item._id} className="snap-start w-[280px]">
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
