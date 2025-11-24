import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const AddToCart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } =
    useContext(CartContext);
  const navigate = useNavigate();

  const gstRate = 0.12;
  const gstAmount = totalPrice * gstRate;
  const finalAmount = totalPrice + gstAmount;

  if (cartItems.length === 0)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500 text-lg font-medium">
        Your cart is empty
      </div>
    );

  return (
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
              item.productImages?.length > 0
                ? item.productImages[0]
                : item.images?.length > 0
                ? item.images[0]
                : "/no-image.png";

            return (
              <div
                key={`${item._id}-${item.selectedWeight}-${item.selectedVolume}-${item.selectedPack}`}
                className="flex flex-col md:flex-row items-center md:items-start justify-between border border-gray-200 p-4 rounded-xl shadow hover:shadow-lg transition duration-300 bg-white"
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
                      <p className="text-gray-500 text-sm">{item.selectedWeight}</p>
                    )}
                    {item.selectedVolume && (
                      <p className="text-gray-500 text-sm">{item.selectedVolume}</p>
                    )}
                    {item.selectedPack && (
                      <p className="text-gray-500 text-sm">Pack: {item.selectedPack}</p>
                    )}
                    <p className="text-green-600 font-bold mt-1 text-lg">
                      ₹{(item.currentPrice || 0) * (item.quantity || 1)}
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
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <span className="text-gray-800 font-medium">{item.quantity}</span>
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
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
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
                    className="text-red-500 font-bold hover:text-red-700 transition ml-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="border border-gray-200 p-6 rounded-xl shadow-md bg-white space-y-5">
          <h2 className="font-semibold text-xl md:text-2xl text-gray-800">Order Summary</h2>
          <div className="flex justify-between text-gray-700">
            <span>Total Items</span>
            <span className="font-medium">{totalItems}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
          </div>
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
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-lg transition duration-300 text-lg font-medium"
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
