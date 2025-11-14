// AdminSmallBanner.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminSmallBanner = () => {
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [banners, setBanners] = useState([]);

  // Fetch all banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get("/api/smallbanners");
      setBanners(res.data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
    }
  };

  // On mount, load banners
  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle create banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/smallbanners", { image, link });
      setMessage("✅ Banner created successfully!");
      setImage("");
      setLink("");
      fetchBanners(); // Refresh list after create
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create banner.");
    }
  };

  // Handle delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`/api/smallbanners/${id}`);
      setMessage("🗑️ Banner deleted successfully!");
      fetchBanners(); // Refresh list after delete
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to delete banner.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Manage Small Banners
      </h2>

      {message && (
        <p className="mb-3 text-center text-sm text-green-600">{message}</p>
      )}

      {/* Create Banner Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Button Link</label>
          <input
            type="text"
            placeholder="Enter button link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Banner
        </button>
      </form>

      {/* Banner List */}
      <h3 className="text-lg font-semibold mb-3">All Small Banners</h3>
      <div className="space-y-4">
        {banners.length === 0 ? (
          <p className="text-gray-500">No banners found.</p>
        ) : (
          banners.map((banner) => (
            <div
              key={banner._id}
              className="flex items-center justify-between border p-3 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={banner.image}
                  alt="Banner"
                  className="w-20 h-14 object-cover rounded-md"
                />
                <a
                  href={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  {banner.link}
                </a>
              </div>
              <button
                onClick={() => handleDelete(banner._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSmallBanner;
