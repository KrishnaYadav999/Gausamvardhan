import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Filter from "./Filter";

/* ---------------------------------------------------
    PRODUCT CARD
----------------------------------------------------*/
const AgarbattiProductCard = ({ product, selectedPack, setSelectedPack }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;
  const isOutOfStock = !product.stock || product.stockQuantity <= 0;

  const currentPrice = product.packs?.find((p) => p.name === selectedPack)?.price || product.current_price || 0;
  const cutPrice = product.cut_price || 0;
  const discount = cutPrice > currentPrice ? Math.round(((cutPrice - currentPrice) / cutPrice) * 100) : null;

  const avgRating = product.averageRating ? product.averageRating.toFixed(1) : "0.0";

  const addCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Out of stock!");

    addToCart({
      _id: product._id,
      productName: product.title,
      selectedWeight: selectedPack,
      quantity: 1,
      selectedPrice: currentPrice,
      cutPrice,
      productImages: product.images || [],
    });

    toast.success(`${product.title} added`);
  };

  const openProduct = () => {
    if (isOutOfStock) return;
    navigate(`/agarbatti-product/${product.slug}/${product._id}`);
  };

  const img1 = product.images?.[0];
  const img2 = product.images?.[1];

  return (
    <div
      onClick={openProduct}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition flex flex-col cursor-pointer h-full`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden bg-gray-50">
        <img
          src={img1}
          alt={product.title}
          className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${hovered && img2 ? "opacity-0" : "opacity-100"}`}
        />
        {img2 && (
          <img
            src={img2}
            alt={product.title}
            className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
        />
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">OUT OF STOCK</span>
          </div>
        )}
        {!isOutOfStock && (
          <span className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}
        {discount && !isOutOfStock && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow font-bold">
            -{discount}%
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-4 py-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2">{product.title}</h3>

        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-500 text-sm sm:text-base">★</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-800">{avgRating}</span>
          <span className="text-xs text-gray-400">({product.reviews?.length || 0}+)</span>
        </div>

        {/* PACK SELECTOR */}
        {product.packs?.length > 0 && (
          <select
            value={selectedPack}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedPack(e.target.value)}
            className={`w-full border px-3 py-1.5 text-sm rounded-lg mb-2 ${isOutOfStock ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "border-gray-300 text-gray-700"}`}
          >
            {product.packs.map((pk) => (
              <option key={pk.name} value={pk.name}>
                {pk.name} ₹{pk.price}
              </option>
            ))}
          </select>
        )}

        <p className="text-lg font-bold text-gray-900 mb-2">₹{currentPrice}</p>

        <button
          onClick={addCart}
          disabled={isOutOfStock}
          className={`w-full py-2 font-semibold text-sm tracking-wide rounded-lg ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 text-white hover:bg-green-800"}`}
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
export default function AgarbattiCategoryProduct() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedPack, setSelectedPack] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/agarbatti/category/${slug}`);
        setProducts(data);
        setFiltered(data);

        const defaults = {};
        data.forEach((p) => {
          if (p.packs?.length > 0) defaults[p._id] = p.packs[0].name;
        });
        setSelectedPack(defaults);
      } catch {
        toast.error("Failed to load products");
      }
    };
    load();
  }, [slug]);

  const handleFilter = useCallback(
    (filters) => {
      let temp = [...products];
      if (filters.rating > 0) temp = temp.filter((p) => (p.averageRating || 0) >= filters.rating);
      setFiltered(temp);
    },
    [products]
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <div className="px-4 sm:px-6 py-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">
            {slug} Agarbatti
          </h2>
          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg shadow hover:bg-green-800"
            onClick={() => setFilterOpen(true)}
          >
            <FiFilter /> Filter
          </button>
        </div>

        <div className="flex gap-6">
          {/* DESKTOP SIDEBAR */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 mr-4">
            <Filter minPrice={0} maxPrice={2000} categories={[]} onFilterChange={handleFilter} />
          </div>

          {/* MOBILE FILTER */}
          {filterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex z-50">
              <div className="flex-1" onClick={() => setFilterOpen(false)}></div>
              <div className="w-72 bg-white h-full shadow-lg p-4 mr-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <FiX size={22} />
                  </button>
                </div>
                <Filter minPrice={0} maxPrice={2000} categories={[]} onFilterChange={handleFilter} />
              </div>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1">
            {filtered.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center py-20">No products found.</p>
            ) : (
              filtered.map((p) => (
                <AgarbattiProductCard
                  key={p._id}
                  product={p}
                  selectedPack={selectedPack[p._id]}
                  setSelectedPack={(pack) => setSelectedPack((prev) => ({ ...prev, [p._id]: pack }))}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
