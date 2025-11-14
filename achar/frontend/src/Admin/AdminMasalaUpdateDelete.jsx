import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "/api/masala-products"; // backend URL

const AdminMasalaUpdateDelete = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // search input
  const [formData, setFormData] = useState({
    title: "",
    rating: 0,
    cut_price: "",
    current_price: "",
    gram: "",
    about_table: [],
    about_more: [],
    technical_details: {},
    stock: true,
    pricepergram: "",
    category: "",
    stockQuantity: 0,
    images: [],
    videoUrl: "",
    moreAboutProduct: [],
  });

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title || "",
      rating: product.rating || 0,
      cut_price: product.cut_price || "",
      current_price: product.current_price || "",
      gram: product.gram || "",
      about_table: product.about_table || [],
      about_more: product.about_more || [],
      technical_details: product.technical_details || {},
      stock: product.stock,
      pricepergram: product.pricepergram || "",
      category: product.category?._id || "",
      stockQuantity: product.stockQuantity || 0,
      images: product.images || [],
      videoUrl: product.videoUrl || "",
      moreAboutProduct: product.moreAboutProduct || [],
    });
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert("⚠️ No product selected for update!");
      return;
    }
    try {
      const response = await axios.put(`${API_URL}/${selectedProduct._id}`, formData);
      if (response.status === 200) {
        toast.success("✅ Product updated successfully!");
        setSelectedProduct(null);
        fetchProducts();
      } else {
        alert("❌ Failed to update product. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("❌ Failed to update product. Check console for details.");
      toast.error("❌ Update failed!");
    }
  };

  // Filter products by title or category
  const filteredProducts = products.filter(
    (prod) =>
      prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prod.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Masala Products</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Cut Price</th>
              <th className="py-3 px-4 text-left">Current Price</th>
              <th className="py-3 px-4 text-left">Gram</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((prod) => (
                <tr key={prod._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-4">{prod.title}</td>
                  <td className="py-2 px-4">{prod.cut_price}</td>
                  <td className="py-2 px-4">{prod.current_price}</td>
                  <td className="py-2 px-4">{prod.gram}</td>
                  <td className="py-2 px-4">{prod.stock ? "Yes" : "No"}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-3 py-1 rounded transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Form */}
      {selectedProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Update Product</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Rating:</label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Cut & Current Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-600">Cut Price:</label>
                <input
                  type="text"
                  value={formData.cut_price}
                  onChange={(e) => setFormData({ ...formData, cut_price: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Current Price:</label>
                <input
                  type="text"
                  value={formData.current_price}
                  onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Gram */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Gram:</label>
              <input
                type="text"
                value={formData.gram}
                onChange={(e) => setFormData({ ...formData, gram: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Stock & Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-600">Stock:</label>
                <select
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value === "true" })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Stock Quantity:</label>
              <input
  type="text" // changed from "number" to "text"
  value={formData.stockQuantity}
  onChange={(e) =>
    setFormData({ ...formData, stockQuantity: e.target.value }) // keep as string
  }
  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
/>
              </div>
            </div>

            {/* Price per gram */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Price per Gram:</label>
              <input
                type="text"
                value={formData.pricepergram}
                onChange={(e) => setFormData({ ...formData, pricepergram: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Images (comma separated URLs):</label>
              <input
                type="text"
                value={formData.images.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    images: e.target.value.split(",").map((i) => i.trim()),
                  })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Video URL:</label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* More About Product */}
            <div>
              <h4 className="font-semibold mb-2">More About Product</h4>
              {formData.moreAboutProduct.map((item, index) => (
                <div key={index} className="grid gap-2 border p-2 rounded mb-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={item.image}
                    onChange={(e) => {
                      const updated = [...formData.moreAboutProduct];
                      updated[index].image = e.target.value;
                      setFormData({ ...formData, moreAboutProduct: updated });
                    }}
                    className="border p-2 rounded"
                  />
                  <textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...formData.moreAboutProduct];
                      updated[index].description = e.target.value;
                      setFormData({ ...formData, moreAboutProduct: updated });
                    }}
                    className="border p-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.moreAboutProduct.filter((_, i) => i !== index);
                      setFormData({ ...formData, moreAboutProduct: updated });
                    }}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    moreAboutProduct: [...formData.moreAboutProduct, { image: "", description: "" }],
                  })
                }
                className="bg-blue-600 text-white px-2 py-1 rounded"
              >
                + Add More
              </button>
            </div>

            {/* Save & Cancel */}
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminMasalaUpdateDelete;
