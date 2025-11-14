import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "http://localhost:5000/api/ghee-products";

const GheeProductUpdateDelete = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    rating: 0,
    cutPrice: "",
    currentPrice: "",
    weightVolume: "",
    description: "",
    specifications: "",
    images: [],
    videos: [],
    videoUrl: "",
    stock: true,
    stockQuantity: 0,
    pricePerGram: "",
    category: "",
    moreAboutProduct: [],
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setProducts(data);
    } catch (error) {
      toast.error("❌ Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("🗑️ Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("❌ Failed to delete product");
    }
  };

  // Start editing
  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      title: product.title || "",
      rating: product.rating || 0,
      cutPrice: product.cutPrice || "",
      currentPrice: product.currentPrice || "",
      weightVolume: product.weightVolume || "",
      description: product.description || "",
      specifications: product.specifications || "",
      images: product.images || [],
      videos: product.videos || [],
      videoUrl: product.videoUrl || "",
      stock: product.stock ?? true,
      stockQuantity: product.stockQuantity || 0,
      pricePerGram: product.pricePerGram || "",
      category: product.category?._id || "",
      moreAboutProduct: product.moreAboutProduct || [],
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${editingProduct}`, formData);
      toast.success("✅ Product updated successfully");
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error("❌ Failed to update product");
    }
  };

  // Filter products based on search term (title or category)
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">🧈 Manage Ghee Products</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search ghee products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Product List */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="border p-4 rounded shadow">
              {editingProduct === product._id ? (
                <form onSubmit={handleUpdate} className="grid gap-2">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="border p-2 rounded"
                  />
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="Rating"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="cutPrice"
                    value={formData.cutPrice}
                    onChange={handleChange}
                    placeholder="Cut Price"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="currentPrice"
                    value={formData.currentPrice}
                    onChange={handleChange}
                    placeholder="Current Price"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="weightVolume"
                    value={formData.weightVolume}
                    onChange={handleChange}
                    placeholder="Weight/Volume"
                    className="border p-2 rounded"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border p-2 rounded"
                  />
                  <textarea
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleChange}
                    placeholder="Specifications"
                    className="border p-2 rounded"
                  />

                  {/* Images */}
                  <input
                    type="text"
                    value={formData.images.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        images: e.target.value.split(",").map((i) => i.trim()),
                      })
                    }
                    placeholder="Image URLs (comma separated)"
                    className="border p-2 rounded"
                  />

                  {/* Videos */}
                  <input
                    type="text"
                    value={formData.videos.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        videos: e.target.value.split(",").map((v) => v.trim()),
                      })
                    }
                    placeholder="Video URLs (comma separated)"
                    className="border p-2 rounded"
                  />

                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="Main Video URL"
                    className="border p-2 rounded"
                  />

                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="Stock Quantity"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="pricePerGram"
                    value={formData.pricePerGram}
                    onChange={handleChange}
                    placeholder="Price per Gram"
                    className="border p-2 rounded"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="stock"
                      checked={formData.stock}
                      onChange={handleChange}
                    />
                    In Stock
                  </label>

                  {/* More About Product */}
                  <h4 className="font-semibold mt-2">More About Product</h4>
                  {formData.moreAboutProduct.map((item, index) => (
                    <div key={index} className="grid gap-2 border p-2 rounded">
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
                        className="bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => {
                          const updated = formData.moreAboutProduct.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, moreAboutProduct: updated });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-2 py-1 rounded mt-2"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        moreAboutProduct: [
                          ...formData.moreAboutProduct,
                          { image: "", description: "" },
                        ],
                      })
                    }
                  >
                    + Add More
                  </button>

                  {/* Save & Cancel */}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <p>⭐ {product.rating}</p>
                  <p>
                    <s>₹{product.cutPrice}</s> <b>₹{product.currentPrice}</b>
                  </p>
                  <p>{product.weightVolume}</p>
                  <p>{product.description}</p>
                  <p>{product.specifications}</p>
                  <p>💰 {product.pricePerGram} per gram</p>
                  <p>Stock Qty: {product.stockQuantity}</p>
                  <p>
                    {product.stock ? (
                      <span className="text-green-600">✅ In Stock</span>
                    ) : (
                      <span className="text-red-600">❌ Out of Stock</span>
                    )}
                  </p>

                  {/* Images */}
                  {product.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}

                  {/* More About Product Display */}
                  {product.moreAboutProduct?.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-semibold">More About Product</h4>
                      {product.moreAboutProduct.map((item, i) => (
                        <div key={i} className="border p-2 rounded mb-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt="More About"
                              className="w-20 h-20 object-cover rounded border mb-1"
                            />
                          )}
                          <p>{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GheeProductUpdateDelete;
