import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Utility function to convert number to words (simplified for INR)
const numberToWords = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  if ((num = num.toString()).length > 9) return "Overflow";
  let n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
  if (!n) return;
  let str = "";
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore " : "";
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh " : "";
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand " : "";
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " " : "";
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
      <div className="min-h-screen flex items-center justify-center">
        Loading Invoice...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  if (!order) return null;

  const shipping = order.shippingAddress;

  // Only subtotal & grand total (no GST)
  const subtotal = order.totalAmount;
  const grandTotal = subtotal;

  const handleDownloadPDF = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${order._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl" ref={invoiceRef}>
        <div className="bg-white shadow-lg rounded-2xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4">
            <img src="/GauSamvardhan.png" alt="Shop Logo" className="h-12" />
            <h1 className="text-xl font-bold text-gray-800">
              Tax Invoice / Cash Memo
            </h1>
          </div>

          {/* Seller & Buyer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
            <div>
              <h2 className="font-bold">Sold By:</h2>
              <p>Building No./Flat No.: BLDG NO. A-18, FLAT NO. 303</p>
              <p>Name Of Premises/Building: Daffodils Road/Street: BADLAPUR</p>
              <p>
                Locality/Sub Locality: SHRUSHTI City/Town/Village: Ambarnath
              </p>
              <p>District: Thane State: Maharashtra PIN Code: 421503</p>
              <br />
              <p>
                <span className="font-bold">GST no:</span> 27ABOCS1120M1Z4
              </p>
              <h3>Dynamic QR Code:</h3>
              <div className="mt-2">
                <img
                  src="/orcode.jpg"
                  alt="QR Code"
                  className="h-24 w-24"
                />
              </div>
            </div>
            <div>
              <h2 className="font-bold">Billing Address:</h2>
              <p>{shipping?.name || order.user?.name}</p>
              <p>{shipping?.address}</p>
              <p>
                {shipping?.city}, {shipping?.state} {shipping?.pincode}
              </p>
              <p>Phone: {shipping?.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mt-6 text-sm">
            <h2 className="font-bold">Shipping Address:</h2>
            <p>{shipping?.name || order.user?.name}</p>
            <p>{shipping?.address}</p>
            <p>
              {shipping?.city}, {shipping?.state} {shipping?.pincode}
            </p>
            <p>Phone: {shipping?.phone}</p>
          </div>

          {/* Order Info */}
          <div className="mt-6 text-sm grid grid-cols-2 gap-4">
            <p>
              <span className="font-bold">Invoice No:</span>{" "}
              {`AMBGS - ${String(order.serialNumber).padStart(4, "0")}`}
            </p>
            <p>
              <span className="font-bold">Invoice Date:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Product Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">#</th>
                  <th className="border px-3 py-2 text-left">Description</th>
                  <th className="border px-3 py-2">Qty</th>
                  <th className="border px-3 py-2">Unit Price</th>
                  <th className="border px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p, idx) => (
                  <tr key={idx}>
                    <td className="border px-3 py-2 text-center">{idx + 1}</td>
                    <td className="border px-3 py-2">
                      {p.product?.productName || p.product?.title || "Product"}
                    </td>
                    <td className="border px-3 py-2 text-center">{p.quantity}</td>
                    <td className="border px-3 py-2 text-center">₹{p.price}</td>
                    <td className="border px-3 py-2 text-center">
                      ₹{(p.price * p.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total (no GST) */}
          <div className="flex justify-end mt-6">
            <div className="w-full md:w-1/2 border rounded p-4 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 font-semibold">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Amount in words: {numberToWords(Math.round(grandTotal))} Rupees Only
              </p>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="mt-8 text-sm text-gray-500 border-t pt-4 flex justify-between items-center">
            <div>
              <p>For Retailerz Private Limited</p>
              <p className="mt-2">This is a computer-generated invoice.</p>
            </div>
            <div className="flex flex-col items-center">
              <img src="/mangesh.jpg" alt="Signature" className="h-16 mt-2" />
              <span className="text-xs mt-1">Authorized Signatory</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download PDF
          </button>
          <Link
            to="/profile"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Invoice;