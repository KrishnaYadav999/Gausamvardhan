import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ProfileDashboard = () => {
  const { user, logoutUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect to login if no user
  useEffect(() => {
    const storedUser = user || JSON.parse(localStorage.getItem("user"));
    if (!loading && !storedUser) navigate("/login");
  }, [user, loading, navigate]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = user || JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;
      if (!userId) {
        setOrdersLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/user-orders/${userId}`
        );

        if (res.data.success) {
          // Filter out cancelled orders so user doesn't see them

          setOrders(res.data.orders);
        } else {
          setError("Failed to fetch orders.");
        }
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

  // Cancel Order
  // Cancel Order - updated version
const handleCancelOrder = async (orderId) => {
  const reason = prompt("Enter cancellation reason:");
  if (!reason) return;

  try {
    // 1️⃣ Call backend to cancel order
    const res = await axios.post(
      "http://localhost:5000/api/orders/cancel-order",
      { orderId, reason }
    );

    if (res.data.success) {
      // 2️⃣ Update the specific order locally immediately for instant UI feedback
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, status: "cancelled", isCancelled: true, cancelReason: reason }
            : o
        )
      );

      // 3️⃣ Refetch latest orders from backend to stay in sync
      const storedUser = user || JSON.parse(localStorage.getItem("user"));
      if (storedUser?._id) {
        const ordersRes = await axios.get(
          `http://localhost:5000/api/orders/user-orders/${storedUser._id}`
        );

        if (ordersRes.data.success) {
          setOrders(ordersRes.data.orders);
        }
      }

      alert("Order cancelled successfully! Refund will be processed within 6–7 working days.");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Failed to cancel order.");
  }
};


  if (loading || ordersLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const storedUser = user || JSON.parse(localStorage.getItem("user"));
  if (!storedUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      {/* Profile Info */}
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg mb-8">
        <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">
          Profile Dashboard
        </h1>
        <div className="space-y-4">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="text-gray-800 font-semibold">{storedUser.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-gray-800 font-semibold">{storedUser.email}</p>
          </div>
          {storedUser.createdAt && (
            <div>
              <p className="text-gray-500">Account Created</p>
              <p className="text-gray-800 font-semibold">
                {new Date(storedUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full py-3 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-600 shadow-md transition-all duration-300"
        >
          Logout
        </button>
      </div>

      {/* Orders Section */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        {orders.length === 0 ? (
          <p className="text-gray-500">You have no active orders.</p>
        ) : (
          <div className="space-y-6">
            {orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <div
                  key={order._id}
                  className="border p-4 rounded-lg shadow-sm bg-white"
                >
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
                    <div className="mb-3 md:mb-0">
                      <p className="text-gray-500 text-sm">
                        Order ID: {order.orderNumber}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        Total: ₹{order.totalAmount}
                      </p>
                     <p className="text-gray-500 text-sm">
  Status:{" "}
  <span
    className={`font-semibold ${
      order.status === "paid"
        ? "text-green-600"
        : order.status === "pending"
        ? "text-yellow-600"
        : order.status === "shipped"
        ? "text-indigo-600"
        : order.status === "delivered"
        ? "text-green-800"
        : order.status === "cancelled"
        ? "text-red-600"
        : order.status === "refunded"
        ? "text-blue-600"
        : "text-gray-600"
    }`}
  >
    {order.status === "cancelled"
      ? `Cancelled (${order.cancelReason || "No reason provided"})`
      : order.status === "refunded"
      ? "Refunded"
      : order.status}
  </span>
</p>

                       {order.isCancelled && (
    <p className="text-sm text-gray-600 mt-1 italic">
      Refund will be processed within 6–7 working days.
    </p>
  )}
                      <p className="text-gray-500 text-sm">
                        Order Date:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>

                      {order.shippingAddress && (
                        <div className="text-gray-500 text-sm mt-2">
                          <p>Shipping Address:</p>
                          <p>{order.shippingAddress.name || storedUser.name}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.pincode}
                          </p>
                          <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Link
                        to={`/order/${order._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        Track Order
                      </Link>
                      <Link
                        to={`/invoice/${order._id}`}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        View Invoice
                      </Link>

                      {!order.isCancelled &&
                        order.status !== "delivered" &&
                        order.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.products.map((p, idx) => (
                      <Link
                        to={`/product/${p.product}`}
                        key={idx}
                        className="flex items-center gap-3 border-b pb-2 mb-2 last:border-none hover:bg-gray-50 transition rounded p-2"
                      >
                        <img
                          src={p.image || "/no-image.png"}
                          alt={p.name || "Unnamed Product"}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          {(p.weight || p.volume) && (
                            <p className="text-gray-500 text-sm">
                              {p.weight && <span>Weight: {p.weight}</span>}
                              {p.weight && p.volume && " | "}
                              {p.volume && <span>Volume: {p.volume}</span>}
                            </p>
                          )}
                          <p className="font-medium">
                            {p.quantity} × {p.name || "Unnamed Product"}
                          </p>
                          <p className="text-gray-500">
                            ₹{p.price} each | ₹{p.price * p.quantity} total
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDashboard;
