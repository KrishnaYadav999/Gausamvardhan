import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { format, subDays } from "date-fns";

const getAuthConfig = () => ({ withCredentials: true });

const COLORS = [
  "#4ade80",
  "#60a5fa",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#a78bfa",
  "#14b8a6",
  "#ec4899",
];

// ✅ Reusable Accordion Component
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-3 text-left font-semibold text-gray-700 hover:bg-gray-50"
      >
        {title}
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-5 pt-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProAdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // ✅ Load all data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [ordersRes, p1, p2, p3, p4, cats] = await Promise.all([
          axios.get("http://localhost:5000/api/orders", getAuthConfig()),
          axios.get("http://localhost:5000/api/products", getAuthConfig()),
          axios.get("http://localhost:5000/api/ghee-products", getAuthConfig()),
          axios.get("http://localhost:5000/api/masala-products", getAuthConfig()),
          axios.get("http://localhost:5000/api/oils", getAuthConfig()),
          axios.get("http://localhost:5000/api/categories", getAuthConfig()),
        ]);

        const mergedProducts = [
          ...(p1.data.products || []),
          ...(p2.data.products || []),
          ...(p3.data.products || []),
          ...(p4.data.products || []),
        ];

        setOrders(ordersRes.data.orders || ordersRes.data || []);
        setAllProducts(mergedProducts);
        setCategories(cats.data.categories || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load data from the server.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshKey]);

  // ✅ Compute Metrics
  const metrics = useMemo(() => {
    const filteredOrders = orders.filter((o) => {
      const created = new Date(o.createdAt || o.updatedAt || Date.now());
      return created >= dateRange.from && created <= dateRange.to;
    });

    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (acc, o) => acc + Number(o.totalAmount || 0),
      0
    );

    const ordersByStatus = filteredOrders.reduce((acc, o) => {
      const s = o.status || "pending";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    const productSales = {};
    filteredOrders.forEach((o) => {
      (o.products || []).forEach((p) => {
        const id = p._id || p.name;
        const name = p.name || "Unknown";
        const qty = Number(p.quantity || 1);
        const price = Number(p.price || 0);
        productSales[id] = productSales[id] || { name, qty: 0, revenue: 0 };
        productSales[id].qty += qty;
        productSales[id].revenue += qty * price;
      });
    });

    const topSelling = Object.values(productSales)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);

    const lowStock = allProducts
      .filter((p) => (p.stockQuantity ?? 0) <= 5)
      .slice(0, 8);

    const revenueByDate = {};
    filteredOrders.forEach((o) => {
      const d = format(new Date(o.createdAt || Date.now()), "yyyy-MM-dd");
      revenueByDate[d] = (revenueByDate[d] || 0) + Number(o.totalAmount || 0);
    });

    const revenueTimeSeries = Object.entries(revenueByDate)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const categoryRevenue = {};
    filteredOrders.forEach((o) => {
      (o.products || []).forEach((p) => {
        const cat = p.category || "Uncategorized";
        const amt = Number(p.price || 0) * Number(p.quantity || 1);
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + amt;
      });
    });

    const categoryRevenueData = Object.entries(categoryRevenue).map(
      ([name, value]) => ({ name, value })
    );

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topSelling,
      lowStock,
      revenueTimeSeries,
      categoryRevenueData,
    };
  }, [orders, allProducts, dateRange]);

  // ✅ Loading & Error States
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading Dashboard...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          Retry
        </button>
      </div>
    );

  // ✅ Dashboard UI
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold mb-4"
      >
        🧭 Admin Dashboard
      </motion.h1>

      {/* 📅 Accordion 1 — Date Range & Summary */}
      <Accordion title="📅 Date Range & Summary" defaultOpen>
        <div className="flex flex-wrap gap-3 mb-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">From</label>
            <input
              type="date"
              value={format(dateRange.from, "yyyy-MM-dd")}
              onChange={(e) =>
                setDateRange((d) => ({ ...d, from: new Date(e.target.value) }))
              }
              className="border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">To</label>
            <input
              type="date"
              value={format(dateRange.to, "yyyy-MM-dd")}
              onChange={(e) =>
                setDateRange((d) => ({ ...d, to: new Date(e.target.value) }))
              }
              className="border px-3 py-2 rounded"
            />
          </div>
          <button
            onClick={() => setDateRange({ from: subDays(new Date(), 30), to: new Date() })}
            className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 self-end"
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="bg-emerald-500 text-white px-4 py-2 rounded self-end"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow text-center">
            <h3 className="text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold">{metrics.totalOrders}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow text-center">
            <h3 className="text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold">₹{metrics.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow text-center">
            <h3 className="text-gray-500">Low Stock</h3>
            <p className="text-2xl font-bold">{metrics.lowStock.length}</p>
          </div>
        </div>
      </Accordion>

      {/* 📈 Accordion 2 — Sales & Revenue Charts */}
      <Accordion title="📈 Sales & Revenue Charts" defaultOpen>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Revenue Trend</h3>
            {metrics.revenueTimeSeries.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={metrics.revenueTimeSeries}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 py-10">No revenue data</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Orders by Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(metrics.ordersByStatus).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {Object.keys(metrics.ordersByStatus).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Accordion>

      {/* 📊 Accordion 3 — Product Insights */}
      <Accordion title="📊 Product Insights">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Top Selling Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.topSelling}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Low Stock Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={metrics.lowStock.map((p) => ({
                  name: p.name || p.title || "Unknown",
                  stock: p.stockQuantity || 0,
                }))}
              >
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Accordion>

      {/* 💸 Accordion 4 — Category Analytics */}
      <Accordion title="💸 Revenue by Category">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={metrics.categoryRevenueData}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {metrics.categoryRevenueData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Accordion>
    </div>
  );
}
