// 🌿 Premium GREEN Theme + Glassmorphism Order Tracking UI + Embedded POPPINS Font 💚✨

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  Truck,
  Package,
  Home,
  XCircle,
  MapPin,
  Phone,
} from "lucide-react";

// GOOGLE FONT EMBEDDED HERE
const fontStyle = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
* {
  font-family: "Poppins", sans-serif !important;
}
`;

// Step Config
const steps = [
  { label: "Ordered", icon: <Package size={20} /> },
  { label: "Shipped", icon: <Truck size={20} /> },
  { label: "Out for Delivery", icon: <Home size={20} /> },
  { label: "Delivered", icon: <CheckCircle size={20} /> },
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
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse text-xl font-semibold text-green-700">
        Loading Order...
      </div>
    );

  if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;

  if (!order) return <div className="p-6">No order found.</div>;

  const currentStepIndex = steps.findIndex(
    (step) => step.label === statusMap[order.status]
  );

  return (
    <>
      {/* Inject Poppins on this page only */}
      <style>{fontStyle}</style>

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-500 text-transparent bg-clip-text drop-shadow-sm">
          Track Your Order
        </h2>

        {/* Order Summary Card */}
        <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl shadow-2xl p-6 flex flex-col gap-1">
          <p className="text-lg font-semibold text-green-700">
            Order #{order.orderNumber}
          </p>
          <p className="text-sm text-gray-700">
            Invoice: {order.invoiceNumber}
          </p>
        </div>

        {/* Progress Tracker */}
        {order.status === "cancelled" ? (
          <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 font-bold text-lg animate-bounce">
            <XCircle size={28} /> Cancelled
          </div>
        ) : (
          <div className="relative bg-white/40 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10" />

            <div className="flex justify-between relative">
              {steps.map((step, index) => {
                const active = index <= currentStepIndex;
                return (
                  <div key={index} className="flex flex-col items-center w-full">
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg border-2 transition-all duration-500 ${
                        active
                          ? "bg-gradient-to-br from-green-600 to-emerald-500 text-white border-green-600 scale-110 shadow-green-300/50"
                          : "bg-gray-200 text-gray-500 border-gray-300"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        active ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}

              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-600 to-emerald-500 transition-all duration-700 -z-10"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl shadow-xl p-6 space-y-2">
          <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
            <MapPin /> Delivery Address
          </h3>
          <p className="font-medium">{order.shippingAddress?.name}</p>
          <p className="text-gray-700">
            {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
            {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </p>
          <p className="text-gray-600">{order.shippingAddress?.country}</p>
          {order.shippingAddress?.phone && (
            <p className="flex items-center gap-2 text-gray-700 font-medium">
              <Phone size={18} /> {order.shippingAddress.phone}
            </p>
          )}
        </div>

        {/* Products List */}
        <div className="backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl shadow-xl p-6 space-y-4">
          <h3 className="text-xl font-semibold text-green-700">
            Ordered Products
          </h3>

          {order.products.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 pb-3 border-b last:border-none border-gray-200/50"
            >
              <img
                src={item.image || "/no-image.png"}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover shadow-md"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                {item.weight && (
                  <p className="text-gray-600 text-sm">
                    Weight: {item.weight}
                  </p>
                )}
                {item.volume && (
                  <p className="text-gray-600 text-sm">
                    Volume: {item.volume}
                  </p>
                )}
                <p className="text-gray-700 text-sm">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
                <p className="font-bold text-green-700">
                  ₹{item.quantity * item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 rounded-2xl shadow-xl">
          <span className="text-xl font-bold">
            Total: ₹{order.totalAmount}
          </span>
          <span className="text-lg capitalize">
            {order.isCancelled
              ? "Cancelled"
              : order.status.replace(/-/g, " ")}
          </span>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;
