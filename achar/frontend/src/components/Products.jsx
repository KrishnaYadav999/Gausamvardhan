import React from "react";
import { FaLeaf, FaFire, FaShoppingBasket, FaHandHoldingHeart } from "react-icons/fa";

const MenuCard = () => {
  const categories = [
    {
      title: "Achar (Pickles)",
      icon: <FaShoppingBasket className="text-orange-700 text-4xl" />,
      items: [
        "Lahsun Adrak Mirch Achar",
        "Lal Mirchi Bharwa Achar",
        "Jackfruit Pickle",
        "Nimbu Mirchi Achar",
        "Amla Pickle",
        "Haldi Mirchi Amla Adrak",
        "Sukha Bharwa Mango",
      ],
    },
    {
      title: "Desi Ghee",
      icon: <FaHandHoldingHeart className="text-yellow-600 text-4xl" />,
      items: ["Desi Ghee 500g", "Desi Ghee 1kg"],
    },
    {
      title: "Cow Dung Ganpati",
      icon: <FaLeaf className="text-green-700 text-4xl" />,
      items: ["Handmade Ganpati"],
    },
    {
      title: "Puja Samagri",
      icon: <FaFire className="text-red-600 text-4xl" />,
      items: ["Dhoop Cone", "Dhoop Stick", "Dhoop Cup"],
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 py-12 px-6 md:px-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-800 mb-12">
        Our Menu Card
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="bg-white shadow-lg border border-orange-300 rounded-2xl p-8 hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">{cat.icon}</div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-center text-orange-800 mb-4">
              {cat.title}
            </h2>

            {/* Items */}
            <ul className="text-gray-700 space-y-2">
              {cat.items.map((item, i) => (
                <li
                  key={i}
                  className="bg-orange-100 px-4 py-2 rounded-lg font-medium border border-orange-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCard;
