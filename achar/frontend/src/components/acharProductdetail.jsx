// AcharProductDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import ProductVideo from "../components/ProductVideo";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import toast from "react-hot-toast";
import Features from "./Features";
import { Star } from "lucide-react";
import Certificate from "./Certificate";
import { Helmet } from "react-helmet-async";
import AcharCustomerReview from "./AcharCustomerReview";
import VideoAdvertiseList from "./VideoAdvertiseList";

const HERO_IMAGE_URL = "/mnt/data/4dc83e6e-457a-4813-963c-0fe8fa4f6c1e.png";

const AcharProductDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [weightQuantities, setWeightQuantities] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const zoomRef = useRef();
  const [zoomStyle, setZoomStyle] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  const getPrice = (prod, weight) => {
    if (!prod) return 0;
    if (prod.pricePerGram) {
      const priceMap = {};
      prod.pricePerGram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        if (w && v) priceMap[w.trim()] = Number(v.trim());
      });
      if (weight) return priceMap[weight] || Number(prod.currentPrice);
      const firstWeight = Object.keys(priceMap)[0];
      return priceMap[firstWeight] || Number(prod.currentPrice);
    }
    return Number(prod.currentPrice);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/category/${slug}/${id}`
        );

        const avgRating =
          data.reviews && data.reviews.length > 0
            ? data.reviews.reduce((sum, r) => sum + r.rating, 0) /
              data.reviews.length
            : 0;

        setProduct({ ...data, rating: avgRating });

        if (data.pricePerGram) {
          const firstWeight = data.pricePerGram
            .split(",")[0]
            .split("=")[0]
            .trim();
          setSelectedWeight(firstWeight);
          setWeightQuantities({ [firstWeight]: 1 });
        } else {
          const firstWeight = data.weightOptions?.split(",")[0] || "";
          setSelectedWeight(firstWeight);
          if (firstWeight) setWeightQuantities({ [firstWeight]: 1 });
        }

        setMainImage(data.productImages?.[0] || HERO_IMAGE_URL);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details!");
      }
    };

    fetchProduct();
  }, [slug, id]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}/similar`);
        setSimilarProducts(data);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    if (product) fetchSimilarProducts();
  }, [id, product]);

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

  const updateWeightQuantity = (weight, change) => {
    setWeightQuantities((prev) => {
      const currentQty = prev[weight] || 1;
      const newQty = Math.max(1, currentQty + change);
      return { ...prev, [weight]: newQty };
    });
  };

  const handleAddToCart = () => {
    if (!selectedWeight) {
      toast.error("⚠️ Please select a weight before adding to cart!");
      return;
    }
    if (isOutOfStock) {
      toast.error("❌ This product/weight is out of stock!");
      return;
    }

    const qty = weightQuantities[selectedWeight] || 1;

    const added = addToCart({
      ...product,
      selectedWeight,
      selectedPrice: getPrice(product, selectedWeight),
      quantity: qty,
      totalPrice: getPrice(product, selectedWeight) * qty,
    });

    if (added) {
      toast.success(
        `${product.productName} (${selectedWeight}) x${qty} added to cart 🛒`
      );
    }
  };

  const handleBuyNow = () => {
    if (!selectedWeight) {
      toast.error("⚠️ Please select a weight!");
      return;
    }
    if (isOutOfStock) {
      toast.error("❌ This product/weight is out of stock!");
      return;
    }

    const qty = weightQuantities[selectedWeight] || 1;

    const singleItemCart = [
      {
        ...product,
        selectedWeight,
        currentPrice: getPrice(product, selectedWeight),
        quantity: qty,
        totalPrice: getPrice(product, selectedWeight) * qty,
      },
    ];

    setCartItems(singleItemCart);
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
    {
      key: "tasteDescription",
      label: "Taste Description",
      value: product.tasteDescription,
    },
    {
      key: "buyMoreTogether",
      label: "Buy More Together",
      value: product.buyMoreTogether,
    },
    {
      key: "moreAboutPickle",
      label: "More About Pickle",
      value: product.moreAboutPickle,
    },
    {
      key: "traditionalRecipes",
      label: "Traditional Recipes",
      value: product.traditionalRecipes,
    },
    {
      key: "localIngredients",
      label: "Local Ingredients",
      value: product.localIngredients,
    },
    {
      key: "driedNaturally",
      label: "Dried Naturally",
      value: product.driedNaturally,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{product.productName} | Gau Samvardhan</title>

        <meta
          name="description"
          content={
            product.shortDescription ||
            product.productTagline ||
            "Premium handmade products from Gau Samvardhan."
          }
        />

        {/* FIXED CANONICAL */}
        <link rel="canonical" href="https://www.gausamvardhan.com/" />

        <meta property="og:type" content="product" />
        <meta
          property="og:title"
          content={`${product.productName} | Gau Samvardhan`}
        />
        <meta
          property="og:description"
          content={product.shortDescription || product.productTagline}
        />
        <meta
          property="og:image"
          content={product.productImages?.[0] || HERO_IMAGE_URL}
        />
        <meta property="og:url" content="https://www.gausamvardhan.com/" />
        <meta property="og:site_name" content="Gau Samvardhan" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${product.productName} | Gau Samvardhan`}
        />
        <meta
          name="twitter:description"
          content={product.shortDescription || product.productTagline}
        />
        <meta
          name="twitter:image"
          content={product.productImages?.[0] || HERO_IMAGE_URL}
        />

        <meta
          name="keywords"
          content={`Achar, Pickle, ${product.productName}, Gau Samvardhan, Organic Pickle, Homemade Pickle`}
        />

        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="text-[0.9rem] bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="order-1 md:order-1">
              {/* MAIN IMAGE + HERO */}
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
                    alt={product.productName}
                    className="w-full h-[360px] md:h-[460px] object-contain rounded-xl border-2 border-white shadow-lg bg-white"
                  />
                </div>

                <div className="absolute right-6 bottom-6 bg-white/90 border rounded-lg p-3 text-sm shadow">
                  <div className="font-semibold">
                    {product.brand || "Gausamvardhan"}
                  </div>
                  <div className="text-xs text-gray-600">
                    India's Best Pickle
                  </div>
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
                {product.productImages?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 border rounded-lg overflow-hidden p-1 transition-transform hover:scale-105 ${
                      mainImage === img
                        ? "ring-2 ring-green-400"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${index}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* MORE ABOUT (EXISTING BLOCK - UNTOUCHED) */}
              <div className="mt-6 bg-white p-6 rounded-2xl shadow hidden md:block">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  More About
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.moreAboutPickle ||
                    "Rich, traditional amlaprash made with desi khand and A2 Gir cow ghee."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                      A
                    </div>
                    <div>
                      <div className="font-medium">Authentic</div>
                      <div className="text-xs text-gray-600">
                        Small-batch, traditional recipe
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center font-semibold text-yellow-700">
                      A
                    </div>
                    <div>
                      <div className="font-medium">Achar</div>
                      <div className="text-xs text-gray-600">
                        Home Made Achar
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                      N
                    </div>
                    <div>
                      <div className="font-medium">No Preservatives</div>
                      <div className="text-xs text-gray-600">
                        Naturally preserved
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center font-semibold text-pink-700">
                      T
                    </div>
                    <div>
                      <div className="font-medium">Taste</div>
                      <div className="text-xs text-gray-600">
                        {product.tasteDescription || "Sweet & tangy"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ⭐⭐⭐ NEW SECTION — More About This Pack ⭐⭐⭐ */}
              {product.moreAboutThisPack && (
                <div className="hidden md:block">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {product.moreAboutThisPack.header || "More About This Pack"}
                  </h3>

                  {product.moreAboutThisPack.description && (
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {product.moreAboutThisPack.description}
                    </p>
                  )}

                  {product.moreAboutThisPack.images?.length > 0 && (
                    <div className="mt-4">
                      {product.moreAboutThisPack.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`pack-img-${index}`}
                          className="w-full rounded-xl mb-4 object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="order-2 md:order-2 md:sticky md:top-6 self-start">
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-lg">
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {product.productName}
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
                <Certificate />

                <p className="mt-4 text-gray-700 text-[0.95rem]">
                  {product.shortDescription ||
                    product.productTagline ||
                    "Handcrafted, fresh & delicious."}
                </p>

                <div className="mt-6 flex items-end gap-4">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-green-600">
                      ₹
                      {getPrice(product, selectedWeight) *
                        (weightQuantities[selectedWeight] || 1)}
                    </div>
                    {product.cutPrice && (
                      <div className="line-through text-gray-400">
                        ₹{product.cutPrice}
                      </div>
                    )}
                  </div>
                </div>

                {/* WEIGHT OPTIONS */}
                {(product.pricePerGram || product.weightOptions) && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-700 mb-2">
                      Select Weight
                    </p>

                    <div className="flex flex-col gap-3">
                      {(
                        product.pricePerGram
                          ?.split(",")
                          .map((p) => p.split("=")[0].trim()) ||
                        product.weightOptions.split(",")
                      )?.map((weight, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedWeight(weight)}
                          className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedWeight === weight
                              ? "border-green-600 bg-green-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-green-400"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {weight} - ₹
                            {getPrice(product, weight) *
                              (weightQuantities[weight] || 1)}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateWeightQuantity(weight, -1);
                              }}
                              className="px-3 py-1 border rounded"
                            >
                              -
                            </button>

                            <span>{weightQuantities[weight] || 1}</span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateWeightQuantity(weight, 1);
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
                {/* MORE ABOUT (MOBILE ONLY) */}
                <div className="mt-6 bg-white p-6 rounded-2xl shadow block md:hidden">
                  <h3 className="text-lg md:text-xl font-semibold mb-3">
                    More About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.moreAboutPickle ||
                      "Rich, traditional amlaprash made with desi khand and A2 Gir cow ghee."}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                        A
                      </div>
                      <div>
                        <div className="font-medium">Authentic</div>
                        <div className="text-xs text-gray-600">
                          Small-batch, traditional recipe
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center font-semibold text-yellow-700">
                        A
                      </div>
                      <div>
                        <div className="font-medium">Achar</div>
                        <div className="text-xs text-gray-600">
                          Home Made Achar
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                        N
                      </div>
                      <div>
                        <div className="font-medium">No Preservatives</div>
                        <div className="text-xs text-gray-600">
                          Naturally preserved
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center font-semibold text-pink-700">
                        T
                      </div>
                      <div>
                        <div className="font-medium">Taste</div>
                        <div className="text-xs text-gray-600">
                          {product.tasteDescription || "Sweet & tangy"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ⭐⭐⭐ NEW SECTION — More About This Pack ⭐⭐⭐ */}

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
              {/* MORE ABOUT THIS PACK — MOBILE (Product Details ke neeche) */}
              {product.moreAboutThisPack && (
                <div className="mt-6 bg-white p-5 rounded-2xl shadow md:hidden">
                  <h3 className="text-lg font-semibold mb-2">
                    {product.moreAboutThisPack.header || "More About This Pack"}
                  </h3>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    {product.moreAboutThisPack.description}
                  </p>

                  {product.moreAboutThisPack.images?.length > 0 && (
                    <div className="space-y-3">
                      {product.moreAboutThisPack.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`pack-img-${index}`}
                          className="w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCT VIDEO */}
              {product.videoUrl && (
                <div className="mt-6">
                  <div className="bg-white p-4 rounded-2xl shadow">
                    <h4 className="font-semibold mb-2">Product Video</h4>
                    <ProductVideo
                      videoUrl={product.videoUrl}
                      thumbnail={product.productImages?.[0]}
                    />
                  </div>
                </div>
              )}
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
                  <AcharCustomerReview />
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
              <h3 className="text-xl font-semibold mb-6">Similar Products</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {similarProducts.map((item) => (
                  <div
                    key={item._id}
                    className="group border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/products/${item.categorySlug || slug}/${item._id}`
                      )
                    }
                  >
                    <img
                      src={item.productImages?.[0]}
                      alt={item.productName}
                      className="w-full h-40 object-contain mb-2 rounded-lg"
                    />
                    <h4 className="text-gray-900 font-medium text-sm">
                      {item.productName}
                    </h4>
                    <p className="text-green-600 font-semibold mt-1">
                      ₹{getPrice(item)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <VideoAdvertiseList />
      </div>
    </>
  );
};

export default AcharProductDetail;
