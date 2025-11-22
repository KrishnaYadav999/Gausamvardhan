// OilProductDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import ProductVideo from "../components/ProductVideo";
import Features from "./Features";
import { Star } from "lucide-react";

const HERO_IMAGE_URL = "/mnt/data/4dc83e6e-457a-4813-963c-0fe8fa4f6c1e.png";

const OilProductDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState("");
  const [volumeQuantities, setVolumeQuantities] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const zoomRef = useRef();
  const [zoomStyle, setZoomStyle] = useState({});

  // ------------------ helpers ------------------
  const normalizePrice = (p) => {
    if (p === undefined || p === null) return 0;
    if (typeof p === "number") return p;
    // strip non-numeric (preserve decimals)
    const n = parseFloat(String(p).replace(/[^0-9.]/g, ""));
    return isNaN(n) ? 0 : n;
  };

  // get price for a given volume (perPriceLiter entries or fallback to currentPrice)
  const getPrice = (prod, volume) => {
    if (!prod) return 0;
    const per = prod.perPriceLiter || prod.per_price_liter || prod.perPrice || [];
    if (per && Array.isArray(per) && per.length > 0) {
      if (volume) {
        const found = per.find((x) => String(x.volume) === String(volume));
        if (found) return normalizePrice(found.price);
      }
      // fallback to first
      const first = per[0];
      return normalizePrice(first?.price ?? prod.currentPrice ?? prod.current_price);
    }
    return normalizePrice(prod.currentPrice ?? prod.current_price);
  };

  // safe accessor (similar to Masala safe)
  const safe = (obj, ...keys) => {
    for (const k of keys) if (obj && obj[k] !== undefined) return obj[k];
    return undefined;
  };

  // ------------------ fetch product ------------------
  useEffect(() => {
    const fetchProduct = async () => {
      setProduct(null);
      setSelectedVolume("");
      setVolumeQuantities({});
      setMainImage("");

      try {
        // primary oil endpoint
        const res = await axios.get(`/api/oils/category/${slug}/${id}`);
        const data = res.data;

        // normalize shape to match Masala UI expectations
        const normalized = {
          ...data,
          productName: data.productName || data.title || data.name,
          productImages: data.productImages || data.images || [],
          perPriceLiter: data.perPriceLiter || data.per_price_liter || data.perPrice || [],
          currentPrice: data.currentPrice ?? data.current_price ?? data.current_price,
          cutPrice: data.cutPrice ?? data.cut_price ?? data.cut_price,
          rating: data.rating ?? 0,
          reviews: data.reviews || [],
          videoUrl: data.videoUrl || data.video || data.video_url || "",
          moreAboutProduct: data.moreAboutProduct || data.moreAboutProduct || [],
          description: data.description || data.shortDescription || "",
          allDetails: data.allDetails || data.all_details || "",
          stock: data.stock === undefined ? true : data.stock,
          stockQuantity: data.stockQuantity ?? data.stock_quantity ?? 0,
          tagline: data.tagline || ""
        };

        // compute average rating if reviews present (like Masala)
        const avgRating =
          normalized.reviews && normalized.reviews.length > 0
            ? normalized.reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) /
              normalized.reviews.length
            : Number(normalized.rating) || 0;
        normalized.rating = avgRating;

        setProduct(normalized);

        // default selectedVolume from perPriceLiter first volume
        const firstVolume = normalized.perPriceLiter?.[0]?.volume || "";
        if (firstVolume) {
          setSelectedVolume(firstVolume);
          setVolumeQuantities({ [firstVolume]: 1 });
        }

        setMainImage(normalized.productImages?.[0] || HERO_IMAGE_URL);

        // fetch similar products (separate call)
        try {
          const sim = await axios.get(`/api/oils/${id}/similar`);
          setSimilarProducts(sim.data || []);
        } catch (_) {
          setSimilarProducts([]);
        }
      } catch (error) {
        console.error("Error fetching oil product:", error);
        toast.error("❌ Failed to load product details");
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, id]);

  // ------------------ quantity helpers ------------------
  const updateVolumeQuantity = (volume, change) => {
    setVolumeQuantities((prev) => {
      const currentQty = prev[volume] || 1;
      const newQty = Math.max(1, currentQty + change);
      return { ...prev, [volume]: newQty };
    });
  };

  // ------------------ cart actions ------------------
  const isOutOfStock = product && (product.stock === false || Number(product.stockQuantity) === 0);

  const handleAddToCart = () => {
    if (!selectedVolume) {
      toast.error("⚠️ Please select a volume before adding to cart!");
      return;
    }
    if (isOutOfStock) {
      toast.error("❌ This product is out of stock!");
      return;
    }

    const qty = volumeQuantities[selectedVolume] || 1;
    const selectedPrice = getPrice(product, selectedVolume);

    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedVolume,
      selectedPrice,
      quantity: qty,
      totalPrice: selectedPrice * qty,
      cutPrice: product.cutPrice || product.cut_price || 0,
      productImages: product.productImages || [],
    });

    toast.success(`${product.productName} (${selectedVolume}) x${qty} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedVolume) {
      toast.error("⚠️ Please select a volume!");
      return;
    }
    if (isOutOfStock) {
      toast.error("❌ This product is out of stock!");
      return;
    }

    const qty = volumeQuantities[selectedVolume] || 1;
    const currentPrice = getPrice(product, selectedVolume);

    setCartItems([
      {
        _id: product._id,
        productName: product.productName,
        selectedVolume,
        currentPrice,
        quantity: qty,
        totalPrice: currentPrice * qty,
        cutPrice: product.cutPrice || product.cut_price || 0,
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading product...
      </div>
    );
  }

  // ------------------ derived values ------------------
  const totalReviews = product.reviews?.length || 0;
  const averageRating = product.rating ? Number(product.rating).toFixed(1) : "0.0";
  const volumeOptions = (product.perPriceLiter || []).map((v) => v.volume);
  const volumeOptionsToRender = volumeOptions.length > 0 ? volumeOptions : [];

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
                  <div className="text-xs text-gray-600">{product.tagline || "Premium quality oil"}</div>
                </div>

                {zoomStyle.backgroundImage && <div className="absolute inset-0 pointer-events-none" style={{ ...zoomStyle }} />}
              </div>

              {/* THUMBNAILS */}
              <div className="mt-4 flex items-center gap-3 overflow-x-auto py-2">
                {(product.productImages || []).map((img, index) => (
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
                  {product.description || product.shortDescription || "Cold-pressed, pure & natural."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">P</div>
                    <div>
                      <div className="font-medium">Pure</div>
                      <div className="text-xs text-gray-600">Cold-pressed, unrefined</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center font-semibold text-yellow-700">H</div>
                    <div>
                      <div className="font-medium">Healthy</div>
                      <div className="text-xs text-gray-600">Rich in nutrients</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">N</div>
                    <div>
                      <div className="font-medium">No Additives</div>
                      <div className="text-xs text-gray-600">No preservatives</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center font-semibold text-pink-700">T</div>
                    <div>
                      <div className="font-medium">Taste</div>
                      <div className="text-xs text-gray-600">{product.tasteDescription || "Fresh & aromatic"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MORE ABOUT PRODUCT (backend array moreAboutProduct) */}
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

                <p className="mt-4 text-gray-700 text-[0.95rem]">{product.shortDescription || product.tagline || ""}</p>

                <div className="mt-6 flex items-end gap-4">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-green-600">₹{getPrice(product, selectedVolume) * (volumeQuantities[selectedVolume] || 1)}</div>
                    {(product.cutPrice || product.cut_price) && <div className="line-through text-gray-400">₹{product.cutPrice || product.cut_price}</div>}
                  </div>
                </div>

                {/* VOLUME OPTIONS */}
                {(product.perPriceLiter && product.perPriceLiter.length > 0) && (
                  <div className="mt-6">
                    <p className="font-medium text-gray-700 mb-2">Select Volume</p>
                    <div className="flex flex-col gap-3">
                      {volumeOptionsToRender.map((vol, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedVolume(vol)}
                          className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                            selectedVolume === vol ? "border-green-600 bg-green-50 shadow-sm" : "border-gray-200 bg-white hover:border-green-400"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {vol} - ₹{getPrice(product, vol) * (volumeQuantities[vol] || 1)}
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateVolumeQuantity(vol, -1);
                              }}
                              className="px-3 py-1 border rounded"
                            >
                              -
                            </button>
                            <span>{volumeQuantities[vol] || 1}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateVolumeQuantity(vol, 1);
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
                    {isOutOfStock ? "Out of Stock" : "💳 Buy Now"}
                  </button>
                </div>

                <Features />

                {/* Product details */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {product.about_table?.map((item, idx) => <li key={`about-${idx}`}>{item}</li>)}
                    {product.about_more?.map((item, idx) => <li key={`more-${idx}`}>{item}</li>)}
                    {product.technical_details && Object.keys(product.technical_details || {}).length > 0 && (
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
                    <ProductVideo videoUrl={product.videoUrl} thumbnail={(product.productImages || [])[0]} />
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
                  <div key={item._id} className="group border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/oil-product/${item.slug || item._id}/${item._id}`)}>
                    <img src={(item.productImages && item.productImages[0]) || (item.images && item.images[0]) || "https://via.placeholder.com/150"} alt={item.title || item.productName} className="w-full h-40 object-contain mb-2 rounded-lg" />
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

export default OilProductDetail;
