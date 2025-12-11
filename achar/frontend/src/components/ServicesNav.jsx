import React from "react";
import { motion } from "framer-motion";

const featureImages = [
  "https://i.pinimg.com/1200x/9f/2d/ee/9f2deefee6fce1178e7a059be64154fd.jpg",
  "https://res.cloudinary.com/dtvihyts8/image/upload/v1765431911/WhatsApp_Image_2025-12-11_at_11.13.36_12cf4131_pphuwz.jpg",
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
    <div
      className="w-full px-4 md:px-10 py-16 relative"
      style={{
        backgroundImage: `url('https://i.pinimg.com/1200x/0f/61/98/0f6198a36e7d5e35871b44c117900f6a.jpg'), linear-gradient(to bottom right, #FFF8EB, #FFE3C6)`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative rounded-xl overflow-hidden shadow-xl cursor-pointer bg-white/80 backdrop-blur-md border border-white/20 transition-all duration-300"
          >
            <img
              src={item.img}
              className="w-full h-44 md:h-48 object-cover"
              alt={item.title}
            />
            <div className="p-5">
              <h3 className="text-lg md:text-xl font-bold text-[#5A3E1B] mb-2">
                {item.title}
              </h3>
              <p className="text-[#5A3E1B]/90 text-sm md:text-base leading-relaxed">
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
