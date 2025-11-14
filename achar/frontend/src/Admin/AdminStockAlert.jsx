import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminStockAlert = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // ✅ new state for toggle

  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const safeFetch = async (url) => {
        try {
          const res = await axios.get(url);
          return res.data || [];
        } catch (err) {
          console.error("Failed to fetch:", url, err);
          return [];
        }
      };

      const [acharData, gheeData, masalaData, oilData] = await Promise.all([
        safeFetch(`/api/products/low-stock?threshold=${threshold}`),
        safeFetch(`/api/ghee-products/ghee/lowstock?threshold=${threshold}`),
        safeFetch(`/api/masala-products/masala/lowstock?threshold=${threshold}`),
        safeFetch(`/api/oils/low-stock-oil?threshold=${threshold}`),
      ]);

      const normalizeProducts = (data, type, nameField, imageField, stockField = "stockQuantity") =>
        data
          .map((p) => ({
            id: p._id,
            name: p[nameField] || `Unnamed ${type}`,
            image: p[imageField]?.[0] || "/no-image.png",
            stockQuantity: Number(p[stockField] ?? 0),
            type,
          }))
          .filter((p) => p.stockQuantity <= threshold);

      const allProducts = [
        ...normalizeProducts(acharData, "Achar", "productName", "productImages"),
        ...normalizeProducts(gheeData, "Ghee", "title", "images"),
        ...normalizeProducts(masalaData, "Masala", "title", "images"),
        ...normalizeProducts(oilData, "Oil", "productName", "productImages"),
      ].sort((a, b) => a.stockQuantity - b.stockQuantity);

      setLowStockProducts(allProducts);
    } catch (err) {
      console.error(err);
      setLowStockProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
    const interval = setInterval(fetchLowStock, 30000);
    return () => clearInterval(interval);
  }, [threshold]);

  // ✅ limit products if showAll is false
  const displayedProducts = showAll ? lowStockProducts : lowStockProducts.slice(0, 30);

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">⚠️ Low Stock Alerts</h2>

      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm text-gray-600 font-medium">Alert Threshold:</label>
        <input
          type="number"
          min="1"
          value={threshold}
          onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
          className="border border-gray-300 rounded-md px-3 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : lowStockProducts.length === 0 ? (
        <p className="text-green-600 font-semibold text-lg">✅ All products are in stock</p>
      ) : (
        <>
          <div className="space-y-4">
            {displayedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-3 rounded-xl shadow-sm border border-red-300 bg-red-50"
              >
                <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg border" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{p.name}</p>
                  <p className="text-sm text-red-600">Only {p.stockQuantity} left in stock!</p>
                </div>
                <span className="text-sm text-gray-500">{p.type}</span>
              </div>
            ))}
          </div>

          {/* ✅ See More / See Less button */}
          {lowStockProducts.length > 30 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
              >
                {showAll ? "See Less" : `See More (${lowStockProducts.length - 30} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminStockAlert;
