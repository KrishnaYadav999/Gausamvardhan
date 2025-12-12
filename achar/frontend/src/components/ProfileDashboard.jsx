// --- FULL UPDATED CODE WITH SHIPPING INSIDE ORDER CARD -----

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaSignOutAlt,
  FaBoxOpen,
  FaMoneyBillWave,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Helpers
const formatCurrency = (amt) => `₹${Number(amt).toLocaleString()}`;
const formatDate = (d) => new Date(d).toLocaleDateString();

// STATUS COLORS
const StatusBadge = ({ status }) => {
  const map = {
    paid: "bg-emerald-500/20 text-emerald-800 border border-emerald-400/30",
    pending: "bg-yellow-500/20 text-yellow-800 border border-yellow-400/30",
    shipped: "bg-blue-500/20 text-blue-800 border border-blue-400/30",
    delivered: "bg-sky-500/20 text-sky-800 border border-sky-400/30",
    cancelled: "bg-rose-500/20 text-rose-800 border border-rose-400/30",
    refunded: "bg-purple-500/20 text-purple-800 border border-purple-400/30",
  };
  const klass = map[status] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${klass}`}
    >
      {status}
    </span>
  );
};

// LOADING SKELETON
const Skeleton = ({ lines = 3 }) => (
  <div className="animate-pulse space-y-2">
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="h-4 bg-white/20 rounded w-full" />
    ))}
  </div>
);

export default function ProfileDashboard() {
  const { user, logoutUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem("user"));
    if (!loading && !storedUser) navigate("/login");
  }, [user, loading, navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = user || JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;
      if (!userId) return setOrdersLoading(false);

      try {
        const res = await axios.get(`/api/orders/user-orders/${userId}`);
        if (res.data.success) setOrders(res.data.orders || []);
        else setError("Failed to fetch orders.");
      } catch (err) {
        setError(
          err.response?.data?.message || "Server error while fetching orders."
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    if (!loading) fetchOrders();
  }, [user, loading]);

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    try {
      const res = await axios.post("/api/orders/cancel-order", {
        orderId,
        reason,
      });

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                  ...o,
                  status: "cancelled",
                  isCancelled: true,
                  cancelReason: reason,
                }
              : o
          )
        );
        alert(
          "Order cancelled successfully! Refund will be processed within 6–7 working days."
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  if (loading || ordersLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-pink-700">
        <div className="w-full max-w-4xl p-6 backdrop-blur-xl bg-white/10 rounded-3xl shadow-lg border border-white/20">
          <Skeleton lines={10} />
        </div>
      </div>
    );

  const storedUser = user || JSON.parse(localStorage.getItem("user"));
  if (!storedUser) return null;

  const totalSpent = orders.reduce(
    (s, o) => s + (Number(o.totalAmount) || 0),
    0
  );
  const activeOrders = orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "refunded"
  );

  // ⭐ FETCH DEFAULT SHIPPING ADDRESS (FIRST ORDER)
  const shipping =
    orders.length > 0 && orders[0].shippingAddress
      ? orders[0].shippingAddress
      : null;

  const initials = (storedUser.name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 px-4 py-10 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <motion.aside
          className="lg:col-span-1 backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-lg"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-700 flex items-center justify-center text-white text-xl font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {initials}
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {storedUser.name}
              </h3>
              <p className="text-sm text-purple-200">{storedUser.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-white">
            {/* Active Orders */}
            <div className="flex items-center gap-3">
              <FaBoxOpen className="text-white/70" />
              <div>
                <p className="text-sm text-purple-200">Active Orders</p>
                <p className="font-semibold">{activeOrders.length}</p>
              </div>
            </div>

            {/* Total Spent */}
            <div className="flex items-center gap-3">
              <FaMoneyBillWave className="text-white/70" />
              <div>
                <p className="text-sm text-purple-200">Total Spent</p>
                <p className="font-semibold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center gap-3">
              <FaClock className="text-white/70" />
              <div>
                <p className="text-sm text-purple-200">Member Since</p>
                <p className="font-semibold">
                  {storedUser.createdAt
                    ? formatDate(storedUser.createdAt)
                    : "—"}
                </p>
              </div>
            </div>

            {/* Logout */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleLogout}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-500 transition shadow-lg"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          {/* ⭐ DEFAULT SHIPPING ADDRESS */}
          <div className="mt-6 border-t border-white/30 pt-4 text-purple-100 text-sm">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-white/70" />
              <div>
                <p className="font-semibold text-white">Default Shipping</p>

                {!shipping ? (
                  <p className="text-purple-200">
                    No shipping address available
                  </p>
                ) : (
                  <>
                    <p>{shipping.name}</p>
                    <p>{shipping.address}</p>
                    <p>
                      {shipping.city}, {shipping.state} - {shipping.pincode}
                    </p>
                    <p>{shipping.country}</p>
                    {shipping.phone && <p>📞 {shipping.phone}</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* RIGHT SIDE - ORDER LIST */}
        <motion.main
          className="lg:col-span-2"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Orders</h2>
            <div className="text-purple-200 text-sm">
              Showing {orders.length} orders
            </div>
          </div>

          {error && (
            <div className="mb-4 text-rose-300 font-medium">{error}</div>
          )}

          {orders.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow">
              <p className="text-purple-100 text-center">
                You have no orders yet.
              </p>
              <Link
                to="/shop"
                className="inline-block mt-4 px-5 py-2 rounded-xl bg-pink-500 text-white font-semibold hover:bg-pink-400 transition"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {orders
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((order, index) => (
                    <motion.article
                      key={order._id}
                      className="backdrop-blur-xl bg-white/10 p-5 rounded-3xl border border-white/20 shadow"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -25 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        delay: index * 0.05,
                      }}
                    >
                      {/* ORDER HEADER */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
                        <div>
                          <p className="text-sm text-purple-200">
                            Order •{" "}
                            <span className="font-mono text-xs text-purple-300">
                              {order.orderNumber}
                            </span>
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <h3 className="text-lg font-semibold">
                              {formatCurrency(order.totalAmount)}
                            </h3>
                            <StatusBadge status={order.status} />
                            {console.log(
                              "Order ID:",
                              order._id,
                              "Payment method raw:",
                              order.paymentMethod
                            )}

                            {order.paymentMethod &&
                            (order.paymentMethod
                              .toString()
                              .trim()
                              .toLowerCase() === "cod" ||
                              order.paymentMethod
                                .toString()
                                .trim()
                                .toLowerCase() === "cash on delivery") ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-400/30">
                                Cash on Delivery
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-400/30">
                                Online Payment
                              </span>
                            )}
                          </div>
                          <p className="text-purple-200 text-sm mt-1">
                            Placed on {formatDate(order.createdAt)}
                          </p>

                        {order.isCancelled &&
  order.paymentMethod &&
  !["cod", "cash on delivery"].includes(
    order.paymentMethod.toString().trim().toLowerCase()
  ) && (
    <p className="mt-1 text-sm italic text-purple-200">
      Refund processed in 6–7 days.
    </p>
  )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/order/${order._id}`}
                            className="px-4 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition"
                          >
                            Track
                          </Link>
                          <Link
                            to={`/invoice/${order._id}`}
                            className="px-4 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition"
                          >
                            Invoice
                          </Link>

                          {!order.isCancelled &&
                            order.status !== "delivered" &&
                            order.status !== "cancelled" && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-500 transition"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>

                      {/* ⭐ SHIPPING INSIDE ORDER CARD (NEWLY ADDED) */}
                      {order.shippingAddress && (
                        <div className="mt-4 border border-white/20 rounded-xl p-4 text-purple-100 text-sm">
                          <div className="flex items-start gap-3">
                            <FaMapMarkerAlt className="mt-1 text-white/70" />
                            <div>
                              <p className="font-semibold text-white">
                                Shipping Address
                              </p>
                              <p>{order.shippingAddress.name}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state} -{" "}
                                {order.shippingAddress.pincode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                              {order.shippingAddress.phone && (
                                <p>📞 {order.shippingAddress.phone}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PRODUCTS */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.products.map((p, idx) => (
                          <Link
                            key={idx}
                            to={`/product/${p.product}`}
                            className="flex items-center gap-3 rounded p-2 hover:bg-white/10 transition border-b border-white/10 last:border-none"
                          >
                            <img
                              src={p.image || "/no-image.png"}
                              alt={p.name || "Product"}
                              className="w-16 h-16 object-cover rounded-md shadow"
                            />

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-white text-sm">
                                  {p.name || "Unnamed Product"}
                                </p>
                                <p className="text-sm text-purple-200">
                                  x{p.quantity}
                                </p>
                              </div>

                              {(p.weight || p.volume || p.pack) && (
                                <p className="text-sm text-purple-200 mt-1">
                                  {p.weight && <span>Weight: {p.weight}</span>}
                                  {p.weight && p.volume && " | "}
                                  {p.volume && <span>Volume: {p.volume}</span>}
                                  {p.pack && <span>Pack: {p.pack}</span>}
                                </p>
                              )}

                              <p className="text-sm text-white mt-1">
                                {formatCurrency(p.price)} each •{" "}
                                {formatCurrency(p.price * p.quantity)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.article>
                  ))}
              </AnimatePresence>
            </div>
          )}
        </motion.main>
      </div>
    </motion.div>
  );
}
