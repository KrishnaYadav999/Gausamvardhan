import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminAgarbatiCreate() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keyBenefits: "",
    ingredients: "",
    stockQuantity: "",
    category: "",
    images: "",
    videoUrl: "",
    packs: [{ name: "", price: "" }], // Updated: packs array
  });

  // ---------------- Fetch Categories ----------------
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.log("Category fetch error", err);
      }
    };
    fetchCats();
  }, []);

  // ---------------- Handle Change ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- Handle Pack Change ----------------
  const handlePackChange = (index, field, value) => {
    const newPacks = [...formData.packs];
    newPacks[index][field] = value;
    setFormData({ ...formData, packs: newPacks });
  };

  // ---------------- Add/Remove Packs ----------------
  const addPack = () => {
    setFormData({ ...formData, packs: [...formData.packs, { name: "", price: "" }] });
  };
  const removePack = (index) => {
    const newPacks = formData.packs.filter((_, i) => i !== index);
    setFormData({ ...formData, packs: newPacks });
  };

  // ---------------- Submit Form ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        keyBenefits: formData.keyBenefits.split(","),
        ingredients: formData.ingredients.split(","),
        stockQuantity: formData.stockQuantity,
        category: formData.category,
        images: formData.images.split(","), // multiple images
        videoUrl: formData.videoUrl,
        packs: formData.packs.filter(p => p.name && p.price), // Only non-empty packs
      };

      await axios.post("/api/agarbatti/create", payload);

      alert("Agarbatti Created Successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        keyBenefits: "",
        ingredients: "",
        stockQuantity: "",
        category: "",
        images: "",
        videoUrl: "",
        packs: [{ name: "", price: "" }],
      });

    } catch (error) {
      console.error(error);
      alert("Error creating agarbatti");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create New Agarbatti Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* MAIN INPUT FIELDS */}
        {[ 
          { label: "Title", name: "title", placeholder: "Premium Sandalwood Agarbatti" },
          { label: "Key Benefits (comma-separated)", name: "keyBenefits", placeholder: "Stress relief, Pleasant aroma, Long lasting" },
          { label: "Ingredients (comma-separated)", name: "ingredients", placeholder: "Sandalwood, Natural Oils, Charcoal" },
          { label: "Stock Quantity", name: "stockQuantity", type: "number", placeholder: "100" },
          { label: "Image URLs (comma-separated)", name: "images", placeholder: "https://img1.jpg, https://img2.jpg" },
          { label: "Video URL", name: "videoUrl", placeholder: "https://youtube.com/xyz" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium mb-1">{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full p-2 border rounded-lg outline-none"
            />
          </div>
        ))}

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="This sandalwood agarbatti gives calming fragrance..."
            className="w-full p-2 border rounded-lg h-24"
            required
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block font-medium mb-1">Select Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* PACKS */}
        <div>
          <label className="block font-medium mb-2">Packs (Name + Price)</label>
          {formData.packs.map((pack, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Pack Name"
                value={pack.name}
                onChange={(e) => handlePackChange(index, "name", e.target.value)}
                className="flex-1 p-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Price"
                value={pack.price}
                onChange={(e) => handlePackChange(index, "price", e.target.value)}
                className="w-32 p-2 border rounded-lg"
              />
              {formData.packs.length > 1 && (
                <button type="button" onClick={() => removePack(index)} className="bg-red-500 text-white px-2 rounded-lg">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPack} className="bg-green-600 text-white px-4 py-1 rounded-lg">
            Add Pack
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-lg mt-4"
        >
          Create Product
        </button>

      </form>
    </div>
  );
}