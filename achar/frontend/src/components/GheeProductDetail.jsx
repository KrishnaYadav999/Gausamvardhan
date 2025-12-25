// GheeProductDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import ProductVideo from "../components/ProductVideo"; // same component used in Achar UI
import toast from "react-hot-toast";
import Features from "./Features";
import { Star } from "lucide-react";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import ImageZoom from "./ImageZoom";
import Certificate from "./Certificate";
import { Helmet } from "react-helmet-async";
import GheeCustomerReview from "./GheeCustomerReview";
import VideoAdvertiseList from "./VideoAdvertiseList";

const HERO_IMAGE_URL = "/mnt/data/4dc83e6e-457a-4813-963c-0fe8fa4f6c1e.png"; // use same hero or change

const GheeProductDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [weightQuantities, setWeightQuantities] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const zoomRef = useRef();
  const [zoomStyle, setZoomStyle] = useState({});

   const [currentPage, setCurrentPage] = useState(1);

  // Helper to compute price from pricePerGram or currentPrice
  const getPrice = (prod, weight) => {
    if (!prod) return 0;
    // If pricePerGram exists, parse into map
    if (prod.pricePerGram) {
      const priceMap = {};
      prod.pricePerGram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        if (w && v) priceMap[w.trim()] = Number(v.trim());
      });
      if (weight)
        return (
          priceMap[weight] ||
          Number(prod.currentPrice || prod.current_price || 0)
        );
      const firstWeight = Object.keys(priceMap)[0];
      return (
        priceMap[firstWeight] ||
        Number(prod.currentPrice || prod.current_price || 0)
      );
    }

    // Fallback to weightVolume logic (comma separated) -> cannot map price, return currentPrice
    return Number(prod.currentPrice || prod.current_price || 0);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Using your Ghee API route
        const { data } = await axios.get(
          `/api/ghee-products/category/${slug}/${id}`
        );

        // compute avg rating from reviews
        const avgRating =
          data.reviews && data.reviews.length > 0
            ? data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
              data.reviews.length
            : 0;

        // keep rating field
        const normalized = { ...data, rating: avgRating };

        setProduct(normalized);

        // default selected weight
        if (data.pricePerGram) {
          const firstWeight = data.pricePerGram
            .split(",")[0]
            .split("=")[0]
            .trim();
          setSelectedWeight(firstWeight);
          setWeightQuantities({ [firstWeight]: 1 });
        } else if (data.weightVolume) {
          const firstWeight = data.weightVolume.split(",")[0].trim();
          setSelectedWeight(firstWeight);
          setWeightQuantities({ [firstWeight]: 1 });
        }

        // main image - using product.images (assumed)
        setMainImage(data.images?.[0] || HERO_IMAGE_URL);
      } catch (error) {
        console.error("Error fetching ghee product:", error);
        toast.error("Failed to load product details!");
      }
    };

    fetchProduct();
  }, [slug, id]);

  // fetch similar when product loaded
  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const { data } = await axios.get(`/api/ghee-products/${id}/similar`);
        setSimilarProducts(data || []);
      } catch (err) {
        console.error("Error fetching similar ghee products:", err);
      }
    };
    if (product) fetchSimilar();
  }, [product, id]);

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
    const price = getPrice(product, selectedWeight);

    const added = addToCart({
      _id: product._id,
      productName: product.title || product.productName,
      selectedWeight,
      selectedPrice: price,
      quantity: qty,
      totalPrice: price * qty,
      cutPrice: parseFloat(product.cutPrice) || 0,
      productImages: product.images || [],
    });
    if (added) {
      toast.success(
        `${
          product.title || product.productName
        } (${selectedWeight}) x${qty} added to cart!`
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
    const price = getPrice(product, selectedWeight);

    const singleItemCart = [
      {
        _id: product._id,
        productName: product.title || product.productName,
        selectedWeight,
        currentPrice: price,
        quantity: qty,
        totalPrice: price * qty,
        productImages: product.images || [],
      },
    ];

    setCartItems(singleItemCart);
    navigate("/checkout");
  };

  // zoom handlers (same UX as Achar)
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

  // product-specific details to show in product details list (adapted)
  const productDetails = [
    { key: "origin", label: "Origin", value: product.origin },
    {
      key: "madeFrom",
      label: "Made From",
      value: product.madeFrom || "A2 Gir Cow Milk",
    },
    { key: "shelfLife", label: "Shelf Life", value: product.shelfLife },
    { key: "storage", label: "Storage", value: product.storageInstructions },
    {
      key: "packInfo",
      label: "Pack Info",
      value: product.moreAboutProduct?.[0]?.description,
    },
  ];

  // weights array (from pricePerGram or weightVolume)
  const weights = product.pricePerGram
    ? product.pricePerGram.split(",").map((p) => p.split("=")[0].trim())
    : product.weightVolume?.split(",").map((w) => w.trim()) || [];

  return (
    <>
      <Helmet>
        <title>{product?.title || "Pure A2 Ghee | Gausamvardhan"}</title>

        <meta
          name="description"
          content={
            product?.shortDescription ||
            "Buy 100% Pure A2 Ghee made from Gir Cow milk. Handcrafted, chemical-free ghee with rich aroma & premium quality from Gausamvardhan."
          }
        />

        <meta
          name="keywords"
          content="A2 ghee, gir cow ghee, pure ghee, organic ghee, desi ghee, bilona ghee, gausamvardhan ghee"
        />

        <link
          rel="canonical"
          href={`https://www.gausamvardhan.com/ghee-product/${slug}/${id}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta
          property="og:title"
          content={product?.title || "Gausamvardhan Pure A2 Gir Cow Ghee"}
        />
        <meta
          property="og:description"
          content={
            product?.shortDescription ||
            "Buy Pure A2 Gir Cow Ghee online. Traditional method, organic, high aroma, rich nutrition."
          }
        />
        <meta
          property="og:image"
          content={
            product?.images?.[0] ||
            "https://www.gausamvardhan.com/default-ghee.jpg"
          }
        />
        <meta
          property="og:url"
          content={`https://www.gausamvardhan.com/ghee-product/${slug}/${id}`}
        />
        <meta property="og:site_name" content="Gausamvardhan" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={product?.title || "Pure A2 Ghee | Gausamvardhan"}
        />
        <meta
          name="twitter:description"
          content={
            product?.shortDescription ||
            "Pure A2 Gir Cow Ghee handcrafted with traditional method. Order online."
          }
        />
        <meta
          name="twitter:image"
          content={
            product?.images?.[0] ||
            "https://www.gausamvardhan.com/default-ghee.jpg"
          }
        />

        <meta name="robots" content="index, follow" />

        {/* JSON-LD (IMPORTANT FIXED VERSION) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product?.title || "Gausamvardhan Pure A2 Ghee",
            image: product?.images?.[0] || "",
            description: product?.shortDescription || "",
            sku: product?._id || "",
            brand: {
              "@type": "Brand",
              name: "Gausamvardhan",
            },
            offers: {
              "@type": "Offer",
              url: `https://www.gausamvardhan.com/ghee-product/${slug}/${id}`,
              priceCurrency: "INR",
              price: getPrice(product, selectedWeight) || "",
              availability: `https://schema.org/${
                isOutOfStock ? "OutOfStock" : "InStock"
              }`,
            },
          })}
        </script>
      </Helmet>

      <div className="text-[0.9rem] bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* LEFT: Hero + Images */}
            <div>
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
                  {/* main product image */}
                  <img
                    src={mainImage}
                    alt={product.title || product.productName}
                    className="w-full h-[360px] md:h-[460px] object-contain rounded-xl border-2 border-white shadow-lg bg-white"
                  />
                </div>

                <div className="absolute right-6 bottom-6 bg-white/90 border rounded-lg p-3 text-sm shadow">
                  <div className="font-semibold">
                    {product.brand || "Our Ghee"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {product.tagline || "Pure A2 Ghee"}
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
                {(product.images || []).map((img, index) => (
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

              {/* MOBILE PURCHASE CARD — SAME AS ACHAR */}
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
                  {product.shortDescription ||
                    product.tagline ||
                    "Handcrafted, fresh & delicious ghee."}
                </p>

                <Certificate />

                {/* Price */}
                <div className="mt-3 text-2xl font-bold text-green-600">
                  ₹
                  {getPrice(product, selectedWeight) *
                    (weightQuantities[selectedWeight] || 1)}
                </div>

                {product.cutPrice && (
                  <div className="line-through text-gray-400">
                    ₹{product.cutPrice}
                  </div>
                )}

                {/* WEIGHT OPTIONS */}
                {(product.pricePerGram || product.weightVolume) && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2 text-sm">
                      Select Weight
                    </p>

                    <div className="flex flex-col gap-2">
                      {(product.pricePerGram
                        ? product.pricePerGram
                            .split(",")
                            .map((p) => p.split("=")[0].trim())
                        : product.weightVolume.split(",")
                      ).map((weight, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedWeight(weight)}
                          className={`flex items-center justify-between border p-2 rounded-lg ${
                            selectedWeight === weight
                              ? "border-green-600 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {weight} – ₹{getPrice(product, weight)}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateWeightQuantity(weight, -1);
                              }}
                              className="px-2 border rounded"
                            >
                              -
                            </button>
                            <span className="text-sm">
                              {weightQuantities[weight] || 1}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateWeightQuantity(weight, 1);
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

                {/* CTA */}
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

                <h3 className="text-lg font-semibold mb-2">Product Details</h3>
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

              {/* MORE ABOUT - left column */}
              <div className="mt-6 bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg md:text-xl font-semibold mb-3">
                  More About
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.moreAboutProduct?.[0]?.description ||
                    product.description ||
                    "Rich, traditional ghee made from A2 Gir cow milk."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                      A
                    </div>
                    <div>
                      <div className="font-medium">Authentic</div>
                      <div className="text-xs text-gray-600">
                        Small-batch, traditional process
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center font-semibold text-yellow-700">
                      G
                    </div>
                    <div>
                      <div className="font-medium">Ghee Rich</div>
                      <div className="text-xs text-gray-600">
                        Made with pure A2 milk
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                      N
                    </div>
                    <div>
                      <div className="font-medium">No Additives</div>
                      <div className="text-xs text-gray-600">
                        No preservatives
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
                        {product.tasteDescription || "Pure, buttery & nutty"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPTIONAL: moreAboutProduct images block */}
              {product.moreAboutProduct?.length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-2xl shadow">
                  <h3 className="text-lg md:text-xl font-semibold mb-3">
                    More About This Pack
                  </h3>
                  {product.moreAboutProduct.map((m, idx) => (
                    <div key={idx} className="mb-4">
                      {m.image && (
                        <img
                          src={m.image}
                          alt={`more-${idx}`}
                          className="w-full rounded-xl mb-2 object-cover"
                        />
                      )}
                      {m.description && (
                        <p className="text-gray-700">{m.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

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
            </div>

            {/* RIGHT: Sticky purchase card */}
            <div className="hidden md:block sticky top-6 self-start">
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  {product.title || product.productName}
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
                  {product.shortDescription ||
                    product.tagline ||
                    "Handcrafted, fresh & delicious ghee."}
                </p>
                <Certificate />

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
                {(product.pricePerGram || product.weightVolume) && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-700 mb-2">
                      Select Weight
                    </p>

                    <div className="flex flex-col gap-3">
                      {(product.pricePerGram
                        ? product.pricePerGram
                            .split(",")
                            .map((p) => p.split("=")[0].trim())
                        : product.weightVolume.split(",")
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
                          <GheeCustomerReview />
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
                        `/ghee-product/${item.slug || item._id}/${item._id}`
                      )
                    }
                  >
                    <img
                      src={item.images?.[0] || HERO_IMAGE_URL}
                      alt={item.title || item.productName}
                      className="w-full h-40 object-contain mb-2 rounded-lg"
                    />
                    <h4 className="text-gray-900 font-medium text-sm">
                      {item.title || item.productName}
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
      </div>
      <div>
        <VideoAdvertiseList />
      </div>
    </>
  );
};

export default GheeProductDetail;
