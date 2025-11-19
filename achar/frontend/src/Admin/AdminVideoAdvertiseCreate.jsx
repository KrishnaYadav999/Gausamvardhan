import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminVideoAdvertiseCreate = () => {
  const [formData, setFormData] = useState({
    videoAdvertiseUrl: "",
    imageUrl: "",
    title: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.videoAdvertiseUrl ||
      !formData.imageUrl ||
      !formData.title ||
      !formData.price
    ) {
      return toast.error("All fields are required!");
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/videoadvertise", formData);

      toast.success("Video advertisement created successfully!");

      setFormData({
        videoAdvertiseUrl: "",
        imageUrl: "",
        title: "",
        price: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Error creating video ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-yellow-300/30 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-yellow-300 mb-6 text-center drop-shadow-md">
        Create Video Advertise
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-yellow-200 font-semibold">Video URL</label>
          <input
            type="text"
            name="videoAdvertiseUrl"
            value={formData.videoAdvertiseUrl}
            onChange={handleChange}
            placeholder="Enter video URL"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-yellow-300/20 focus:border-yellow-400 outline-none"
          />
        </div>

        <div>
          <label className="text-yellow-200 font-semibold">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter thumbnail image URL"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-yellow-300/20 focus:border-yellow-400 outline-none"
          />
        </div>

        <div>
          <label className="text-yellow-200 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-yellow-300/20 focus:border-yellow-400 outline-none"
          />
        </div>

        <div>
          <label className="text-yellow-200 font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-yellow-300/20 focus:border-yellow-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-lg font-bold shadow-lg border border-yellow-400 
            ${
              loading
                ? "bg-yellow-300 text-black cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-yellow-200 text-black hover:shadow-yellow-500/50"
            }
          `}
        >
          {loading ? "Creating..." : "Create Video Ad"}
        </button>
      </form>
    </div>
  );
};

export default AdminVideoAdvertiseCreate;