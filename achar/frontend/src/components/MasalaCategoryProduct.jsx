import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import Filter from "../components/Filter";
import AcharAdvertizeBanner from "../components/AcharAdvertizeBanner";
import { FaHeart } from "react-icons/fa";

/* ------------------ Product Card ------------------ */
const MasalaProductCard = ({ product, selectedWeight, setSelectedWeight, onNavigate }) => {
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock === false || product.stockQuantity <= 0;

  // Price calculation based on selectedWeight
  const getPrice = (weight) => {
    const base = parseFloat(product.current_price || 0) || 0;
    if (!product.pricepergram) return base;
    const map = {};
    product.pricepergram.split(",").forEach((p) => {
      const [w, v] = p.split("=");
      if (w && v) map[w.trim()] = parseFloat(v.trim());
    });
    return map[weight] || base;
  };

  const price = getPrice(selectedWeight);

  const avgRating =
    product?.reviews?.length > 0
      ? (product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / product.reviews.length).toFixed(1)
      : "0.0";

  const addCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Out of stock");
    if (!selectedWeight) return toast.error("Select weight");

    addToCart({
      _id: product._id,
      productName: product.title,
      selectedWeight,
      quantity: 1,
      selectedPrice: price,
      cutPrice: parseFloat(product.cut_price) || 0,
      productImages: product.images || [],
    });

    toast.success(`${product.title} added`);
  };

  const firstImg =
    product.images?.[0] && product.images[0].startsWith("http") ? product.images[0] : `/${product.images?.[0]}`;
  const secondImg =
    product.images?.[1] && product.images[1].startsWith("http") ? product.images[1] : `/${product.images?.[1]}`;

  const discount = product.cut_price
    ? Math.round(((parseFloat(product.cut_price) - price) / parseFloat(product.cut_price)) * 100)
    : null;

  return (
    <div
      onClick={() => !isOutOfStock && onNavigate(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col relative h-[360px] md:h-full ${
        isOutOfStock ? "opacity-70 cursor-not-allowed" : ""
      }`}
      style={{ fontFamily: "Inter" }}
    >
      {/* Images */}
      <div className="relative h-[160px] md:h-[260px] overflow-hidden rounded-t-2xl bg-gray-100">
        <img
          src={firstImg}
          className={`w-full h-full object-contain absolute inset-0 transition duration-500 ${
            hovered && secondImg ? "opacity-0" : "opacity-100"
          }`}
        />
        {secondImg && (
          <img
            src={secondImg}
            className={`w-full h-full object-contain absolute inset-0 transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow">
              OUT OF STOCK
            </span>
          </div>
        )}

        {!isOutOfStock && (
          <span onClick={(e) => e.stopPropagation()} className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow cursor-pointer">
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}

        {discount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-xs rounded-lg font-semibold shadow">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-3 py-2 md:py-3 flex flex-col flex-1">
        <h3 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-2">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-2 mt-1">Small-batch • Handcrafted</p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="text-sm font-semibold text-gray-800">{avgRating}</span>
          <span className="text-xs text-gray-500">({product.reviews?.length || 0})</span>
        </div>

        {/* Weight selector */}
        {product.pricepergram && (
          <select
            value={selectedWeight}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className={`w-full border px-3 py-2 text-xs font-medium rounded-lg ${
              isOutOfStock ? "bg-gray-200 cursor-not-allowed text-gray-500" : "border-gray-300 text-gray-700"
            }`}
          >
            {product.pricepergram.split(",").map((item) => {
              const w = item.split("=")[0].trim();
              const p = item.split("=")[1]?.trim();
              return (
                <option value={w} key={w}>
                  {w} {p ? `• ₹${parseFloat(p)}` : ""}
                </option>
              );
            })}
          </select>
        )}

        <div className="flex justify-between mt-4 items-center">
          <div>
            <p className="text-lg font-bold text-gray-900">₹{price}</p>
            {product.cut_price && <p className="text-xs text-gray-400 line-through">₹{product.cut_price}</p>}
          </div>

          <button
            onClick={addCart}
            disabled={isOutOfStock}
            className={`px-3 py-2 text-xs tracking-wide font-semibold rounded-lg ${
              isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800 text-white"
            }`}
          >
            {isOutOfStock ? "OUT" : "ADD"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------ Main Page ------------------ */
export default function MasalaCategoryProduct() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`/api/masala-products/category/${slug}`),
          axios.get(`/api/categories`).catch(() => ({ data: [] })),
        ]);

        const prods = prodRes.data || [];
        setProducts(prods);
        setFilteredProducts(prods);

        // Set default selected weight per product
        const defaults = {};
        prods.forEach((p) => {
          const def = p.pricepergram?.split(",")[0].split("=")[0].trim() || "";
          defaults[p._id] = def;
        });
        setSelectedWeights(defaults);

        setCategories(catRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      }
    };
    load();
  }, [slug]);

  const handleFilter = useCallback(
    (filters) => {
      let temp = [...products];

      if (filters.category) temp = temp.filter((p) => String(p.category) === String(filters.category));
      if (filters.rating && filters.rating > 0) temp = temp.filter((p) => (p.rating || 0) >= filters.rating);
      if (filters.stock) temp = temp.filter((p) => p.stock === true);

      if (filters.price && Array.isArray(filters.price)) {
        const [minP, maxP] = filters.price;
        temp = temp.filter((p) => {
          const base = parseFloat(p.current_price || 0) || 0;
          let low = base;
          if (p.pricepergram) {
            const vals = p.pricepergram
              .split(",")
              .map((x) => parseFloat((x.split("=")[1] || "").trim() || base));
            low = Math.min(...(vals.length ? vals : [base]));
          }
          return low >= minP && low <= maxP;
        });
      }

      setFilteredProducts(temp);
    },
    [products]
  );

  const goToProduct = (p) => {
    if (!p.stock) return;
    navigate(`/masala-product/${p.slug}/${p._id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AcharAdvertizeBanner />
      <div className="px-4 sm:px-6 py-8">
        <Toaster />
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-[0.9rem] md:text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">{slug} Masala Products</h2>

          <button className="md:hidden flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow" onClick={() => setFilterOpen(true)}>
            <FiFilter /> Filter
          </button>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filter */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 h-fit">
            <Filter minPrice={0} maxPrice={5000} categories={categories} onFilterChange={handleFilter} />
          </div>

          {/* Mobile Filter Slide */}
          {filterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
              <div className="flex-1" onClick={() => setFilterOpen(false)} />
              <div className="w-80 bg-white h-full shadow-lg p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setFilterOpen(false)}>
                    <FiX size={22} />
                  </button>
                </div>
                <Filter minPrice={0} maxPrice={5000} categories={categories} onFilterChange={handleFilter} />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1">
            {filteredProducts.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center py-20">No products found.</p>
            ) : (
              filteredProducts.map((p) => (
                <MasalaProductCard
                  key={p._id}
                  product={p}
                  selectedWeight={selectedWeights[p._id]}
                  setSelectedWeight={(w) => setSelectedWeights((prev) => ({ ...prev, [p._id]: w }))}
                  onNavigate={goToProduct}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
