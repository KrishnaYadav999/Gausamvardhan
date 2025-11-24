import React from "react";

const Certificate = () => {
  const certificates = [
    {
      img: "https://i.pinimg.com/736x/3e/55/5d/3e555d13595e2ae7037be6a8473953b7.jpg",
    },
    {
      img: "https://i.pinimg.com/736x/bd/e3/c8/bde3c898035d6f1458c4fb6916b63ba5.jpg",
    },
    {
      img: "https://i.pinimg.com/736x/99/d2/bf/99d2bfb7aa495007652936c6e050ad9d.jpg",
    },
  ];

  return (
    <div className="py-8 px-4 bg-white">
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
              className="w-full h-24 object-contain bg-gray-50"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificate;
