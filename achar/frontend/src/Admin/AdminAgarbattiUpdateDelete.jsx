import React, { useState, useEffect } from "react";
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
    stock: true,
    category: "",
    images: [""],
    videoUrl: "",
    cutPrice: "",
    currentPrice: "",
    rating: "",
    packs: [{ name: "", price: "" }],
    reviews: [{ name: "", rating: "", comment: "", images: [""] }],
    moreAboutProduct: { name: "", description: "", images: [""] },
    coupons: [],
  });
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch all products
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

  // ---------------- Handlers ----------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckboxChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.checked });

  // ---------------- Packs ----------------
  const handlePackChange = (index, field, value) => {
    const newPacks = [...formData.packs];
    newPacks[index][field] = value;
    setFormData({ ...formData, packs: newPacks });
  };
  const addPack = () =>
    setFormData({
      ...formData,
      packs: [...formData.packs, { name: "", price: "" }],
    });
  const removePack = (index) =>
    setFormData({
      ...formData,
      packs: formData.packs.filter((_, i) => i !== index),
    });

  // ---------------- Reviews ----------------
  const handleReviewChange = (index, field, value) => {
    const newReviews = [...formData.reviews];
    newReviews[index][field] = value;
    setFormData({ ...formData, reviews: newReviews });
  };
  const addReview = () =>
    setFormData({
      ...formData,
      reviews: [
        ...formData.reviews,
        { name: "", rating: "", comment: "", images: [""] },
      ],
    });
  const removeReview = (index) =>
    setFormData({
      ...formData,
      reviews: formData.reviews.filter((_, i) => i !== index),
    });

  const handleReviewImageChange = (reviewIndex, imgIndex, value) => {
    const newReviews = [...formData.reviews];
    newReviews[reviewIndex].images[imgIndex] = value;
    setFormData({ ...formData, reviews: newReviews });
  };
  const addReviewImage = (reviewIndex) => {
    const newReviews = [...formData.reviews];
    newReviews[reviewIndex].images.push("");
    setFormData({ ...formData, reviews: newReviews });
  };
  const removeReviewImage = (reviewIndex, imgIndex) => {
    const newReviews = [...formData.reviews];
    newReviews[reviewIndex].images = newReviews[reviewIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setFormData({ ...formData, reviews: newReviews });
  };

  // ---------------- More About Product ----------------
  const handleMoreAboutImageChange = (index, value) => {
    const newImages = [...formData.moreAboutProduct.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      moreAboutProduct: { ...formData.moreAboutProduct, images: newImages },
    });
  };
  const addMoreAboutImage = () =>
    setFormData({
      ...formData,
      moreAboutProduct: {
        ...formData.moreAboutProduct,
        images: [...formData.moreAboutProduct.images, ""],
      },
    });
  const removeMoreAboutImage = (index) =>
    setFormData({
      ...formData,
      moreAboutProduct: {
        ...formData.moreAboutProduct,
        images: formData.moreAboutProduct.images.filter((_, i) => i !== index),
      },
    });

  // ---------------- Main Images ----------------
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };
  const addImage = () =>
    setFormData({ ...formData, images: [...formData.images, ""] });
  const removeImage = (index) =>
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });

  // ---------------- Coupons ----------------
  const handleCouponChange = (index, field, value) => {
    const newCoupons = [...formData.coupons];
    newCoupons[index][field] = value;
    setFormData({ ...formData, coupons: newCoupons });
  };
  const addCoupon = () =>
    setFormData({
      ...formData,
      coupons: [
        ...formData.coupons,
        {
          code: "",
          discountType: "percentage",
          discountValue: 0,
          isPermanent: false,
          expiryDate: "",
          usageLimit: null,
          isActive: true,
        },
      ],
    });
  const removeCoupon = (index) =>
    setFormData({
      ...formData,
      coupons: formData.coupons.filter((_, i) => i !== index),
    });

  // ---------------- Edit Flow ----------------
  const startEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      keyBenefits: product.keyBenefits.join(","),
      ingredients: product.ingredients.join(","),
      quantity: product.quantity,
      stockQuantity: product.stockQuantity,
      stock: product.stock,
      category: product.category?._id || "",
      images: product.images.length ? product.images : [""],
      videoUrl: product.videoUrl || "",
      cutPrice: product.cut_price || "",
      currentPrice: product.current_price || "",
      rating: product.rating || "",
      packs: product.packs.length ? product.packs : [{ name: "", price: "" }],
      reviews: product.reviews.length
        ? product.reviews
        : [{ name: "", rating: "", comment: "", images: [""] }],
      moreAboutProduct: product.moreAboutProduct || {
        name: "",
        description: "",
        images: [""],
      },
      coupons: product.coupons || [],
    });
  };

  const cancelEdit = () => setEditingProduct(null);

  const handleUpdate = async (id) => {
    try {
      const payload = {
        ...formData,
        keyBenefits: formData.keyBenefits.split(",").map((b) => b.trim()),
        ingredients: formData.ingredients.split(",").map((i) => i.trim()),
        images: formData.images.filter((img) => img),
        packs: formData.packs.filter((p) => p.name && p.price),
        reviews: formData.reviews
          .filter((r) => r.name && r.rating && r.comment)
          .map((r) => ({ ...r, images: r.images.filter((img) => img) })),
        moreAboutProduct: {
          ...formData.moreAboutProduct,
          images: formData.moreAboutProduct.images.filter((img) => img),
        },
        coupons: formData.coupons,
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/api/agarbatti/${id}`);
      alert("Deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Agarbatti Products</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {products.map((p) =>
        editingProduct === p._id ? (
          <div
            key={p._id}
            className="border p-4 mb-4 rounded-lg bg-yellow-50 shadow"
          >
            <h3 className="font-semibold mb-2">Editing: {p.title}</h3>

            {/* ---------------- Basic Fields ---------------- */}
            {[
              { label: "Title", name: "title" },
              { label: "Description", name: "description", textarea: true },
              { label: "Key Benefits", name: "keyBenefits" },
              { label: "Ingredients", name: "ingredients" },
              { label: "Quantity", name: "quantity" },
              { label: "Stock Quantity", name: "stockQuantity", type: "number" },
              { label: "Rating", name: "rating", type: "number" },
              { label: "Video URL", name: "videoUrl" },
              { label: "Cut Price", name: "cutPrice", type: "number" },
              { label: "Current Price", name: "currentPrice", type: "number" },
            ].map((f) => (
              <div key={f.name} className="mb-2">
                <label className="block font-medium">{f.label}</label>
                {f.textarea ? (
                  <textarea
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    className="w-full border rounded p-1"
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    className="w-full border rounded p-1"
                  />
                )}
              </div>
            ))}

            {/* ---------------- Category ---------------- */}
            <div className="mb-2">
              <label className="block font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded p-1"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ---------------- Main Images ---------------- */}
            <div className="mb-2">
              <label className="block font-medium">Images</label>
              {formData.images.map((img, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    className="border rounded p-1 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImage}
                className="bg-green-500 text-white px-2 rounded"
              >
                Add Image
              </button>
            </div>

            {/* ---------------- Packs ---------------- */}
            <div className="mb-2">
              <label className="block font-medium">Packs</label>
              {formData.packs.map((pack, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder="Name"
                    value={pack.name}
                    onChange={(e) =>
                      handlePackChange(idx, "name", e.target.value)
                    }
                    className="border rounded p-1"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={pack.price}
                    onChange={(e) =>
                      handlePackChange(idx, "price", e.target.value)
                    }
                    className="border rounded p-1"
                  />
                  <button
                    type="button"
                    onClick={() => removePack(idx)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPack}
                className="bg-green-500 text-white px-2 rounded"
              >
                Add Pack
              </button>
            </div>

            {/* ---------------- Reviews ---------------- */}
            <div className="mb-2">
              <label className="block font-medium">Reviews</label>
              {formData.reviews.map((review, rIdx) => (
                <div key={rIdx} className="border p-2 mb-2 rounded">
                  <input
                    type="text"
                    placeholder="Name"
                    value={review.name}
                    onChange={(e) =>
                      handleReviewChange(rIdx, "name", e.target.value)
                    }
                    className="border rounded p-1 mb-1 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Rating"
                    value={review.rating}
                    onChange={(e) =>
                      handleReviewChange(rIdx, "rating", e.target.value)
                    }
                    className="border rounded p-1 mb-1 w-full"
                  />
                  <textarea
                    placeholder="Comment"
                    value={review.comment}
                    onChange={(e) =>
                      handleReviewChange(rIdx, "comment", e.target.value)
                    }
                    className="border rounded p-1 mb-1 w-full"
                  />
                  {review.images.map((img, iIdx) => (
                    <div key={iIdx} className="flex gap-1 mb-1">
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={img}
                        onChange={(e) =>
                          handleReviewImageChange(rIdx, iIdx, e.target.value)
                        }
                        className="border rounded p-1 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeReviewImage(rIdx, iIdx)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addReviewImage(rIdx)}
                    className="bg-green-500 text-white px-2 rounded mt-1"
                  >
                    Add Image
                  </button>
                  <button
                    type="button"
                    onClick={() => removeReview(rIdx)}
                    className="bg-red-500 text-white px-2 rounded mt-1"
                  >
                    Remove Review
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addReview}
                className="bg-green-500 text-white px-2 rounded"
              >
                Add Review
              </button>
            </div>

            {/* ---------------- More About Product ---------------- */}
            <div className="mb-2">
              <label className="block font-medium">More About Product Images</label>
              {formData.moreAboutProduct.images.map((img, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) =>
                      handleMoreAboutImageChange(idx, e.target.value)
                    }
                    className="border rounded p-1 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeMoreAboutImage(idx)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMoreAboutImage}
                className="bg-green-500 text-white px-2 rounded"
              >
                Add Image
              </button>
            </div>

            {/* ---------------- Coupons ---------------- */}
            <div className="mb-2">
              <label className="block font-medium">Coupons</label>
              {formData.coupons.map((coupon, idx) => (
                <div key={idx} className="border p-2 mb-2 rounded">
                  <input
                    type="text"
                    placeholder="Code"
                    value={coupon.code}
                    onChange={(e) =>
                      handleCouponChange(idx, "code", e.target.value)
                    }
                    className="border rounded p-1 mb-1 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Discount Value"
                    value={coupon.discountValue}
                    onChange={(e) =>
                      handleCouponChange(idx, "discountValue", e.target.value)
                    }
                    className="border rounded p-1 mb-1 w-full"
                  />
                  <select
                    value={coupon.discountType}
                    onChange={(e) =>
                      handleCouponChange(idx, "discountType", e.target.value)
                    }
                    className="border rounded p-1 mb-1 w-full"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeCoupon(idx)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    Remove Coupon
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCoupon}
                className="bg-green-500 text-white px-2 rounded"
              >
                Add Coupon
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleUpdate(p._id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            key={p._id}
            className="border p-4 mb-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{p.title}</h3>
              <p>Category: {p.category?.name}</p>
              <p>Stock Qty: {p.stockQuantity}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(p)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
