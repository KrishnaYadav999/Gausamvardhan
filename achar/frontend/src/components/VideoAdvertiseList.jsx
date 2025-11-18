import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const VideoAdvertiseList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideoAds = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/videoadvertise");
      setAds(res.data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch video ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoAds();
  }, []);

  return (
    <div className="p-4">

      {loading ? (
        <div className="text-white text-lg">Loading...</div>
      ) : (
        <>
          {/* ✅ MOBILE SLIDER */}
          <div
            className="
              flex 
              gap-4 
              overflow-x-auto 
              snap-x 
              snap-mandatory 
              pb-4
              md:hidden
            "
            style={{ scrollBehavior: "smooth" }}
          >
            {ads.map((ad) => (
              <div
                key={ad._id}
                className="
                  min-w-[75%]
                  bg-[#e3e6e3]
                  rounded-xl
                  overflow-hidden
                  shadow-md
                  border
                  border-gray-300
                  snap-center
                "
              >
                {/* VIDEO */}
                <div className="relative w-full h-[380px]">
                  <video
                    src={ad.videoAdvertiseUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* PRODUCT CARD */}
                <div className="bg-[#163d1a] px-4 py-3 flex gap-3 items-center">
                  <img
                    src={ad.imageUrl}
                    className="w-10 h-10 object-cover rounded-md border border-yellow-300"
                    alt="product"
                  />

                  <div className="flex flex-col">
                    <h3 className="text-white font-semibold text-[15px] leading-tight">
                      {ad.title}
                    </h3>

                    <p className="text-yellow-300 font-bold text-[14px]">
                      Rs.{ad.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ DESKTOP GRID */}
          <div
            className="
              hidden
              md:grid
              grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-6
            "
          >
            {ads.map((ad) => (
              <div
                key={ad._id}
                className="
                  bg-[#e3e6e3] 
                  rounded-xl 
                  overflow-hidden 
                  shadow-md 
                  border 
                  border-gray-300
                "
              >
                <div className="relative w-full h-[380px]">
                  <video
                    src={ad.videoAdvertiseUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                <div className="bg-[#163d1a] px-4 py-3 flex gap-3 items-center">
                  <img
                    src={ad.imageUrl}
                    className="w-10 h-10 object-cover rounded-md border border-yellow-300"
                    alt="product"
                  />

                  <div className="flex flex-col">
                    <h3 className="text-white font-semibold text-[15px] leading-tight">
                      {ad.title}
                    </h3>

                    <p className="text-yellow-300 font-bold text-[14px]">
                      Rs.{ad.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoAdvertiseList;
