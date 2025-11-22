// CupCategoryProduct.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";

const CupCategoryProduct = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [selectedPack, setSelectedPack] = useState({});
  const { addToCart } = useContext(CartContext);

  // Fetch Cup products by category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`/api/cup/category/${slug}`);
        setProducts(data);

        const defaults = {};
        data.forEach((p) => {
          if (p.packs && p.packs.length > 0) {
            defaults[p._id] = p.packs[0].name;
          }
        });
        setSelectedPack(defaults);
      } catch (error) {
        console.error("Cup Fetch Error:", error);
        toast.error("❌ Failed to load Cup products");
      }
    };
    fetchProducts();
  }, [slug]);

  // Current price based on selected pack
  const getCurrentPrice = (product) => {
    const packName = selectedPack[product._id];
    if (!product.packs || !packName) return null;

    const pack = product.packs.find((p) => p.name === packName);
    return pack ? pack.price : null;
  };

  // Add to cart
  const handleAddToCart = (product) => {
    if (!product.stock) return toast.error("❌ This product is out of stock!");

    const packName = selectedPack[product._id];
    const price = getCurrentPrice(product);

    addToCart({
      ...product,
      selectedPack: packName,
      selectedPrice: price,
    });

    toast.success(`🛒 ${product.title} (${packName}) added to cart!`);
  };

  // Discount calculation
  const calculateDiscount = (cut, current) => {
    const cutPrice = Number(cut?.replace(/[^\d.]/g, ""));
    const currPrice = Number(current?.replace(/[^\d.]/g, ""));
    if (!cutPrice || !currPrice) return null;
    return Math.round(((cutPrice - currPrice) / cutPrice) * 100);
  };

  return (
    <div className="px-6 py-12 lg:ml-40">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6 text-center">
        Cup Products in "{slug}" Category
      </h2>

      <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.length === 0 && (
          <p className="col-span-full text-center">No products found.</p>
        )}

        {products.map((product) => {
          const isOutOfStock = !product.stock;
          const currentPrice = getCurrentPrice(product);

          return (
            <div
              key={product._id}
              className={`relative bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col ${
                isOutOfStock ? "opacity-50" : ""
              }`}
            >
              {product.cut_price && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {calculateDiscount(product.cut_price, currentPrice)}% OFF
                </span>
              )}

              <Link
                to={`/cup-product/${product.slug}/${product._id}`}
                className="overflow-hidden"
              >
                <img
                  src={product.images?.[0] || "/no-image.png"}
                  alt={product.title}
                  className="w-full h-44 object-contain transition-transform duration-300 hover:scale-105"
                />
              </Link>

              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                  {product.description}
                </p>

                {product.packs && (
                  <div className="flex space-x-2 mt-2 flex-wrap">
                    {product.packs.map((pack) => (
                      <button
                        key={pack.name}
                        onClick={() =>
                          setSelectedPack((prev) => ({
                            ...prev,
                            [product._id]: pack.name,
                          }))
                        }
                        className={`px-2 py-1 border rounded text-xs ${
                          selectedPack[product._id] === pack.name
                            ? "border-blue-600 text-blue-600"
                            : "border-gray-300 text-gray-700"
                        }`}
                        disabled={isOutOfStock}
                      >
                        {pack.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-bold text-sm sm:text-base">
                      {currentPrice}₹
                    </p>
                    {product.cut_price && (
                      <p className="text-xs text-gray-400 line-through">
                        {product.cut_price}₹
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm transition ${
                      isOutOfStock
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
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

export default CupCategoryProduct;
