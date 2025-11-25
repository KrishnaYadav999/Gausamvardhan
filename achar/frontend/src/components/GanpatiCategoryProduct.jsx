import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import Filter from "./Filter";
import { FaHeart } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
/* ===================================================
   CARD COMPONENT
=================================================== */
const GanpatiCard = ({ product, selectedPack, setSelectedPack }) => {
  const { addToCart } = useContext(CartContext);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const isOutOfStock = !product.stock || product.stockQuantity <= 0;
  const packObj = product.packs?.find((p) => p.name === selectedPack);
  const selectedPrice = packObj?.price || product.current_price;

  const avgRating = product.reviews?.length
    ? (
        product.reviews.reduce((a, r) => a + (r.rating || 0), 0) /
        product.reviews.length
      ).toFixed(1)
    : "0.0";

  const add = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Out of Stock");
    if (!selectedPack) return toast.error("Select pack");

    addToCart({
      _id: product._id,
      productName: product.title,
      selectedPack,
      quantity: 1,
      selectedPrice,
      cutPrice: product.cut_price,
      productImages: product.images,
    });

    toast.success(`${product.title} added`);
  };

  const pageTitle = `${slug.toLowerCase()} ganpati products | gausamvardhan`;
  const pageDescription = `Shop premium ${slug.toLowerCase()} ganpati products online at GausamVardhan. Pure, natural, multiple packs available.`;
  const pageUrl = `https://www.gausamvardhan.com/ganpati-category/${slug}`;
  const pageImage = `https://www.gausamvardhan.com/images/ganpati-category/${slug}.jpg`;
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={pageImage} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        {/* Structured Data for Products */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${slug.toLowerCase()} ganpati`,
            image: products.map((p) => p.images?.[0] || pageImage),
            description: pageDescription,
            brand: { "@type": "Brand", name: "GausamVardhan" },
            offers: {
              "@type": "AggregateOffer",
              offerCount: products.length,
              lowPrice: products.reduce(
                (min, p) => Math.min(min, parseFloat(p.current_price || 0)),
                Infinity
              ),
              highPrice: products.reduce(
                (max, p) => Math.max(max, parseFloat(p.current_price || 0)),
                0
              ),
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
          })}
        </script>
      </Helmet>
      <div
        className={`bg-white rounded-2xl border shadow-md hover:shadow-xl 
      transition-all cursor-pointer flex flex-col h-full relative 
      ${isOutOfStock ? "opacity-60 cursor-not-allowed" : ""}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() =>
          navigate(`/ganpati-product/${product.slug}/${product._id}`)
        }
      >
        {/* Image */}
        <div className="relative h-40 sm:h-48 md:h-[250px] overflow-hidden rounded-t-2xl bg-gray-100">
          <img
            src={product.images?.[0]}
            className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${
              hover && product.images?.[1] ? "opacity-0" : "opacity-100"
            }`}
          />

          {product.images?.[1] && (
            <img
              src={product.images[1]}
              className={`absolute inset-0 w-full h-full object-cover transition duration-500 ${
                hover ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {!isOutOfStock && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
            >
              <FaHeart size={16} className="text-gray-700" />
            </button>
          )}

          {isOutOfStock && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-[0.7rem] font-bold px-3 py-1 rounded-lg shadow">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Details */}
        <div className="px-3 py-3 flex flex-col flex-1">
          {/* TITLE responsive */}
          <h3 className="font-semibold text-[0.9rem] sm:text-base text-gray-900 line-clamp-2">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[0.8rem] sm:text-sm mt-1 mb-2">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="font-semibold">{avgRating}</span>
            <span className="text-gray-500 text-[0.75rem]">
              ({product?.reviews?.length || 0}+)
            </span>
          </div>

          {/* Pack Dropdown */}
          {product.packs?.length > 0 && (
            <select
              value={selectedPack}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSelectedPack(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg 
            text-[0.9rem] sm:text-sm mb-2"
            >
              {product.packs.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {/* Price */}
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg sm:text-xl font-bold text-green-700">
              ₹{selectedPrice}
            </p>
            {product.cut_price > 0 && (
              <p className="text-[0.75rem] sm:text-xs line-through text-gray-400">
                ₹{product.cut_price}
              </p>
            )}
          </div>

          {/* Add Btn */}
          <button
            onClick={add}
            disabled={isOutOfStock}
            className={`w-full py-2 
          text-[0.9rem] sm:text-sm font-semibold rounded-lg transition ${
            isOutOfStock
              ? "bg-gray-400 text-gray-700"
              : "bg-orange-600 hover:bg-orange-700 text-white"
          }`}
          >
            {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          </button>
        </div>
      </div>
    </>
  );
};

/* ===================================================
   MAIN PAGE
=================================================== */
export default function GanpatiCategoryProduct() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedPack, setSelectedPack] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get(`/api/ganpati/category/${slug}`);
        setProducts(data);
        setFiltered(data);

        const defaults = {};
        data.forEach((p) => {
          if (p.packs?.length > 0) defaults[p._id] = p.packs[0].name;
        });
        setSelectedPack(defaults);
      } catch {
        toast.error("Failed to load");
      }
    };
    loadProducts();
  }, [slug]);

  /* Filter Logic */
  const handleFilter = useCallback(
    (filters) => {
      let temp = [...products];

      if (filters.rating > 0) {
        temp = temp.filter((p) => {
          const avg =
            p.reviews?.length > 0
              ? p.reviews.reduce((a, r) => a + (r.rating || 0), 0) /
                p.reviews.length
              : 0;
          return avg >= filters.rating;
        });
      }

      if (filters.stock) temp = temp.filter((p) => p.stock === true);

      setFiltered(temp);
    },
    [products]
  );

  return (
    <div className="bg-gray-50 min-h-screen px-3 sm:px-6 py-6 sm:py-8">
      <Toaster />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 capitalize">
          {slug} Products
        </h2>

        {/* Mobile filter btn */}
        <button
          className="md:hidden flex items-center gap-2 px-4 py-2 
          text-[0.9rem] bg-orange-600 text-white rounded-lg shadow"
          onClick={() => setFilterOpen(true)}
        >
          <FiFilter /> Filter
        </button>
      </div>

      <div className="flex gap-4 sm:gap-6">
        {/* Desktop filter */}
        <div className="hidden md:block w-72 shrink-0 sticky top-24">
          <Filter
            minPrice={0}
            maxPrice={5000}
            categories={[]}
            onFilterChange={handleFilter}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex bg-black bg-opacity-50">
            <div className="flex-1" onClick={() => setFilterOpen(false)}></div>

            <div className="w-72 bg-white p-5 overflow-y-auto shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[0.9rem]">Filters</h3>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 flex-1">
          {filtered.length === 0 ? (
            <p className="text-gray-600 col-span-full text-center py-20 text-[0.9rem]">
              No products found.
            </p>
          ) : (
            filtered.map((p) => (
              <GanpatiCard
                key={p._id}
                product={p}
                selectedPack={selectedPack[p._id]}
                setSelectedPack={(val) =>
                  setSelectedPack((prev) => ({ ...prev, [p._id]: val }))
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
