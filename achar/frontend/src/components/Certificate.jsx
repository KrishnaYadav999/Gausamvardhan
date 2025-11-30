import React from "react";

const Certificate = () => {
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

  return (
    <div className="py-8 px-4">
      <h2 className="text-lg font-semibold mb-4">Certificates</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {certificates.map((item, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden"
          >
            <img
              src={item.img}
              alt={`Certificate ${index + 1}`}
              className="w-full h-24 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;
