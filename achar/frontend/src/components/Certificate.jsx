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
    <div className="py-6 px-4">
      <h2 className="text-lg font-semibold mb-4">Certificates</h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {certificates.map((item, index) => (
          <div
            key={index}
            className="rounded-lg overflow-hidden flex justify-center items-center"
          >
            <img
              src={item.img}
              alt={`Certificate ${index + 1}`}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;
