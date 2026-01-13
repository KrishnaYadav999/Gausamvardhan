import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* ================= COMPANY CONFIG ================= */
const COMPANY = {
  name: "Gau Samvardhan",
  address:
    "BLDG NO. A-18, FLAT NO-303, DAFFODILS, SHRUSHTI, AMBARNATH, MAHARASHTRA – 421503, India",
  phone: "+91 9326539055",
  email: "customercare@gausamvardhan.com",
  logo: "/GauSamvardhan.png",
  signature: "/mangesh.jpg",
  qr: "/orcode.jpg",
  state: "maharashtra",
};

/* ================= CONSTANTS ================= */
const STATUS = [
  "all",
  "pending",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
  "refunded",
];

/* ✅ PAYMENT FORMATTER (FIXED) */
const paymentLabel = (m) =>
  m?.toLowerCase() === "cod" ? "Cash on Delivery" : "Online Payment";

/* ================= IMAGE LOADER ================= */
const loadImage = async (src) => {
  try {
    const blob = await fetch(src).then((r) => r.blob());
    return await new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};



/* ================= COMPONENT ================= */
const AdminUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [emailLoading, setEmailLoading] = useState(null);
  const [error, setError] = useState("");

  /* ---------- FILTER ORDERS BASED ON STATUS + DATE ---------- */
useEffect(() => {
  let temp = [...orders];

  // Status Filter
  if (statusFilter !== "all") temp = temp.filter((o) => o.status === statusFilter);

  // Date Filter
  const now = new Date();
  if (dateFilter !== "all") {
    let days = 0;
    if (dateFilter === "1d") days = 1;
    if (dateFilter === "7d") days = 7;
    if (dateFilter === "30d") days = 30;
    if (dateFilter === "60d") days = 60;
    if (dateFilter === "90d") days = 90;

    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    temp = temp.filter((o) => new Date(o.createdAt) >= cutoff);
  }

  setFiltered(temp);
}, [orders, statusFilter, dateFilter]);

  /* ---------- FETCH ORDERS ---------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/orders/admin/orders");
        if (res.data?.success) setOrders(res.data.orders);
      } catch {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- FILTER ---------- */
  useEffect(() => {
    setFiltered(
      statusFilter === "all"
        ? orders
        : orders.filter((o) => o.status === statusFilter)
    );
  }, [orders, statusFilter]);

  /* ---------- UPDATE STATUS ---------- */
  const updateStatus = async (id, status) => {
    await axios.post("/api/orders/update-status", { orderId: id, status });
    setOrders((p) => p.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  /* ---------- CANCEL ORDER ---------- */
  const cancelOrder = async (id) => {
    const reason = prompt("Enter cancellation reason");
    if (!reason) return;
    await axios.post("/api/orders/cancel-order", { orderId: id, reason });
    setOrders((p) =>
      p.map((o) =>
        o._id === id ? { ...o, status: "cancelled", isCancelled: true } : o
      )
    );
  };

  /* ---------- EMAIL INVOICE ---------- */
  const emailInvoice = async (id) => {
    try {
      setEmailLoading(id);
      await axios.post("/api/invoice/email", { orderId: id });
      alert("📧 Invoice emailed");
    } catch {
      alert("❌ Email failed");
    } finally {
      setEmailLoading(null);
    }
  };

  /* ================= PDF DOWNLOAD (A4 LANDSCAPE) ================= */
  const downloadInvoice = async (order) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    let y = 15;

    const [logo, sign, qr] = await Promise.all([
      loadImage(COMPANY.logo),
      loadImage(COMPANY.signature),
      loadImage(COMPANY.qr),
    ]);

    const ship = order.shippingAddress || {};
    const bill = order.billingAddress || ship;

    const sameState = bill.state?.toLowerCase() === COMPANY.state.toLowerCase();

    /* ---------- HEADER ---------- */
    if (logo) doc.addImage(logo, "PNG", 15, y, 40, 18);

    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.text(COMPANY.name, 148, y + 8, { align: "center" });

    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text(COMPANY.address, 148, y + 14, {
      align: "center",
      maxWidth: 260,
    });

    y += 30;
    doc.line(10, y, 287, y);
    y += 10;

    /* ---------- ORDER INFO ---------- */
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text(`Order #: ${order.orderNumber}`, 10, y);
    doc.text(`Invoice #: ${order.invoiceNumber}`, 150, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 10, y);
    doc.text(`Payment: ${paymentLabel(order.paymentMethod)}`, 150, y);
    y += 12;

    /* ================= ADDRESSES ================= */
    doc.setFont("helvetica", "bold").setFontSize(11);
    doc.text("BILLING ADDRESS", 10, y);
    doc.text("SHIPPING ADDRESS", 155, y);
    y += 6;

    doc.setFont("helvetica", "normal").setFontSize(10);

    // ✅ Billing address (same as shipping if billing not stored)
    const billingText = `
${bill?.name || ""}
${bill?.address || ""}
${bill?.city || ""}, ${bill?.state || ""} - ${bill?.pincode || ""}
${bill?.country || ""}
Phone: ${bill?.phone || ""}
`.trim();

    // ✅ Shipping address
    const shippingText = `
${ship?.name || ""}
${ship?.address || ""}
${ship?.city || ""}, ${ship?.state || ""} - ${ship?.pincode || ""}
${ship?.country || ""}
Phone: ${ship?.phone || ""}
`.trim();

    // ✅ Auto wrap + full height
    doc.text(billingText, 10, y, {
      maxWidth: 130,
      lineHeightFactor: 1.4,
    });

    doc.text(shippingText, 155, y, {
      maxWidth: 130,
      lineHeightFactor: 1.4,
    });

    // ✅ Move Y safely after longest address
    const billingLines = doc.splitTextToSize(billingText, 130).length;
    const shippingLines = doc.splitTextToSize(shippingText, 130).length;
    y += Math.max(billingLines, shippingLines) * 6 + 6;

    /* ---------- TABLE ---------- */
    autoTable(doc, {
      startY: y,
      theme: "grid",
      head: [
        ["Item", "Qty", "Rate", "Taxable", "CGST", "SGST", "IGST", "Total"],
      ],
      body: order.products.map((p) => {
        const amount = p.price * p.quantity;
        return [
          p.name,
          p.quantity,
          `₹${p.price}`,
          `₹${amount}`,
          sameState ? "2.5%" : "-",
          sameState ? "2.5%" : "-",
          !sameState ? "5%" : "-",
          `₹${amount}`,
        ];
      }),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: "center",
      },
    });

    y = doc.lastAutoTable.finalY + 10;

    /* ---------- TOTAL ---------- */
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total : ₹${order.totalAmount}`, 10, y);

    if (qr) doc.addImage(qr, "JPEG", 150, y - 10, 40, 40);
    if (sign) doc.addImage(sign, "JPEG", 80, y + 15, 40, 15);

    /* ---------- CANCELLED ---------- */
    if (order.isCancelled) {
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(40);
      doc.text("CANCELLED", 148, 150, {
        align: "center",
        angle: 45,
      });
      doc.setTextColor(0, 0, 0);
    }

    doc.save(`invoice_${order.orderNumber}.pdf`);
  };

const exportExcel = () => {
  const data = filtered.map((o) => {
    const billing = o.billingAddress || o.shippingAddress || {};
    const shipping = o.shippingAddress || {};

    return {
      /* ================= BASIC ================= */
      OrderNumber: o.orderNumber,
      InvoiceNumber: o.invoiceNumber,
      OrderStatus: o.status,
      PaymentMethod: paymentLabel(o.paymentMethod),
      PaymentStatus: o.paymentStatus,
      TotalAmount: o.totalAmount,
      IsCancelled: o.isCancelled ? "Yes" : "No",
      CancelReason: o.cancelReason || "",

      /* ================= USER ================= */
      UserName: o.user?.name || "",
      UserEmail: o.userEmail || o.user?.email || "",
      UserPhone: o.user?.phone || "",

      /* ================= BILLING ADDRESS ================= */
      BillingName: billing.name || "",
      BillingAddress: billing.address || "",
      BillingCity: billing.city || "",
      BillingState: billing.state || "",
      BillingPincode: billing.pincode || "",
      BillingCountry: billing.country || "",
      BillingPhone: billing.phone || "",

      /* ================= SHIPPING ADDRESS ================= */
      ShippingName: shipping.name || "",
      ShippingAddress: shipping.address || "",
      ShippingCity: shipping.city || "",
      ShippingState: shipping.state || "",
      ShippingPincode: shipping.pincode || "",
      ShippingCountry: shipping.country || "",
      ShippingPhone: shipping.phone || "",

      /* ================= PRODUCTS (STRINGIFIED) ================= */
      Products: o.products
        .map(
          (p, i) =>
            `${i + 1}) ${p.name} | Qty:${p.quantity} | Price:${p.price} | Weight:${p.weight || ""} | Volume:${p.volume || ""} | Pack:${p.pack || ""}`
        )
        .join(" || "),

      /* ================= LOGISTICS / PAYMENT IDS ================= */
      DelhiveryWaybill: o.delhiveryWaybill || "",
      RazorpayOrderId: o.razorpayOrderId || "",
      RazorpayPaymentId: o.razorpayPaymentId || "",

      /* ================= DATES ================= */
      CreatedAt: new Date(o.createdAt).toLocaleString(),
      UpdatedAt: new Date(o.updatedAt).toLocaleString(),
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Orders");

  XLSX.writeFile(wb, "All_Orders_Full_Data.xlsx");
};


  if (loading) return <p className="p-6">Loading…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin – Orders</h2>

      <div className="flex justify-between mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>

      <div className="flex justify-between mb-4 flex-wrap gap-2">
  {/* Status Dropdown */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border px-3 py-2 rounded"
  >
    {STATUS.map((s) => (
      <option key={s} value={s}>
        {s.toUpperCase()}
      </option>
    ))}
  </select>

  {/* Date Filter Buttons */}
  <div className="flex gap-2 flex-wrap">
    {[
      { label: "All", value: "all" },
      { label: "24 Hours", value: "1d" },
      { label: "7 Days", value: "7d" },
      { label: "30 Days", value: "30d" },
      { label: "60 Days", value: "60d" },
      { label: "90 Days", value: "90d" },
    ].map((f) => (
      <button
        key={f.value}
        onClick={() => setDateFilter(f.value)}
        className={`px-3 py-1 rounded text-sm ${
          dateFilter === f.value
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {f.label}
      </button>
    ))}
  </div>

  {/* Excel Export */}
  <button
    onClick={exportExcel}
    className="bg-yellow-500 text-white px-4 py-2 rounded"
  >
    Export Excel
  </button>
