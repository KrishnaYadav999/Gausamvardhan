import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const statusOptions = ["pending", "shipped", "out-for-delivery", "delivered", "cancelled", "refunded", ];

const statusColors = {
  pending: "text-yellow-600",
  shipped: "text-orange-500",
  "out-for-delivery": "text-purple-600",
  delivered: "text-green-600",
  cancelled: "text-red-600",
    refunded: "text-blue-600",
};

const filterOptions = [
  { label: "All Data", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 60 Days", value: "60d" },
];

const AdminUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [orderCounts, setOrderCounts] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/orders/admin/orders?filter=${selectedFilter}`
      );
      if (res.data.success) {
        setOrders(res.data.orders);
        setOrderCounts(res.data.orderCounts || {});
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Server error while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedFilter]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await axios.post("/api/orders/update-status", { orderId, status });
      if (res.data.success) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleCancel = async (orderId) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    try {
      const res = await axios.post("/api/orders/cancel-order", { orderId, reason });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "cancelled", isCancelled: true, cancelReason: reason } : o
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  // PDF download
  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Orders Report", pageWidth / 2, 40, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Filter: ${selectedFilter}`, pageWidth - 100, 30, { align: "right" });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 100, 40, { align: "right" });

    const tableColumn = [
      "Order #", "Invoice", "User", "Email", "Status", "Products", "Total", "Ordered On", "Shipping Address"
    ];

    const tableRows = orders.map(order => {
      const products = order.products.map(p => `${p.name} x${p.quantity} ₹${p.price}`).join(", ");
      const shipping = `${order.shippingAddress?.name}, ${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}, ${order.shippingAddress?.country}`;
      return [
        order.orderNumber,
        order.invoiceNumber,
        order.user?.name,
        order.user?.email,
        order.isCancelled ? `Cancelled (${order.cancelReason})` : order.status,
        products,
        `₹${order.totalAmount}`,
        new Date(order.createdAt).toLocaleString(),
        shipping
      ];
    });

    autoTable(doc, {
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold", fontSize: 7 },
      styles: { fontSize: 6, cellPadding: 3, overflow: "linebreak", valign: "middle" },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50 }, 2: { cellWidth: 60 }, 3: { cellWidth: 80 }, 4: { cellWidth: 50 }, 5: { cellWidth: 100 }, 6: { cellWidth: 40 }, 7: { cellWidth: 70 }, 8: { cellWidth: 180 } },
      margin: { left: 20, right: 20 },
      pageBreak: "auto",
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
      },
    });

    doc.save(`orders_report_${selectedFilter}_${new Date().toISOString()}.pdf`);
  };

  // Excel download
  const downloadExcel = () => {
    const worksheetData = orders.map(order => ({
      "Order #": order.orderNumber,
      Invoice: order.invoiceNumber,
      User: order.user?.name,
      Email: order.user?.email,
      Status: order.isCancelled ? `Cancelled (${order.cancelReason})` : order.status,
      Products: order.products.map(p => `${p.name} x${p.quantity} ₹${p.price}`).join(", "),
      Total: order.totalAmount,
      "Ordered On": new Date(order.createdAt).toLocaleString(),
      "Shipping Address": `${order.shippingAddress?.name}, ${order.shippingAddress?.address}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}, ${order.shippingAddress?.country}`
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `orders_report_${selectedFilter}_${new Date().toISOString()}.xlsx`);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Admin - User Orders</h2>
          <div className="mt-2 flex gap-4 items-center">
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)} className="border px-3 py-2 rounded">
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({orderCounts[opt.value] ?? 0})
                </option>
              ))}
            </select>

            <button onClick={downloadPDF} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Download PDF
            </button>

            <button onClick={downloadExcel} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Download Excel
            </button>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <p>No orders found for this filter.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4 shadow-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-bold text-lg">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">Invoice: {order.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">User: {order.user?.name} ({order.user?.email})</p>
                  <p className="text-sm text-gray-500">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center">
                  <select value={order.status} onChange={(e) => handleUpdateStatus(order._id, e.target.value)} className="border px-3 py-1 rounded" disabled={order.status === "delivered"} >
                    {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                  {!order.isCancelled && (
                    <button onClick={() => handleCancel(order._id)} className="ml-3 px-4 py-1 bg-red-500 text-white rounded">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded mb-3">
                <p className="font-semibold">Shipping Address</p>
                <p>{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                <p>{order.shippingAddress?.country}</p>
                {order.shippingAddress?.phone && <p>📞 {order.shippingAddress.phone}</p>}
              </div>

              <div className="space-y-3">
                {order.products.map((item, idx) => (
                  <div key={idx} className="flex items-center border-b pb-2 last:border-none">
                    <img src={item.image || "/no-image.png"} alt={item.name} className="w-16 h-16 rounded mr-4 object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                      <p className="font-bold">₹{item.quantity * item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold text-lg">Total: ₹{order.totalAmount}</span>
                <span className={`font-semibold ${order.isCancelled ? statusColors["cancelled"] : statusColors[order.status] || "text-gray-800"}`}>
                  {order.isCancelled ? `Cancelled (${order.cancelReason})` : order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserOrders;
