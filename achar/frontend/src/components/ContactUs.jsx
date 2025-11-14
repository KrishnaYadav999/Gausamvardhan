import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // You can integrate API call here
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <FaMapMarkerAlt className="text-green-600 text-2xl mb-2" />
          <p>123 GAUSAM Street, City, State, 123456</p>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <FaPhone className="text-green-600 text-2xl mb-2" />
          <p>+91 9876543210</p>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <FaEnvelope className="text-green-600 text-2xl mb-2" />
          <p>support@gausamvardhan.com</p>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows="5"
          required
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
        ></textarea>
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          Send Message
        </button>
      </form>
    </section>
  );
};

export default ContactUs;
