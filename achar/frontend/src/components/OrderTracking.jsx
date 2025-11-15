import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Truck, Package, Home, XCircle } from "lucide-react";

const steps = [
  { label: "Ordered", icon: <Package size={18} />, color: "bg-green-500 text-white" },
  { label: "Shipped", icon: <Truck size={18} />, color: "bg-orange-500 text-white" },
  { label: "Out for Delivery", icon: <Home size={18} />, color: "bg-purple-500 text-white" },
  { label: "Delivered", icon: <CheckCircle size={18} />, color: "bg-teal-500 text-white" },
];

const statusMap = {
  pending: "Ordered",
  shipped: "Shipped",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        if (res.data.success) setOrder(res.data.order);
        else setError("Order not found.");
      } catch (err) {
        setError(err.response?.data?.message || "Server error while fetching order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!order) return <div className="p-6">No order found.</div>;

  const currentStepIndex = steps.findIndex(
    (step) => step.label === statusMap[order.status]
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Order Tracking
      </h2>

      {/* Order Info */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
        <p className="text-gray-500 text-sm">Invoice: {order.invoiceNumber}</p>
      </div>

      {/* Step Tracker */}
      {order.status === "cancelled" ? (
        <div className="flex items-center justify-center space-x-2 bg-red-100 text-red-700 py-3 rounded-lg mb-6">
          <XCircle size={20} />
          <span className="font-semibold text-lg">
            Cancelled ({order.cancelReason || "No reason provided"})
          </span>
        </div>
      ) : (
        <div className="relative flex flex-col md:flex-row items-center justify-between mb-12 px-2 md:px-0">
          {/* Road Background */}
          <div className="absolute top-6 md:top-9 left-6 right-6 h-1 bg-blue-300 z-0 md:flex hidden"></div>
          <div className="absolute top-12 left-6 right-6 h-1 bg-blue-300 z-0 md:hidden"></div>

          {steps.map((step, index) => {
            const isCompletedOrActive = index <= currentStepIndex;
            return (
              <div
                key={index}
                className="flex flex-1 items-center md:flex-col md:items-center relative z-10"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
                    ${isCompletedOrActive ? step.color : "bg-gray-200 text-gray-500 border-gray-300"}
                  `}
                >
                  {step.icon}
                </div>
                <span
                  className={`mt-2 text-sm font-medium text-center
                    ${isCompletedOrActive ? "text-gray-800" : "text-gray-500"}
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}

          {/* Progress Fill */}
          <div
            className="absolute top-6 md:top-9 left-6 h-1 bg-blue-500 z-0 transition-all duration-500 md:flex hidden"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          ></div>
          <div
            className="absolute top-12 left-6 h-1 bg-blue-500 z-0 transition-all duration-500 md:hidden"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          ></div>
        </div>
      )}

      {/* Shipping Address */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <h3 className="font-semibold text-lg mb-2 text-blue-700">Shipping Address</h3>
        <p>{order.shippingAddress?.name}</p>
        <p>
          {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
          {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
        </p>
        <p>{order.shippingAddress?.country}</p>
        {order.shippingAddress?.phone && <p>📞 {order.shippingAddress.phone}</p>}
      </div>

      {/* Products */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6 space-y-4">
        <h3 className="font-semibold text-lg text-blue-700">Products</h3>
        {order.products.map((item, idx) => (
          <div key={idx} className="flex items-center border-b pb-2 last:border-none">
            <img
              src={item.image || "/no-image.png"}
              alt={item.name}
              className="w-16 h-16 rounded object-cover mr-4"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              {item.weight && <p className="text-gray-500 text-sm">Weight: {item.weight}</p>}
{item.volume && <p className="text-gray-500 text-sm">Volume: {item.volume}</p>}

              <p className="text-gray-500 text-sm">
                Qty: {item.quantity} × ₹{item.price}
              </p>
              <p className="font-semibold">₹{item.quantity * item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 md:p-6">
        <span className="font-bold text-lg text-blue-700">Total: ₹{order.totalAmount}</span>
        {order.isCancelled ? (
          <span className="text-red-600 font-semibold">Cancelled</span>
        ) : (
          <span className="text-yellow-600 font-semibold capitalize">
            {order.status === "out-for-delivery" ? "Out for Delivery" : order.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
