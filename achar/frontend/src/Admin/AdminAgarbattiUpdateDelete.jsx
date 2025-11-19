import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAgarbattiUpdateDelete() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerPack: "", // comma separated: pack1,pack2,pack3
    current_price: "",
    stockQuantity: "",
    quantity: "",
  });
  const [error, setError] = useState(null);


  // ---------------- Fetch All Products ----------------
  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching all products from backend...");
      const res = await axios.get("/api/agarbatti/all");
      console.log("Backend response:", res.data);
      if (!Array.isArray(res.data)) {
        setError("Invalid response from backend");
        setProducts([]);
      } else {
        setProducts(res.data);
        setError(null);
      }
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch products. Check backend or API path.");
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- Handle Form Change ----------------
  const handleChange = (e) => {
    console.log("Form change:", e.target.name, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- Start Editing ----------------
  const startEdit = (product) => {
    console.log("Start editing product:", product);
    setEditingProduct(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      pricePerPack: Array.isArray(product.pricePerPack)
        ? product.pricePerPack.join(",")
        : product.pricePerPack,
      current_price: product.current_price,
      stockQuantity: product.stockQuantity,
      quantity: product.quantity,
    });
  };

  // ---------------- Cancel Edit ----------------
  const cancelEdit = () => {
    console.log("Edit cancelled");
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      pricePerPack: "",
      current_price: "",
      stockQuantity: "",
      quantity: "",
    });
    setError(null);
  };

  // ---------------- Submit Update ----------------
  const handleUpdate = async (id) => {
    try {
      const payload = {
        ...formData,
        pricePerPack: formData.pricePerPack.split(",").map((p) => p.trim()), // send as array
      };
      console.log("Sending update payload:", payload);
      const res = await axios.put("/api/agarbatti/${id}", payload);
      console.log("Update response:", res.data);
      alert("Product updated successfully!");
      cancelEdit();
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err.response || err);
      setError("Failed to update product. Check input or backend.");
    }
  };

  // ---------------- Delete Product ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      console.log("Deleting product with id:", id);
      const res = await axios.delete("/api/agarbatti/${id}");
      console.log("Delete response:", res.data);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err.response || err);
      setError("Failed to delete product. Check backend.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Agarbatti Products</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Price Per Pack</th>
            <th className="border p-2">Current Price</th>
            <th className="border p-2">Stock Quantity</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) =>
              editingProduct === product._id ? (
                <tr key={product._id} className="bg-yellow-50">
                  <td className="border p-2">
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      name="pricePerPack"
                      value={formData.pricePerPack}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                      placeholder="pack1,pack2,pack3"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      name="current_price"
                      value={formData.current_price}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full border rounded p-1"
                    />
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleUpdate(product._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={product._id}>
                  <td className="border p-2">{product.title}</td>
                  <td className="border p-2">
                    {Array.isArray(product.pricePerPack)
                      ? product.pricePerPack.join(", ")
                      : product.pricePerPack}
                  </td>
                  <td className="border p-2">{product.current_price}</td>
                  <td className="border p-2">{product.stockQuantity}</td>
                  <td className="border p-2">{product.quantity}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
