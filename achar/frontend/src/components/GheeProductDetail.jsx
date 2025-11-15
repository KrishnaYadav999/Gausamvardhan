import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import ImageZoom from "./ImageZoom";
import { Play, Maximize, Minimize, ChevronDown, ChevronUp } from "lucide-react";

// ---------------- ProductVideo Component ----------------
const ProductVideo = ({ videoUrl, thumbnail }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        controls={isPlaying}
        className="w-full h-full object-cover"
        poster={thumbnail || "/placeholder.png"}
        onEnded={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
        >
          <Play className="w-16 h-16 text-white drop-shadow-lg" />
        </button>
      )}
      {isPlaying && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 bg-black/50 p-2 rounded-full hover:bg-black/70 transition"
        >
          {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
        </button>
      )}
    </div>
  );
};

// ---------------- Ghee Product Detail ----------------
const GheeProductDetail = () => {
  const { slug, id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [weightQuantities, setWeightQuantities] = useState({});
  const [mainImage, setMainImage] = useState("");
  const { addToCart , setCartItems } = useContext(CartContext);
   const navigate = useNavigate();
  // Dropdown states
  const [descOpen, setDescOpen] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);
  const descRef = useRef(null);
  const specRef = useRef(null);

  const specs =
    product?.specifications
      ?.split(" | ")
      .reduce((rows, key, idx, arr) => {
        if (idx % 2 === 0) rows.push({ key, value: arr[idx + 1] || "" });
        return rows;
      }, []) || [];

  // ---------------- Fetch Product ----------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `/api/ghee-products/category/${slug}/${id}`
        );

        const avgRating =
          data.reviews && data.reviews.length > 0
            ? data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length
            : 0;

        setProduct({ ...data, rating: avgRating });

        // default weight
        const firstWeight = data.pricePerGram
          ? data.pricePerGram.split(",")[0].split("=")[0].trim()
          : data.weightVolume?.split(",")[0] || "";
        setSelectedWeight(firstWeight);
        setWeightQuantities({ [firstWeight]: 1 });

        setMainImage(data.images?.[0] || "/placeholder.png");
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load product details");
      }
    };

    fetchProduct();
  }, [slug, id]);

  // ---------------- Fetch Similar Products ----------------
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const { data } = await axios.get(
          `/api/ghee-products/${id}/similar`
        );
        setSimilarProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (product) fetchSimilarProducts();
  }, [product, id]);

  if (!product) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // ---------------- Price and Quantity Logic ----------------
  const getPriceByWeight = (weight) => {
    if (!weight) return parseFloat(product.currentPrice) || 0;
    if (product.pricePerGram) {
      const map = {};
      product.pricePerGram.split(",").forEach((p) => {
        const [w, v] = p.split("=");
        map[w.trim()] = parseFloat(v.trim());
      });
      return map[weight] || parseFloat(product.currentPrice) || 0;
    }
    return parseFloat(product.currentPrice) || 0;
  };

  const updateWeightQuantity = (weight, change) => {
    setWeightQuantities((prev) => {
      const current = prev[weight] || 1;
      const newQty = Math.max(1, current + change);
      return { ...prev, [weight]: newQty };
    });
  };

  const selectedPrice = getPriceByWeight(selectedWeight);
  const weights = product.pricePerGram
    ? product.pricePerGram.split(",").map((p) => p.split("=")[0].trim())
    : product.weightVolume?.split(",") || [];

  const handleAddToCart = () => {
    if (!selectedWeight) return toast.error("❌ Please select a weight");
    if (!product.stock) return toast.error("❌ Out of stock!");

    const qty = weightQuantities[selectedWeight] || 1;

    addToCart({
      _id: product._id,
      productName: product.title,
      selectedWeight,
      quantity: qty,
      selectedPrice,
      totalPrice: selectedPrice * qty,
      cutPrice: parseFloat(product.cutPrice) || 0,
      productImages: product.images || [],
    });

    toast.success(`✅ ${product.title} (${selectedWeight}) x${qty} added to cart!`);
  };


