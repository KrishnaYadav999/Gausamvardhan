// OilCategoryProduct.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Filter from "./Filter";
import AcharAdvertizeBanner from "../components/AcharAdvertizeBanner";

/* ----------------------
   Helper utilities
------------------------*/
const normalizePrice = (v) => {
  if (v === undefined || v === null) return 0;
  // Accept number or string like "₹499" or "499.00"
  if (typeof v === "number") return v;
  const cleaned = String(v).replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const calcDiscountPercent = (cutPrice, salePrice) => {
  const cp = normalizePrice(cutPrice);
  const sp = normalizePrice(salePrice);
  if (!cp || !sp || cp <= sp) return null;
  return Math.round(((cp - sp) / cp) * 100);
};

/* ---------------------------------------------------
   PRODUCT CARD (matches Achar UI style)
----------------------------------------------------*/
const OilProductCard = ({ product, selectedVolume, setSelectedVolume }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock === false || (product.stockQuantity !== undefined && product.stockQuantity <= 0);

  // Get price for selected volume (fallback to currentPrice)
  const getPriceByVolume = (product, volume) => {
    const base = normalizePrice(product.currentPrice);
    if (!volume || !product.perPriceLiter) return base;
    const found = product.perPriceLiter.find((p) => p.volume === volume);
    return found ? normalizePrice(found.price) : base;
  };

  const selectedPrice = getPriceByVolume(product, selectedVolume);
  const avgRating =
    product?.reviews?.length > 0
      ? (product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / product.reviews.length).toFixed(1)
      : "0.0";

  const goToProduct = () => {
    if (isOutOfStock) return;
    navigate(`/oil-product/${product.slug || product.productName}/${product._id}`);
  };

  const addCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Out of stock");
    if (!selectedVolume) return toast.error("Select volume");

    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedVolume,
      quantity: 1,
      selectedPrice,
      cutPrice: normalizePrice(product.cutPrice) || 0,
      productImages: product.productImages || [],
    });

    toast.success(`${product.productName} added`);
  };

  const img1 = product.productImages?.[0];
  const img2 = product.productImages?.[1];

  const discountPercent = calcDiscountPercent(product.cutPrice, selectedPrice);

  return (
    <div
      onClick={goToProduct}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-full w-full relative ${
        isOutOfStock ? "opacity-70 cursor-not-allowed" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: "Inter" }}
    >
      {/* IMAGE */}
      <div className="relative h-[380px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={img1}
          alt={product.productName}
          className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
            hovered && img2 ? "opacity-0" : "opacity-100"
          }`}
        />
        {img2 && (
          <img
            src={img2}
            alt={product.productName + "-alt"}
            className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* WISHLIST */}
        {!isOutOfStock && (
          <span onClick={(e) => e.stopPropagation()} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer">
            <FaHeart size={18} className="text-gray-700" />
          </span>
        )}

        {/* DISCOUNT BADGE */}
        {discountPercent && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow font-bold">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-4 py-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900 w-[70%] leading-tight line-clamp-2">
            {product.productName}
          </h3>

          <div className="flex flex-col items-end -mt-1">
            <p className="text-xl font-bold text-gray-900 leading-none">₹{selectedPrice}</p>
            {product.cutPrice && (
              <p className="text-sm text-gray-400 line-through leading-none mt-[2px]">₹{normalizePrice(product.cutPrice)}</p>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3">Cold-pressed • Small batches</p>

        <div className="flex items-center gap-1 mb-4">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="text-sm font-semibold text-gray-800">{avgRating}</span>
          <span className="text-xs text-gray-500">({product?.reviews?.length || 0}+)</span>
        </div>

        {/* VOLUME BUTTONS (A) */}
        {product.perPriceLiter && product.perPriceLiter.length > 0 && (
          <div className="mb-3 flex gap-2 flex-wrap">
            {product.perPriceLiter.map((v) => (
              <button
                key={v.volume}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVolume(v.volume);
                }}
                disabled={isOutOfStock}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                  selectedVolume === v.volume
                    ? "bg-green-700 text-white border-green-700"
                    : "border-gray-300 text-gray-700 hover:border-green-700"
                }`}
              >
                {v.volume}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={addCart}
          disabled={isOutOfStock}
          className={`w-full py-3 font-semibold text-sm tracking-wide mt-auto rounded-lg ${
            isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800 text-white"
          }`}
        >
          {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
   MAIN CATEGORY PAGE (Oil)
----------------------------------------------------*/
export default function OilCategoryProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedVolumes, setSelectedVolumes] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  // fetch products for category
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/oils/category/${slug}`);
        setProducts(data || []);
        setFiltered(data || []);

        // set defaults (first volume)
        const defaults = {};
        data.forEach((p) => {
          if (p.perPriceLiter && p.perPriceLiter.length > 0) {
            defaults[p._id] = p.perPriceLiter[0].volume;
          } else {
            defaults[p._id] = ""; // no variant
          }
        });
        setSelectedVolumes(defaults);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      }
    };
    load();
  }, [slug]);

  // filter callback (reused Filter component)
  const handleFilter = useCallback(
    (filters) => {
      let temp = [...products];
      // rating filter (example)
      if (filters.rating > 0) temp = temp.filter((p) => (p.rating || 0) >= filters.rating);
      // price filter: assume Filter returns min/max in filters.price
      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        temp = temp.filter((p) => {
          const vol = selectedVolumes[p._id];
          const price = vol && p.perPriceLiter ? (p.perPriceLiter.find((x) => x.volume === vol)?.price ?? normalizePrice(p.currentPrice)) : normalizePrice(p.currentPrice);
          return price >= filters.minPrice && price <= filters.maxPrice;
        });
      }
      // stock filter
      if (filters.stockOnly) temp = temp.filter((p) => p.stock === true);

      setFiltered(temp);
    },
    [products, selectedVolumes]
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <AcharAdvertizeBanner />
      <div className="px-4 sm:px-6 py-8">
        <Toaster />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">{slug} Oil Products</h2>

          <button className="md:hidden flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow" onClick={() => setFilterOpen(true)}>
            <FiFilter /> Filter
          </button>
        </div>

        <div className="flex gap-6">
          {/* SIDE FILTER (Desktop) */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 h-fit">
            <Filter minPrice={0} maxPrice={5000} categories={[]} onFilterChange={handleFilter} />
          </div>

          {/* MOBILE FILTER */}
          {filterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
              <div className="flex-1" onClick={() => setFilterOpen(false)}></div>

              <div className="w-72 bg-white h-full shadow-lg p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <FiX size={22} />
                  </button>
                </div>

                <Filter minPrice={0} maxPrice={5000} categories={[]} onFilterChange={handleFilter} />
              </div>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1">
            {filtered.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center py-20">No products found.</p>
            ) : (
              filtered.map((p) => (
                <OilProductCard
                  key={p._id}
                  product={p}
                  selectedVolume={selectedVolumes[p._id]}
                  setSelectedVolume={(v) => setSelectedVolumes((prev) => ({ ...prev, [p._id]: v }))}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
