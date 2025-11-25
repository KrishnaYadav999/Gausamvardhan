import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import Filter from "./Filter";
import { Helmet } from "react-helmet-async";
/* ---------------------------------------------------
    PRODUCT CARD (UPDATED)
----------------------------------------------------*/
const AgarbattiProductCard = ({ product, selectedPack, setSelectedPack }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [hovered, setHovered] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock === false || product.stockQuantity <= 0;

  // Use selected pack or default first pack
  const currentPack = product.packs?.find((p) => p.name === selectedPack) || product.packs?.[0];
  const currentPrice = currentPack?.price || product.current_price || 0;
  const oldPrice = product.cut_price || currentPack?.oldPrice || null;
  const rating = product.rating || 0;

  const openProduct = () => {
    if (!isOutOfStock) navigate(`/agarbatti-product/${product.slug}/${product._id}`);
  };

  const addCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return toast.error("Out of stock");

    addToCart({
      _id: product._id,
      productName: product.title,
      quantity: 1,
      selectedPrice: currentPrice,
      cutPrice: oldPrice,
      selectedPack: currentPack?.name,
      productImages: product.images,
    });

    toast.success(`${product.title} added`);
  };

  const pageTitle = `${slug.toLowerCase()} agarbatti | gausamvardhan`;
  const pageDescription = `Buy premium ${slug.toLowerCase()} agarbatti online at GausamVardhan. Pure, aromatic, and available in multiple packs.`;
  const pageUrl = `https://www.gausamvardhan.com/agarbatti-category/${slug}`;
  const pageImage = `https://www.gausamvardhan.com/images/agarbatti/${slug}.jpg`;

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

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${slug.toLowerCase()} agarbatti`,
            "image": products.map((p) => p.images?.[0] || pageImage),
            "description": pageDescription,
            "brand": { "@type": "Brand", "name": "GausamVardhan" },
            "offers": {
              "@type": "AggregateOffer",
              "offerCount": products.length,
              "lowPrice": products.reduce(
                (min, p) =>
                  Math.min(min, parseFloat(p.current_price || 0)),
                Infinity
              ),
              "highPrice": products.reduce(
                (max, p) =>
                  Math.max(max, parseFloat(p.current_price || 0)),
                0
              ),
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>
     <div
      onClick={openProduct}
      className={`min-w-[280px] bg-white rounded-2xl border shadow-sm hover:shadow-lg flex flex-col cursor-pointer relative ${
        isOutOfStock ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <div className="relative h-48 rounded-t-2xl overflow-hidden bg-gray-50">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
            hovered && product.images?.[1] ? "opacity-0" : "opacity-100"
          }`}
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={product.title}
            className={`w-full h-full object-cover absolute inset-0 transition duration-500 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {/* OUT OF STOCK */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
            OUT OF STOCK
          </span>
        </div>
      )}

      {/* WISHLIST */}
      {!isOutOfStock && (
        <span
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer"
        >
          <FaHeart size={16} className="text-gray-700" />
        </span>
      )}

      {/* DETAILS */}
      <div className="px-4 py-3 flex flex-col flex-1 text-[0.9rem] sm:text-[0.9rem] md:text-sm">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.title}
        </h3>

        {/* RATING */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2 text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                size={12}
                className={i < rating ? "text-yellow-500" : "text-gray-300"}
              />
            ))}
            <span className="text-gray-600 ml-1 text-xs">({rating})</span>
          </div>
        )}

        {/* PACK SELECTOR */}
        {product.packs?.length > 0 && (
          <select
            value={selectedPack}
            disabled={isOutOfStock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSelectedPack(e.target.value)}
            className={`w-full border px-3 py-1.5 rounded-lg mb-2 ${
              isOutOfStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {product.packs.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ₹{p.price}
              </option>
            ))}
          </select>
        )}

        {/* PRICE */}
        <div className="mb-2">
          <span className="text-lg font-bold text-gray-900 mr-2">₹{currentPrice}</span>
          {oldPrice && <span className="text-sm text-gray-500 line-through">₹{oldPrice}</span>}
        </div>

        {/* ADD TO CART */}
        <button
          onClick={addCart}
          disabled={isOutOfStock}
          className={`w-full py-2 font-semibold tracking-wide rounded-lg ${
            isOutOfStock
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800"
          }`}
        >
          {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
      </div>
    </div>
   </>
  );
};

/* ---------------------------------------------------
    MAIN CATEGORY PAGE
----------------------------------------------------*/
export default function AgarbattiCategoryProduct() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedPack, setSelectedPack] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get(`/api/agarbatti/category/${slug}`);
        const items = Array.isArray(data) ? data : [];
        setProducts(items);

        // Set default selected pack for each product
        const defaults = {};
        items.forEach((p) => {
          if (p.packs?.length > 0) defaults[p._id] = p.packs[0].name;
        });
        setSelectedPack(defaults);
      } catch {
        toast.error("Failed to load products");
      }
    };
    loadProducts();
  }, [slug]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toaster />
      <div className="px-4 sm:px-6 py-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-[0.9rem] sm:text-[1.5rem] md:text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">
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
            <Filter minPrice={0} maxPrice={2000} categories={[]} onFilterChange={() => {}} />
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
                <Filter minPrice={0} maxPrice={2000} categories={[]} onFilterChange={() => {}} />
              </div>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex-1">
            {products.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center py-20">
                No products found.
              </p>
            ) : (
              products.map((p) => (
                <AgarbattiProductCard
                  key={p._id}
                  product={p}
                  selectedPack={selectedPack[p._id]}
                  setSelectedPack={(pack) =>
                    setSelectedPack((prev) => ({ ...prev, [p._id]: pack }))
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
