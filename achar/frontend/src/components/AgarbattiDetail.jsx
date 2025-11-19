// AgarbattiDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import ProductVideo from "../components/ProductVideo";

const AgarbattiDetail = () => {
  const { slug, id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedPack, setSelectedPack] = useState("");
  const [packQuantities, setPackQuantities] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);
  const { addToCart, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // ---------------- Fetch product ----------------
  useEffect(() => {
    const fetchProduct = async () => {
      setProduct(null);
      setSelectedPack("");
      setPackQuantities({});
      setMainImage("");
      try {
        const { data } = await axios.get(`/api/agarbatti/${id}`);
        setProduct(data);

        // Default pack selection
        if (data.packs && data.packs.length > 0) {
          const firstPack = data.packs[0].name;
          setSelectedPack(firstPack);
          setPackQuantities({ [firstPack]: 1 });
        }

        setMainImage(data.images?.[0] || "https://via.placeholder.com/300");
      } catch (error) {
        console.error("Error fetching agarbatti product:", error);
        toast.error("❌ Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  // ---------------- Fetch similar products ----------------
  useEffect(() => {
    const fetchSimilar = async () => {
      if (!product) return;
      try {
        const { data } = await axios.get(`/api/agarbatti/${product._id}/similar`);
        setSimilarProducts(data);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };
    fetchSimilar();
  }, [product]);

  if (!product)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // ---------------- Helpers ----------------
  const getPrice = (packName) => {
    if (!packName || !product.packs) return product.current_price;
    const pack = product.packs.find((p) => p.name === packName);
    return pack ? pack.price : product.current_price;
  };

  const isOutOfStock = !product.stock;

  const updatePackQuantity = (pack, change) => {
    setPackQuantities((prev) => {
      const currentQty = prev[pack] || 1;
      const newQty = Math.max(1, currentQty + change);
      return { ...prev, [pack]: newQty };
    });
  };

  const handleAddToCart = () => {
    if (!selectedPack) return toast.error("❌ Please select a pack!");
    if (isOutOfStock) return toast.error("❌ This product is out of stock!");

    const qty = packQuantities[selectedPack] || 1;

    addToCart({
      _id: product._id,
      productName: product.title,
      selectedPack,
      selectedPrice: getPrice(selectedPack),
      quantity: qty,
      totalPrice: getPrice(selectedPack) * qty,
      cutPrice: product.cut_price || 0,
      productImages: product.images || [],
    });

    toast.success(`🛒 ${product.title} (${selectedPack}) x${qty} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!selectedPack) return toast.error("❌ Please select a pack!");
    if (isOutOfStock) return toast.error("❌ This product is out of stock!");

    const qty = packQuantities[selectedPack] || 1;

    setCartItems([
      {
        _id: product._id,
        productName: product.title,
        selectedPack,
        selectedPrice: getPrice(selectedPack),
        currentPrice: getPrice(selectedPack),
        quantity: qty,
        totalPrice: getPrice(selectedPack) * qty,
        cutPrice: product.cut_price || 0,
        productImages: product.images || [],
      },
    ]);

    navigate("/checkout");
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Toaster position="top-right" />

        {/* Left Section - Images + Video */}
        <div>
          <div className="border rounded-lg p-4 flex justify-center bg-white shadow">
            <img src={mainImage} alt={product.title} className="max-h-96 object-contain" />
          </div>
          <div className="flex mt-4 space-x-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 border rounded-lg object-cover cursor-pointer hover:scale-105 transition ${
                  mainImage === img ? "border-green-600" : "border-gray-300"
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

        {/* Right Section - Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p className="text-gray-500">Rating: {product.rating || 0} ★</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-green-600">
              ₹{getPrice(selectedPack) * (packQuantities[selectedPack] || 1)}
            </span>
            {product.cut_price && <span className="line-through text-gray-400">₹{product.cut_price}</span>}
          </div>

          {/* Select Pack + Quantity */}
          {product.packs && (
            <div className="space-y-2">
              <p className="font-medium">Select Pack</p>
              <div className="flex flex-col gap-2">
                {product.packs.map((pack, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedPack(pack.name)}
                    className={`flex justify-between items-center border p-3 rounded-lg cursor-pointer ${
                      selectedPack === pack.name
                        ? "border-green-600 bg-green-50 shadow"
                        : "border-gray-300 bg-white hover:border-green-400"
                    }`}
                  >
                    <span>{pack.name} - ₹{getPrice(pack.name) * (packQuantities[pack.name] || 1)}</span>
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

          <button
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-lg shadow-lg text-white transition ${
              isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            className={`w-full py-3 rounded-lg shadow-lg text-white transition mt-2 ${
              isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Out of Stock" : "Buy Now"}
          </button>

          {/* About Sections */}
          {product.about_table?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">About This Product</h3>
              <ul className="list-disc list-inside text-gray-600">
                {product.about_table.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.about_more?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">More Details</h3>
              <ul className="list-disc list-inside text-gray-600">
                {product.about_more.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {product.technical_details && Object.keys(product.technical_details).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Technical Details</h3>
              <ul className="list-disc list-inside text-gray-600">
                {Object.entries(product.technical_details).map(([key, value], idx) => (
                  <li key={idx}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-6 border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Reviews</h3>
            {product.reviews?.length > 0 ? (
              <ul className="space-y-2">
                {product.reviews.map((r, idx) => (
                  <li key={idx} className="border-b pb-2">
                    <p className="font-semibold">{r.name} - ⭐ {r.rating}</p>
                    <p>{r.comment}</p>
                    {r.images?.length > 0 && (
                      <div className="flex space-x-2 mt-1">
                        {r.images.map((img, i) => (
                          <img key={i} src={img} alt={`review-${i}`} className="h-16 w-16 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="col-span-1 md:col-span-2 mt-12">
            <h2 className="text-xl font-semibold mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((sp) => (
                <Link
                  key={sp._id}
                  to={`/agarbatti-product/${sp.slug}/${sp._id}`}
                  className="border rounded-lg p-3 hover:shadow-lg transition"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <img
                    src={sp.images?.[0] || "https://via.placeholder.com/150"}
                    alt={sp.title}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <h3 className="font-medium text-gray-800">{sp.title}</h3>
                  <p className="text-green-600 font-bold">₹{sp.current_price}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgarbattiDetail;
