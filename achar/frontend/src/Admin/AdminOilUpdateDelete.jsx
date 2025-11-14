import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminOilUpdateDelete = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    cutPrice: "",
    currentPrice: "",
    allDetails: "",
    rating: 0,
    numberOfReviews: 0,
    perPriceLiter: "",
    stock: true,
    stockQuantity: 0,
    productImages: [],
    videoUrl: "",
    moreAboutProduct: [],
    category: "",
  });

  // ---------------- Fetch Products ----------------
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/oils");
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- Search Filter ----------------
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (p) =>
          p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // ---------------- Delete Product ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/oils/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  // ---------------- Select Product to Edit ----------------
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      productName: product.productName || "",
      description: product.description || "",
      cutPrice: product.cutPrice || "",
      currentPrice: product.currentPrice || "",
      allDetails: product.allDetails || "",
      rating: product.rating || 0,
      numberOfReviews: product.numberOfReviews || 0,
      perPriceLiter: product.perPriceLiter
        ? product.perPriceLiter.map((p) => `${p.volume}=${p.price}`).join(",")
        : "",
      stock: product.stock,
      stockQuantity: product.stockQuantity || 0,
      productImages: product.productImages || [],
      videoUrl: product.videoUrl || "",
      moreAboutProduct: product.moreAboutProduct || [],
      category: product.category?._id || "",
    });
  };

  // ---------------- Update Product ----------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const payload = { ...formData };

      if (!payload.category || payload.category.trim() === "") {
        delete payload.category;
      }

      await axios.put(`/api/oils/${selectedProduct._id}`, payload);
      toast.success("Product updated successfully");
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      toast.error("Failed to update product");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Oil Products</h2>

      {/* ---------------- Search Input ---------------- */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* ---------------- Product List ---------------- */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Price/Liter</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr key={prod._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-4">{prod.productName}</td>
                <td className="py-2 px-4">{prod.description}</td>
                <td className="py-2 px-4">
                  {prod.perPriceLiter?.map((p) => `${p.volume}=${p.price}`).join(", ")}
                </td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- Update Form ---------------- */}
      {selectedProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Update Product</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Name:</label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Rating & Reviews */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-600">Rating:</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Number of Reviews:</label>
                <input
                  type="number"
                  min="0"
                  value={formData.numberOfReviews}
                  onChange={(e) => setFormData({ ...formData, numberOfReviews: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-600">Cut Price:</label>
                <input
                  type="text"
                  value={formData.cutPrice}
                  onChange={(e) => setFormData({ ...formData, cutPrice: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Current Price:</label>
                <input
                  type="text"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            {/* Description & Details */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-600">All Details:</label>
              <textarea
                value={formData.allDetails}
                onChange={(e) => setFormData({ ...formData, allDetails: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Per Price Liter */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Per Price Liter:</label>
              <input
                type="text"
                value={formData.perPriceLiter}
                onChange={(e) => setFormData({ ...formData, perPriceLiter: e.target.value })}
                placeholder="1L=499,5L=1000"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-600">Stock:</label>
                <select
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value === "true" })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Stock Quantity:</label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Product Images (comma separated URLs):</label>
              <input
                type="text"
                value={formData.productImages.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productImages: e.target.value.split(",").map((i) => i.trim()),
                  })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block mb-1 font-medium text-gray-600">Video URL:</label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* More About Product */}
            <div>
              <h4 className="font-semibold mb-2">More About Product</h4>
              {formData.moreAboutProduct.map((item, index) => (
                <div key={index} className="border p-3 rounded mb-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={item.image}
                    onChange={(e) => {
                      const updated = [...formData.moreAboutProduct];
                      updated[index].image = e.target.value;
                      setFormData({ ...formData, moreAboutProduct: updated });
                    }}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...formData.moreAboutProduct];
                      updated[index].description = e.target.value;
                      setFormData({ ...formData, moreAboutProduct: updated });
                    }}
                    className="border p-2 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.moreAboutProduct.filter((_, i) => i !== index);
                      setFormData({ ...formData, moreAboutProduct: updated });
                    }}
                    className="bg-red-600 text-white px-2 py-1 rounded mt-2"
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
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                + Add More
              </button>
            </div>

            {/* Save & Cancel */}
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
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

export default AdminOilUpdateDelete;
