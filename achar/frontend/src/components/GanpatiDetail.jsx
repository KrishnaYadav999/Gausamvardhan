// GanpatiDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import ProductVideo from "../components/ProductVideo";
import toast from "react-hot-toast";
import Features from "./Features";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import { Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import GanpatiCustomerReview from "./GanpatiCustomerReview";
import Certificate from "./Certificate";
import VideoAdvertiseList from "./VideoAdvertiseList";

const HERO_IMAGE_URL = "/mnt/data/4dc83e6e-457a-4813-963c-0fe8fa4f6c1e.png";

const GanpatiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedPack, setSelectedPack] = useState("");
  const [packQuantities, setPackQuantities] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const zoomRef = useRef();
  const [zoomStyle, setZoomStyle] = useState({});

    const [currentPage, setCurrentPage] = useState(1);

  const getPrice = (prod, packName) => {
    if (!prod) return 0;
    if (!packName || !prod.packs) return Number(prod.current_price || 0);
    const found = prod.packs.find((p) => p.name === packName);
    return found ? Number(found.price) : Number(prod.current_price || 0);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/ganpati/${id}`);

        const avgRating =
          data.reviews && data.reviews.length > 0
            ? data.reviews.reduce(
                (sum, r) => sum + (Number(r.rating) || 0),
                0
              ) / data.reviews.length
            : 0;

        setProduct({ ...data, rating: avgRating });

        if (data.packs && data.packs.length > 0) {
          const firstPack = data.packs[0].name;
          setSelectedPack(firstPack);
          setPackQuantities({ [firstPack]: 1 });
        }

        setMainImage(data.images?.[0] || HERO_IMAGE_URL);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details!");
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const fetchSimilarProducts = async () => {
      try {
        const { data } = await axios.get(`/api/ganpati/${product._id}/similar`);
        setSimilarProducts(data || []);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };
    fetchSimilarProducts();
  }, [product]);

  if (!product) {
    return <ProductDetailSkeleton />;
  }

   const REVIEWS_PER_PAGE = 4;
  const reviews = product.reviews || [];

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );


  const isOutOfStock = !product.stock;

  const updatePackQuantity = (pack, change) => {
    setPackQuantities((prev) => {
      const currentQty = prev[pack] || 1;
      return { ...prev, [pack]: Math.max(1, currentQty + change) };
    });
  };

  const handleAddToCart = () => {
    if (!selectedPack) {
      toast.error("⚠️ Please select a pack before adding to cart!");
      return;
    }
    if (isOutOfStock) {
      toast.error("❌ This product is out of stock!");
      return;
    }
    const qty = packQuantities[selectedPack] || 1;
    const added =addToCart({
      ...product,
      selectedPack,
      selectedPrice: getPrice(product, selectedPack),
      quantity: qty,
      totalPrice: getPrice(product, selectedPack) * qty,
      productImages: product.images || [],
    });
    if(added){
toast.success(`${product.title} (${selectedPack}) x${qty} added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (!selectedPack) {
      toast.error("⚠️ Please select a pack!");
      return;
    }
    if (isOutOfStock) {
      toast.error("❌ This product is out of stock!");
      return;
    }
    const qty = packQuantities[selectedPack] || 1;
    setCartItems([
      {
        ...product,
        selectedPack,
        selectedPrice: getPrice(product, selectedPack),
        quantity: qty,
        totalPrice: getPrice(product, selectedPack) * qty,
        productImages: product.images || [],
      },
    ]);
    navigate("/checkout");
  };

  const handleMouseMove = (e) => {
    if (!zoomRef.current) return;
    const { left, top, width, height } =
      zoomRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${mainImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
      backgroundRepeat: "no-repeat",
    });
  };

  const handleMouseLeave = () => setZoomStyle({});

  const totalReviews = product.reviews?.length || 0;
  const averageRating = product.rating ? product.rating.toFixed(1) : "0.0";

  const productDetails = [
    { key: "description", label: "Description", value: product.description },
    { key: "quantity", label: "Quantity", value: product.quantity },
    {
      key: "keyBenefits",
      label: "Key Benefits",
      value: product.keyBenefits?.join(", "),
    },
    {
      key: "ingredients",
      label: "Ingredients",
      value: product.ingredients?.join(", "),
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${product.title} | gau samvardhan`}</title>

        <meta
          name="description"
          content={
            product.shortDescription ||
            product.productTagline ||
            "High-quality Ganpati Murti for Pooja and rituals from gau samvardhan."
          }
        />

        <link
          rel="canonical"
          href={`https://www.gausamvardhan.com/ganpati-category/${product._id}`}
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${product.productName} | gau samvardhan`}
        />
        <meta
          property="og:description"
          content={product.shortDescription || product.productTagline}
        />
        <meta property="og:type" content="product" />
        <meta
          property="og:url"
          content={`https://www.gausamvardhan.com/ganpati-category/${product._id}`}
        />
        <meta
          property="og:image"
          content={product.images?.[0] || HERO_IMAGE_URL}
        />
        <meta property="og:site_name" content="gau samvardhan" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${product.productName} | gau samvardhan`}
        />
        <meta
          name="twitter:description"
          content={product.shortDescription || product.productTagline}
        />
        <meta
          name="twitter:image"
          content={product.images?.[0] || HERO_IMAGE_URL}
        />
        <meta name="twitter:site" content="@gausamvardhan" />

        {/* Keywords */}
        <meta
          name="keywords"
          content={`Ganpati Murti, Pooja Murti, ${product.productName}, gau samvardhan, Handmade, Premium`}
        />
        <meta name="robots" content="index, follow" />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.productName,
            image: product.images || [HERO_IMAGE_URL],
            description: product.shortDescription || product.productTagline,
            sku: product._id,
            brand: { "@type": "Brand", name: "gau samvardhan" },
            offers: {
              "@type": "Offer",
              url: `https://www.gausamvardhan.com/ganpati-category/${product._id}`,
              priceCurrency: "INR",
              price: getPrice(product, selectedPack),
              availability: product.stock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
            aggregateRating: product.rating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: product.rating.toFixed(1),
                  reviewCount: totalReviews,
                }
              : undefined,
            review: product.reviews?.map((r) => ({
              "@type": "Review",
              author: r.name,
              reviewBody: r.comment,
              reviewRating: { "@type": "Rating", ratingValue: r.rating },
              datePublished: new Date(r.createdAt).toISOString(),
            })),
          })}
        </script>
      </Helmet>

      <div className="text-[0.9rem] bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* LEFT SIDE */}
            <div>
              {/* MAIN IMAGE + ZOOM */}
              <div
                ref={zoomRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative bg-white rounded-3xl p-6 shadow-2xl overflow-hidden"
              >
                <div className="w-full h-[420px] md:h-[580px] flex items-center justify-center">
                  <img
                    src={HERO_IMAGE_URL}
                    alt="hero"
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>

                <div className="absolute left-6 top-10 md:left-10 md:top-16 w-[70%] md:w-[65%] transform -translate-y-6 md:-translate-y-12">
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-[360px] md:h-[460px] object-contain rounded-xl border-2 border-white shadow-lg bg-white"
                  />
                </div>

                {zoomStyle.backgroundImage && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ ...zoomStyle }}
                  />
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="mt-4 flex items-center gap-3 overflow-x-auto py-2">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 border rounded-lg overflow-hidden p-1 transition-transform hover:scale-105 ${
                      mainImage === img
                        ? "ring-2 ring-green-400"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* MOBILE PURCHASE CARD */}
              <div className="block md:hidden mt-6 bg-white rounded-2xl p-4 shadow-lg">
                <h1 className="text-xl font-bold text-gray-900">
                  {product.title || product.productName}
                </h1>

                {/* Rating */}
                <div className="flex items-center mt-2 space-x-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.round(Number(averageRating) || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    ({totalReviews} reviews)
                  </span>
                </div>

                <p className="mt-4 text-gray-700 text-[0.95rem]">
                  {product.description || "Beautiful premium Ganpati idol."}
                </p>

                <Certificate />

                {/* Price */}
                <div className="mt-3 text-2xl font-bold text-green-600">
                  ₹
                  {getPrice(product, selectedPack) *
                    (packQuantities[selectedPack] || 1)}
                </div>

                {product.cut_price && (
                  <div className="line-through text-gray-400">
                    ₹{product.cut_price}
                  </div>
                )}

                {/* PACK OPTIONS */}
                {product.packs?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2 text-sm">
                      Select Pack
                    </p>

                    <div className="flex flex-col gap-2">
                      {product.packs.map((pack, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPack(pack.name)}
                          className={`flex items-center justify-between border p-2 rounded-lg ${
                            selectedPack === pack.name
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {pack.name} – ₹{getPrice(product, pack.name)}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updatePackQuantity(pack.name, -1);
                              }}
                              className="px-2 border rounded"
                            >
                              -
                            </button>

                            <span className="text-sm">
                              {packQuantities[pack.name] || 1}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updatePackQuantity(pack.name, 1);
                              }}
                              className="px-2 border rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA BUTTONS */}
                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg tracking-wide transition ${
                      isOutOfStock
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                    }`}
                  >
                    {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`w-full py-3 rounded-xl text-lg font-semibold text-gray-800 transition ${
                      isOutOfStock
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500"
                    }`}
                  >
                    {isOutOfStock ? "Out of Stock" : "💳 Shop Now"}
                  </button>
                </div>
                <Features />
                {/* PRODUCT DETAILS */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Product Details
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {productDetails.map(
                      (item) =>
                        item.value && (
                          <li key={item.key}>
                            <span className="font-medium text-gray-900">
                              {item.label}:
                            </span>{" "}
                            {item.value}
                          </li>
                        )
                    )}
                  </ul>
                </div>
              </div>

              {/* MORE ABOUT */}
              <div className="mt-6 bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  More About
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.moreAboutProduct?.description ||
                    product.description ||
                    "Premium handcrafted product."}
                </p>

                {/* FEATURES ICON GRID */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Premium",
                      desc: "Excellent build quality",
                      color: "green",
                    },
                    {
                      label: "Handmade",
                      desc: "Crafted carefully",
                      color: "yellow",
                    },
                    {
                      label: "Divine",
                      desc: "Positive spiritual energy",
                      color: "indigo",
                    },
                    { label: "Aesthetic", desc: product.title, color: "pink" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div
                        className={
                          "w-9 h-9 rounded-full flex items-center justify-center font-semibold " +
                          (item.color === "green"
                            ? "bg-green-100 text-green-700"
                            : item.color === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.color === "indigo"
                            ? "bg-indigo-100 text-indigo-700"
                            : item.color === "pink"
                            ? "bg-pink-100 text-pink-700"
                            : "")
                        }
                      >
                        {item.label.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-600">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MORE ABOUT THIS PACK */}
              {product.moreAboutProduct?.images?.length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-2xl shadow">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {product.moreAboutProduct.name || "More About This Pack"}
                  </h3>

                  {product.moreAboutProduct.description && (
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {product.moreAboutProduct.description}
                    </p>
                  )}

                  <div className="mt-4 space-y-4">
                    {product.moreAboutProduct.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`pack-${i}`}
                        className="w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* PRODUCT VIDEO — MOBILE & TABLET ONLY */}
            {product.videoUrl && (
              <div className="mt-6 block lg:hidden">
                <div className="bg-white p-4 rounded-2xl shadow">
                  <h4 className="font-semibold mb-2">Product Video</h4>
                  <ProductVideo
                    videoUrl={product.videoUrl}
                    thumbnail={product.images?.[0]}
                  />
                </div>
              </div>
            )}

            {/* RIGHT SIDE */}
            <div className="hidden md:block sticky top-6 self-start">
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-center mt-3 space-x-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={
                          i < Math.round(Number(averageRating) || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({totalReviews} reviews)
                  </span>
                </div>

                <p className="mt-4 text-gray-700 text-[0.95rem]">
                  {product.description || "Beautiful premium Ganpati idol."}
                </p>

                <Certificate />

                <div className="mt-6 flex items-end gap-4">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-green-600">
                      ₹
                      {getPrice(product, selectedPack) *
                        (packQuantities[selectedPack] || 1)}
                    </div>
                    {product.cut_price && (
                      <div className="line-through text-gray-400">
                        ₹{product.cut_price}
                      </div>
                    )}
                  </div>
                </div>

                {/* PACK OPTIONS */}
                {product.packs?.length > 0 && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-700 mb-2">
                      Select Pack
                    </p>
                    <div className="flex flex-col gap-3">
                      {product.packs.map((pack, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPack(pack.name)}
                          className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedPack === pack.name
                              ? "border-green-600 bg-green-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-green-400"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {pack.name} – ₹
                            {getPrice(product, pack.name) *
                              (packQuantities[pack.name] || 1)}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updatePackQuantity(pack.name, -1);
                              }}
                              className="px-3 py-1 border rounded"
                            >
                              -
                            </button>
                            <span>{packQuantities[pack.name] || 1}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updatePackQuantity(pack.name, 1);
                              }}
                              className="px-3 py-1 border rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA BUTTONS */}
                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg tracking-wide transition ${
                      isOutOfStock
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                    }`}
                  >
                    {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`w-full py-3 rounded-xl text-lg font-semibold text-gray-800 transition ${
                      isOutOfStock
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500"
                    }`}
                  >
                    {isOutOfStock ? "Out of Stock" : "💳 Shop Now"}
                  </button>
                </div>

                <Features />

                {/* PRODUCT DETAILS */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Product Details
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {productDetails.map(
                      (item) =>
                        item.value && (
                          <li key={item.key}>
                            <span className="font-medium text-gray-900">
                              {item.label}:
                            </span>{" "}
                            {item.value}
                          </li>
                        )
                    )}
                  </ul>
                </div>

                {/* PRODUCT VIDEO */}
                {product.videoUrl && (
                  <div className="mt-6">
                    <div className="bg-white p-4 rounded-2xl shadow">
                      <h4 className="font-semibold mb-2">Product Video</h4>
                      <ProductVideo
                        videoUrl={product.videoUrl}
                        thumbnail={product.images?.[0]}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

         {/* REVIEWS SUMMARY */}
          {product.reviews?.length > 0 && (
            <div className="mt-14">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Customer Reviews
              </h3>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8">
                {/* Left: Average Rating */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.round(product.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <div className="text-green-600 font-semibold text-lg">
                    {product.rating?.toFixed(2) || "0.0"} out of 5
                  </div>
                  <div className="text-gray-500 text-sm">
                    Based on {product.reviews.length} reviews
                  </div>
                  <GanpatiCustomerReview />
                </div>

                {/* Right: Rating Breakdown */}
                <div className="w-full max-w-md">
                  {Array.from({ length: 5 }, (_, i) => {
                    const starCount = 5 - i;
                    const count = product.reviews.filter(
                      (r) => Math.round(r.rating) === starCount
                    ).length;
                    const percentage =
                      (count / product.reviews.length) * 100 || 0;

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm mb-2"
                      >
                        <span className="w-10">{starCount}★</span>
                        <div className="flex-1 bg-gray-200 h-3 rounded overflow-hidden">
                          <div
                            className="bg-yellow-400 h-3 rounded"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* REVIEW CARDS */}
              <div className="grid gap-6 sm:grid-cols-2">
                {paginatedReviews.map((rev, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition"
                  >
                    {/* HEADER */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-lg">
                          {rev.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-yellow-400 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                          ★ {rev.rating}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {rev.name}
                        </p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              size={14}
                              className={
                                idx < Number(rev.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* COMMENT */}
                    <p className="text-gray-700 text-sm leading-relaxed">
                      “{rev.comment}”
                    </p>

                    {/* IMAGES */}
                    {rev.images?.length > 0 && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {rev.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`review-${idx}`}
                            className="w-20 h-20 rounded-xl object-cover border"
                          />
                        ))}
                      </div>
                    )}

                    {/* DATE */}
                    <p className="text-xs text-gray-400 mt-4">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition ${
                        currentPage === i + 1
                          ? "bg-green-600 text-white"
                          : "border hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
          {/* SIMILAR PRODUCTS */}
          {similarProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">You May Also Like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarProducts.map((sp, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                  >
                    <img
                      src={sp.images?.[0]}
                      alt={sp.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {sp.title}
                      </h4>
                      <p className="text-green-600 font-semibold text-sm mt-1">
                        ₹{sp.current_price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
        </div>
        <VideoAdvertiseList />
      </div>
    </>
  );
};

export default GanpatiDetail;
