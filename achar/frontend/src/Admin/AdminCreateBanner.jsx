import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCreateBanner = () => {
  const [buttonText, setButtonText] = useState("Shop Now");
  const [buttonLink, setButtonLink] = useState("/");
  const [images, setImages] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [banners, setBanners] = useState([]);
  const [fetching, setFetching] = useState(false);

  // Fetch all banners
  const fetchBanners = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get("/api/banners");
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index) => setImages(images.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { buttonText, buttonLink, images };
      await axios.post("/api/banners", data);
      setSuccess("✅ Banner created successfully!");
      setButtonText("Shop Now");
      setButtonLink("/");
      setImages([""]);
      fetchBanners(); // Refresh list after creating
    } catch (error) {
      setSuccess("❌ Failed to create banner.");
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`/api/banners/${id}`);
      setSuccess("✅ Banner deleted successfully!");
      fetchBanners(); // Refresh list after deleting
    } catch (error) {
      setSuccess("❌ Failed to delete banner.");
      console.error(error);
    } finally {
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Create Image Banner</h2>

      {/* Create Banner Form */}
      <form className="bg-white p-6 rounded shadow-md mb-8" onSubmit={handleSubmit}>
        {/* Button Text */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Button Text</label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Button Link */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Button Link</label>
          <input
            type="text"
            value={buttonLink}
            onChange={(e) => setButtonLink(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Images (URLs)</label>
          {images.map((img, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="url"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="https://example.com/image.jpg"
                required
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add Image
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {loading ? "Creating..." : "Create Banner"}
        </button>

        {success && (
          <p
            className={`mt-3 font-semibold ${
              success.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {success}
          </p>
        )}
      </form>

      {/* Banner List */}
      <h2 className="text-2xl font-bold mb-4">All Banners</h2>
      {fetching ? (
        <p>Loading banners...</p>
      ) : banners.length === 0 ? (
        <p>No banners found.</p>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white p-4 rounded shadow-md flex justify-between items-center">
              <div>
                <p className="font-semibold">{banner.buttonText}</p>
                <p className="text-sm text-gray-600">{banner.buttonLink}</p>
                <div className="flex space-x-2 mt-1">
                  {banner.images.map((img, i) => (
                    <img key={i} src={img} alt="banner" className="w-16 h-16 object-cover rounded" />
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleDelete(banner._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCreateBanner;
