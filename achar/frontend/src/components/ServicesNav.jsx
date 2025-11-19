import React from "react";
import { motion } from "framer-motion";

// Your 3 images (replace with your actual Cloudinary images)
const featureImages = [
  "https://i.pinimg.com/1200x/9f/2d/ee/9f2deefee6fce1178e7a059be64154fd.jpg",
  "https://i.pinimg.com/736x/d0/e8/a8/d0e8a84b4bb0276879c30532ec986020.jpg",
  "https://i.pinimg.com/1200x/56/9e/92/569e92bca3653297b0edd6819c455a71.jpg",
];

const ServicesNav = () => {
  const features = [
    {
      img: featureImages[0],
      title: "Nutritional Benefits",
      desc: "Our cow ghee is rich in essential fatty acids and vitamins, contributing to overall health and well-being.",
    },
    {
      img: featureImages[1],
      title: "Traditional Cooking",
      desc: "Perfect for traditional Indian cooking, adding a rich flavor to your dishes.",
    },
    {
      img: featureImages[2],
      title: "Gausamvardhan Brand",
      desc: "Gausamvardhan stands for enhancing the cow, symbolizing our commitment to quality and purity.",
    },
  ];

  return (
    <div className="w-full px-4 md:px-10 py-10 bg-[#B6743D]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {features.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="bg-[#D99853] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            {/* IMAGE */}
            <img
              src={item.img}
              className="w-full h-40 md:h-44 object-cover"
              alt={item.title}
            />

            {/* TEXT SECTION */}
            <div className="p-4">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>

              <p className="text-white/90 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  );
};

export default ServicesNav;
