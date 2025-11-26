/* ---------------------------------------------------
    IMPORTS
----------------------------------------------------*/
import React from "react";
import { FaPhoneAlt, FaEnvelope, FaLeaf, FaShoppingBasket } from "react-icons/fa";

/* ---------------------------------------------------
    ABOUT US COMPONENT
----------------------------------------------------*/
const AboutUS = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-16 px-6 md:px-20">
      {/* PAGE TITLE */}
      <h1 className="text-4xl md:text-5xl font-bold text-green-800 text-center mb-8">
        About <span className="text-green-600">Gausamvardhan</span>
      </h1>

      {/* INTRO SECTION */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 md:p-12 border border-green-200">
        <p className="text-lg text-gray-700 leading-relaxed">
          Welcome to <b>Gausamvardhan.com</b> — a trusted online store dedicated
          to bringing you traditional, natural, and pure products made from our
          Indian culture. We believe in promoting the essence of **Gau
          Samvardhan**, supporting cow-based products that enhance health,
          spirituality, and daily living.
        </p>

        <p className="text-lg text-gray-700 mt-5 leading-relaxed">
          Hamare products 100% natural, chemical-free aur purity-tested hote
          hain. Hum desi parampara ko modern e-commerce ke saath jod kar aap tak
          best quality products pahunchane ka prayas karte hain.
        </p>
      </div>

      {/* PRODUCT CATEGORIES */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-6">
          Our Product Categories
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* CARD 1 */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-green-200 hover:shadow-xl transition">
            <FaShoppingBasket className="text-green-700 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Achar (Pickles)
            </h3>
            <p className="text-gray-700">
              Ghar-jaise swad wala, traditionally prepared, aur chemical-free.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-green-200 hover:shadow-xl transition">
            <FaLeaf className="text-green-700 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Desi Ghee
            </h3>
            <p className="text-gray-700">
              Bilkul shuddh aur natural cow ghee — made with traditional
              methods.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-green-200 hover:shadow-xl transition">
            <FaLeaf className="text-green-700 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Cow Dung Products
            </h3>
            <p className="text-gray-700">
              Gobar se bane Ganpati idols, dhoop, aur pooja materials.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-green-200 hover:shadow-xl transition">
            <FaLeaf className="text-green-700 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Dhoop (Incense)
            </h3>
            <p className="text-gray-700">
              Natural fragrance, long-lasting, aur pure herbal ingredients se
              bana.
            </p>
          </div>

          {/* CARD 5 */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-green-200 hover:shadow-xl transition">
            <FaLeaf className="text-green-700 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Dhoop Cup
            </h3>
            <p className="text-gray-700">
              Dhup jalane ke liye ready-made cup — pooja aur meditation ke liye
              perfect.
            </p>
          </div>

          {/* CARD 6 */}
          <div className="bg-white p-6 shadow-md rounded-xl border border-green-200 hover:shadow-xl transition">
            <FaLeaf className="text-green-700 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Handcrafted Ganpati
            </h3>
            <p className="text-gray-700">
              Gobar se banaya gaya eco-friendly Ganpati murti — spiritual &
              natural.
            </p>
          </div>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="max-w-4xl mx-auto mt-16 bg-white shadow-lg rounded-2xl p-8 border border-green-200">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-6">
          Contact Us
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-green-700 text-2xl" />
            <p className="text-gray-700 text-lg">
              Email:{" "}
              <a
                href="mailto:info.siddharthmep@gmail.com"
                className="text-green-800 font-semibold"
              >
                info.siddharthmep@gmail.com
              </a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-green-700 text-2xl" />
            <p className="text-gray-700 text-lg font-semibold">
              +91 8097675222
            </p>
          </div>
        </div>

        <p className="text-center text-gray-700 mt-6">
          Thank you for supporting **Gausamvardhan** and helping us promote pure
          and natural Indian products.
        </p>
      </div>
    </div>
  );
};

export default AboutUS;
