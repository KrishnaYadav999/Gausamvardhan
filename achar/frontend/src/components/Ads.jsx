import React, { useState, useEffect } from "react";
import axios from "axios";

const Ads = () => {
  const [showAd, setShowAd] = useState(false);
  const [product, setProduct] = useState(null);

  // Fetch a random product
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get("/api/products"); // your route
      if (data.length > 0) {
        // Pick a random product
        const randomIndex = Math.floor(Math.random() * data.length);
        setProduct(data[randomIndex]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    const show = () => {
      fetchProduct();
      setShowAd(true);
    };

    // Initial display after 1 second
    const initialTimer = setTimeout(() => {
      show();
      setTimeout(() => setShowAd(false), 3000);
    }, 1000);

    // Repeat every 2 minutes
    const interval = setInterval(() => {
      show();
      setTimeout(() => setShowAd(false), 3000);
    }, 2 * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {showAd && product && (
        <div className="fixed bottom-5 left-5 w-64 bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-50 animate-slide-in">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800">Special Offer!</h4>
            <button
              onClick={() => setShowAd(false)}
              className="text-gray-400 hover:text-gray-600 font-bold"
            >
              ×
            </button>
          </div>

          {/* Product Info */}
          <div className="flex items-center gap-3">
            <img
              src={product.productImages[0]} // ensure this field exists
              alt={product.productName}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div>
              <h5 className="font-semibold text-gray-800 text-sm">
                {product.productName}
              </h5>
              <p className="text-xs text-gray-500 line-through">
                {product.cutPrice}
              </p>
              <p className="text-sm text-green-600 font-semibold">
                {product.currentPrice}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Ads;