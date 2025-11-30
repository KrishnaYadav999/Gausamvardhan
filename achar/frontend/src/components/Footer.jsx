import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="relative w-full bg-white border-t overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Google Font Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Background Shape */}
      <div
        className="absolute bottom-0 left-0 w-full h-[230px] bg-bottom bg-cover bg-no-repeat opacity-90 animate-fadeIn"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dkmxeiyvp/image_upload_placeholder')",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-20 animate-fadeUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Left */}
          <div className="animate-slideUp">

            {/* Logo + Added Image with Made in India */}
            <div className="flex items-center gap-4">
              <img
                src="https://res.cloudinary.com/dtagulyhy/image/upload/v1763540008/gausamvardhan_logo_yqmzpg.png"
                className="w-40"
                alt="logo"
              />

              <div className="flex flex-col items-center mb-[5vh]">
                <img
                  src="https://i.pinimg.com/1200x/fc/1e/aa/fc1eaa7fed0bd14e5b5280ee08aaa280.jpg"
                  className="w-24 rounded-lg object-cover"
                  alt="side-img"
                />
                <span className="text-green-800 text-sm mt-1 font-semibold">
                  Made in India
                </span>
              </div>
            </div>

            <h2
              className="text-xl font-semibold text-green-800 mt-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              The Organic Way of Life
            </h2>

            <p className="text-base text-green-700 mt-3 leading-6 font-light">
              Subscribe for special offers, newsletters and become a <br />
              part of our movement.
            </p>

            {/* Email Box */}
            <div className="flex items-center bg-white border border-green-300 rounded-xl mt-6 max-w-md overflow-hidden">
              <input
                type="email"
                placeholder="Your e-mail"
                className="px-4 py-2.5 w-full outline-none text-green-800 text-sm font-light"
              />
              <button className="px-5 py-2 text-green-700 hover:bg-green-100 text-lg font-medium transition">
                →
              </button>
            </div>

            {/* Social */}
            <div className="flex gap-6 mt-8 text-green-800 text-2xl">
              <a
                href="https://www.instagram.com/gau.samvardhan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="cursor-pointer" />
              </a>

              <a
                href="https://wa.me/message/U4A6QYNSCD5GH1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-green-800 animate-slideUp ml-auto text-right">
            <h3
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Quick Links
            </h3>

            <ul className="space-y-2 text-green-700 font-light">
              <li><a href="/about" className="hover:text-green-500">About Us</a></li>
              <li><a href="/products" className="hover:text-green-500">Products</a></li>
              <li><a href="/contact" className="hover:text-green-500">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-green-500">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-green-500">Terms & Conditions</a></li>
              <li><a href="developer" target="_blank" rel="noreferrer" className="hover:text-green-500">Developer</a></li>
            </ul>
          </div>

          {/* Right Info */}
          <div className="text-green-700 text-base leading-7 animate-slideUp font-light">
            <p className="font-medium text-lg text-green-800">
              SIDDHARTH MEP PRIVATE LIMITED (Gausamvardhan)
            </p>

            <p className="mt-3 text-green-700">
              Registered Office: <br />
              Pune, Maharashtra, India
            </p>

            <p className="mt-3">
              <span className="font-medium text-green-800">Email:</span>{" "}
              <a
                href="mailto:info.siddharthmep@gmail.com"
                className="underline text-green-600"
              >
                info.siddharthmep@gmail.com
              </a>
            </p>

            <p className="mt-1">
              <span className="font-medium text-green-800">Phone:</span>{" "}
              <a href="tel:+918097675222" className="underline text-green-600">
                +91 8097675222
              </a>
            </p>
          </div>
        </div>

        <div className="mt-20 border-t pt-6 text-center text-sm text-green-600 animate-fadeUp font-light">
          © {new Date().getFullYear()} SIDDHARTH MEP PRIVATE LIMITED
          (Gausamvardhan). All Rights Reserved.
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 1s ease-in-out; }
        .animate-slideUp { animation: slideUp 1.1s ease-in-out; }
        .animate-fadeIn { animation: fadeIn 1.8s ease-in-out; }
      `}</style>
    </footer>
  );
}
