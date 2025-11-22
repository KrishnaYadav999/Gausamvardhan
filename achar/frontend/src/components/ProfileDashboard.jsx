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

const StatusBadge = ({ status }) => {
  const map = {
    paid: "bg-emerald-100 text-emerald-800",
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-sky-100 text-sky-800",
    cancelled: "bg-rose-100 text-rose-800",
    refunded: "bg-blue-100 text-blue-800",
  };
  const klass = map[status] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${klass}`}
    >
      {status}
    </span>
  );
};

const Skeleton = ({ lines = 3 }) => (
  <div className="animate-pulse space-y-2">
    {[...Array(lines)].map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded w-full" />
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-4xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 bg-white p-6 rounded-2xl shadow">
              <Skeleton lines={6} />
            </div>
            <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
              <Skeleton lines={8} />
            </div>
          </div>
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

  const initials = (storedUser.name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      className="min-h-screen bg-gray-50 px-4 py-8 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <motion.aside
          className="lg:col-span-1 bg-white p-6 rounded-2xl shadow"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-red-700 flex items-center justify-center text-white text-xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {initials}
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {storedUser.name}
              </h3>
              <p className="text-sm text-gray-500">{storedUser.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Active Orders */}
            <div className="flex items-center gap-3">
              <FaBoxOpen className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Active Orders</p>
                <p className="font-semibold text-gray-800">
                  {activeOrders.length}
                </p>
              </div>
            </div>

            {/* Total Spent */}
            <div className="flex items-center gap-3">
              <FaMoneyBillWave className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-center gap-3">
              <FaClock className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-semibold text-gray-800">
                  {storedUser.createdAt
                    ? formatDate(storedUser.createdAt)
                    : "—"}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleLogout}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-500 transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6 border-t pt-4 text-sm text-gray-500">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-800">Default Shipping</p>
                {storedUser.address ? (
                  <p className="text-gray-500 text-sm">{storedUser.address}</p>
                ) : (
                  <p className="text-gray-400">No address saved</p>
                )}
              </div>
            </div>
          </div>
        </motion.aside>

        {/* RIGHT SECTION */}
        <motion.main
          className="lg:col-span-2"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
            <div className="text-sm text-gray-500">
              Showing {orders.length} orders
            </div>
          </div>

          {error && (
            <div className="mb-4 text-rose-600 font-medium">{error}</div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow text-center">
              <p className="text-gray-600">You have no orders yet.</p>
              <Link
                to="/shop"
                className="inline-block mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {orders
                  .sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  )
                  .map((order, index) => (
                    <motion.article
                      key={order._id}
                      className="bg-white p-5 rounded-2xl shadow-sm border"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -25 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        delay: index * 0.05,
                      }}
                    >
                      {/* Top Row */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Order •{" "}
                            <span className="font-mono text-xs">
                              {order.orderNumber}
                            </span>
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {formatCurrency(order.totalAmount)}
                            </h3>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-gray-500 text-sm mt-1">
                            Placed on {formatDate(order.createdAt)}
                          </p>

                          {order.isCancelled && (
                            <p className="mt-1 text-sm italic text-gray-500">
                              Refund will be processed within 6–7 working days.
                            </p>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/order/${order._id}`}
                            className="px-4 py-2 rounded-lg border text-sm"
                          >
                            Track
                          </Link>
                          <Link
                            to={`/invoice/${order._id}`}
                            className="px-4 py-2 rounded-lg border text-sm"
                          >
                            Invoice
                          </Link>

                          {!order.isCancelled &&
                            order.status !== "delivered" &&
                            order.status !== "cancelled" && (
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>

                      {/* Product List */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.products.map((p, idx) => (
                          <Link
                            key={idx}
                            to={`/product/${p.product}`}
                            className="flex items-center gap-3 rounded p-2 hover:bg-gray-50 transition border-b last:border-none"
                          >
                            <img
                              src={p.image || "/no-image.png"}
                              alt={p.name || "Product"}
                              className="w-16 h-16 object-cover rounded-md"
                            />

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">
                                  {p.name || "Unnamed Product"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  x{p.quantity}
                                </p>
                              </div>

                              {(p.weight || p.volume) && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {p.weight && (
                                    <span>Weight: {p.weight}</span>
                                  )}
                                  {p.weight && p.volume && " | "}
                                  {p.volume && (
                                    <span>Volume: {p.volume}</span>
                                  )}
                                </p>
                              )}

                              <p className="text-sm text-gray-700 mt-1">
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
