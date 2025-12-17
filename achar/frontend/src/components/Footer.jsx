import React, { useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/newsletter/subscribe", { email });
      toast.success(res.data.message || "Subscribed successfully");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative w-full bg-white border-t overflow-hidden font-inter min-h-[700px] md:min-h-[750px]">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ✅ BACKGROUND IMAGE — FULLY VISIBLE */}
      <div
        className="absolute inset-0 bg-no-repeat opacity-90 pointer-events-none animate-fadeIn"
        style={{
          backgroundImage:
            "url('https://gausamvardhan.sfo3.cdn.digitaloceanspaces.com/footer%20iamge.png')",
          backgroundSize: "contain",
          backgroundPosition: "bottom center",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 animate-fadeUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* LEFT */}
          <div className="animate-slideUp">
            <div className="flex items-start gap-4">
              <img
                src="https://gausamvardhan.sfo3.cdn.digitaloceanspaces.com/gausamvardhan%20logoo.jpg"
                className="w-40"
                alt="logo"
              />

              <div className="relative">
                <img
                  src="https://gausamvardhan.sfo3.cdn.digitaloceanspaces.com/image%20(36).png"
                  className=" w-28 rounded-lg object-cover mt-10"
                  alt="side"
                />
                {/* <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[#5F893F] text-sm font-semibold">
                  Made in India
                </span> */}
              </div>
            </div>

            <h2 className="text-xl font-semibold text-green-800 mt-8 font-montserrat">
              The Organic Way of Life
            </h2>

            <p className="text-green-700 mt-3 leading-6 font-light">
              Subscribe for special offers, newsletters and become a <br />
              part of our movement.
            </p>

            {/* EMAIL */}
            <div className="flex bg-white border border-green-300 rounded-xl mt-6 max-w-md overflow-hidden">
              <input
                type="email"
                placeholder="Your e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 w-full outline-none text-green-800 text-sm"
              />
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="px-5 text-green-700 hover:bg-green-100 text-lg transition disabled:opacity-50"
              >
                {loading ? "..." : "→"}
              </button>
            </div>

            {/* SOCIAL */}
            <div className="flex gap-6 mt-8 text-2xl text-green-700">
              <a
                href="https://www.instagram.com/gau.samvardhan"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/message/U4A6QYNSCD5GH1"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="text-right ml-auto animate-slideUp">
            <h3 className="text-lg font-semibold mb-3 text-green-800 font-montserrat">
              Quick Links
            </h3>
            <ul className="space-y-2 text-green-700 font-light">
              {[
                ["About Us", "/about"],
                ["Products", "/products"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms & Conditions", "/terms-and-conditions"],
                ["Developer", "/developer"],
              ].map(([label, link]) => (
                <li key={label}>
                  <a href={link} className="hover:text-green-500">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* INFO */}
          <div className="text-green-700 leading-7 animate-slideUp font-light">
            <p className="font-medium text-lg text-green-800">
              SIDDHARTH MEP PRIVATE LIMITED (Gausamvardhan)
            </p>
            <p className="mt-3">
              BLDG NO. A-18, FLAT NO-303, DAFFODILS, SHRUSHTI, AMBARNATH,
              MAHARASHTRA – 421503, India
            </p>
            <p className="mt-3">
              <b>Email:</b>{" "}
              <a
                href="mailto:customercare@gausamvardhan.com"
                className="underline text-green-600"
              >
                customercare@gausamvardhan.com
              </a>
            </p>
            <p className="mt-1">
              <b>Phone:</b>{" "}
              <a href="tel:+919326539055" className="underline text-green-600">
                +91 9326539055
              </a>
            </p>
          </div>
        </div>

        <div className="mt-20 border-t pt-6 text-center text-sm text-green-700 font-light">
          © {new Date().getFullYear()} SIDDHARTH MEP PRIVATE LIMITED
          (Gausamvardhan). All Rights Reserved.
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
        .animate-fadeUp { animation: fadeUp 1s ease; }
        .animate-slideUp { animation: slideUp 1.1s ease; }
        .animate-fadeIn { animation: fadeIn 1.8s ease; }
      `}</style>
    </footer>
  );
}
