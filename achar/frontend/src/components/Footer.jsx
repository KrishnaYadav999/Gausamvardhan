import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="relative w-full bg-white border-t overflow-hidden"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* GOOGLE FONT IMPORT */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* === Bottom Background Image === */}
      <div
        className="absolute bottom-0 left-0 w-full h-[230px] bg-bottom bg-cover bg-no-repeat opacity-90 animate-fadeIn"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dkmxeiyvp/image/upload/v1763532491/image_gallery/fvdprloak3ogr3q9h0ap.png')",
        }}
      />

      {/* === CONTENT === */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 animate-fadeUp">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

          {/* ---------------- LEFT ---------------- */}
          <div className="animate-slideUp">
            <img
              src="https://res.cloudinary.com/dtagulyhy/image/upload/v1763540008/gausamvardhan_logo_yqmzpg.png"
              className="w-40"
              alt="logo"
            />

            {/* ==== 3 IMAGES GALLERY ==== */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <img
                src="https://i.pinimg.com/1200x/34/94/6e/34946ea8562dc196a6b3c69f1d11997f.jpg"
                className="w-full h-24 object-cover rounded-xl shadow hover:scale-105 transition"
              />
              <img
                src="https://i.pinimg.com/736x/4f/21/19/4f211947dca2e6adf4e7f25effbcb257.jpg"
                className="w-full h-24 object-cover rounded-xl shadow hover:scale-105 transition"
              />
              <img
                src="https://i.pinimg.com/736x/81/62/99/816299f003410331c4919f9d9ee9d2d3.jpg"
                className="w-full h-24 object-cover rounded-xl shadow hover:scale-105 transition"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#1B3D1B] mt-6">
              The Organic Way of Life
            </h2>

            <p className="text-base text-[#1B3D1B] mt-3 leading-6 font-light">
              Subscribe for special offers, newsletters and become a <br />
              part of our movement.
            </p>

            {/* Email Input */}
            <div className="flex items-center bg-white border border-gray-300 rounded-xl mt-6 max-w-md overflow-hidden transition">
              <input
                type="email"
                placeholder="Your e-mail"
                className="px-4 py-2.5 w-full outline-none text-gray-700 text-sm font-light"
              />
              <button className="px-5 py-2 text-[#1B3D1B] hover:bg-gray-100 text-lg font-medium transition">
                →
              </button>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex gap-6 mt-8 text-[#1B3D1B] text-2xl">
              <a
                href="https://www.instagram.com/gau.samvardhan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="cursor-pointer hover:text-gray-700 transition" />
              </a>

              <a
                href="https://wa.me/message/U4A6QYNSCD5GH1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="cursor-pointer hover:text-green-600 transition" />
              </a>
            </div>
          </div>

          {/* ---------------- MIDDLE LINKS ---------------- */}
          <div className="text-[#1B3D1B] animate-slideUp">
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>

            <ul className="space-y-2 text-gray-700 font-light">
              <li className="hover:text-black transition cursor-pointer">About Us</li>
              <li className="hover:text-black transition cursor-pointer">Products</li>
              <li className="hover:text-black transition cursor-pointer">Contact</li>
              <li className="hover:text-black transition cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black transition cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-black transition cursor-pointer">Developer</li>
            </ul>
          </div>

          {/* ---------------- RIGHT SIDE ---------------- */}
          <div className="text-[#1B3D1B] text-base leading-7 animate-slideUp font-light">
            <p className="font-medium text-lg">
              SIDDHARTH MEP PRIVATE LIMITED (Gausamvardhan)
            </p>

            <p className="mt-3 text-gray-700">
              Registered Office: <br />
              Pune, Maharashtra, India
            </p>

            <p className="mt-3">
              <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:info.siddharthmep@gmail.com"
                className="text-blue-700 underline"
              >
                info.siddharthmep@gmail.com
              </a>
            </p>

            <p className="mt-1">
              <span className="font-medium">Phone:</span>{" "}
              <a href="tel:+918097675222" className="text-blue-700 underline">
                +91 8097675222
              </a>
            </p>
          </div>
        </div>

        {/* ---------------- COPYRIGHT ---------------- */}
        <div className="mt-20 border-t pt-6 text-center text-sm text-gray-600 animate-fadeUp font-light">
          © {new Date().getFullYear()} SIDDHARTH MEP PRIVATE LIMITED (Gausamvardhan).
          All Rights Reserved.
        </div>
      </div>

      {/* ANIMATIONS */}
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
