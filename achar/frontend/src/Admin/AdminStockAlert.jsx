import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 5;

const AdminStockAlert = () => {
  const [products, setProducts] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllStock = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      const data = res.data?.products || res.data || [];

      const normalized = data.map((p) => {
        const qty = Number(p.stockQuantity ?? 0);

        let status = "IN_STOCK";
        if (qty === 0) status = "OUT_OF_STOCK";
        else if (qty <= threshold) status = "LOW_STOCK";

        return {
          id: p._id,
          name: p.productName,
          image: p.productImages?.[0] || "/no-image.png",
          quantity: qty,
          status,
          category: p.category?.name || "Product",
          updatedAt: p.lastStockUpdatedAt || p.updatedAt,
        };
      });

      normalized.sort((a, b) => a.quantity - b.quantity);
      setProducts(normalized);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStock();
    const timer = setInterval(fetchAllStock, 30000);
    return () => clearInterval(timer);
  }, [threshold]);

  // 🔎 Filtered products
  const filteredProducts =
    filter === "ALL"
      ? products
      : products.filter((p) => p.status === filter);

  // 🔢 Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // 🔄 Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, threshold]);

  // 📥 Excel Download (FULL FILTERED DATA)
  const downloadExcel = () => {
    const excelData = filteredProducts.map((p) => ({
      "Product Name": p.name,
      Category: p.category,
      Quantity: p.quantity,
      Status: p.status.replaceAll("_", " "),
      "Last Updated": p.updatedAt
        ? new Date(p.updatedAt).toLocaleString()
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Report");

    XLSX.writeFile(
      workbook,
      `stock-report-${filter.toLowerCase()}-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    );
  };

  const badge = (status) => {
    if (status === "OUT_OF_STOCK")
      return "bg-red-100 text-red-700 border-red-300";
    if (status === "LOW_STOCK")
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-700 border-green-300";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📦 Inventory Stock Status
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Alert below</span>
            <input
              type="number"
              min="1"
              value={threshold}
              onChange={(e) =>
                setThreshold(Math.max(1, Number(e.target.value)))
              }
              className="w-20 border rounded-lg px-2 py-1 text-sm"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="ALL">All</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          <button
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
          >
            ⬇ Download Excel
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading inventory...</p>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg border object-cover"
                      />
                      <span className="font-medium">{p.name}</span>
                    </td>

                    <td className="text-center font-bold">{p.quantity}</td>

                    <td className="text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full border ${badge(
                          p.status
                        )}`}
                      >
                        {p.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="text-center text-xs text-gray-500">
                      {p.updatedAt
                        ? new Date(p.updatedAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                ◀
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminStockAlert;
