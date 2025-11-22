import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAgarbattiUpdateDelete() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keyBenefits: "",
    ingredients: "",
    quantity: "",
    stockQuantity: "",
    category: "",
    images: "",
    videoUrl: "",
    packs: [{ name: "", price: "" }],
    reviews: [{ name: "", rating: "", comment: "", images: "" }],
    moreAboutProduct: { name: "", description: "", images: "" },
  });
  const [error, setError] = useState(null);

  // ---------------- Fetch All Products ----------------
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/agarbatti/all");
      setProducts(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- Handle Form Change ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- Array field handlers ----------------
  const handlePackChange = (index, field, value) => {
    const newPacks = [...formData.packs];
    newPacks[index][field] = value;
    setFormData({ ...formData, packs: newPacks });
  };
  const addPack = () => setFormData({ ...formData, packs: [...formData.packs, { name: "", price: "" }] });
  const removePack = (index) => setFormData({ ...formData, packs: formData.packs.filter((_, i) => i !== index) });

  const handleReviewChange = (index, field, value) => {
    const newReviews = [...formData.reviews];
    newReviews[index][field] = value;
    setFormData({ ...formData, reviews: newReviews });
  };
  const addReview = () => setFormData({ ...formData, reviews: [...formData.reviews, { name: "", rating: "", comment: "", images: "" }] });
  const removeReview = (index) => setFormData({ ...formData, reviews: formData.reviews.filter((_, i) => i !== index) });

  const handleMoreAboutChange = (field, value) => {
    setFormData({ ...formData, moreAboutProduct: { ...formData.moreAboutProduct, [field]: value } });
  };

  // ---------------- Start Editing ----------------
  const startEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      keyBenefits: product.keyBenefits.join(","),
      ingredients: product.ingredients.join(","),
      quantity: product.quantity,
      stockQuantity: product.stockQuantity,
      category: product.category?._id || "",
      images: product.images.join(","),
      videoUrl: product.videoUrl,
      packs: product.packs.length ? product.packs : [{ name: "", price: "" }],
      reviews: product.reviews.length ? product.reviews : [{ name: "", rating: "", comment: "", images: "" }],
      moreAboutProduct: product.moreAboutProduct || { name: "", description: "", images: "" },
    });
  };

  // ---------------- Cancel Edit ----------------
  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      keyBenefits: "",
      ingredients: "",
      quantity: "",
      stockQuantity: "",
      category: "",
      images: "",
      videoUrl: "",
      packs: [{ name: "", price: "" }],
      reviews: [{ name: "", rating: "", comment: "", images: "" }],
      moreAboutProduct: { name: "", description: "", images: "" },
    });
    setError(null);
  };

  // ---------------- Submit Update ----------------
  const handleUpdate = async (id) => {
    try {
      const payload = {
        ...formData,
        keyBenefits: formData.keyBenefits.split(",").map((b) => b.trim()),
        ingredients: formData.ingredients.split(",").map((i) => i.trim()),
        images: formData.images.split(",").map((img) => img.trim()),
        packs: formData.packs.filter((p) => p.name && p.price),
        reviews: formData.reviews
          .filter((r) => r.name && r.rating && r.comment)
          .map((r) => ({ ...r, images: r.images ? r.images.split(",").map((i) => i.trim()) : [] })),
        moreAboutProduct: {
          ...formData.moreAboutProduct,
          images: formData.moreAboutProduct.images ? formData.moreAboutProduct.images.split(",").map((i) => i.trim()) : [],
        },
      };
      await axios.put(`/api/agarbatti/${id}`, payload);
      alert("Product updated successfully!");
      cancelEdit();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to update product");
    }
  };

  // ---------------- Delete Product ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/agarbatti/${id}`);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Agarbatti Products</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Key Benefits</th>
            <th className="border p-2">Ingredients</th>
            <th className="border p-2">Packs</th>
            <th className="border p-2">Stock Qty</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4">No products found.</td>
            </tr>
          ) : (
            products.map((product) =>
              editingProduct === product._id ? (
                <tr key={product._id} className="bg-yellow-50">
                  <td className="border p-2">
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-1" placeholder="Title" />
                  </td>
                  <td className="border p-2">
                    <input name="keyBenefits" value={formData.keyBenefits} onChange={handleChange} className="w-full border rounded p-1" placeholder="benefit1,benefit2" />
                  </td>
                  <td className="border p-2">
                    <input name="ingredients" value={formData.ingredients} onChange={handleChange} className="w-full border rounded p-1" placeholder="ingredient1,ingredient2" />
                  </td>
                  <td className="border p-2">
                    {formData.packs.map((pack, i) => (
                      <div key={i} className="flex gap-1 mb-1">
                        <input placeholder="Pack Name" value={pack.name} onChange={(e) => handlePackChange(i, "name", e.target.value)} className="flex-1 border rounded p-1" />
                        <input placeholder="Price" value={pack.price} onChange={(e) => handlePackChange(i, "price", e.target.value)} className="w-24 border rounded p-1" />
                        {formData.packs.length > 1 && <button type="button" onClick={() => removePack(i)} className="bg-red-500 text-white px-1 rounded">X</button>}
                      </div>
                    ))}
                    <button type="button" onClick={addPack} className="bg-green-500 text-white px-2 rounded mt-1">Add Pack</button>
                  </td>
                  <td className="border p-2">
                    <input name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full border rounded p-1" placeholder="Stock Quantity" />
                  </td>
                  <td className="border p-2 space-x-2">
                    <button onClick={() => handleUpdate(product._id)} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                    <button onClick={cancelEdit} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={product._id}>
                  <td className="border p-2">{product.title}</td>
                  <td className="border p-2">{product.keyBenefits.join(", ")}</td>
                  <td className="border p-2">{product.ingredients.join(", ")}</td>
                  <td className="border p-2">{product.packs.map(p => `${p.name}: ${p.price}`).join(", ")}</td>
                  <td className="border p-2">{product.stockQuantity}</td>
                  <td className="border p-2 space-x-2">
                    <button onClick={() => startEdit(product)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
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
