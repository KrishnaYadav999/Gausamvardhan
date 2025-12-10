// ProAdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
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

// small helper for auth requests
const getAuthConfig = () => ({ withCredentials: true });

// color palette
const COLORS = [
  "#10B981", // green
  "#60A5FA", // blue
  "#F59E0B", // amber
  "#F97316", // orange
  "#EF4444", // red
  "#A78BFA", // purple
  "#14B8A6", // teal
  "#EC4899", // pink
];

// CSV export helper
const downloadCSV = (rows = [], filename = "export.csv") => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const val = r[h] ?? "";
          if (typeof val === "string" && val.includes(",")) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function ProAdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Search + UI
  const [query, setQuery] = useState("");
  const [themeDark, setThemeDark] = useState(true);

  // Date range
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Quick ranges
  const setQuickRange = (days) =>
    setDateRange({ from: subDays(new Date(), days), to: new Date() });

  // Load data (relative routes; proxy or production host will handle base URL)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use relative routes - no env or localhost
        const [
          ordersRes,
          prodAll,
          gheeRes,
          masalaRes,
          oilsRes,
          catsRes,
        ] = await Promise.all([
          axios.get("/api/orders/admin/orders", getAuthConfig()),
          axios.get("/api/products", getAuthConfig()),
          axios.get("/api/ghee-products", getAuthConfig()),
          axios.get("/api/masala-products", getAuthConfig()),
          axios.get("/api/oils", getAuthConfig()),
          axios.get("/api/categories", getAuthConfig()),
        ]);

        const mergedProducts = [
          ...(prodAll.data.products || []),
          ...(gheeRes.data.products || []),
          ...(masalaRes.data.products || []),
          ...(oilsRes.data.products || []),
        ];

        if (!mounted) return;

        setOrders(ordersRes.data.orders || ordersRes.data || []);
        setAllProducts(mergedProducts);
        setCategories(catsRes.data.categories || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to fetch analytics data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  // Filter orders by dateRange and query
  const filteredOrders = useMemo(() => {
    const from = dateRange.from ? new Date(dateRange.from).setHours(0, 0, 0, 0) : null;
    const to = dateRange.to ? new Date(dateRange.to).setHours(23, 59, 59, 999) : null;

    return orders
      .filter((o) => {
        const created = new Date(o.createdAt || o.updatedAt || Date.now()).getTime();
        if (from && created < from) return false;
        if (to && created > to) return false;
        if (!query) return true;

        const q = query.toLowerCase();
        // search in order id, user email/name, product names, status
        if ((o._id || "").toString().toLowerCase().includes(q)) return true;
        if ((o.email || o.userEmail || "").toLowerCase().includes(q)) return true;
        if ((o.userName || "").toLowerCase().includes(q)) return true;
        if ((o.status || "").toLowerCase().includes(q)) return true;
        if (
          Array.isArray(o.products) &&
          o.products.some(
            (p) =>
              (p.name || p.title || "").toLowerCase().includes(q) ||
              (p.sku || "").toLowerCase().includes(q)
          )
        )
          return true;

        return false;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, dateRange, query]);

  // Compute metrics (memoized)
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (acc, o) => acc + Number(o.totalAmount || 0),
      0
    );

    const ordersByStatus = filteredOrders.reduce((acc, o) => {
      const s = (o.status || "pending").toLowerCase();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    // product-level stats
    const productSales = {};
    filteredOrders.forEach((o) => {
      (o.products || []).forEach((p) => {
        const id = p._id || p.sku || p.name || Math.random().toString();
        const name = p.name || p.title || "Unnamed";
        const qty = Number(p.quantity || 1);
        const price = Number(p.price || p.unitPrice || 0);
        if (!productSales[id]) productSales[id] = { id, name, qty: 0, revenue: 0 };
        productSales[id].qty += qty;
        productSales[id].revenue += qty * price;
      });
    });

    const topSelling = Object.values(productSales)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);

    const lowStock = allProducts
      .filter((p) => (p.stockQuantity ?? p.stock ?? 0) <= 5)
      .slice(0, 10)
      .map((p) => ({
        name: p.name || p.title || "Unknown",
        stock: p.stockQuantity ?? p.stock ?? 0,
      }));

    // revenue by date
    const revByDate = {};
    filteredOrders.forEach((o) => {
      const d = format(new Date(o.createdAt || Date.now()), "yyyy-MM-dd");
      revByDate[d] = (revByDate[d] || 0) + Number(o.totalAmount || 0);
    });
    const revenueTimeSeries = Object.entries(revByDate)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // category revenue
    const categoryRevenue = {};
    filteredOrders.forEach((o) => {
      (o.products || []).forEach((p) => {
        const cat = p.category || "Uncategorized";
        const amt = Number(p.price || 0) * Number(p.quantity || 1);
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + amt;
      });
    });
    const categoryRevenueData = Object.entries(categoryRevenue).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topSelling,
      lowStock,
      revenueTimeSeries,
      categoryRevenueData,
    };
  }, [filteredOrders, allProducts]);

  // UI helpers
  const isEmpty = !orders.length && !loading && !error;

  // Export currently visible orders
  const exportVisibleOrdersCSV = () => {
    const rows = filteredOrders.map((o) => ({
      orderId: o._id,
      date: new Date(o.createdAt).toLocaleString(),
      status: o.status,
      totalAmount: o.totalAmount,
      customer: o.userName || o.email || o.userEmail || "",
      products: (o.products || []).map((p) => `${p.name || p.title} x${p.quantity || 1}`).join(" | "),
    }));
    downloadCSV(rows, `orders_${format(new Date(), "yyyyMMdd_HHmm")}.csv`);
  };

  // Theme class
  useEffect(() => {
    if (themeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeDark]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600">Loading analytics…</div>
      </div>
    );

  if (error)
    return (
      <div className="p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          Retry
        </button>
      </div>
    );

  // Render
  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-[#0b1220] text-gray-900 dark:text-gray-100">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time overview · Orders · Revenue · Products
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search box (Search Console style) */}
            <div className="flex items-center bg-white dark:bg-[#0f1724] border rounded-md px-3 py-2 shadow-sm">
              <input
                placeholder="Search orders, users, products, status..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent outline-none placeholder-gray-400 text-sm w-72"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="ml-2 text-sm text-gray-400 hover:text-gray-500"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Date selectors */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#081226] border rounded-md px-3 py-2">
              <input
                type="date"
                value={format(dateRange.from, "yyyy-MM-dd")}
                onChange={(e) =>
                  setDateRange((d) => ({ ...d, from: new Date(e.target.value) }))
                }
                className="text-sm bg-transparent outline-none"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={format(dateRange.to, "yyyy-MM-dd")}
                onChange={(e) =>
                  setDateRange((d) => ({ ...d, to: new Date(e.target.value) }))
                }
                className="text-sm bg-transparent outline-none"
              />
            </div>

            {/* Quick ranges */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuickRange(7)}
                className="px-3 py-2 bg-white dark:bg-[#081226] rounded-md text-sm"
              >
                7d
              </button>
              <button
                onClick={() => setQuickRange(30)}
                className="px-3 py-2 bg-white dark:bg-[#081226] rounded-md text-sm"
              >
                30d
              </button>
              <button
                onClick={() => setQuickRange(90)}
                className="px-3 py-2 bg-white dark:bg-[#081226] rounded-md text-sm"
              >
                90d
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setThemeDark((t) => !t)}
              className="px-3 py-2 bg-white dark:bg-[#081226] rounded-md text-sm"
            >
              {themeDark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#07132a] p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Orders</div>
          <div className="text-2xl font-semibold">{metrics.totalOrders}</div>
          <div className="text-xs text-gray-400 mt-1">In selected range</div>
        </div>

        <div className="bg-white dark:bg-[#07132a] p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
          <div className="text-2xl font-semibold">₹{metrics.totalRevenue.toFixed(2)}</div>
          <div className="text-xs text-gray-400 mt-1">Net sales in range</div>
        </div>

        <div className="bg-white dark:bg-[#07132a] p-4 rounded-xl shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Low stock</div>
          <div className="text-2xl font-semibold">{metrics.lowStock.length}</div>
          <div className="text-xs text-gray-400 mt-1">Products ≤ 5 stock</div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue trend (wide) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#07132a] p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Revenue Trend</h3>
            <div className="text-sm text-gray-400">Total: ₹{metrics.totalRevenue.toFixed(2)}</div>
          </div>

          {metrics.revenueTimeSeries.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={metrics.revenueTimeSeries}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-16 text-gray-400">No revenue data</div>
          )}
        </div>

        {/* Orders by status */}
        <div className="bg-white dark:bg-[#07132a] p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Orders by Status</h3>
          {Object.keys(metrics.ordersByStatus).length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={Object.entries(metrics.ordersByStatus).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                >
                  {Object.keys(metrics.ordersByStatus).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-gray-400">No orders</div>
          )}
        </div>
      </div>

      {/* Products insights + low stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white dark:bg-[#07132a] p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Top Selling Products</h3>
            <div className="text-sm text-gray-400">Top {metrics.topSelling.length}</div>
          </div>
          {metrics.topSelling.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={metrics.topSelling}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-16 text-gray-400">No sales data</div>
          )}
        </div>

        <div className="bg-white dark:bg-[#07132a] p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Low Stock</h3>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="text-sm text-blue-600"
            >
              Refresh
            </button>
          </div>

          {metrics.lowStock.length ? (
            <div className="space-y-2 max-h-[240px] overflow-auto pr-2">
              {metrics.lowStock.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="text-sm">{p.name}</div>
                  <div className="text-sm font-semibold text-amber-600">{p.stock}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">No low stock</div>
          )}
        </div>
      </div>

      {/* Category revenue */}
      <div className="bg-white dark:bg-[#07132a] p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3">Revenue by Category</h3>
        {metrics.categoryRevenueData.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.categoryRevenueData}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
              >
                {metrics.categoryRevenueData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 text-gray-400">No category data</div>
        )}
      </div>

      {/* Recent Orders table + export */}
      <div className="bg-white dark:bg-[#07132a] p-4 rounded-xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Orders</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="px-3 py-2 bg-gray-100 dark:bg-[#061025] rounded text-sm"
            >
              Refresh
            </button>
            <button
              onClick={exportVisibleOrdersCSV}
              className="px-3 py-2 bg-emerald-600 text-white rounded text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full table-auto text-left text-sm">
            <thead>
              <tr className="text-xs text-gray-500">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Order ID</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Products</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 50).map((o) => (
                <tr key={o._id} className="border-t dark:border-[#102233]">
                  <td className="px-3 py-2 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2">{o._id}</td>
                  <td className="px-3 py-2">{o.userName || o.email || o.userEmail || "—"}</td>
                  <td className="px-3 py-2 max-w-[350px]">
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {(o.products || [])
                        .map((p) => `${p.name || p.title} x${p.quantity || 1}`)
                        .join(" · ")}
                    </div>
                  </td>
                  <td className="px-3 py-2">₹{Number(o.totalAmount || 0).toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        (o.status || "").toLowerCase() === "delivered"
                          ? "bg-green-100 text-green-700"
                          : (o.status || "").toLowerCase() === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.status || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
              {!filteredOrders.length && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-gray-400">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredOrders.length} orders (latest first). Use the search to filter like a search console: order id, customer email, product name, status.
        </div>
      </div>
    </div>
  );
}