const handleBuyNow = () => {
  if (!selectedWeight) return toast.error("❌ Please select a weight");
  if (!product.stock) return toast.error("❌ Out of stock!");

  const qty = weightQuantities[selectedWeight] || 1;

  const singleItemCart = [
   {
    _id: product._id,
    productName: product.title,
    selectedWeight,
    quantity: qty,
    selectedPrice,
    currentPrice: selectedPrice, // ✅ important for checkout
    totalPrice: selectedPrice * qty,
    cutPrice: parseFloat(product.cutPrice) || 0,
    productImages: product.images || [],
  },

  ];

setCartItems(singleItemCart);
  navigate("/checkout"); // Redirect to checkout
};


  return (
    <>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Toaster position="top-right" />

        {/* ---------------- Left Section ---------------- */}
        <div>
          <div className="border rounded-lg p-4 flex justify-center bg-white shadow relative">
            <ImageZoom src={mainImage} alt={product.title} />
          </div>

          <div className="flex mt-4 space-x-3">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumbnail-${idx}`}
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 border rounded-lg object-cover cursor-pointer hover:scale-105 transition ${
                  mainImage === img ? "border-blue-600" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {product.videoUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Product Video</h3>
              <ProductVideo videoUrl={product.videoUrl} thumbnail={product.images?.[0]} />
            </div>
          )}
        </div>

        {/* ---------------- Right Section ---------------- */}
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <div className="text-gray-500">
            ({product.rating.toFixed(1)} ★ {product.reviews?.length || 0} Reviews)
          </div>

          {/* ---------------- Main Price & Cut Price ---------------- */}
          <div className="flex items-center gap-4 text-xl font-bold mt-2">
            <span className="text-blue-600">
              ₹{selectedPrice * (weightQuantities[selectedWeight] || 1)}
            </span>
            {product.cutPrice && (
              <span className="line-through text-gray-400 text-lg">
                ₹{product.cutPrice * (weightQuantities[selectedWeight] || 1)}
              </span>
            )}
          </div>

          {/* ---------------- Weight Selection with Quantity ---------------- */}
          <div className="flex flex-col gap-2 mt-2">
            {weights.map((weight) => (
              <div
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={`flex items-center justify-between border p-2 rounded cursor-pointer ${
                  selectedWeight === weight ? "border-blue-600 bg-blue-50" : "border-gray-300"
                }`}
              >
                <span className="text-sm font-medium">
                  {weight} ₹{getPriceByWeight(weight) * (weightQuantities[weight] || 1)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateWeightQuantity(weight, -1);
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{weightQuantities[weight] || 1}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateWeightQuantity(weight, 1);
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-lg shadow-lg transition text-white ${
              !product.stock ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
            disabled={!product.stock}
          >
            {product.stock ? "Add to Cart" : "Out of Stock"}
          </button>
           <button
    onClick={handleBuyNow}
    className={`w-full py-3 rounded-lg shadow-lg text-white transition ${
      !product.stock ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
    }`}
    disabled={!product.stock}
  >
    {product.stock ? "Buy Now" : "Out of Stock"}
  </button>
          {/* ---------------- Description & Specifications ---------------- */}
          {product.description && (
            <div className="w-full border rounded-2xl shadow-sm bg-white p-4">
              <button
                onClick={() => setDescOpen(!descOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold">Description</h3>
                {descOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              <div
                ref={descRef}
                style={{ maxHeight: descOpen ? `${descRef.current.scrollHeight}px` : "0px" }}
                className="overflow-hidden transition-all duration-500 mt-3"
              >
                <p className="text-gray-600 leading-relaxed">{product?.description}</p>
              </div>
            </div>
          )}

          {product.specifications && (
            <div className="w-full border rounded-2xl shadow-sm bg-white p-4 mt-4">
              <button
                onClick={() => setSpecOpen(!specOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                {specOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>

              <div
                ref={specRef}
                style={{ maxHeight: specRef.current ? `${specRef.current.scrollHeight}px` : "0px" }}
                className="overflow-hidden transition-all duration-500 mt-3"
              >
                <table className="w-full border border-gray-300 rounded-lg">
                  <tbody>
                    {specs.map((spec, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="border px-4 py-2 font-medium">{spec.key}</td>
                        <td className="border px-4 py-2">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {product.moreAboutProduct?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-6 mb-3">More About Product</h3>
              <div className="grid gap-4">
                {product.moreAboutProduct.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 border p-3 rounded-lg">
                    {item.image && (
                      <img src={item.image} alt={`more-about-${idx}`} className="w-24 h-24 object-cover rounded" />
                    )}
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- Reviews ---------------- */}
          <div>
            <h3 className="text-lg font-semibold mt-6 mb-3">Customer Reviews</h3>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-200 py-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{review.name}</span>
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                  {review.images?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {review.images.map((img, i) => (
                        <img key={i} src={img} alt={`review-${i}`} className="h-16 w-16 object-cover rounded-lg border" />
                      ))}
                    </div>
                  )}
                  <p className="text-gray-400 text-xs mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* ---------------- Similar Products ---------------- */}
        {similarProducts.length > 0 && (
          <div className="col-span-2 mt-10">
            <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((sp) => (
                <Link
                  key={sp._id}
                  to={`/ghee-product/${sp.slug}/${sp._id}`}
                  className="border p-3 rounded-lg hover:shadow-md transition flex flex-col items-center"
                >
                  <img
                    src={sp.images?.[0] || "/placeholder.png"}
                    alt={sp.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="mt-2 text-center font-medium">{sp.title}</p>
                  <p className="text-blue-600 font-bold mt-1">₹{sp.currentPrice}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GheeProductDetail;
