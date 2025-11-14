import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiX } from "react-icons/si";
import { Link } from "react-router-dom";

const Footer = () => {
  const Products = [
    "KesarCoco Kheer",
    "Kalpana’s Pickle Trio",
    "Traditional Pickle Sampler",
    "Stuffed Red Chilli Pickle",
    "Lemon Ginger Chilli Pickle",
    "Bihari Pickle Pack",
  ];

  const SupportLinks = [
    { name: "FAQs", path: "/faq" },
    { name: "Shipping & Returns", path: "/shipping-returns" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  return (
    <footer className="bg-gray-50 text-gray-700 pt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8">
        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Products</h4>
            <span className="text-green-600 text-sm cursor-pointer hidden md:inline-block">
              see all
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2">
            {Products.map((category) => (
              <p
                key={category}
                className="text-sm py-1 hover:text-green-600 cursor-pointer break-words"
              >
                {category}
              </p>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            {SupportLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-sm hover:text-green-600 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-6 space-y-4 md:space-y-0">
        {/* Copyright */}
        <p className="text-sm text-gray-500 text-center md:text-left">
          © GAUSAM VARDHAN Private Limited, 2025
        </p>

        {/* Download App */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="font-semibold">Download App</span>
          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            alt="App Store"
            className="h-8 cursor-pointer"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Google Play"
            className="h-8 cursor-pointer"
          />
        </div>

        {/* Social Icons */}
        <div className="flex space-x-3">
          {[FaFacebookF, SiX, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
            <div
              key={idx}
              className="p-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800"
            >
              <Icon />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
