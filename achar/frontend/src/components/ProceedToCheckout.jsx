// File: src/pages/ProceedToCheckout.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProceedToCheckout = () => {
  const { cartItems, totalPrice } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [shippingCharge, setShippingCharge] = useState(0);
  // const [isLoadingShipping, setIsLoadingShipping] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    phone: "",
  });

  // -------------------------------
  // CALCULATE TOTAL CART WEIGHT IN GRAMS & KG
  // -------------------------------
  // NEW: Chargeable weight = max(actual weight, volumetric weight)
  // const totalCartWeightGrams = cartItems.reduce((total, item) => {
  //   if (!item.selectedWeight) return total;

  //   // Convert selected weight to grams
  //   let actualWeight = 0;
  //   const w = item.selectedWeight.toString().toLowerCase();
  //   if (w.includes("kg")) actualWeight = parseFloat(w) * 1000;
  //   else if (w.includes("g")) actualWeight = parseFloat(w);

  //   // Default dimensions in cm if not provided
  //   const l = item.length || 10;
  //   const b = item.breadth || 10;
  //   const h = item.height || 10;

  //   // Volumetric weight (grams) formula used by Delhivery: (L*B*H)/5000*1000
  //   const volumetricWeight = (l * b * h) / 5000 * 1000;

  //   // Chargeable weight = max(actual weight, volumetric weight)
  //   const chargeableWeight = Math.max(actualWeight, volumetricWeight);

  //   return total + chargeableWeight;
  // }, 0);
  // -------------------------------
  // CALL SHIPPING API WHEN PINCODE IS ENTERED
  // -------------------------------
  // useEffect(() => {
  //   const pin = shippingAddress.pincode;
  //   if (pin.length === 6) fetchShippingCharge(pin);
  // }, [shippingAddress.pincode]);

  // const fetchShippingCharge = async (pincode) => {
  //   try {
  //     setIsLoadingShipping(true);

  //     const res = await axios.post("/api/orders/shipping/calculate", {
  //      pickupPincode: "421505",
  //   destinationPincode: pincode,
  //   totalWeight: totalCartWeightGrams, // already updated
  //   isCOD: false,                  // Prepaid shipment
  //     });

  //     if (res.data.success) {
  //       setShippingCharge(res.data.charges || 0);
  //     } else {
  //       setShippingCharge(0);
  //       console.warn("Delhivery response not valid:", res.data);
  //     }
  //   } catch (err) {
  //     console.error("Shipping calc error:", err.response?.data || err.message);
  //     setShippingCharge(0);
  //   } finally {
  //     setIsLoadingShipping(false);
  //   }
  // };

  // Prefill name if logged in
  useEffect(() => {
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        name: user.name || "",
      }));
    }
  }, [user]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validation
  const isShippingValid = () => {
    const { name, address, city, state, pincode, phone } = shippingAddress;
    if (!name.trim()) return "Full name is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone))
      return "Valid 10-digit phone number is required";
    if (!address.trim()) return "Address is required";
    if (!city.trim()) return "City is required";
    if (!state.trim()) return "State is required";
    if (!pincode.trim() || !/^\d{6}$/.test(pincode))
      return "Valid 6-digit pincode is required";
    return null;
  };

  // ✅ GST Calculation (12%)
  // ✅ GST Calculation (5%)
  // const gstRate = 0.05;
  // const gstAmount = totalPrice * gstRate;

  // const FREE_SHIPPING_LIMIT = 500;
  // const isFreeShipping = totalPrice >= FREE_SHIPPING_LIMIT;

  // 🟢 Final Shipping Charge
  // const finalShippingCharge = isFreeShipping ? 0 : shippingCharge;

  // 🟢 FINAL AMOUNT
  const finalAmount = totalPrice// + gstAmount; //finalShippingCharge
  // useEffect(() => {
  //   const pin = shippingAddress.pincode;

  //   if (isFreeShipping) {
  //     setShippingCharge(0);
  //     return;
  //   }

  //   if (pin.length === 6) fetchShippingCharge(pin);
  // }, [shippingAddress.pincode, isFreeShipping]);

  const handleCOD = async () => {
    if (!user) return toast("Please log in to continue.");
    if (!cartItems.length) return toast("Your cart is empty.");

    const validationError = isShippingValid();
    if (validationError) return toast(validationError);

    try {
      const products = cartItems.map((item) => ({
        productType:
          item.productType ||
          (item.category === "Oil"
            ? "OilProduct"
            : item.category === "Masala"
            ? "MasalaProduct"
            : item.category === "Ghee"
            ? "GheeProduct"
            : item.category === "Agarbatti"
            ? "AgarbattiProduct"
            : item.category === "Ganpati"
            ? "GanpatiProduct"
            : "Product"),
        product: item._id,
        quantity: item.quantity || 1,
        price: item.currentPrice || 0,
        name:
          item.category === "Agarbatti"
            ? item.title
            : item.productName || item.title || item.name,
        image: item.productImages?.[0],
        weight: item.selectedWeight || null,
        volume: item.selectedVolume || null,
        pack: item.selectedPack || null,
      }));

      const res = await axios.post("/api/orders/create-order", {
        userId: user._id || user.id,
        products,
        totalAmount: finalAmount,
        shippingAddress,
        email: user.email,
        paymentMethod: "COD", // 🔥 NEW
        paymentStatus: "Pending", // 🔥 NEW
      });

      if (!res.data.success) return toast(res.data.message);

      toast("✅ Order placed successfully with Cash on Delivery!");
      navigate("/profile");
    } catch (err) {
      console.error("COD Order Error:", err);
      toast("Failed to place COD order. Please try again.");
    }
  };

  // ✅ Payment Handler
  const handlePayment = async () => {
    if (loading) return;
    if (!user) return toast("Please log in to proceed.");
    if (!cartItems.length) return toast("Your cart is empty.");

    const validationError = isShippingValid();
    if (validationError) return toast(validationError);

    try {
      // Map products properly for backend
      console.log("Cart Items at Checkout:", cartItems);
      const products = cartItems.map((item) => ({
        productType:
          item.productType ||
          (item.category === "Oil"
            ? "OilProduct"
            : item.category === "Masala"
            ? "MasalaProduct"
            : item.category === "Ghee"
            ? "GheeProduct"
            : item.category === "Agarbatti"
            ? "AgarbattiProduct"
            : item.category === "Ganpati"
            ? "GanpatiProduct"
            : "Product"),
        product: item._id,
        quantity: item.quantity || 1,
        price: item.currentPrice || 0,
        name:
          item.category === "Agarbatti"
            ? item.title
            : item.productName || item.title || item.name,
        image: item.productImages?.[0],
        weight: item.selectedWeight || null,
        volume: item.selectedVolume || null,
        pack: item.selectedPack || null,
      }));

      // ✅ Create order with GST included
      const res = await axios.post("/api/orders/create-order", {
        userId: user._id || user.id,
        products,
        totalAmount: finalAmount,
        shippingAddress,
      });

      if (!res.data.success) return toast(res.data.message);

      const { razorpayOrder, key, invoiceNumber } = res.data;

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Ambgs Store",
        description: `Order Payment (${invoiceNumber})`,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post("/api/orders/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              toast("✅ Payment Successful! Thank you for shopping.");
              navigate("/profile");
            } else {
              toast("❌ Payment verification failed!");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast("Payment verification failed.");
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: user.email,
          contact: shippingAddress.phone,
        },
        notes: {
          address: shippingAddress.address,
        },
        theme: {
          color: "#16a34a",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Order creation error:", err);
      toast("Failed to create order. Please try again.");
    }
  };

  // Loading & Empty Cart UI
  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 font-semibold">
        Loading user info...
      </div>
    );

  if (!cartItems.length)
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Your cart is empty 🛍️
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---------------- LEFT SIDE ---------------- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          {cartItems.map((item) => (
            <div
              key={`${item._id}-${item.selectedWeight}-${item.selectedVolume}`}
              className="flex justify-between items-center border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.productImages?.[0]}
                  alt={item.productName}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.productName || item.title || item.name}{" "}
                    {item.category === "Agarbatti" && item.selectedPack
                      ? `(${item.selectedPack})`
                      : ""}
                  </h2>

                  {item.selectedWeight && (
                    <p className="text-gray-500 text-sm">
                      Weight: {item.selectedWeight}
                    </p>
                  )}
                  {item.selectedVolume && (
                    <p className="text-gray-500 text-sm">
                      Volume: {item.selectedVolume}
                    </p>
                  )}
                  {item.selectedPack && (
                    <p className="text-gray-500 text-sm">
                      Pack: {item.selectedPack}
                    </p>
                  )}
                  <p className="text-green-600 font-bold mt-1">
                    ₹{(item.currentPrice || 0) * (item.quantity || 1)}
                  </p>
                  <p className="text-xs text-gray-400">
                    (₹{item.currentPrice} × {item.quantity})
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Shipping Address */}
          <div className="border p-6 rounded-xl shadow-md bg-white mt-6">
            <h2 className="font-semibold text-lg mb-4">📦 Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleShippingChange}
                  placeholder="Enter your full name"
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-green-200"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleShippingChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-green-200"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  placeholder="House no, Street, Area"
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-green-200"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  placeholder="Enter your city"
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-green-200"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleShippingChange}
                  placeholder="Enter your state"
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-green-200"
                  required
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleShippingChange}
                  placeholder="Enter your pincode"
                  className="w-full border p-2 rounded-lg focus:ring focus:ring-green-200"
                  required
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value="India"
                  disabled
                  className="w-full border p-2 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SIDE ---------------- */}
        <div className="border p-6 rounded-xl shadow-md bg-white space-y-4">
          <h2 className="font-semibold text-lg">🧾 Order Summary</h2>

          <div className="divide-y text-sm">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between py-2 text-gray-600"
              >
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>₹{item.currentPrice * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="flex justify-between text-sm pt-3">
            <span>Subtotal</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>All Inclusive Price</span>
            {/* <span>₹{gstAmount.toFixed(2)}</span> */}
          </div>
          {/* Shipping Charges */}

          {/* <div className="flex justify-between text-sm font-medium">
            <span>
              Delivery Charges{" "}
              {!isFreeShipping && (
                <span className="text-xs text-gray-400">
                  (Free above ₹{FREE_SHIPPING_LIMIT})
                </span>
              )}
            </span>

            {isFreeShipping ? (
              <span className="text-green-600 font-bold">FREE </span>
            ) : isLoadingShipping ? (
              <span>Calculating...</span>
            ) : (
              <span className="text-blue-600">₹{shippingCharge}</span>
            )}
          </div> */}

          <div className="flex justify-between text-lg font-bold pt-3 border-t">
            <span>Total</span>
            <span className="text-green-600">₹{finalAmount.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCOD}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg shadow-lg transition mb-3"
          >
            🚚 Cash on Delivery (COD)
          </button>

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-lg transition"
          >
            ✅ Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProceedToCheckout;
