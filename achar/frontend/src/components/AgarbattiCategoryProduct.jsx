// AgarbattiCategoryProduct.jsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import Filter from "../components/Filter";
import { FaHeart } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import VideoAdvertiseList from "./VideoAdvertiseList";

/* ---------------------------------------------------
    PRODUCT CARD (Ghee UI Applied)
----------------------------------------------------*/
const AgarbattiProductCard = ({ product, selectedPack, setSelectedPack }) => {
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  if (!product) return null;

  const isOut = product.stock === false || product.stockQuantity <= 0;

  const currentPack =
    product.packs?.find((p) => p.name === selectedPack) || product.packs?.[0];
  const selectedPrice = currentPack?.price || product.current_price || 0;

  const ratingCount = product.reviews?.length || 0;
  const avgRating =
    ratingCount > 0
      ? (
          product.reviews.reduce((a, r) => a + (r.rating || 0), 0) /
          ratingCount
        ).toFixed(1)
      : "0.0";

  const openProduct = () => {
    if (!isOut)
      navigate(`/agarbatti-product/${product.slug}/${product._id}`);
  };

  const addCart = (e) => {
    e.stopPropagation();
    if (isOut) return toast.error("❌ Out of stock");

    addToCart({
       ...product,
      productName: product.title,
      quantity: 1,
      selectedPrice,
      selectedPack: currentPack?.name,
      productImages: product.images,
    });

    toast.success(`🛒 ${product.title} (${currentPack?.name}) added!`);
  };

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition flex flex-col cursor-pointer h-full ${
        isOut ? "opacity-60" : ""
      }`}
      onClick={openProduct}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <div className="relative h-40 sm:h-48 rounded-t-2xl overflow-hidden bg-gray-50">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className={`w-full h-full object-cover absolute inset-0 transition-all duration-500 ${
            hovered && product.images?.[1] ? "opacity-0" : "opacity-100"
          }`}
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={product.title}
            className={`w-full h-full object-cover absolute inset-0 transition-all duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {isOut && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
              OUT OF STOCK
            </span>
          </div>
        )}

        {!isOut && (
          <span
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-4 py-3 flex flex-col flex-1">
        {/* Name + Price */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-[0.9rem] sm:text-base text-gray-900 w-[70%] line-clamp-2">
            {product.title}
          </h3>
          <p className="text-[0.9rem] sm:text-base font-bold text-gray-900">
            ₹{selectedPrice}
          </p>
        </div>

        {/* Tagline */}
        <p className="text-[0.75rem] sm:text-sm text-gray-500 mb-2">
          Premium Fragrance
        </p>

        {/* ⭐ Rating */}
        <div className="flex items-center gap-1 mb-2 text-[0.8rem] sm:text-sm">
          <span className="text-yellow-500 text-sm sm:text-base">★</span>
          <span className="font-semibold text-gray-800">{avgRating}</span>
          <span className="text-gray-400">({ratingCount}+)</span>
        </div>

        {/* PACK SELECT */}
        {product.packs?.length > 0 && (
          <select
            value={selectedPack}
            disabled={isOut}
            onChange={(e) => setSelectedPack(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={`w-full border px-3 py-1.5 rounded-lg mb-2 ${
              isOut ? "bg-gray-200 text-gray-500" : "border-gray-300"
            }`}
          >
            {product.packs.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ₹{p.price}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={addCart}
          disabled={isOut}
          className={`w-full py-2 font-semibold text-[0.9rem] sm:text-sm tracking-wide rounded-lg ${
            isOut
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          {isOut ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------
    MAIN CATEGORY PAGE (Ghee Layout)
----------------------------------------------------*/
export default function AgarbattiCategoryProduct() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedPack, setSelectedPack] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/agarbatti/category/${slug}`);
        const items = Array.isArray(data) ? data : [];
        setProducts(items);
        setFilteredProducts(items);

        const defaults = {};
        items.forEach((p) => {
          if (p.packs?.length > 0) defaults[p._id] = p.packs[0].name;
        });
        setSelectedPack(defaults);
      } catch {
        toast.error("Failed to load");
      }
    };
    load();
  }, [slug]);

const handleFilter = useCallback(
  (filters) => {
    let temp = [...products];

    // CATEGORY
    if (filters.category) {
      temp = temp.filter(
        (p) =>
          p.category === filters.category ||
          p.categoryId === filters.category
      );
    }

    // PRICE
    temp = temp.filter((p) => {
      const price =
        p.currentPrice ||
        p.current_price ||
        p.packs?.[0]?.price ||
        0;
      return price >= filters.price[0] && price <= filters.price[1];
    });

    // RATING
    if (filters.rating > 0) {
      temp = temp.filter((p) => {
        if (!p.reviews || p.reviews.length === 0) return false;

        const avg =
          p.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          p.reviews.length;

        return avg >= filters.rating;
      });
    }

    // STOCK
    if (filters.stock) {
      temp = temp.filter(
        (p) => p.stock !== false && p.stockQuantity > 0
      );
    }

    // ✅ CORRECT STATE SETTER
    setFilteredProducts(temp);
  },
  [products]
);


  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>{`${slug} Agarbatti | gausamvardhan`}</title>
      </Helmet>
      <Toaster />

      <div className="px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">
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
          {/* Sidebar */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 mr-4">
            <Filter minPrice={0} maxPrice={2000} categories={[]} onFilterChange={handleFilter} />
          </div>

          {/* Drawer */}
          {filterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex z-[999]">
              <div className="flex-1" onClick={() => setFilterOpen(false)} />
              <div className="w-72 bg-white h-full shadow-lg p-4  overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <FiX size={22} />
                  </button>
                </div>

                <Filter
                  minPrice={0}
                  maxPrice={2000}
                  categories={[]}
                  onFilterChange={handleFilter}
                />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1">
            {filteredProducts.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center py-20">
                No products available
              </p>
            ) : (
              filteredProducts.map((p) => (
                <AgarbattiProductCard
                  key={p._id}
                  product={p}
                  selectedPack={selectedPack[p._id]}
                  setSelectedPack={(w) =>
                    setSelectedPack((prev) => ({ ...prev, [p._id]: w }))
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
         <div> <VideoAdvertiseList /> </div>
    </div>
  );
}
