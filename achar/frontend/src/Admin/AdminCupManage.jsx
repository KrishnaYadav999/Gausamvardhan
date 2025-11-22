import React, { useState, useEffect } from "react";
import axios from "axios";

// Packs Component
const Packs = ({ packs, setPacks }) => {
  const handlePackChange = (index, field, value) => {
    const newPacks = [...packs];
    newPacks[index][field] = value;
    setPacks(newPacks);
  };
  const addPack = () => setPacks([...packs, { name: "", price: "" }]);
  const removePack = (index) => setPacks(packs.filter((_, i) => i !== index));

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">Packs</label>
      {packs.map((pack, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Pack Name"
            value={pack.name}
            onChange={(e) => handlePackChange(index, "name", e.target.value)}
            className="flex-1 p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Price"
            value={pack.price}
            onChange={(e) => handlePackChange(index, "price", e.target.value)}
            className="w-32 p-2 border rounded-lg"
          />
          {packs.length > 1 && (
            <button
              type="button"
              onClick={() => removePack(index)}
              className="bg-red-500 text-white px-2 rounded-lg"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addPack}
        className="bg-green-600 text-white px-4 py-1 rounded-lg"
      >
        Add Pack
      </button>
    </div>
  );
};

// Reviews Component
const Reviews = ({ reviews, setReviews }) => {
  const handleReviewChange = (index, field, value) => {
    const newReviews = [...reviews];
    newReviews[index][field] = value;
    setReviews(newReviews);
  };
  const handleReviewImageChange = (reviewIndex, imgIndex, value) => {
    const newReviews = [...reviews];
    newReviews[reviewIndex].images[imgIndex] = value;
    setReviews(newReviews);
  };
  const addReview = () =>
    setReviews([...reviews, { name: "", rating: "", comment: "", images: [""] }]);
  const removeReview = (index) => setReviews(reviews.filter((_, i) => i !== index));
  const addReviewImage = (reviewIndex) => {
    const newReviews = [...reviews];
    newReviews[reviewIndex].images.push("");
    setReviews(newReviews);
  };
  const removeReviewImage = (reviewIndex, imgIndex) => {
    const newReviews = [...reviews];
    newReviews[reviewIndex].images = newReviews[reviewIndex].images.filter(
      (_, i) => i !== imgIndex
    );
    setReviews(newReviews);
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">Reviews</label>
      {reviews.map((review, index) => (
        <div key={index} className="mb-2 border p-3 rounded-lg bg-white shadow-sm">
          <input
            type="text"
            placeholder="Reviewer Name"
            value={review.name}
            onChange={(e) => handleReviewChange(index, "name", e.target.value)}
            className="w-full p-2 border rounded-lg mb-1"
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={review.rating}
            onChange={(e) => handleReviewChange(index, "rating", e.target.value)}
            className="w-full p-2 border rounded-lg mb-1"
          />
          <textarea
            placeholder="Comment"
            value={review.comment}
            onChange={(e) => handleReviewChange(index, "comment", e.target.value)}
            className="w-full p-2 border rounded-lg mb-1"
          />
          {review.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                type="text"
                value={img}
                onChange={(e) => handleReviewImageChange(index, i, e.target.value)}
                placeholder="Image URL"
                className="flex-1 p-2 border rounded-lg"
              />
              {review.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReviewImage(index, i)}
                  className="bg-red-500 text-white px-2 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addReviewImage(index)}
            className="bg-green-600 text-white px-4 py-1 rounded-lg mb-1"
          >
            Add More Images
          </button>
          {reviews.length > 1 && (
            <button
              type="button"
              onClick={() => removeReview(index)}
              className="bg-red-500 text-white px-2 rounded-lg mt-1"
            >
              Remove Review
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addReview}
        className="bg-green-600 text-white px-4 py-1 rounded-lg"
      >
        Add Review
      </button>
    </div>
  );
};

// More About Product Component
const MoreAboutProduct = ({ moreAbout, setMoreAbout }) => {
  const safeMoreAbout = moreAbout || { name: "", description: "", images: [""] };
  const handleChange = (field, value) =>
    setMoreAbout({ ...safeMoreAbout, [field]: value });
  const handleImageChange = (index, value) => {
    const newImages = [...safeMoreAbout.images];
    newImages[index] = value;
    setMoreAbout({ ...safeMoreAbout, images: newImages });
  };
  const addImage = () =>
    setMoreAbout({ ...safeMoreAbout, images: [...safeMoreAbout.images, ""] });
  const removeImage = (index) =>
    setMoreAbout({
      ...safeMoreAbout,
      images: safeMoreAbout.images.filter((_, i) => i !== index),
    });

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">More About Product</label>
      <input
        type="text"
        placeholder="Name"
        value={safeMoreAbout.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="w-full p-2 border rounded-lg mb-1"
      />
      <textarea
        placeholder="Description"
        value={safeMoreAbout.description}
        onChange={(e) => handleChange("description", e.target.value)}
        className="w-full p-2 border rounded-lg mb-1"
      />
      {safeMoreAbout.images.map((img, index) => (
        <div key={index} className="flex gap-2 mb-1">
          <input
            type="text"
            value={img}
            onChange={(e) => handleImageChange(index, e.target.value)}
            placeholder="Image URL"
            className="flex-1 p-2 border rounded-lg"
          />
          {safeMoreAbout.images.length > 1 && (
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="bg-red-500 text-white px-2 rounded-lg"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addImage}
        className="bg-green-600 text-white px-4 py-1 rounded-lg"
      >
        Add More Images
      </button>
    </div>
  );
};

// Main AdminCupManage Component
export default function AdminCupManage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
    packs: [{ name: "", price: "" }],
    reviews: [{ name: "", rating: "", comment: "", images: [""] }],
    moreAboutProduct: { name: "", description: "", images: [""] },
    cut_price: "",
    current_price: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/cup/all");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
    fetchProducts();
  }, []);

  const editProduct = (product) => {
    setEditingProduct(product._id);
    setFormData({
      ...product,
      keyBenefits: product.keyBenefits.join(", "),
      ingredients: product.ingredients.join(", "),
      moreAboutProduct: product.moreAboutProduct || { name: "", description: "", images: [""] },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      keyBenefits: formData.keyBenefits.split(",").map((k) => k.trim()),
      ingredients: formData.ingredients.split(",").map((i) => i.trim()),
      images: formData.images.filter(Boolean),
      packs: formData.packs.filter((p) => p.name && p.price),
      reviews: formData.reviews
        .filter((r) => r.name && r.rating && r.comment)
        .map((r) => ({ ...r, images: r.images.filter(Boolean) })),
      moreAboutProduct: {
        ...formData.moreAboutProduct,
        images: formData.moreAboutProduct.images.filter(Boolean),
      },
    };
    try {
      await axios.put(`/api/cup/${editingProduct}`, payload);
      alert("Product updated!");
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Cup Products</h2>

      {/* Products List */}
      <div className="mb-10 bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold mb-2">All Products</h3>
        {products.map((product) => (
          <div key={product._id} className="flex items-center justify-between border p-2 mb-2 rounded-lg">
            <span>{product.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => editProduct(product)}
                className="bg-yellow-500 text-white px-2 py-1 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  if (!window.confirm("Are you sure?")) return;
                  await axios.delete(`/api/cup/${product._id}`);
                  setProducts(products.filter((p) => p._id !== product._id));
                }}
                className="bg-red-600 text-white px-2 py-1 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingProduct && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-center">Edit Product</h3>
          <form onSubmit={handleUpdate} className="space-y-4">

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Key Benefits (comma separated)"
              value={formData.keyBenefits}
              onChange={(e) => setFormData({ ...formData, keyBenefits: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Ingredients (comma separated)"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Current Price"
              value={formData.current_price}
              onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Cut Price"
              value={formData.cut_price}
              onChange={(e) => setFormData({ ...formData, cut_price: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Video URL"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full p-2 border rounded-lg"
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>

            {/* Images */}
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={img}
                  placeholder="Image URL"
                  onChange={(e) => {
                    const newImages = [...formData.images];
                    newImages[idx] = e.target.value;
                    setFormData({ ...formData, images: newImages });
                  }}
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })}
              className="bg-green-600 text-white px-4 py-1 rounded-lg"
            >
              Add Image
            </button>

            {/* Packs, Reviews, More About Product */}
            <Packs packs={formData.packs} setPacks={(packs) => setFormData({ ...formData, packs })} />
            <Reviews reviews={formData.reviews} setReviews={(reviews) => setFormData({ ...formData, reviews })} />
            <MoreAboutProduct
              moreAbout={formData.moreAboutProduct}
              setMoreAbout={(moreAbout) => setFormData({ ...formData, moreAboutProduct: moreAbout })}
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.checked })}
              />
              <label>In Stock</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
            >
              Update Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
