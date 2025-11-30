import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import Filter from "./Filter";
import AcharAdvertizeBanner from "../components/AcharAdvertizeBanner";
import { FaHeart } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

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
       ...product,
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
      className={`bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full w-full relative ${
        isOutOfStock ? "opacity-70 cursor-not-allowed" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ fontFamily: "Inter" }}
    >
      {/* IMAGE HEIGHT RESPONSIVE */}
      <div className="relative h-[180px] sm:h-[220px] md:h-[280px] lg:h-[300px] overflow-hidden rounded-t-2xl bg-gray-50">
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
            <span className="bg-red-600 text-white px-4 py-1 rounded-lg text-sm font-bold shadow">
              OUT OF STOCK
            </span>
          </div>
        )}

        {!isOutOfStock && (
          <span
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white p-1.5 sm:p-2 rounded-full shadow cursor-pointer"
          >
            <FaHeart size={16} className="text-gray-700" />
          </span>
        )}
      </div>

      {/* DETAILS */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 w-[70%] leading-tight line-clamp-2">
            {product.productName}
          </h3>

          <div className="flex flex-col items-end -mt-1">
            <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-none">
              ₹{selectedPrice}
            </p>
            {product.cutPrice && (
              <p className="text-[10px] sm:text-xs text-gray-400 line-through leading-none mt-[1px]">
                ₹{product.cutPrice}
              </p>
            )}
          </div>
        </div>

        <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3">
          Bilona-made • Small batches
        </p>

        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-500 text-sm sm:text-base">★</span>
          <span className="text-[10px] sm:text-xs font-semibold text-gray-800">
            {avgRating}
          </span>
          <span className="text-[9px] sm:text-[10px] text-gray-500">
            ({product?.reviews?.length || 0}+)
          </span>
        </div>

        {product.pricePerGram && (
          <select
            value={selectedWeight}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedWeight(e.target.value)}
            className={`w-full border px-2 py-1 text-[10px] sm:text-xs font-medium rounded-lg mb-2 sm:mb-3 ${
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
          className={`w-full py-1.5 sm:py-2 text-xs sm:text-sm font-semibold tracking-wide mt-auto rounded-lg ${
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
            defaults[p._id] = p.pricePerGram.split(",")[0].split("=")[0].trim();
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
    <>
      <Helmet>
        {/* Title with primary keyword + brand */}
        <title>
          {slug} | Buy Best Achar Online – Mango, Lemon, Haldi & More | Gausam
          Vardhan
        </title>

        {/* Meta description - descriptive, enticing, natural */}
        <meta
          name="description"
          content={`Shop authentic ${slug} online at Gausam Vardhan. Discover premium homemade achar including mango, lemon, haldi, garlic, carrot, and mixed varieties. Fresh, traditional, and preservative-free.`}
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://www.gausamvardhan.com/achar-category/${slug}`}
        />

        {/* Open Graph for social sharing */}
        <meta property="og:title" content={`${slug} | Gausam Vardhan`} />
        <meta
          property="og:description"
          content={`Explore a wide range of ${slug} including mango, lemon, haldi, garlic, carrot, and more.`}
        />
        <meta
          property="og:url"
          content={`https://www.gausamvardhan.com/achar-category/${slug}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Gausam Vardhan" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${slug} | Gausam Vardhan`} />
        <meta
          name="twitter:description"
          content={`Shop authentic ${slug} including mango, lemon, haldi, garlic, carrot, and more.`}
        />

        {/* Optional keywords (less critical for SEO today) */}
        <meta
          name="keywords"
          content="mango achar, lemon achar, haldi achar, garlic achar, carrot achar, mixed achar, homemade achar, traditional achar"
        />

        {/* JSON-LD Structured Data for category (boosts rich snippets) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${slug} Products`,
            description: `Shop authentic ${slug} online at Gausam Vardhan. Discover premium homemade achar including mango, lemon, haldi, garlic, carrot, and mixed varieties.`,
            url: `https://www.gausamvardhan.com/achar-category/${slug}`,
            publisher: {
              "@type": "Organization",
              name: "Gausam Vardhan",
              logo: {
                "@type": "ImageObject",
                url: "https://www.gausamvardhan.com/logo.png",
              },
            },
          })}
        </script>
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        <AcharAdvertizeBanner />

        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <Toaster />

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-[0.9rem] sm:text-lg md:text-2xl font-bold text-gray-800 capitalize border-b pb-1 sm:pb-2 flex-1">
              {slug} Products
            </h2>

            <button
              className="md:hidden flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg shadow"
              onClick={() => setFilterOpen(true)}
            >
              <FiFilter /> Filter
            </button>
          </div>

          <div className="flex gap-4 sm:gap-6">
            {/* SIDE FILTER (Desktop) */}
            <div className="hidden md:block w-60 shrink-0 sticky top-20 h-fit">
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

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 flex-1">
              {filteredProducts.length === 0 ? (
                <p className="text-gray-600 col-span-full text-center py-16 sm:py-20">
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
    </>
  );
}
