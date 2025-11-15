import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiChevronLeft } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

const OilProductDetail = () => {
  const { slug, id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState("");
  const [volumeQuantities, setVolumeQuantities] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const { addToCart , setCartItems  } = useContext(CartContext);
 const navigate = useNavigate();
  const normalizePrice = (price) => {
    if (!price) return 0;
    return parseFloat(String(price).replace(/[^0-9.]/g, ""));
  };

  const getPriceByVolume = (product, volume) => {
    if (!volume) return normalizePrice(product.currentPrice);
    const found = product.perPriceLiter?.find((p) => p.volume === volume);
    return found ? normalizePrice(found.price) : normalizePrice(product.currentPrice);
  };

  const calculateDiscount = (cutPrice, selectedPrice) => {
    const cp = normalizePrice(cutPrice);
    const curr = normalizePrice(selectedPrice);
    if (!cp || !curr) return null;
    return Math.round(((cp - curr) / cp) * 100);
  };

  // ---------------- Fetch product ----------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `/api/oils/category/${slug}/${id}`
        );
        setProduct(data);
        setSelectedVolume(data.perPriceLiter?.[0]?.volume || "");
        setMainImage(data.productImages?.[0] || "https://via.placeholder.com/300");

        // Initialize quantity per volume
        const qtyObj = {};
        data.perPriceLiter?.forEach((v) => (qtyObj[v.volume] = 1));
        setVolumeQuantities(qtyObj);

        const simRes = await axios.get(`/api/oils/${id}/similar`);
        setSimilarProducts(simRes.data);
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load product details");
      }
    };
    fetchProduct();
  }, [slug, id]);

  // ---------------- Update Quantity ----------------
  const updateVolumeQuantity = (volume, change) => {
    setVolumeQuantities((prev) => {
      const currentQty = prev[volume] || 1;
      const newQty = Math.max(1, currentQty + change);
      return { ...prev, [volume]: newQty };
    });
  };

  // ---------------- Add to Cart ----------------
  const handleAddToCart = () => {
    if (!selectedVolume) return toast.error("❌ Please select a volume");
    if (!product.stock) return toast.error("❌ Out of stock");

    const selectedPrice = getPriceByVolume(product, selectedVolume);
    const quantity = volumeQuantities[selectedVolume] || 1;

    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedVolume,
      quantity,
      selectedPrice,
      totalPrice: selectedPrice * quantity,
      cutPrice: normalizePrice(product.cutPrice) || 0,
      productImages: product.productImages || [],
    });

    toast.success(`🛒 ${product.productName} (${selectedVolume}) x${quantity} added!`);
  };

 const handleBuyNow = () => {
    if (!selectedVolume) return toast.error("❌ Please select a volume");
    if (!product.stock) return toast.error("❌ Out of stock");

    const selectedPrice = getPriceByVolume(product, selectedVolume);
    const quantity = volumeQuantities[selectedVolume] || 1;

    // Replace cart with only this product
    setCartItems([
     {
    _id: product._id,
    productName: product.productName,
    selectedVolume,
    quantity,
    selectedPrice,
    currentPrice: selectedPrice, // ✅ add this
    totalPrice: selectedPrice * quantity,
    cutPrice: normalizePrice(product.cutPrice) || 0,
    productImages: product.productImages || [],
  },
    ]);

    navigate("/checkout");
  };

  if (!product) return <p className="text-center py-10">Loading...</p>;

  const price = getPriceByVolume(product, selectedVolume);
  const quantity = volumeQuantities[selectedVolume] || 1;

  return (
    <div className="px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <Link to={`/oil/category/${slug}`} className="flex items-center text-gray-600 mb-4">
        <FiChevronLeft size={20} /> <span className="ml-2">Back to {slug} Oils</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Images & Video */}
        <div className="flex-1">
          <div className="border rounded-lg p-4 bg-white shadow">
            <img
              src={mainImage}
              alt={product.productName}
              className="w-full h-96 object-contain"
            />
          </div>

          {product.productImages?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mt-4">
              {product.productImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.productName}-${i}`}
                  className={`w-20 h-20 object-contain border rounded cursor-pointer transition ${
                    mainImage === img ? "border-yellow-600" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}

          {product.videoUrl && (
            <video controls className="w-full h-64 mt-4 rounded-md">
              <source src={product.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.productName}</h1>
          <p className="text-gray-500">{product.description}</p>

          {product.allDetails && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Product Details</h2>
              <p className="text-gray-600 whitespace-pre-line">{product.allDetails}</p>
            </div>
          )}

          {/* Select Volume & Quantity */}
          {product.perPriceLiter?.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Select Volume</h2>
              <div className="flex flex-col gap-2">
                {product.perPriceLiter.map((v) => (
                  <div
                    key={v.volume}
                    onClick={() => setSelectedVolume(v.volume)}
                    className={`flex justify-between items-center border p-3 rounded-lg cursor-pointer transition ${
                      selectedVolume === v.volume
                        ? "border-yellow-600 bg-yellow-50 shadow"
                        : "border-gray-300 bg-white hover:border-yellow-400"
                    }`}
                  >
                    <span>
                      {v.volume} - ₹{normalizePrice(v.price) * (volumeQuantities[v.volume] || 1)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateVolumeQuantity(v.volume, -1);
                        }}
                        className="px-3 py-1 border rounded"
                      >
                        -
                      </button>
                      <span>{volumeQuantities[v.volume]}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateVolumeQuantity(v.volume, 1);
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

          {/* Price & Add to Cart */}
          <div className="flex items-center gap-4 mt-4">
            <div>
              <p className="text-yellow-600 font-bold text-lg">{price * quantity}₹</p>
              {product.cutPrice && (
                <p className="text-gray-400 line-through text-sm">
                  {normalizePrice(product.cutPrice)}₹
                </p>
              )}
              {product.cutPrice && (
                <p className="text-red-500 text-sm">
                  {calculateDiscount(product.cutPrice, price)}% OFF
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-md text-white ${
                !product.stock || !selectedVolume
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
              disabled={!product.stock || !selectedVolume}
            >
              {product.stock ? "Add to Cart" : "Out of Stock"}
            </button>

            
          </div>

 <button
            onClick={handleBuyNow}
            className={`px-4 py-2 rounded-md text-white mt-2 w-full ${
              !product.stock || !selectedVolume
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={!product.stock || !selectedVolume}
          >
            {product.stock ? "Buy Now" : "Out of Stock"}
          </button>

          {/* More About Product */}
          {product.moreAboutProduct?.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">More About Product</h2>
              {product.moreAboutProduct.map((item, i) => (
                <div key={i} className="flex gap-2 items-start mb-2">
                  {item.image && (
                    <img src={item.image} alt={`more-${i}`} className="w-16 h-16 object-contain" />
                  )}
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Reviews ({product.numberOfReviews || product.reviews.length})
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{review.name}</p>
                  <div className="flex">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <AiFillStar key={i} className="text-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                {review.images?.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto mt-2">
                    {review.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`review-${i}`}
                        className="w-20 h-20 object-contain rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <Link
                to={`/oil-product/${p.slug}/${p._id}`}
                key={p._id}
                className="bg-white rounded-lg shadow hover:shadow-lg p-2 flex flex-col"
              >
                <img
                  src={p.productImages?.[0] || "https://via.placeholder.com/150"}
                  alt={p.productName}
                  className="w-full h-32 object-contain mb-2"
                />
                <p className="text-sm font-semibold line-clamp-2">{p.productName}</p>
                <p className="text-yellow-600 font-bold text-sm mt-auto">
                  ₹{getPriceByVolume(p, p.perPriceLiter?.[0]?.volume)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OilProductDetail;