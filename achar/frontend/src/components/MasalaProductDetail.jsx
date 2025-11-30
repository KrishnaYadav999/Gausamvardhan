// MasalaProductDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import ProductVideo from "../components/ProductVideo";
import Features from "./Features";
import { Star } from "lucide-react";

const HERO_IMAGE_URL = "/mnt/data/4dc83e6e-457a-4813-963c-0fe8fa4f6c1e.png";

const MasalaProductDetail = () => {
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

  // ------------------ helpers ------------------
  const safe = (obj, ...keys) => {
    for (const k of keys) if (obj && obj[k] !== undefined) return obj[k];
    return undefined;
  };

  const parsePriceString = (priceStr) => {
    const map = {};
    if (!priceStr || typeof priceStr !== "string") return map;
    priceStr.split(",").forEach((p) => {
      const [w, v] = p.split("=");
      if (!w) return;
      map[w.trim()] = Number((v || "").trim()) || 0;
    });
    return map;
  };

  const getPrice = (prod, weight) => {
    if (!prod) return 0;
    const ppg = safe(prod, "pricePerGram") || safe(prod, "pricepergram") || prod.pricepergram || prod.pricePerGram || "";
    const currentPrice = Number(safe(prod, "currentPrice") ?? safe(prod, "current_price") ?? prod.current_price ?? prod.currentPrice ?? 0) || 0;

    if (ppg) {
      const priceMap = parsePriceString(ppg);
      if (weight && priceMap[weight]) return priceMap[weight];
      const firstKey = Object.keys(priceMap)[0];
      if (firstKey) return priceMap[firstKey] || currentPrice;
    }

    return currentPrice || 0;
  };

  const getWeightOptions = (prod) => {
    const ppg = safe(prod, "pricePerGram") || safe(prod, "pricepergram") || prod.pricepergram || prod.pricePerGram || "";
    if (ppg) return ppg.split(",").map((p) => p.split("=")[0].trim());
    if (prod.gram) return [prod.gram];
    if (prod.weightOptions && typeof prod.weightOptions === "string") return prod.weightOptions.split(",").map((w) => w.trim());
    return [];
  };

  // ------------------ fetch product ------------------
  useEffect(() => {
    const fetchProduct = async () => {
      setProduct(null);
      setSelectedWeight("");
      setWeightQuantities({});
      setMainImage("");

      try {
        let res;
        try {
          res = await axios.get(`/api/masala-products/${id}`);
        } catch (e) {
          // fallback to generic product route
          res = await axios.get(`/api/products/category/${slug}/${id}`);
        }

        const data = res.data;

        // compute avg rating
        const avgRating =
          data?.reviews && data.reviews.length > 0
            ? data.reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / data.reviews.length
            : Number(data.rating) || 0;

        const normalized = {
          ...data,
          productName: data.title || data.productName || data.name || data.product_name || data.title,
          productImages: data.images || data.productImages || [],
          pricepergram: data.pricepergram || data.pricePerGram || data.pricePerGram || "",
          current_price: data.current_price ?? data.currentPrice ?? data.current_price,
          cut_price: data.cut_price ?? data.cutPrice ?? data.cut_price,
          rating: avgRating,
          reviews: data.reviews || [],
          videoUrl: data.videoUrl || data.video || data.video_url || "",
          moreAboutProduct: data.moreAboutProduct || data.moreAboutProduct || [], // matches your backend array
        };

        setProduct(normalized);

        const weightOptions = getWeightOptions(normalized);
        if (weightOptions.length > 0) {
          setSelectedWeight(weightOptions[0]);
          setWeightQuantities({ [weightOptions[0]]: 1 });
        }

        setMainImage(normalized.productImages?.[0] || HERO_IMAGE_URL);
      } catch (err) {
        console.error("Error fetching masala product:", err);
        toast.error("Failed to load product details!");
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, id]);

  // ------------------ fetch similar ------------------
  useEffect(() => {
    const fetchSimilar = async () => {
      if (!product) return;
      try {
        let data = [];
        try {
          const res = await axios.get(`/api/masala-products/${product._id}/similar`);
          data = res.data;
        } catch (e) {
          const res = await axios.get(`/api/products/${product._id}/similar`);
          data = res.data;
        }
        setSimilarProducts(data || []);
      } catch (err) {
        console.error("Error fetching similar products:", err);
      }
    };
    fetchSimilar();
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading product...
      </div>
    );
  }

  // ------------------ stock & qty ------------------
  const isOutOfStock = product.stock === false || product.stockQuantity === 0;

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
    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedWeight,
      selectedPrice: getPrice(product, selectedWeight),
      quantity: qty,
      totalPrice: getPrice(product, selectedWeight) * qty,
      cutPrice: product.cut_price || product.cutPrice || 0,
      productImages: product.productImages || [],
    });

    toast.success(`${product.productName} (${selectedWeight}) x${qty} added to cart!`);
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
    setCartItems([
      {
        _id: product._id,
        productName: product.productName,
        selectedWeight,
        currentPrice: getPrice(product, selectedWeight),
        quantity: qty,
        totalPrice: getPrice(product, selectedWeight) * qty,
        cutPrice: product.cut_price || product.cutPrice || 0,
        productImages: product.productImages || [],
      },
    ]);
    navigate("/checkout");
  };

  // ------------------ zoom handlers ------------------
  const handleMouseMove = (e) => {
    if (!zoomRef.current) return;
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
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

  // ------------------ derived values ------------------
  const totalReviews = product.reviews?.length || 0;
  const averageRating = product.rating ? Number(product.rating).toFixed(1) : "0.0";
  const weightOptions = getWeightOptions(product);
  const weightOptionsToRender = weightOptions.length > 0 ? weightOptions : [];

  return (
    <>
      <div className="text-[0.9rem] bg-gray-50 min-h-screen">
        <Toaster position="top-right" />
        <div className="max-w-screen-xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* LEFT */}
            <div>
              {/* HERO + MAIN IMAGE */}
              <div
                ref={zoomRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative bg-white rounded-3xl p-6 shadow-2xl overflow-hidden"
              >
                <div className="w-full h-[420px] md:h-[580px] flex items-center justify-center">
                  <img src={HERO_IMAGE_URL} alt="hero" className="object-cover w-full h-full rounded-xl" />
                </div>

                <div className="absolute left-6 top-10 md:left-10 md:top-16 w-[70%] md:w-[65%] transform -translate-y-6 md:-translate-y-12">
                  <img
                    src={mainImage}
                    alt={product.productName}
                    className="w-full h-[360px] md:h-[460px] object-contain rounded-xl border-2 border-white shadow-lg bg-white"
                  />
                </div>

                <div className="absolute right-6 bottom-6 bg-white/90 border rounded-lg p-3 text-sm shadow">
                  <div className="font-semibold">{product.brand || product.manufacturer || "Local"}</div>
                  <div className="text-xs text-gray-600">{product.tagline || "Premium quality masala"}</div>
                </div>

                {zoomStyle.backgroundImage && <div className="absolute inset-0 pointer-events-none" style={{ ...zoomStyle }} />}
              </div>

              {/* THUMBNAILS */}
              <div className="mt-4 flex items-center gap-3 overflow-x-auto py-2">
                {(product.productImages || product.images || []).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`flex-shrink-0 border rounded-lg overflow-hidden p-1 transition-transform hover:scale-105 ${
                      mainImage === img ? "ring-2 ring-green-400" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`thumb-${index}`} className="w-20 h-20 object-cover" />
                  </button>
                ))}
              </div>

              {/* MORE ABOUT */}
              <div className="mt-6 bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg md:text-xl font-semibold mb-3">More About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.moreAbout || product.description || product.shortDescription || "Handcrafted, fresh & aromatic masala."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">M</div>
                    <div>
                      <div className="font-medium">Authentic</div>
                      <div className="text-xs text-gray-600">Small-batch, traditional recipe</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center font-semibold text-yellow-700">S</div>
                    <div>
                      <div className="font-medium">Spice Rich</div>
                      <div className="text-xs text-gray-600">Balanced & fresh spices</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">N</div>
                    <div>
                      <div className="font-medium">No Additives</div>
                      <div className="text-xs text-gray-600">No artificial preservatives</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center font-semibold text-pink-700">T</div>
                    <div>
                      <div className="font-medium">Taste</div>
                      <div className="text-xs text-gray-600">{product.tasteDescription || "Bold & aromatic"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MORE ABOUT PRODUCT (uses backend array moreAboutProduct) */}
              {product.moreAboutProduct && product.moreAboutProduct.length > 0 && (
                <div className="mt-6 bg-white p-6 rounded-2xl shadow">
                  <h3 className="text-lg md:text-xl font-semibold">More About This Product</h3>

                  <div className="mt-4 space-y-6">
                    {product.moreAboutProduct.map((item, idx) => (
                      <div key={idx} className="border-b pb-6 last:border-none">
                        {item.description && <p className="text-gray-700 leading-relaxed mb-3">{item.description}</p>}
                        {item.image && <img src={item.image} alt={`more-about-${idx}`} className="w-full rounded-xl object-cover" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT (sticky) */}
            <div className="sticky top-6 self-start">
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">{product.productName}</h1>

                <div className="flex items-center mt-3 space-x-3">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={18} className={i < Math.round(Number(averageRating) || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">({totalReviews} reviews)</span>
                </div>

                <p className="mt-4 text-gray-700 text-[0.95rem]">{product.shortDescription || product.productTagline || ""}</p>

                <div className="mt-6 flex items-end gap-4">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-green-600">₹{getPrice(product, selectedWeight) * (weightQuantities[selectedWeight] || 1)}</div>
                    {(product.cut_price || product.cutPrice) && <div className="line-through text-gray-400">₹{product.cut_price || product.cutPrice}</div>}
                  </div>
                </div>

                {/* WEIGHT OPTIONS */}
                {(product.pricepergram || product.pricePerGram || product.gram) && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-700 mb-2">Select Weight</p>
                    <div className="flex flex-col gap-3">
                      {weightOptionsToRender.map((weight, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedWeight(weight)}
                          className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedWeight === weight ? "border-green-600 bg-green-50 shadow-sm" : "border-gray-200 bg-white hover:border-green-400"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {weight} - ₹{getPrice(product, weight) * (weightQuantities[weight] || 1)}
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

                {/* CTA */}
                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button onClick={handleAddToCart} disabled={isOutOfStock} className={`w-full py-4 rounded-xl text-white font-bold text-lg tracking-wide transition ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"}`}>
                    {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
                  </button>

                  <button onClick={handleBuyNow} disabled={isOutOfStock} className={`w-full py-3 rounded-xl text-lg font-semibold text-gray-800 transition ${isOutOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"}`}>
                    {isOutOfStock ? "Out of Stock" : "💳 Shop Now"}
                  </button>
                </div>

                <Features />

                {/* Product details */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {product.about_table?.map((item, idx) => <li key={`about-${idx}`}>{item}</li>)}
                    {product.about_more?.map((item, idx) => <li key={`more-${idx}`}>{item}</li>)}
                    {product.technical_details && Object.keys(product.technical_details).length > 0 && (
                      <li><strong>Technical:</strong> {Object.entries(product.technical_details).map(([k, v]) => `${k}: ${v}`).join(" • ")}</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* PRODUCT VIDEO */}
              {product.videoUrl && (
                <div className="mt-6">
                  <div className="bg-white p-4 rounded-2xl shadow">
                    <h4 className="font-semibold mb-2">Product Video</h4>
                    <ProductVideo videoUrl={product.videoUrl} thumbnail={(product.productImages || product.images || [])[0]} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* REVIEWS */}
          {product.reviews?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.map((rev, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {rev.name ? rev.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{rev.name || "Anonymous"}</div>
                        <div className="flex mt-1">{Array.from({ length: Number(rev.rating) || 0 }).map((_, idx) => <Star key={idx} size={14} className="text-yellow-400 fill-yellow-400" />)}</div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-snug">{rev.comment}</p>

                    {rev.images?.length > 0 && (
                      <div className="flex mt-3 gap-2 flex-wrap">
                        {rev.images.map((img, idx) => <img key={idx} src={img} alt={`review-${idx}`} className="w-20 h-20 rounded-lg object-cover" />)}
                      </div>
                    )}

                    <p className="text-gray-400 text-xs mt-2">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIMILAR PRODUCTS */}
          {similarProducts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6">Similar Products</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {similarProducts.map((item) => (
                  <div key={item._id} className="group border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/masala-product/${item.slug || item._id}/${item._id}`)}>
                    <img src={(item.images && item.images[0]) || (item.productImages && item.productImages[0]) || "https://via.placeholder.com/150"} alt={item.title || item.productName} className="w-full h-40 object-contain mb-2 rounded-lg" />
                    <h4 className="text-gray-900 font-medium text-sm">{item.title || item.productName}</h4>
                    <p className="text-green-600 font-semibold mt-1">₹{getPrice(item)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MasalaProductDetail;