</div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((o) => {
          const billing = o.billingAddress || o.shippingAddress || {};
          const shipping = o.shippingAddress || billing;

          return (
            <div
              key={o._id}
              className="bg-white p-5 rounded-xl shadow flex flex-col gap-3"
            >
              <h3 className="font-semibold text-lg">Order #{o.orderNumber}</h3>

              <p className="text-sm">
                <span className="font-medium">Total:</span> ₹{o.totalAmount}
              </p>

              <p className="text-sm">
                <span className="font-medium">Payment:</span>{" "}
                {paymentLabel(o.paymentMethod)}
              </p>

              {/* ================= ADDRESSES ================= */}
              <div className="border-t pt-3 text-sm space-y-3">
                <div>
                  <p className="font-semibold text-gray-700">Billing Address</p>
                  <p className="text-gray-600 whitespace-pre-line break-words">
                    {billing.name && `${billing.name}\n`}
                    {billing.address && `${billing.address}\n`}
                    {billing.city && billing.city},{" "}
                    {billing.state && billing.state}{" "}
                    {billing.pincode && `- ${billing.pincode}`}\n
                    {billing.country}\n
                    {billing.phone && `Phone: ${billing.phone}`}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-700">
                    Shipping Address
                  </p>
                  <p className="text-gray-600 whitespace-pre-line break-words">
                    {shipping.name && `${shipping.name}\n`}
                    {shipping.address && `${shipping.address}\n`}
                    {shipping.city && shipping.city},{" "}
                    {shipping.state && shipping.state}{" "}
                    {shipping.pincode && `- ${shipping.pincode}`}\n
                    {shipping.country}\n
                    {shipping.phone && `Phone: ${shipping.phone}`}
                  </p>
                </div>
              </div>

              {/* ================= ACTIONS ================= */}
              <div className="mt-3 flex gap-2 flex-wrap">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                >
                  {STATUS.filter((s) => s !== "all").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {!o.isCancelled && (
                  <button
                    onClick={() => cancelOrder(o._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => downloadInvoice(o)}
                  className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                >
                  PDF
                </button>

                <button
                  disabled={emailLoading === o._id}
                  onClick={() => emailInvoice(o._id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                >
                  {emailLoading === o._id ? "Sending…" : "Email"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUserOrders;
