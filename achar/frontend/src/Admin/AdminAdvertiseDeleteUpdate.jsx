import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminAdvertiseDeleteUpdate() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editAd, setEditAd] = useState(null);

  // Fetch all ads
  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/videoadvertise");
      setAds(res.data);
    } catch (error) {
      toast.error("Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Delete ad
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/videoadvertise/${id}`);
      toast.success("Deleted Successfully");
      fetchAds();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Save updated ad
  const handleUpdate = async () => {
    try {
      await axios.put(
        `/api/videoadvertise/${editAd._id}`,
        editAd
      );
      toast.success("Updated Successfully");
      setEditAd(null);
      fetchAds();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Advertise Videos</h1>

      {loading && <p>Loading...</p>}

      {/* Edit Modal */}
      {editAd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-3">Update Advertise</h2>

            <input
              type="text"
              value={editAd.title}
              onChange={(e) =>
                setEditAd({ ...editAd, title: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              placeholder="Title"
            />

            <input
              type="number"
              value={editAd.price}
              onChange={(e) =>
                setEditAd({ ...editAd, price: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              placeholder="Price"
            />

            <input
              type="text"
              value={editAd.imageUrl}
              onChange={(e) =>
                setEditAd({ ...editAd, imageUrl: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              placeholder="Image URL"
            />

            <input
              type="text"
              value={editAd.videoAdvertiseUrl}
              onChange={(e) =>
                setEditAd({
                  ...editAd,
                  videoAdvertiseUrl: e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-4"
              placeholder="Video URL"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setEditAd(null)}
                className="px-3 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ads.map((ad) => (
          <div
            key={ad._id}
            className="border rounded-lg shadow p-3 bg-white"
          >
            <img
              src={ad.imageUrl}
              alt="Thumbnail"
              className="w-full h-40 object-cover rounded"
            />

            <h3 className="font-semibold mt-2">{ad.title}</h3>
            <p className="text-sm text-gray-600">₹ {ad.price}</p>

            <video
              src={ad.videoAdvertiseUrl}
              controls
              className="w-full mt-3 rounded"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditAd(ad)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(ad._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
