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
    PRODUCT CARD
----------------------------------------------------*/
const GheeProductCard = ({ product, selectedWeight, setSelectedWeight }) => {
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  if (!product) return null;
  const isOutOfStock = !product.stock;

  const getPriceByWeight = (product, weight) => {
    if (!weight) return parseFloat(product.currentPrice) || 0;
    if (product.pricePerGram) {
      const priceMap = {};
      product.pricePerGram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        priceMap[w.trim()] = parseFloat(v.trim());
      });
      return priceMap[weight] || parseFloat(product.currentPrice);
    }
    return parseFloat(product.currentPrice);
  };

  const selectedPrice = getPriceByWeight(product, selectedWeight);

  const avgRating =
    product?.reviews?.length > 0
      ? (
          product.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          product.reviews.length
        ).toFixed(1)
      : "0.0";

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("❌ Out of stock");
    if (!selectedWeight) return toast.error("❌ Select weight");

    addToCart({
       ...product,
      productName: product.title,
      selectedWeight,
      quantity: 1,
      selectedPrice,
      cutPrice: product.cutPrice || 0,
      productImages: product.images || [],
    });
    toast.success(`🛒 ${product.title} (${selectedWeight}) added!`);
  };

  const weights = product.pricePerGram
    ? product.pricePerGram.split(",").map((p) => p.split("=")[0].trim())
    : [];

  return (
    <div
      className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition flex flex-col cursor-pointer h-full"
      onClick={() => navigate(`/ghee-product/${product.slug}/${product._id}`)}
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

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
              OUT OF STOCK
            </span>
          </div>
        )}

        {!isOutOfStock && (
          <span className="absolute top-3 right-3 bg-white p-2 rounded-full shadow">
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-4 py-3 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-[0.9rem] sm:text-base text-gray-900 w-[70%] line-clamp-2">
            {product.title}
          </h3>
          <p className="text-[0.9rem] sm:text-base font-bold text-gray-900">
            ₹{selectedPrice}
          </p>
        </div>

        <p className="text-[0.75rem] sm:text-sm text-gray-500 mb-2">
          Pure & Natural Ghee
        </p>

        <div className="flex items-center gap-1 mb-2 text-[0.8rem] sm:text-sm">
          <span className="text-yellow-500 text-sm sm:text-base">★</span>
          <span className="font-semibold text-gray-800">{avgRating}</span>
          <span className="text-gray-400">
            ({product.reviews?.length || 0}+)
          </span>
        </div>

        {/* WEIGHT SELECTOR */}
        {weights.length > 0 && (
          <select
            value={selectedWeight}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className={`w-full border px-3 py-1.5 text-[0.8rem] sm:text-sm rounded-lg mb-2 ${
              isOutOfStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {weights.map((w) => (
              <option key={w} value={w}>
                {w} ₹{getPriceByWeight(product, w)}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 font-semibold text-[0.9rem] sm:text-sm tracking-wide rounded-lg ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-600 text-white hover:bg-yellow-700"
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
export default function GheeCategoryProduct() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  // FETCH PRODUCTS
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/ghee-products/category/${slug}`);
        setProducts(data);
        setFilteredProducts(data);

        const defaults = {};
        data.forEach((p) => {
          if (p.pricePerGram)
            defaults[p._id] = p.pricePerGram.split(",")[0].split("=")[0].trim();
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
        {/* Dynamic title in small letters */}
        <title>{`${slug.toLowerCase()} ghee products | gausamvardhan`}</title>

        {/* Meta description */}
        <meta
          name="description"
          content={`Explore our premium ${slug.toLowerCase()} ghee products. Pure, natural, multiple weights. Shop online at GausamVardhan.`}
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://www.gausamvardhan.com/ghee-category/${slug}`}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${slug.toLowerCase()} ghee products | gausamvardhan`}
        />
        <meta
          property="og:description"
          content={`Buy premium ${slug.toLowerCase()} ghee online. Pure & natural ghee from GausamVardhan.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://www.gausamvardhan.com/ghee-category/${slug}`}
        />
        <meta
          property="og:image"
          content={`https://www.gausamvardhan.com/images/ghee-category/${slug}.jpg`}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${slug.toLowerCase()} ghee products | gausamvardhan`}
        />
        <meta
          name="twitter:description"
          content={`Buy premium ${slug.toLowerCase()} ghee online. Pure & natural ghee from GausamVardhan.`}
        />
        <meta
          name="twitter:image"
          content={`https://www.gausamvardhan.com/images/ghee-category/${slug}.jpg`}
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${slug.toLowerCase()} ghee`,
            image: [
              `https://www.gausamvardhan.com/images/ghee-category/${slug}.jpg`,
            ],
            description: `Pure & natural ${slug.toLowerCase()} ghee from GausamVardhan. Available in multiple weights.`,
            brand: { "@type": "Brand", name: "GausamVardhan" },
            offers: {
              "@type": "AggregateOffer",
              offerCount: products.length,
              lowPrice: products.reduce(
                (min, p) => Math.min(min, parseFloat(p.currentPrice || 0)),
                Infinity
              ),
              highPrice: products.reduce(
                (max, p) => Math.max(max, parseFloat(p.currentPrice || 0)),
                0
              ),
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
          })}
        </script>
      </Helmet>
      <Toaster />
      <div className="px-4 sm:px-6 py-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">
            {slug} Ghee Products
          </h2>

          <button
            className="md:hidden flex items-center gap-2 px-4 py-2 text-[0.9rem] bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700"
            onClick={() => setFilterOpen(true)}
          >
            <FiFilter /> Filter
          </button>
        </div>

        <div className="flex gap-6">
          {/* SIDEBAR FILTER */}
          <div className="hidden md:block w-64 shrink-0 sticky top-24 mr-4">
            <Filter
              minPrice={0}
              maxPrice={5000}
              categories={[]}
              onFilterChange={handleFilter}
            />
          </div>

          {/* MOBILE FILTER DRAWER */}
          {filterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex z-[999]">
              <div
                className="flex-1"
                onClick={() => setFilterOpen(false)}
              ></div>
              <div className="w-72 bg-white h-full shadow-lg p-4  overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[0.9rem] sm:text-lg font-semibold">
                    Filters
                  </h3>
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

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1">
            {filteredProducts.length === 0 ? (
              <p className="text-gray-600 text-[0.9rem] col-span-full text-center py-20">
                No products found.
              </p>
            ) : (
              filteredProducts.map((p) => (
                <GheeProductCard
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
         <div> <VideoAdvertiseList /> </div>
    </div>
  );
}
