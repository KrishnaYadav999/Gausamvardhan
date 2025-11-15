import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCategoryCreate = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("❌ Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // ✅ Update
        const { data } = await axios.put(
          `/api/categories/${editingId}`,
          { name, image, description }
        );
        setMessage(`✅ Category "${data.category.name}" updated successfully!`);
      } else {
        // ✅ Create
        const { data } = await axios.post(
          "/api/categories",
          { name, image, description }
        );
        setMessage(`✅ Category "${data.name}" created successfully!`);
      }

      // Reset form
      setName("");
      setImage("");
      setDescription("");
      setEditingId(null);

      fetchCategories(); // refresh list
    } catch (error) {
      setMessage(
        error.response?.data?.message || "❌ Failed to submit category"
      );
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      alert("🗑️ Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete category");
    }
  };

  // Edit category (populate form)
  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setImage(category.image);
    setDescription(category.description);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-5">
        {editingId ? "Update Category" : "Create Category"}
      </h2>

      {message && (
        <p
          className={`text-center text-sm font-medium mb-3 ${
            message.includes("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none min-h-[100px]"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          {editingId ? "Update Category" : "Create Category"}
        </button>
      </form>

      {/* Category List */}
      <h3 className="text-xl font-semibold mb-3">All Categories</h3>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex justify-between items-center border p-3 rounded-lg"
            >
              <div>
                <h4 className="font-semibold">{cat.name}</h4>
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-24 h-16 object-cover my-1 rounded"
                  />
                )}
                <p className="text-sm text-gray-600">{cat.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminCategoryCreate;
