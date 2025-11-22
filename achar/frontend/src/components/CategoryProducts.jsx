import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import Filter from "./Filter";
import AcharAdvertizeBanner from "../components/AcharAdvertizeBanner";
import { FaHeart } from "react-icons/fa";

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
    const basePrice = parseFloat(product?.currentPrice || 0);

    if (product.pricePerGram) {
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

  const avgRating =
    product?.reviews?.length > 0
      ? (
          product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          product.reviews.length
        ).toFixed(1)
      : "0.0";

  const goToProduct = () => {
    if (isOutOfStock) return;
    const slug = product.categorySlug || "achar";
    navigate(`/products/${slug}/${product._id}`);
  };

  const addCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Out of stock");
    if (!selectedWeight) return toast.error("Select weight");

    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedWeight,
      quantity: 1,
      selectedPrice,
      cutPrice: product.cutPrice || 0,
      productImages: product.productImages || [],
    });

    toast.success(`${product.productName} added`);
  };

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
      {/* FIXED IMAGE HEIGHT */}
      <div className="relative h-[380px] overflow-hidden rounded-t-2xl bg-gray-50">
        <img
          src={product.productImages?.[0]}
          className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
            hovered && product.productImages?.[1] ? "opacity-0" : "opacity-100"
          }`}
        />

        {product.productImages?.[1] && (
          <img
            src={product.productImages[1]}
            className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
              OUT OF STOCK
            </span>
          </div>
        )}

        {!isOutOfStock && (
          <span
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow cursor-pointer"
          >
            <FaHeart size={18} className="text-gray-700" />
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
            <p className="text-xl font-bold text-gray-900 leading-none">
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
            className={`w-full border px-4 py-2 text-sm font-medium rounded-lg ${
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
          onClick={addCart}
          disabled={isOutOfStock}
          className={`w-full py-3 font-semibold text-sm tracking-wide mt-auto rounded-lg ${
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
    MAIN CATEGORY PAGE
----------------------------------------------------*/
export default function CategoryProducts() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFiltered] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  // FETCH PRODUCTS
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/products/category/${slug}`);
        setProducts(data);
        setFiltered(data);

        const defaults = {};
        data.forEach((p) => {
          if (p.pricePerGram) {
            defaults[p._id] =
              p.pricePerGram.split(",")[0].split("=")[0].trim();
          }
        });
        setSelectedWeights(defaults);
      } catch {
        toast.error("Failed to load products");
      }
    };
    load();
  }, [slug]);

  const handleFilter = useCallback(
    (filters) => {
      let temp = [...products];
      if (filters.rating > 0)
        temp = temp.filter((p) => p.rating >= filters.rating);

      setFiltered(temp);
    },
    [products]
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ⭐ Banner Always on Top */}
      <AcharAdvertizeBanner />

      <div className="px-4 sm:px-6 py-8">
        <Toaster />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">
            {slug} Products
          </h2>

          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow"
            onClick={() => setFilterOpen(true)}
          >
            <FiFilter /> Filter
          </button>
        </div>

        <div className="flex gap-6">
          {/* SIDE FILTER (Desktop) */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 h-fit">
            <Filter
              minPrice={0}
              maxPrice={5000}
              categories={[]}
              onFilterChange={handleFilter}
            />
          </div>

          {/* MOBILE FILTER */}
          {filterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
              <div
                className="flex-1"
                onClick={() => setFilterOpen(false)}
              ></div>

              <div className="w-72 bg-white h-full shadow-lg p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <FiX size={22} />
                  </button>
                </div>

                <Filter
                  minPrice={0}
                  maxPrice={5000}
                  categories={[]}
                  onFilterChange={handleFilter}
                />
              </div>
            </div>
          )}

          {/* ⭐ PRODUCT GRID — FIXED MOBILE = 2 PER ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1">
            {filteredProducts.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center py-20">
                No products found.
              </p>
            ) : (
              filteredProducts.map((p) => (
                <AcharProductCard
                  key={p._id}
                  product={p}
                  selectedWeight={selectedWeights[p._id]}
                  setSelectedWeight={(w) =>
                    setSelectedWeights((prev) => ({ ...prev, [p._id]: w }))
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
