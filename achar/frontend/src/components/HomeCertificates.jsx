import React from "react";

const certificates = [
  {
    img: "https://res.cloudinary.com/dtvihyts8/image/upload/v1764332358/Gemini_Generated_Image_1syyha1syyha1syy-removebg-preview_1_mpih4x.png",
  },
  {
    img: "https://res.cloudinary.com/dtvihyts8/image/upload/v1764333064/Gemini_Generated_Image_dvf9isdvf9isdvf9__1_-removebg-preview_gs0cv8.png",
  },
  {
    img: "https://res.cloudinary.com/dtvihyts8/image/upload/v1764333214/Gemini_Generated_Image_g40rg6g40rg6g40r-removebg-preview_lihv28.png",
  },
];

export default function HomeCertificates() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
          Our Certificates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {certificates.map((certificate, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl transform transition duration-300 "
            >
              <img
                src={certificate.img}
                alt={`Certificate ${index + 1}`}
                className="w-full h-64 object-contain p-4"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
