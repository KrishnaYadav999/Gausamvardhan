// AcharProductDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import ProductVideo from "../components/ProductVideo";
import toast from "react-hot-toast";
import Features from "./Features";
import { Star } from "lucide-react";

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
  const zoomRef = useRef();
  const [zoomStyle, setZoomStyle] = useState({});

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
        const { data } = await axios.get(`/api/products/category/${slug}/${id}`);

        const avgRating =
          data.reviews && data.reviews.length > 0
            ? data.reviews.reduce((sum, r) => sum + r.rating, 0) /
              data.reviews.length
            : 0;

        setProduct({ ...data, rating: avgRating });

        if (data.pricePerGram) {
          const firstWeight = data.pricePerGram.split(",")[0].split("=")[0].trim();
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
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading product...
      </div>
    );
  }

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

    addToCart({
      ...product,
      selectedWeight,
      selectedPrice: getPrice(product, selectedWeight),
      quantity: qty,
      totalPrice: getPrice(product, selectedWeight) * qty,
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

  const totalReviews = product.reviews?.length || 0;
  const averageRating = product.rating ? product.rating.toFixed(1) : "0.0";

  const productDetails = [
    { key: "tasteDescription", label: "Taste Description", value: product.tasteDescription },
    { key: "buyMoreTogether", label: "Buy More Together", value: product.buyMoreTogether },
    { key: "moreAboutPickle", label: "More About Pickle", value: product.moreAboutPickle },
    { key: "traditionalRecipes", label: "Traditional Recipes", value: product.traditionalRecipes },
    { key: "localIngredients", label: "Local Ingredients", value: product.localIngredients },
    { key: "driedNaturally", label: "Dried Naturally", value: product.driedNaturally },
  ];

  return (
    <>
      <div className="text-[0.9rem] bg-gray-50 min-h-screen">
        <div className="max-w-screen-xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
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
                  <div className="font-semibold">{product.brand || "Rosier"}</div>
                  <div className="text-xs text-gray-600">Made with A2 Gir Cow Ghee</div>
                </div>

                {zoomStyle.backgroundImage && (
                  <div className="absolute inset-0 pointer-events-none" style={{ ...zoomStyle }} />
                )}
              </div>

              {/* THUMBNAILS */}
              <div className="mt-4 flex items-center gap-3 overflow-x-auto py-2">
                {product.productImages?.map((img, index) => (
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

              {/* MORE ABOUT (EXISTING BLOCK - UNTOUCHED) */}
              <div className="mt-6 bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg md:text-xl font-semibold mb-3">More About</h3>
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
                      <div className="text-xs text-gray-600">Small-batch, traditional recipe</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center font-semibold text-yellow-700">
                      G
                    </div>
                    <div>
                      <div className="font-medium">Ghee Rich</div>
                      <div className="text-xs text-gray-600">Made with A2 Gir cow ghee</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                      N
                    </div>
                    <div>
                      <div className="font-medium">No Preservatives</div>
                      <div className="text-xs text-gray-600">Naturally preserved</div>
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
                <div className="mt-6 bg-white p-6 rounded-2xl shadow">
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
            <div className="sticky top-6 self-start">
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                
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
                  <span className="text-gray-600 text-sm">({totalReviews} reviews)</span>
                </div>

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
                    <p className="font-medium text-gray-700 mb-2">Select Weight</p>

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
                    {isOutOfStock ? "Out of Stock" : "💳 Buy Now"}
                  </button>
                </div>

                <Features />

                {/* PRODUCT DETAILS */}
                <div className="mt-6">
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
              </div>

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

          {/* REVIEWS */}
          {product.reviews?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

              <div className="space-y-4">
                {product.reviews.map((rev, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {rev.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {rev.name}
                        </div>

                        <div className="flex mt-1">
                          {Array.from({
                            length: Number(rev.rating) || 0,
                          }).map((_, idx) => (
                            <Star
                              key={idx}
                              size={14}
                              className="text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-snug">{rev.comment}</p>

                    {rev.images?.length > 0 && (
                      <div className="flex mt-3 gap-2 flex-wrap">
                        {rev.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`review-${idx}`}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
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
                  <div
                    key={item._id}
                    className="group border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() =>
                      navigate(`/products/${item.categorySlug || slug}/${item._id}`)
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
      </div>
    </>
  );
};

export default AcharProductDetail;
