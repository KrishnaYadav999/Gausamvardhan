import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Convert Number → Words (INR)
const numberToWords = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  if ((num = num.toString()).length > 9) return "Overflow";
  let n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);

  if (!n) return "";

  let str = "";
  str += n[1] !== "00" ? (a[+n[1]] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore " : "";
  str += n[2] !== "00" ? (a[+n[2]] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh " : "";
  str += n[3] !== "00" ? (a[+n[3]] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand " : "";
  str += n[4] !== "000" ? (a[+n[4]] || b[n[4][0]] + " " + a[n[4][1]]) + " " : "";
  return str.trim();
};

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        if (res.data.success) setOrder(res.data.order);
        else setError("Failed to fetch invoice.");
      } catch (err) {
        setError(err.response?.data?.message || "Server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading Invoice...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );

  if (!order) return null;

  const shipping = order?.shippingAddress;

  const subtotal = order.totalAmount;
  const grandTotal = subtotal;

  // PDF Download
  const handleDownloadPDF = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${order._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4 flex flex-col items-center">

      <div
        className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-10 border border-gray-200"
        ref={invoiceRef}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <img src="/GauSamvardhan.png" alt="Logo" className="h-14" />
          <h1 className="text-2xl font-bold tracking-wide text-gray-800">
            TAX INVOICE / CASH MEMO
          </h1>
        </div>

        {/* Seller + Buyer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <h2 className="font-bold text-gray-800 text-lg mb-2">
              Seller Details
            </h2>
            <p>BLDG NO. A-18, FLAT NO. 303</p>
            <p>Daffodils Road, BADLAPUR</p>
            <p>SHRUSHTI, Ambarnath</p>
            <p>Thane, Maharashtra - 421503</p>
            <p className="mt-2 font-semibold">GST: 27ABOCS1120M1Z4</p>

            <p className="mt-3 font-semibold text-sm">Dynamic QR Code:</p>
            <img src="/orcode.jpg" className="h-28 w-28 rounded-md mt-2" />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <h2 className="font-bold text-gray-800 text-lg mb-2">
              Billing Address
            </h2>
            <p>{shipping?.name}</p>
            <p>{shipping?.address}</p>
            <p>
              {shipping?.city}, {shipping?.state} - {shipping?.pincode}
            </p>
            <p>Phone: {shipping?.phone}</p>
          </div>
        </div>

        {/* Shipping */}
        <div className="mt-8 bg-gray-50 p-4 rounded-xl border text-sm">
          <h2 className="font-bold text-gray-800 text-lg mb-1">Shipping Address</h2>
          <p>{shipping?.name}</p>
          <p>{shipping?.address}</p>
          <p>
            {shipping?.city}, {shipping?.state} - {shipping?.pincode}
          </p>
          <p>Phone: {shipping?.phone}</p>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 mt-8 text-sm gap-4">
          <p>
            <span className="font-bold">Invoice No:</span>{" "}
            {order.invoiceNumber}
          </p>
          <p>
            <span className="font-bold">Date:</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Product Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border text-left">Product</th>
                <th className="px-4 py-2 border">Qty</th>
                <th className="px-4 py-2 border">Unit Price</th>
                <th className="px-4 py-2 border">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.products.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border text-center">{i + 1}</td>
                  <td className="px-4 py-2 border">
                    {p.product?.productName || p.product?.title}
                  </td>
                  <td className="px-4 py-2 border text-center">{p.quantity}</td>
                  <td className="px-4 py-2 border text-center">₹{p.price}</td>
                  <td className="px-4 py-2 border text-center">
                    ₹{(p.price * p.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-10">
          <div className="w-full md:w-1/2 bg-gray-50 border rounded-xl p-5 shadow-inner">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal:</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-900 text-lg font-semibold">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <p className="text-xs mt-2 text-gray-500">
              Amount in words: {numberToWords(Math.round(grandTotal))} Rupees Only
            </p>

            <p className="text-xs mt-1 italic text-green-700 font-medium">
              ✔ All taxes and shipping charges are included.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-5 border-t flex justify-between items-center text-sm text-gray-600">
          <div>
            <p className="font-medium">For Retailerz Private Limited</p>
            <p className="text-xs mt-1">This is a computer-generated invoice.</p>
          </div>

          <div className="flex flex-col items-center">
            <img src="/mangesh.jpg" className="h-16 rounded-md" />
            <span className="text-xs mt-1">Authorized Signatory</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition"
          >
            Download PDF
          </button>

          <Link
            to="/profile"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
