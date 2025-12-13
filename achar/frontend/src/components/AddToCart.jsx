/* ---------------------------------------------------
    AddToCart.jsx
    - Trending Grocery / FMCG style (green gradient, glass cards)
    - Tailwind CSS required
    - Dependencies: framer-motion, react-confetti, react-hot-toast
----------------------------------------------------*/
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import toast from "react-hot-toast";

/* ----------------------
   Small helpers
-----------------------*/
const formatPrice = (v) =>
  typeof v === "number" ? `₹${v.toFixed(2)}` : `₹${Number(v || 0).toFixed(2)}`;

const SummaryRow = ({ label, value, accent }) => (
  <div className="flex justify-between items-center text-sm md:text-base">
    <span className="text-gray-700">{label}</span>
    <span
      className={`font-medium ${accent ? "text-green-600" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

/* ----------------------
   Main component
-----------------------*/
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
  const [windowSize, setWindowSize] = useState({ w: 1200, h: 800 });
  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const onResize = () =>
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------------------------------------------------
        COUPON VALIDATION LOGIC
  ----------------------------------------------------*/
  const handleApplyCoupon = () => {
    const enteredCode = couponInput.trim();

    if (!enteredCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    const availableCoupon = cartItems[0]?.coupons?.find(
      (c) => c.code.toLowerCase() === enteredCode.toLowerCase()
    );

    if (!availableCoupon) {
      toast.error("❌ Invalid coupon code");
      return;
    }

    if (
      !availableCoupon.isPermanent &&
      new Date(availableCoupon.expiryDate) < new Date()
    ) {
      toast.error("⚠️ Coupon expired");
      return;
    }

    if (availableCoupon.isActive === false) {
      toast.error("⚠️ Coupon not active");
      return;
    }

    applyCoupon(availableCoupon);
    setShowSuccess(true);
    setCouponInput("");

    setTimeout(() => setShowSuccess(false), 2600);
  };

  const gstRate = 0.05;
  const gstAmount = (totalPrice - (discountAmount || 0)) * gstRate;
  const finalAmount = totalPrice - (discountAmount || 0) + gstAmount;

  /* ---------------------------------------------------
        EMPTY CART – BEST UI ANIMATION
  ----------------------------------------------------*/
  if (!cartItems || cartItems.length === 0)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex flex-col justify-center items-center h-[70vh] px-4 text-center"
      >
        {/* Floating Cart Icon */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          className="w-32 h-32 mb-4"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="drop-shadow-xl"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-extrabold text-gray-800"
        >
          Your cart is empty
        </motion.h2>

        <p className="text-gray-500 mt-2 text-sm md:text-base max-w-xs">
          Looks like you haven't added anything yet. Explore products & add to
          cart!
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 
          text-white font-semibold shadow-lg hover:shadow-2xl 
          transition-all duration-300 cursor-pointer"
        >
          🛍 Continue Shopping
        </motion.button>

        {/* Glow Effect Background */}
        <div className="absolute bottom-24 w-64 h-20 bg-green-300 blur-3xl opacity-20 rounded-full"></div>
      </motion.div>
    );

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Your Cart
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalItems} item{totalItems > 1 ? "s" : ""} in your bag
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="px-3 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-white text-green-700 font-semibold shadow-sm border border-green-100">
              Save more with coupons
            </div>
            <button
              onClick={() => navigate("/")}
              className="text-sm font-medium text-green-700 underline"
            >
              Continue shopping
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT: items */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => {
              const imgSrc =
                item.productImages?.[0] || item.images?.[0] || "/no-image.png";
              return (
                <motion.article
                  key={`${item._id}-${item.selectedWeight}-${item.selectedVolume}-${item.selectedPack}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-sm"
                >
                  {/* image */}
                  <div className="relative w-full md:w-36 flex-shrink-0">
                    <img
                      src={imgSrc}
                      alt={item.productName || item.title}
                      className="w-full h-28 md:h-36 object-cover rounded-xl shadow-md"
                    />

                    {/* trending badge */}
                    {item.isTrending && (
                      <div className="absolute -top-2 -left-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">
                        TRENDING
                      </div>
                    )}
                  </div>

                  {/* info */}
                  <div className="flex-1 w-full">
                    <div className="flex items-start justify-between">
                      <div className="pr-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.productName || item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.selectedWeight ||
                            item.selectedVolume ||
                            item.selectedPack ||
                            ""}
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice(
                              (item.currentPrice || 0) * (item.quantity || 1)
                            )}
                          </p>
                          <p className="text-xs text-gray-400 line-through">
                            {item.mrp
                              ? formatPrice(item.mrp * (item.quantity || 1))
                              : ""}
                          </p>
                          {item.offer && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                              {item.offer}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.selectedWeight,
                                item.selectedVolume,
                                -1,
                                item.selectedPack
                              )
                            }
                            className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100"
                          >
                            -
                          </motion.button>

                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 20,
                            }}
                            className="text-gray-800 font-medium px-2"
                          >
                            {item.quantity}
                          </motion.span>

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              updateQuantity(
                                item._id,
                                item.selectedWeight,
                                item.selectedVolume,
                                1,
                                item.selectedPack
                              )
                            }
                            className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-100"
                          >
                            +
                          </motion.button>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(
                              item._id,
                              item.selectedWeight,
                              item.selectedVolume,
                              item.selectedPack
                            )
                          }
                          className="text-red-500 text-sm font-semibold hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500 flex items-center justify-between">
                      <div>Seller: {item.sellerName || "Local Store"}</div>
                      <div>Delivery: {item.deliveryEstimate || "6-7 days"}</div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* RIGHT: summary */}
          <aside className="relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-6 bg-white/85 backdrop-blur-md border border-gray-100 rounded-2xl p-5 shadow-lg w-full"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <SummaryRow label="Items" value={`${totalItems}`} />
              <div className="my-3">
                <SummaryRow label="Subtotal" value={formatPrice(totalPrice)} />
              </div>

              {discountAmount > 0 && (
                <div className="mb-2">
                  <SummaryRow
                    label="Discount"
                    value={`- ${formatPrice(discountAmount)}`}
                    accent
                  />
                </div>
              )}

              <SummaryRow
                label="All Inclusive Price"
                value={formatPrice(gstAmount)}
              />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="text-xl font-extrabold text-green-600">
                    {formatPrice(finalAmount)}
                  </span>
                </div>
                {/* Coupon */}
                {/* Coupon */}
                {coupon && coupon.code ? (
                  <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm font-semibold">
                    Coupon <span className="font-bold">{coupon.code}</span>{" "}
                    applied 🎉
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-white border border-green-100"
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Apply Coupon
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="w-full sm:flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-green-500
      uppercase text-sm"
                      />

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleApplyCoupon}
                        className="w-full sm:w-auto flex-shrink-0 px-4 py-2 rounded-lg
      bg-green-600 text-white font-semibold shadow"
                      >
                        Apply
                      </motion.button>
                    </div>
                  </motion.div>
                )}
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg transform hover:-translate-y-0.5 transition"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Safe & secure checkout • Free delivery above ₹500
                </p>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <>
            <Confetti width={windowSize.w} height={windowSize.h} />
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-green-100 px-8 py-8 text-center max-w-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-4">
                  Coupon Applied!
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  You've saved on your order 🎉
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddToCart;
