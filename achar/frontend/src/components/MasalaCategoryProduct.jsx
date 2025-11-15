import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

const MasalaCategoryProduct = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState({});
  const [mainImages, setMainImages] = useState({});
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `/api/masala-products/category/${slug}`
        );
        setProducts(data);

        const defaults = {};
        const images = {};
        data.forEach((product) => {
          // default weight = first option from pricepergram
          const defaultWeight =
            product.pricepergram?.split(",")[0].split("=")[0].trim() || "";
          defaults[product._id] = defaultWeight;

          // default image (check if URL or relative path)
          images[product._id] = product.images?.[0]
            ? product.images[0].startsWith("http")
              ? product.images[0]
              : `/${product.images[0]}`
            : "https://via.placeholder.com/300";
        });

        setSelectedWeights(defaults);
        setMainImages(images);
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load products");
        setProducts([]);
      }
    };
    fetchProducts();
  }, [slug]);

  const getPriceByWeight = (product, weight) => {
    if (!weight) return 0;
    const priceMap = {};
    product.pricepergram?.split(",").forEach((p) => {
      const [w, v] = p.split("=");
      priceMap[w.trim()] = parseFloat(v.trim());
    });
    return priceMap[weight] || parseFloat(product.current_price) || 0;
  };

  const handleAddToCart = (product) => {
    const weight = selectedWeights[product._id];
    if (!weight) return toast.error("❌ Please select a weight");
    if (!product.stock) return toast.error("❌ This product is out of stock!");

    const selectedPrice = getPriceByWeight(product, weight);
    addToCart({
      _id: product._id,
      productName: product.title,
      selectedWeight: weight,
      quantity: 1,
      selectedPrice,
      cutPrice: parseFloat(product.cut_price) || 0,
      productImages: product.images || [],
    });
    toast.success(`🛒 ${product.title} (${weight}) added to cart!`);
  };

  const calculateDiscount = (cutPrice, selectedPrice) => {
    if (!cutPrice || !selectedPrice) return null;
    return Math.round(
      ((parseFloat(cutPrice) - parseFloat(selectedPrice)) / parseFloat(cutPrice)) * 100
    );
  };

  if (products.length === 0) return <p className="text-center py-10">No products found.</p>;

  return (
    <div className="px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 capitalize border-b pb-2">
        {slug} Masala Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isOutOfStock = !product.stock;
          const weights = product.pricepergram
            ?.split(",")
            .map((p) => p.split("=")[0].trim()) || [];
          const selectedWeight = selectedWeights[product._id] || weights[0] || "";
          const selectedPrice = getPriceByWeight(product, selectedWeight);

          return (
            <div
              key={product._id}
              className={`relative bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col ${
                isOutOfStock ? "opacity-50" : ""
              }`}
            >
              {/* Discount Badge */}
              {product.cut_price && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {calculateDiscount(product.cut_price, selectedPrice)}% OFF
                </span>
              )}

              {/* Product Image */}
              <Link to={`/masala-product/${product.slug}/${product._id}`} className="overflow-hidden">
                <img
                  src={mainImages[product._id]}
                  alt={product.title}
                  className="w-full h-44 object-contain transition-transform duration-300 hover:scale-105"
                />
              </Link>

              {/* Product Info */}
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                  {product.title}
                </h3>

                {/* Weight Selector */}
                {weights.length > 0 && (
                  <div className="flex space-x-2 mt-2 flex-wrap">
                    {weights.map((weight) => (
                      <button
                        key={weight}
                        onClick={() =>
                          setSelectedWeights((prev) => ({ ...prev, [product._id]: weight }))
                        }
                        className={`px-2 py-1 border rounded text-xs ${
                          selectedWeight === weight
                            ? "border-green-600 text-green-600"
                            : "border-gray-300 text-gray-700"
                        }`}
                        disabled={isOutOfStock}
                      >
                        {weight} ₹{getPriceByWeight(product, weight)}
                      </button>
                    ))}
                  </div>
                )}

                {/* Price + Add */}
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-bold text-sm sm:text-base">{selectedPrice}₹</p>
                    {product.cut_price && (
                      <p className="text-xs text-gray-400 line-through">{product.cut_price}₹</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm transition ${
                      isOutOfStock
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MasalaCategoryProduct;
