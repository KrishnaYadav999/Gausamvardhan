import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* ---------------- COMPANY CONFIG ---------------- */
const COMPANY = {
  name: "Gau Samvardhan",
  address:
    "BLDG NO. A-18, FLAT NO-303, DAFFODILS, SHRUSHTI, AMBARNATH, MAHARASHTRA – 421503, India",
  phone: "+91 9326539055",
  email: "customercare@gausamvardhan.com",
  logo: "/GauSamvardhan.png",
  signature: "/mangesh.jpg",
  qr: "/orcode.jpg",
};

/* ---------------- CONSTANTS ---------------- */
const statusOptions = [
  "all",
  "pending",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
  "refunded",
];

const formatPaymentMethod = (method) => {
  if (!method) return "Unknown";
  return method.toLowerCase() === "cod"
    ? "Cash on Delivery"
    : "Online Payment";
};

/* ---------------- HELPERS ---------------- */
const loadImage = async (src) => {
  const blob = await fetch(src).then((r) => r.blob());
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.readAsDataURL(blob);
  });
};

/* ---------------- COMPONENT ---------------- */
const AdminUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailLoading, setEmailLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let tempOrders = [...orders];

    if (filterStatus !== "all") {
      tempOrders = tempOrders.filter((o) => o.status === filterStatus);
    }

    if (filterDate) {
      tempOrders = tempOrders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        const selectedDate = new Date(filterDate);
        return (
          orderDate.getFullYear() === selectedDate.getFullYear() &&
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getDate() === selectedDate.getDate()
        );
      });
    }

    setFilteredOrders(tempOrders);
  }, [filterStatus, filterDate, orders]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders/admin/orders");
      if (res.data.success) setOrders(res.data.orders);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    await axios.post("/api/orders/update-status", { orderId, status });
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    );
  };

  const handleCancel = async (orderId) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    await axios.post("/api/orders/cancel-order", { orderId, reason });
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, status: "cancelled", isCancelled: true }
          : o
      )
    );
  };

  const emailInvoice = async (orderId) => {
    try {
      setEmailLoading(orderId);
      const res = await axios.post("/api/invoice/email", { orderId });
      if (res.data.success) alert("📧 Invoice emailed successfully");
      else alert(res.data.message || "Email sending failed");
    } catch (err) {
      alert(
        err.response?.data?.message || "Backend error: Email service not configured"
      );
    } finally {
      setEmailLoading(null);
    }
  };

  const downloadInvoice = async (order) => {
    const doc = new jsPDF({ unit: "mm", format: [80, 300] });
    let y = 8;
    const logo = await loadImage(COMPANY.logo);
    const sign = await loadImage(COMPANY.signature);
    const qr = await loadImage(COMPANY.qr);

    doc.addImage(logo, "PNG", 25, y, 30, 15);
    y += 18;
    doc.setFontSize(9).setFont("helvetica", "bold");
    doc.text(COMPANY.name, 40, y, { align: "center" });
    y += 4;
    doc.setFontSize(7).setFont("helvetica", "normal");
    doc.text(COMPANY.address, 40, y, { align: "center", maxWidth: 70 });
    y += 6;
    doc.text(`Phone: ${COMPANY.phone}`, 40, y, { align: "center" });
    y += 4;
    doc.text(COMPANY.email, 40, y, { align: "center" });
    y += 5;
    doc.line(5, y, 75, y);
    y += 4;
    doc.text(`Order: ${order.orderNumber}`, 5, y);
    y += 4;
    doc.text(`Invoice: ${order.invoiceNumber}`, 5, y);
    y += 4;
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 5, y);
    y += 4;
    doc.text(`Payment: ${formatPaymentMethod(order.paymentMethod)}`, 5, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      theme: "plain",
      styles: { fontSize: 7 },
      head: [["Item", "Qty", "Rate", "Amt"]],
      body: order.products.map((p) => [p.name, p.quantity, p.price, p.quantity * p.price]),
    });

    y = doc.lastAutoTable.finalY + 4;
    doc.line(5, y, 75, y);
    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: ₹${order.totalAmount}`, 5, y);
    y += 6;
    doc.addImage(qr, "JPEG", 25, y, 30, 30);
    y += 32;
    doc.addImage(sign, "JPEG", 40, y, 25, 10);
    y += 12;

    if (order.isCancelled) {
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(26);
      doc.text("CANCELLED", 40, 150, { angle: 45, align: "center" });
      doc.setTextColor(0, 0, 0);
    }

    doc.save(`invoice_${order.orderNumber}.pdf`);
    return `invoice_${order.orderNumber}.pdf`; // Return filename for WhatsApp
  };

  const exportAllInvoices = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = 10;

    for (let order of filteredOrders) {
      const logo = await loadImage(COMPANY.logo);
      doc.addImage(logo, "PNG", 80, y, 50, 25);
      y += 30;

      doc.setFontSize(12).setFont("helvetica", "bold");
      doc.text(`Invoice – Order #${order.orderNumber}`, 15, y);
      y += 8;

      doc.setFontSize(10).setFont("helvetica", "normal");
      doc.text(`Customer: ${order.user?.name || "N/A"}`, 15, y);
      y += 5;
      doc.text(`Email: ${order.user?.email || order.shippingAddress?.email}`, 15, y);
      y += 5;
      doc.text(`Phone: ${order.user?.phone || order.shippingAddress?.phone}`, 15, y);
      y += 5;
      doc.text(
        `Address: ${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.zip}`,
        15,
        y
      );
      y += 7;

      autoTable(doc, {
        startY: y,
        theme: "striped",
        head: [["Item", "Qty", "Rate", "Amt"]],
        body: order.products.map((p) => [p.name, p.quantity, p.price, p.quantity * p.price]),
      });

      y = doc.lastAutoTable.finalY + 10;
      doc.addPage();
    }

    doc.save("All_Invoices.pdf");
  };

  const exportExcel = () => {
    const data = filteredOrders.map((order) => ({
      OrderNumber: order.orderNumber,
      InvoiceNumber: order.invoiceNumber,
      CustomerName: order.user?.name || "N/A",
      Email: order.user?.email || order.shippingAddress?.email,
      Phone: order.user?.phone || order.shippingAddress?.phone,
      Status: order.status,
      TotalAmount: order.totalAmount,
      Payment: formatPaymentMethod(order.paymentMethod),
      Address: `${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.zip}`,
      Items: order.products.map((p) => `${p.name} ×${p.quantity}`).join(", "),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "Orders.xlsx");
  };

/* ---------------- WHATSAPP INVOICE ---------------- */
const shareInvoiceWhatsApp = (order) => {
  try {
    // Format items
    const itemsText = order.products
      .map((p) => `* ${p.name} (Qty: ${p.quantity}) - ₹${p.quantity * p.price}`)
      .join("\n");

    // Format seller address
    const sellerDetails = `🏢 Seller Details
${COMPANY.name}
BLDG NO. A-18, FLAT NO. 303
Daffodils Road, BADLAPUR
SHRUSHTI, Ambarnath
Thane, Maharashtra - 421503
GST: 27ABOCS1120M1Z4
✔ All taxes and shipping charges are included.\n`;

    // Compose WhatsApp message
    const message = encodeURIComponent(
      `🧾 Invoice from ${COMPANY.name}\n\n` +
      `Order No: ${order.orderNumber}\n` +
      `Invoice No: ${order.invoiceNumber}\n` +
      `Date: ${new Date(order.createdAt).toLocaleDateString()}\n` +
      `Payment: ${formatPaymentMethod(order.paymentMethod)}\n\n` +
      `🛒 Items\n${itemsText}\n\n` +
      `💰 Total Amount: ₹${order.totalAmount}\n\n` +
      `${sellerDetails}` +
      `Thank you for shopping with us 🛍️\n` +
      `${COMPANY.name}`
    );

    const phone = order.user?.phone || order.shippingAddress?.phone;
    if (!phone) {
      alert("Customer phone number not available for WhatsApp.");
      return;
    }

    // Open WhatsApp chat
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  } catch (err) {
    console.error(err);
    alert("Failed to generate WhatsApp invoice link.");
  }
};


  if (loading) return <p className="p-6 text-lg">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Panel - User Orders</h2>

      <div className="flex flex-wrap gap-3 mb-4 justify-between">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm text-gray-700"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.toUpperCase()}</option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm text-gray-700"
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={exportAllInvoices}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md text-sm transition-colors"
          >
            Export All Invoices
          </button>

          <button
            onClick={exportExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-md text-sm transition-colors"
          >
            Download Excel
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-shadow border-t-4 border-blue-600">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-700">Order #{order.orderNumber}</h3>
              <span className={`px-2 py-1 text-sm font-medium rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                {order.status.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-600 mb-1">Total: <span className="font-semibold">₹{order.totalAmount}</span></p>
            <p className="text-gray-600 mb-1">Payment: <span className="font-semibold">{formatPaymentMethod(order.paymentMethod)}</span></p>

            <div className="mt-2 p-3 bg-gray-50 rounded shadow-inner text-sm text-gray-700">
              <p><strong>Name:</strong> {order.user?.name || "N/A"}</p>
              <p><strong>Email:</strong> {order.user?.email || order.shippingAddress?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {order.user?.phone || order.shippingAddress?.phone || "N/A"}</p>
              <p><strong>Address:</strong> {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.filter((s) => s !== "all").map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {!order.isCancelled && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow-md text-sm transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => downloadInvoice(order)}
                className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded shadow-md text-sm transition-colors"
              >
                Download PDF
              </button>

              <button
                disabled={emailLoading === order._id}
                onClick={() => emailInvoice(order._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-md text-sm transition-colors disabled:opacity-50"
              >
                {emailLoading === order._id ? "Sending…" : "Email Invoice"}
              </button>

              <button
                onClick={() => shareInvoiceWhatsApp(order)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-md text-sm transition-colors"
              >
                WhatsApp Invoice
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-600">Items:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {order.products.map((p) => (
                  <li key={p._id}>{p.name} × {p.quantity} – ₹{p.quantity * p.price}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserOrders;
