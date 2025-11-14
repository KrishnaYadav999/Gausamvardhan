import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqsData = [
  {
    question: "What is the return policy?",
    answer:
      "You can return any product within 30 days of purchase. Make sure the packaging is intact.",
  },
  {
    question: "Do you offer free shipping?",
    answer:
      "Yes! We offer free shipping on all orders above ₹499 within India.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After placing the order, you will receive a tracking number via email and SMS.",
  },
  {
    question: "Are your products organic?",
    answer:
      "We use the finest natural ingredients. While not certified organic, all products are chemical-free.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqsData.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow duration-300"
          >
            <div
              className="flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="font-medium text-lg">{faq.question}</h3>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openIndex === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
