import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative w-full bg-white border-t overflow-hidden">

      {/* === BOTTOM BACKGROUND IMAGE === */}
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
              className="w-40 drop-shadow-md"
              alt="logo"
            />

            <h2 className="text-3xl font-bold text-[#1B3D1B] mt-6">
              THE ORGANIC WAY OF LIFE
            </h2>

            <p className="text-base text-[#1B3D1B] mt-3 leading-6">
              Subscribe for special offers, newsletters and become a <br />
              part of our movement.
            </p>

            {/* Email Box */}
            <div className="flex items-center bg-white border border-gray-300 rounded-xl mt-6 max-w-md shadow-md overflow-hidden hover:shadow-lg transition">
              <input
                type="email"
                placeholder="Your e-mail"
                className="px-4 py-2.5 w-full outline-none text-gray-700 text-sm"
              />
              <button className="px-5 py-2 text-[#1B3D1B] hover:bg-gray-100 text-lg font-semibold transition">
                →
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6 mt-8 text-[#1B3D1B] text-xl">
              <FaFacebookF className="cursor-pointer hover:text-gray-700 transition" />

              <a
                href="https://www.instagram.com/gau.samvardhan?igsh=YnplanBpdGNhMTVv&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="cursor-pointer hover:text-gray-700 transition" />
              </a>

              <FaYoutube className="cursor-pointer hover:text-gray-700 transition" />
              <FaLinkedinIn className="cursor-pointer hover:text-gray-700 transition" />

              <a
                href="https://wa.me/message/U4A6QYNSCD5GH1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="cursor-pointer hover:text-green-600 transition" />
              </a>
            </div>
          </div>

          {/* ---------------- MIDDLE - QUICK LINKS ---------------- */}
          <div className="text-[#1B3D1B] animate-slideUp">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-2 text-gray-700">
              <li className="hover:text-black transition cursor-pointer">About Us</li>
              <li className="hover:text-black transition cursor-pointer">Products</li>
              <li className="hover:text-black transition cursor-pointer">Contact</li>
              <li className="hover:text-black transition cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black transition cursor-pointer">Terms & Conditions</li>
            </ul>
          </div>

          {/* ---------------- RIGHT ---------------- */}
          <div className="text-[#1B3D1B] text-base leading-7 animate-slideUp">
            <p className="font-semibold text-xl">
              SIDDHARTH MEP PRIVATE LIMITED (Gausamvardhan)
            </p>

            <p className="mt-4 text-gray-700">
              Registered Office: <br />
              Pune, Maharashtra, India
            </p>

            <p className="mt-4">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:info.siddharthmep@gmail.com"
                className="text-blue-700 underline"
              >
                info.siddharthmep@gmail.com
              </a>
            </p>

            <p>
              <span className="font-semibold">Phone:</span>{" "}
              <a href="tel:+918097675222" className="text-blue-700 underline">
                +91 8097675222
              </a>
            </p>
          </div>
        </div>

        {/* ---------------- COPYRIGHT BAR ---------------- */}
        <div className="mt-20 border-t pt-6 text-center text-sm text-gray-600 animate-fadeUp">
          © {new Date().getFullYear()} SIDDHARTH MEP PRIVATE LIMITED (Gausamvardhan).
          All Rights Reserved.
        </div>
      </div>

      {/* ====== Animations ====== */}
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
