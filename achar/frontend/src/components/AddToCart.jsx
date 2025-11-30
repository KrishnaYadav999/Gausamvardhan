/* ---------------------------------------------------
    IMPORTS
----------------------------------------------------*/
import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import toast from "react-hot-toast";

const AddToCart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
    coupon,
    discountAmount,
    applyCoupon,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  /* ---------------------------------------------------
        FIXED COUPON VALIDATION LOGIC
  ----------------------------------------------------*/
  const handleApplyCoupon = () => {
    const coup = cartItems[0]?.coupons?.[0];

    if (!coup) {
      toast.error("No coupon available!");
      return;
    }

    // ❌ Expired coupon
    if (!coup.isPermanent && new Date(coup.expiryDate) < new Date()) {
      toast.error("⚠️ Coupon Expired");
      return;
    }

    // ❌ Inactive coupon
    if (coup.isActive === false) {
      toast.error("⚠️ Coupon Not Active");
      return;
    }

    // Apply coupon
    applyCoupon(coup);

    // Success popup
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  const gstRate = 0.12;
  const gstAmount = (totalPrice - (discountAmount || 0)) * gstRate;
  const finalAmount = totalPrice - (discountAmount || 0) + gstAmount;

  if (cartItems.length === 0)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500 text-lg font-medium">
        Your cart is empty
      </div>
    );

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h1
          className="font-bold mb-8 text-gray-800"
          style={{
            fontSize: window.innerWidth >= 768 ? "1.1rem" : "0.9rem",
          }}
        >
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const imgSrc =
                item.productImages?.[0] ||
                item.images?.[0] ||
                "/no-image.png";

              return (
                <motion.div
                  key={`${item._id}-${item.selectedWeight}-${item.selectedVolume}-${item.selectedPack}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col md:flex-row items-center md:items-start justify-between border border-gray-200 p-4
                  rounded-xl shadow hover:shadow-lg transition duration-300 bg-white"
                >
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    <img
                      src={imgSrc}
                      alt={item.productName || item.title}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover"
                    />

                    <div className="flex-1 mt-2 md:mt-0">
                      <h2 className="font-semibold text-lg text-gray-800">
                        {item.productName || item.title}
                      </h2>

                      {item.selectedWeight && (
                        <p className="text-gray-500 text-sm">
                          {item.selectedWeight}
                        </p>
                      )}
                      {item.selectedVolume && (
                        <p className="text-gray-500 text-sm">
                          {item.selectedVolume}
                        </p>
                      )}
                      {item.selectedPack && (
                        <p className="text-gray-500 text-sm">
                          Pack: {item.selectedPack}
                        </p>
                      )}

                      <p className="text-green-600 font-bold mt-1 text-lg">
                        ₹{(
                          (item.currentPrice || 0) * (item.quantity || 1)
                        ).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        (₹{item.currentPrice} × {item.quantity})
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center mt-4 md:mt-0 space-x-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.selectedWeight,
                          item.selectedVolume,
                          -1,
                          item.selectedPack
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-gray-800 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          item.selectedWeight,
                          item.selectedVolume,
                          1,
                          item.selectedPack
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        removeFromCart(
                          item._id,
                          item.selectedWeight,
                          item.selectedVolume,
                          item.selectedPack
                        )
                      }
                      className="text-red-500 font-bold hover:text-red-700 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="border border-gray-200 p-6 rounded-xl shadow-md bg-white space-y-5">
            <h2 className="font-semibold text-xl md:text-2xl text-gray-800">
              Order Summary
            </h2>

            <div className="flex justify-between text-gray-700">
              <span>Total Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Discount</span>
                <span className="text-green-600 font-medium">
                  - ₹{discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-gray-700">
              <span>GST (12%)</span>
              <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-gray-200 pt-3 text-gray-800">
              <span className="font-semibold">Total (Incl. GST)</span>
              <span className="font-bold text-green-600 text-lg md:text-xl">
                ₹{finalAmount.toFixed(2)}
              </span>
            </div>

            {/* ⭐ Coupon */}
            {cartItems[0]?.coupons?.[0] && !coupon?.code && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-300 rounded-xl p-4 shadow-md mt-4
                flex justify-between items-center"
              >
                <div>
                  <p className="text-green-700 font-bold text-lg">
                    {cartItems[0].coupons[0].code}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {cartItems[0].coupons[0].discountType === "percentage"
                      ? `${cartItems[0].coupons[0].discountValue}% Discount`
                      : `Save ₹${cartItems[0].coupons[0].discountValue}`}
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleApplyCoupon}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold
                  shadow-lg hover:bg-green-700"
                >
                  Apply
                </motion.button>
              </motion.div>
            )}

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-lg
              transition duration-300 text-lg font-medium mt-4"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* 🎉 Coupon Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <Confetti width={window.innerWidth} height={window.innerHeight} />

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              bg-white shadow-2xl rounded-2xl px-8 py-6 text-center border border-green-400 z-[999]"
            >
              <h2 className="text-2xl font-bold text-green-600">
                🎉 Coupon Applied!
              </h2>
              <p className="text-gray-600 mt-2">
                You saved money on your order!
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddToCart;
