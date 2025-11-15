import React, { useEffect, useState } from "react";
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

const AdminUserAllData = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorUsers, setErrorUsers] = useState("");
  const [errorOrders, setErrorOrders] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/auth/all");
      if (res.data.success) setUsers(res.data.users);
      else setErrorUsers("Failed to fetch users.");
    } catch (err) {
      setErrorUsers(err.response?.data?.message || "Server error while fetching users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    setLoadingOrders(true);
    setUserOrders([]);
    try {
      const res = await axios.get(`/api/orders/user-orders/${userId}`);
      if (res.data.success) setUserOrders(res.data.orders);
      else setErrorOrders("Failed to fetch orders.");
    } catch (err) {
      setErrorOrders(err.response?.data?.message || "Server error while fetching orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) fetchUserOrders(selectedUserId);
  }, [selectedUserId]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h2 className="text-4xl font-bold mb-6 text-blue-700">Admin Dashboard - Users & Orders</h2>

      {/* Users Table */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-blue-600">Registered Users</h3>
        {loadingUsers ? (
          <p className="text-gray-600">Loading users...</p>
        ) : errorUsers ? (
          <p className="text-red-600">{errorUsers}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left text-gray-700">#</th>
                  <th className="py-3 px-4 border-b text-left text-gray-700">Name</th>
                  <th className="py-3 px-4 border-b text-left text-gray-700">Email</th>
                  <th className="py-3 px-4 border-b text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">{idx + 1}</td>
                    <td className="py-2 px-4 border-b font-medium">{user.name}</td>
                    <td className="py-2 px-4 border-b text-gray-600">{user.email}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => setSelectedUserId(user._id)}
                        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 shadow-md transition"
                      >
                        View Orders
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Orders */}
      {selectedUserId && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">User Orders</h3>
          {loadingOrders ? (
            <p className="text-gray-600">Loading orders...</p>
          ) : errorOrders ? (
            <p className="text-red-600">{errorOrders}</p>
          ) : userOrders.length === 0 ? (
            <p className="text-gray-600">No orders for this user.</p>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => {
                const currentStepIndex = steps.findIndex(
                  (step) => step.label === statusMap[order.status]
                );

                return (
                  <div key={order._id} className="border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <p className="font-bold text-lg text-gray-800">Order #{order.orderNumber}</p>
                      <p className="text-gray-500">Invoice: {order.invoiceNumber}</p>
                    </div>

                    {/* Step Tracker */}
                    {order.status === "cancelled" ? (
                      <div className="flex items-center space-x-2 bg-red-100 text-red-700 py-2 px-3 rounded mb-4">
                        <XCircle size={20} />
                        <span className="font-semibold">
                          Cancelled ({order.cancelReason || "No reason"})
                        </span>
                      </div>
                    ) : (
                      <div className="flex space-x-2 mb-4">
                        {steps.map((step, idx) => {
                          const isCompletedOrActive = idx <= currentStepIndex;
                          return (
                            <div
                              key={idx}
                              className={`flex-1 flex flex-col items-center transition ${
                                isCompletedOrActive ? "text-gray-800" : "text-gray-400"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                                  isCompletedOrActive ? steps[idx].color : "bg-gray-200 border-gray-300"
                                }`}
                              >
                                {steps[idx].icon}
                              </div>
                              <span className="text-xs mt-1 font-medium">{steps[idx].label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Products */}
                    <div className="space-y-3 mb-4">
                      {order.products.map((item, i) => (
                        <div key={i} className="flex items-center border-b pb-2 last:border-none">
                          <img
                            src={item.image || "/no-image.png"}
                            alt={item.name}
                            className="w-14 h-14 rounded object-cover mr-3"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                            <p className="font-semibold text-gray-700">₹{item.quantity * item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-lg text-blue-700">Total: ₹{order.totalAmount}</span>
                      <span
                        className={`font-semibold px-2 py-1 rounded ${
                          order.isCancelled
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-800 capitalize"
                        }`}
                      >
                        {order.status === "out-for-delivery" ? "Out for Delivery" : order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUserAllData;
