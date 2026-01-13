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
    PRODUCT CARD
----------------------------------------------------*/
const AcharProductCard = ({ product, selectedWeight, setSelectedWeight }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const isOutOfStock =
    product.stock === false || product.stockQuantity <= 0;

  const getPriceByWeight = (product, weight) => {
    const basePrice = parseFloat(product?.currentPrice || 0);
    if (!product?.pricePerGram || !weight) return basePrice;

    const priceMap = {};
    product.pricePerGram.split(",").forEach((p) => {
      const [w, v] = p.split("=");
      if (w && v) priceMap[w.trim()] = parseFloat(v.trim());
    });

    return priceMap[weight] || basePrice;
  };

  const selectedPrice = getPriceByWeight(product, selectedWeight);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (isOutOfStock) return toast.error("Product is out of stock");
    if (!selectedWeight) return toast.error("Please select weight");

    addToCart({
      ...product,
      selectedWeight,
      quantity: 1,
      selectedPrice,
    });

    toast.success(`${product.productName} added to cart`);
  };

  const avgRating =
    product?.reviews?.length > 0
      ? (
          product.reviews.reduce((a, r) => a + (r.rating || 0), 0) /
          product.reviews.length
        ).toFixed(1)
      : "0.0";

  const goToProduct = () => {
    if (isOutOfStock) return;
    navigate(`/products/${product.categorySlug || "achar"}/${product._id}`);
  };

  return (
    <div
      onClick={goToProduct}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all flex flex-col cursor-pointer ${
        isOutOfStock ? "opacity-70 cursor-not-allowed" : ""
      }`}
      style={{ fontFamily: "Inter" }}
    >
      {/* IMAGE */}
      <div className="relative h-[260px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.productImages?.[0]}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${
            hovered && product.productImages?.[1]
              ? "opacity-0"
              : "opacity-100"
          }`}
        />

        {product.productImages?.[1] && (
          <img
            src={product.productImages[1]}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
              OUT OF STOCK
            </span>
          </div>
        )}

        {!isOutOfStock && (
          <span
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
          >
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4 flex flex-col flex-grow">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold text-[18px] line-clamp-2 w-[70%]">
            {product.productName}
          </h3>

          <div className="text-right">
            <p className="font-bold text-[18px]">₹{selectedPrice}</p>
            {product.cutPrice && (
              <p className="text-sm text-gray-400 line-through">
                ₹{product.cutPrice}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          Bilona-made • Small batches
        </p>

        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-500">★</span>
          <span className="text-sm font-semibold">{avgRating}</span>
          <span className="text-xs text-gray-500">
            ({product?.reviews?.length || 0}+)
          </span>
        </div>

        {/* WEIGHT SELECT */}
        {product.pricePerGram && (
          <select
            value={selectedWeight}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className={`w-full border px-4 py-2 text-sm rounded-md ${
              isOutOfStock
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "border-gray-300"
            }`}
          >
            {product.pricePerGram.split(",").map((item) => {
              const weight = item.split("=")[0].trim();
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
          disabled={isOutOfStock}
          className={`mt-4 w-full py-3  font-semibold text-sm ${
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
const AcharProductSkeleton = () => (
  <div className="min-w-[280px] bg-white rounded-2xl border shadow-sm animate-pulse">
    <div className="h-[260px] bg-gray-200 rounded-t-2xl" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 w-3/4" />
      <div className="h-3 bg-gray-200 w-1/2" />
      <div className="h-10 bg-gray-200 rounded-md" />
    </div>
  </div>
);

/* ---------------------------------------------------
    MAIN LIST
----------------------------------------------------*/
const AcharProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/products")
      .then(({ data }) => {
        const items = Array.isArray(data) ? data : data.products;
        setProducts(items);

        const defaults = {};
        items.forEach((p) => {
          if (p.pricePerGram) {
            defaults[p._id] = p.pricePerGram
              .split(",")[0]
              .split("=")[0]
              .trim();
          }
        });
        setSelectedWeights(defaults);
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 relative" style={{ fontFamily: "Inter" }}>
      {/* HERO */}
      <div className="relative w-full mb-6">
        <div
          className="w-full h-[150px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dtvihyts8/image/upload/v1765003639/Untitled_design_1_jcllwz.png')",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <h2 className="text-3xl font-extrabold text-emerald-500">
            Achar
          </h2>
          <Link to="/achar-category/achar">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Shop More →
            </button>
          </Link>
        </div>
      </div>

      {/* SLIDER BUTTONS */}
      <button
        onClick={() =>
          sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
        }
        className="absolute left-0 top-1/2 bg-white p-3 rounded-full shadow z-20"
      >
        <FaChevronLeft />
      </button>

      <button
        onClick={() =>
          sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
        }
        className="absolute right-0 top-1/2 bg-white p-3 rounded-full shadow z-20"
      >
        <FaChevronRight />
      </button>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide py-4"
      >
        {(loading ? [...Array(6)] : products).map((item, i) =>
          loading ? (
            <AcharProductSkeleton key={i} />
          ) : (
            <AcharProductCard
              key={item._id}
              product={item}
              selectedWeight={selectedWeights[item._id]}
              setSelectedWeight={(w) =>
                setSelectedWeights((prev) => ({ ...prev, [item._id]: w }))
              }
            />
          )
        )}
      </div>
    </div>
  );
};

export default AcharProductList;
