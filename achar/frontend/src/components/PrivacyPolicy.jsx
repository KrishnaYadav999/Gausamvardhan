import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const privacyData = [
  {
    title: "Information We Collect",
    details:
      "We collect personal information you provide when placing an order, creating an account, or subscribing to our newsletter. This may include your name, email, phone number, and shipping address.",
  },
  {
    title: "How We Use Your Information",
    details:
      "Your information is used to process orders, provide customer support, improve our services, and send promotional emails (if you opt-in).",
  },
  {
    title: "Data Security",
    details:
      "We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, or misuse.",
  },
  {
    title: "Sharing Information",
    details:
      "We do not sell or rent your personal information. We may share information with trusted third parties for order fulfillment or legal requirements.",
  },
  {
    title: "Cookies & Tracking",
    details:
      "We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.",
  },
  {
    title: "Your Rights",
    details:
      "You can request access, correction, or deletion of your personal data. Contact our support team for any privacy-related inquiries.",
  },
];

const PrivacyPolicy = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Privacy Policy</h2>
      <div className="space-y-4">
        {privacyData.map((item, index) => (
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

export default PrivacyPolicy;
