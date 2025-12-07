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
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-10">
          Our Certificates
        </h2>

        {/* MOBILE SLIDER */}
        <div className="block md:hidden overflow-x-auto pb-2">
          <div className="flex gap-3 w-max mx-auto">
            {certificates.map((c, i) => (
              <div
                key={i}
                className="min-w-[95px] h-[95px] rounded-lg p-1 flex items-center justify-center"
              >
                <img
                  src={c.img}
                  className="w-[75px] h-[75px] object-contain"
                  alt="certificate"
                />
              </div>
            ))}
          </div>
        </div>

        {/* TABLET VIEW */}
        <div className="hidden sm:grid md:hidden grid-cols-3 gap-6 place-items-center">
          {certificates.map((certificate, index) => (
            <div key={index} className="p-2 rounded-lg flex justify-center">
              <img
                src={certificate.img}
                alt={`Certificate ${index + 1}`}
                className="w-[120px] h-[120px] object-contain"
              />
            </div>
          ))}
        </div>

        {/* DESKTOP / LAPTOP VIEW - SMALLER SIZE */}
        <div className="hidden md:grid grid-cols-3 gap-8 place-items-center">
          {certificates.map((certificate, index) => (
            <div key={index} className="rounded-xl flex justify-center">
              <img
                src={certificate.img}
                alt={`Certificate ${index + 1}`}
                className="w-[160px] h-[160px] object-contain p-2"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
