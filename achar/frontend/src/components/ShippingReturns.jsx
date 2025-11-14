import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const shippingData = [
  {
    title: "Shipping Information",
    details:
      "We offer free shipping on orders above ₹499. Standard shipping takes 3-7 business days. Expedited shipping options are available at checkout.",
  },
  {
    title: "Order Tracking",
    details:
      "Once your order is shipped, you will receive a tracking number via email and SMS. Use this number to track your order status online.",
  },
  {
    title: "Returns & Refunds",
    details:
      "You can return any product within 30 days of delivery. Ensure the items are unused and in original packaging. Refunds will be processed within 5-7 business days after receiving the return.",
  },
  {
    title: "Damaged or Incorrect Items",
    details:
      "If you receive a damaged or incorrect product, contact our support team within 48 hours with a photo of the product. We will arrange a replacement or refund.",
  },
];

const ShippingReturns = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Shipping & Returns</h2>
      <div className="space-y-4">
        {shippingData.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-300"
          >
            <div
              className="flex justify-between items-center"
              onClick={() => toggleSection(index)}
            >
              <h3 className="font-medium text-lg">{item.title}</h3>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openIndex === index && (
              <p className="mt-2 text-gray-600">{item.details}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShippingReturns;
