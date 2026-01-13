import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* ---------------- Number to Words (INR) ---------------- */
const numberToWords = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  if (num === 0) return "Zero";
  let str = "";

  if (num > 99) {
    str += a[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num > 19) {
    str += b[Math.floor(num / 10)] + " ";
    num %= 10;
  }
  if (num > 0) str += a[num];

  return str.trim();
};

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const invoiceRef = useRef();

  /* ---------------- Fetch Order ---------------- */
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p className="text-center mt-10">Loading order...</p>;

  const shipping = order.shippingAddress || {};

  /* ---------------- Invoice values from DB ---------------- */
  const invoiceNo = order.invoiceNumber || order._id;
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB")
    : "";

  const subtotal = order.totalAmount || 0;
  const grandTotal = subtotal;

  const buyerState = shipping.state?.toLowerCase() || "";
  const isMaharashtra = buyerState.includes("maharashtra");

  /* ---------------- PDF ---------------- */
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Invoice_${invoiceNo}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div
        ref={invoiceRef}
        className="w-full max-w-4xl bg-white p-10 rounded-xl shadow"
      >
        {/* Header */}
        <div className="flex justify-between border-b pb-4 mb-6">
          <img src="/GauSamvardhan.png" className="h-12" alt="Logo" />
          <h1 className="text-xl font-bold">TAX INVOICE</h1>
        </div>

        {/* Seller + Buyer */}
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-bold mb-1">Seller</h3>
            <p>Retailerz Private Limited</p>
            <p>Thane, Maharashtra - 421503</p>
            <p>GSTIN: 27ABOCS1120M1Z4</p>
          </div>

          <div>
            <h3 className="font-bold mb-1">Bill To</h3>
            <p>{shipping.name || "N/A"}</p>
            <p>{shipping.address || "N/A"}</p>
            <p>
              {shipping.city || "N/A"}, {shipping.state || "N/A"} -{" "}
              {shipping.pincode || "N/A"}
            </p>
            <p>{shipping.phone || "N/A"}</p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-2 mt-6 text-sm">
          <p>
            <b>Invoice No:</b> {invoiceNo}
          </p>
          <p>
            <b>Invoice Date:</b> {invoiceDate}
          </p>
          <p className="col-span-2">
            <b>Order ID:</b> {order.orderNumber || order._id}
          </p>
        </div>

        {/* Products */}
        <table className="w-full border mt-6 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.length > 0 ? (
              order.products.map((p, i) => (
                <tr key={i}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">
                    {p.product?.productName || "Product not available"}
                  </td>
                  <td className="border p-2 text-center">{p.quantity || 0}</td>
                  <td className="border p-2 text-center">₹{p.price || 0}</td>
                  <td className="border p-2 text-center">
                    ₹{((p.price || 0) * (p.quantity || 0)).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-6">
          <div className="w-1/2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {isMaharashtra ? (
              <>
                <div className="flex justify-between">
                  <span>CGST 2.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST 2.5%</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between">
                <span>IGST 5%</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <p className="text-xs mt-1">
              Amount in words: {numberToWords(Math.round(grandTotal))} Rupees Only
            </p>

            <p className="text-xs italic text-green-700 mt-1">
              ✔ GST @5% included in price
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t mt-6 pt-4 flex justify-between text-sm">
          <p>This is a computer-generated invoice.</p>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>

        <Link to="/profile" className="block text-center mt-4 text-blue-600">
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default Invoice;
