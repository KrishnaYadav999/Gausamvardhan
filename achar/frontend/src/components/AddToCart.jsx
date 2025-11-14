import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const AddToCart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } =
    useContext(CartContext);
  const navigate = useNavigate();

  // Calculate GST (12%)
  const gstRate = 0.12;
  const gstAmount = totalPrice * gstRate;
  const finalAmount = totalPrice + gstAmount;

  if (cartItems.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">
        Your cart is empty
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item._id}-${item.selectedWeight}-${item.selectedVolume}`}
              className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.productImages?.[0] || "/no-image.png"} // fallback image
                  alt={item.productName}
                  className="w-20 h-20 rounded object-cover"
                />
                <div>
                  <h2 className="font-semibold">{item.productName}</h2>
                  {item.selectedWeight && (
                    <p className="text-gray-500 text-sm">{item.selectedWeight}</p>
                  )}
                  {item.selectedVolume && (
                    <p className="text-gray-500 text-sm">{item.selectedVolume}</p>
                  )}
                  <p className="text-green-600 font-bold">
                    ₹{(item.currentPrice || 0) * (item.quantity || 1)}
                  </p>
                  <p className="text-xs text-gray-400">
                    (₹{item.currentPrice} × {item.quantity})
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    updateQuantity(
                      item._id,
                      item.selectedWeight,
                      item.selectedVolume,
                      -1
                    )
                  }
                  className="px-3 py-1 border rounded hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(
                      item._id,
                      item.selectedWeight,
                      item.selectedVolume,
                      1
                    )
                  }
                  className="px-3 py-1 border rounded hover:bg-gray-100 transition"
                >
                  +
                </button>
                <button
                  onClick={() =>
                    removeFromCart(
                      item._id,
                      item.selectedWeight,
                      item.selectedVolume
                    )
                  }
                  className="text-red-500 font-bold hover:text-red-700 transition"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border p-6 rounded-lg shadow-md space-y-4">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="flex justify-between">
            <span>Total Items</span>
            <span className="font-bold">{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (12%)</span>
            <span className="font-bold">₹{gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">Total (Incl. GST)</span>
            <span className="font-bold text-green-600">₹{finalAmount.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md transition"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;