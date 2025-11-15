import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import ProductVideo from "../components/ProductVideo";
import toast from "react-hot-toast";
import Features from "./Features";
import { Star } from "lucide-react";

const AcharProductDetail = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartItems } = useContext(CartContext); // Added setCartItems for Buy Now

  const [product, setProduct] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [weightQuantities, setWeightQuantities] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const zoomRef = useRef();
  const [zoomStyle, setZoomStyle] = useState({});

  // ---------------- Helper: Get price for a weight or product ----------------
  const getPrice = (prod, weight) => {
    if (!prod) return 0;
    if (prod.pricePerGram) {
      const priceMap = {};
      prod.pricePerGram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        priceMap[w.trim()] = Number(v.trim());
      });
      if (weight) return priceMap[weight] || Number(prod.currentPrice);
      const firstWeight = Object.keys(priceMap)[0];
      return priceMap[firstWeight] || Number(prod.currentPrice);
    }
    return Number(prod.currentPrice);
  };

  // ---------------- Fetch product details ----------------
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

        // Set default selected weight
        if (data.pricePerGram) {
          const firstWeight = data.pricePerGram.split(",")[0].split("=")[0].trim();
          setSelectedWeight(firstWeight);
          setWeightQuantities({ [firstWeight]: 1 });
        } else {
          const firstWeight = data.weightOptions?.split(",")[0] || "";
          setSelectedWeight(firstWeight);
          if (firstWeight) setWeightQuantities({ [firstWeight]: 1 });
        }

        setMainImage(data.productImages?.[0] || "");
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details!");
      }
    };

    fetchProduct();
  }, [slug, id]);

  // ---------------- Fetch similar products ----------------
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}/similar`
        );
        setSimilarProducts(data);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    if (product) fetchSimilarProducts();
  }, [id, product]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
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

    toast.success(
      `${product.productName} (${selectedWeight}) x${qty} added to cart!`
    );
  };

  // ---------------- Buy Now Function ----------------
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
      currentPrice: getPrice(product, selectedWeight), // ✅ important
      quantity: qty,
      totalPrice: getPrice(product, selectedWeight) * qty,
    },
  ];

  setCartItems(singleItemCart); // Replace cart with single item
  navigate("/checkout");
};


  // ---------------- Zoom on hover ----------------
  const handleMouseMove = (e) => {
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
  const averageRating = product.rating.toFixed(1);

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
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT SECTION */}
        <div className="space-y-4">
          <div
            ref={zoomRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="border rounded-2xl p-4 bg-white shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            <img
              src={mainImage}
              alt={product.productName}
              className="max-h-[450px] w-full object-contain rounded-lg"
            />
            {zoomStyle.backgroundImage && (
              <div
                className="absolute inset-0"
                style={{ ...zoomStyle, cursor: "zoom-in" }}
              />
            )}
          </div>

          <div className="flex space-x-3 overflow-x-auto py-2 scrollbar-hide">
            {product.productImages?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="product-thumbnail"
                onClick={() => setMainImage(img)}
                className={`h-24 w-24 border rounded-xl object-cover cursor-pointer transition-transform hover:scale-110 ${
                  mainImage === img
                    ? "border-green-600 ring-2 ring-green-400"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {product.videoUrl && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Product Video</h3>
              <ProductVideo
                videoUrl={product.videoUrl}
                thumbnail={product.productImages?.[0]}
              />
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {product.productName}
            </h1>
            <div className="flex items-center mt-2 space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-gray-600 text-sm">
                ({totalReviews} Reviews)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-green-600">
              ₹{getPrice(product, selectedWeight) * (weightQuantities[selectedWeight] || 1)}
            </span>
            {product.cutPrice && (
              <span className="line-through text-gray-400 text-lg">
                ₹{product.cutPrice}
              </span>
            )}
          </div>

          {/* Select Weight + Quantity */}
          {(product.pricePerGram || product.weightOptions) && (
            <div>
              <p className="font-medium text-gray-700 mb-2">Select Weight</p>
              <div className="flex flex-col gap-4">
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
                        ? "border-green-600 bg-green-50 shadow-md"
                        : "border-gray-300 bg-white hover:border-green-400"
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

          {/* ADD TO CART & BUY NOW */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl shadow-xl transition-all duration-300 text-white font-bold text-lg tracking-wide ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
              }`}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "🛒 Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className={`w-full py-4 rounded-xl shadow-xl transition-all duration-300 text-white font-bold text-lg tracking-wide ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "💳 Buy Now"}
            </button>
          </div>

          <Features />

          {/* Product Details */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-700 leading-relaxed">
              {productDetails.map(
                (item) =>
                  item.value && (
                    <li key={item.key}>
                      <span className="font-medium text-gray-900">{item.label}:</span>{" "}
                      {item.value}
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews & Similar Products */}
      {product.reviews?.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 py-8 mt-10">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            Customer Reviews
          </h3>
          <div className="space-y-5">
            {product.reviews.map((rev, i) => (
              <div
                key={i}
                className="border border-gray-200 bg-white p-4 rounded-xl shadow-sm hover:shadow transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 text-sm">
                      {rev.name}
                    </span>
                    <div className="flex mt-0.5">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={14}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-snug">
                  {rev.comment}
                </p>
                {rev.images?.length > 0 && (
                  <div className="flex mt-3 gap-2 flex-wrap">
                    {rev.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`review-${idx}`}
                        className="w-20 h-20 rounded-lg border object-cover hover:scale-105 transition-transform"
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

      {similarProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 mt-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            Similar Products
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {similarProducts.map((item) => (
              <div
                key={item._id}
                className="group border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/products/${item.categorySlug || slug}/${item._id}`)}

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
    </>
  );
};

export default AcharProductDetail;
