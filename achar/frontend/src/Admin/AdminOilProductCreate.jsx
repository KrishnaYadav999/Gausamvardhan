import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminOilProductCreate = () => {
  // ---------------- Product Fields ----------------
  const [productName, setProductName] = useState("");
  const [rating, setRating] = useState(0);
  const [cutPrice, setCutPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [allDetails, setAllDetails] = useState("");
  const [perPricePairs, setPerPricePairs] = useState([{ volume: "", price: "" }]);
  const [stock, setStock] = useState(true);
   const [stockQuantity, setStockQuantity] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([""]);
  const [moreAboutProduct, setMoreAboutProduct] = useState([{ image: "", description: "" }]);

  // ---------------- Review Fields ----------------
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([""]);
  const [reviews, setReviews] = useState([]);

  const [message, setMessage] = useState("");

  // ---------------- Fetch Categories ----------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // ---------------- Auto-calculate average rating ----------------
  useEffect(() => {
    if (reviews.length > 0) {
      const avg =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      setRating(parseFloat(avg.toFixed(1)));
    } else {
      setRating(0);
    }
  }, [reviews]);

  // ---------------- Dynamic Fields ----------------
  const handleImageChange = (index, value) => {
    const newImages = [...productImages];
    newImages[index] = value;
    setProductImages(newImages);
  };
  const addImageField = () => setProductImages([...productImages, ""]);
  const removeImageField = (index) =>
    setProductImages(productImages.filter((_, i) => i !== index));

  const handleReviewImageChange = (index, value) => {
    const newReviewImages = [...reviewImages];
    newReviewImages[index] = value;
    setReviewImages(newReviewImages);
  };
  const addReviewImageField = () => setReviewImages([...reviewImages, ""]);
  const removeReviewImageField = (index) =>
    setReviewImages(reviewImages.filter((_, i) => i !== index));

  // ---------------- More About Product ----------------
  const handleMoreAboutChange = (index, field, value) => {
    const updated = [...moreAboutProduct];
    updated[index][field] = value;
    setMoreAboutProduct(updated);
  };
  const addMoreAboutField = () =>
    setMoreAboutProduct([...moreAboutProduct, { image: "", description: "" }]);
  const removeMoreAboutField = (index) =>
    setMoreAboutProduct(moreAboutProduct.filter((_, i) => i !== index));

  // ---------------- Per Price Liter ----------------
  const handlePerPriceChange = (index, field, value) => {
    const updated = [...perPricePairs];
    updated[index][field] = value;
    setPerPricePairs(updated);
  };
  const addPerPricePair = () =>
    setPerPricePairs([...perPricePairs, { volume: "", price: "" }]);
  const removePerPricePair = (index) =>
    setPerPricePairs(perPricePairs.filter((_, i) => i !== index));

  // ---------------- Add Review ----------------
  const addReview = () => {
    if (!reviewName || !reviewComment || reviewRating <= 0) {
      return toast.error("Please fill review name, comment and rating");
    }

    const newReview = {
      name: reviewName,
      rating: Number(reviewRating),
      comment: reviewComment,
      images: reviewImages.filter((url) => url.trim() !== ""),
    };

    setReviews([...reviews, newReview]);

    // Reset review fields
    setReviewName("");
    setReviewRating(0);
    setReviewComment("");
    setReviewImages([""]);

    toast.success("Review added");
  };

  // ---------------- Submit Product ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!productName.trim()) return toast.error("Product Name is required");
      if (!category) return toast.error("Please select category");

      const productData = {
        productName,
        rating,
        cutPrice,
        currentPrice,
        allDetails,
        perPriceLiter: perPricePairs.filter(p => p.volume && p.price).map(p => ({
          volume: p.volume,
          price: Number(p.price),
        })),
        stock,
          stockQuantity,
        videoUrl,
        category,
        productImages: productImages.filter((url) => url !== ""),
        moreAboutProduct: moreAboutProduct.filter(
          (item) => item.image || item.description
        ),
        reviews,
      };

      const res = await axios.post("/api/oils", productData);
      setMessage("✅ Product created successfully!");
      console.log(res.data);

      // Reset all fields
      setProductName("");
      setRating(0);
      setCutPrice("");
      setCurrentPrice("");
      setAllDetails("");
      setPerPricePairs([{ volume: "", price: "" }]);
      setStock(true);
      setStockQuantity(0);
      setVideoUrl("");
      setCategory("");
      setProductImages([""]);
      setMoreAboutProduct([{ image: "", description: "" }]);
      setReviewName("");
      setReviewRating(0);
      setReviewComment("");
      setReviewImages([""]);
      setReviews([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating product");
    }
  };

  // ---------------- JSX ----------------
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Create Oil Product</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name & Rating */}
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(parseFloat(e.target.value))}
          step="0.1"
          min="0"
          max="5"
          className="w-full border rounded px-3 py-2"
        />

        {/* Prices */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Cut Price"
            value={cutPrice}
            onChange={(e) => setCutPrice(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Current Price"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            required
            className="flex-1 border rounded px-3 py-2"
          />
        </div>

        {/* All Details */}
        <textarea
          placeholder="All Details"
          value={allDetails}
          onChange={(e) => setAllDetails(e.target.value)}
          rows="3"
          className="w-full border rounded px-3 py-2"
        />

        {/* Per Price Liter */}
        <div>
          <h4 className="font-semibold mb-2">Per Price Liter</h4>
          {perPricePairs.map((pair, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Volume e.g., 1L"
                value={pair.volume}
                onChange={(e) => handlePerPriceChange(idx, "volume", e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={pair.price}
                onChange={(e) => handlePerPriceChange(idx, "price", e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                required
              />
              <button
                type="button"
                onClick={() => removePerPricePair(idx)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPerPricePair}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add Volume-Price
          </button>
        </div>
 
        {/* Stock */}
        <div className="flex items-center gap-2">
   <input
  type="number"
  placeholder="Stock Quantity"
  value={stockQuantity}
  onChange={(e) => {
    const val = e.target.value;
    // Allow empty or numeric input only
    if (val === "" || /^[0-9\b]+$/.test(val)) {
      setStockQuantity(val);
    }
  }}
  className="flex-1 border rounded px-3 py-2 stock-input"
/>


          <input
            type="checkbox"
            checked={stock}
            onChange={(e) => setStock(e.target.checked)}
            id="stock"
            className="w-4 h-4"
          />
          <label htmlFor="stock">In Stock</label>
        </div>

        {/* Product Images */}
        <div>
          <h4 className="font-semibold mb-2">Product Images (URLs)</h4>
          {productImages.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Paste image URL"
                value={url}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeImageField(idx)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add Image URL
          </button>
        </div>

        {/* Video URL */}
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        {/* More About Product */}
        <div>
          <h4 className="font-semibold mb-2">More About Product</h4>
          {moreAboutProduct.map((item, idx) => (
            <div key={idx} className="mb-3 p-3 border rounded">
              <input
                type="text"
                placeholder="Image URL"
                value={item.image}
                onChange={(e) => handleMoreAboutChange(idx, "image", e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleMoreAboutChange(idx, "description", e.target.value)}
                rows="3"
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <button
                type="button"
                onClick={() => removeMoreAboutField(idx)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMoreAboutField}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add More About Product
          </button>
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Reviews */}
        <div className="mt-4 border p-4 rounded">
          <h4 className="font-semibold mb-2">Add Review</h4>
          <input
            type="text"
            placeholder="Reviewer Name"
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <input
            type="number"
            placeholder="Rating"
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
            step="1"
            min="1"
            max="5"
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <textarea
            placeholder="Comment"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows="3"
            className="w-full border rounded px-3 py-2 mb-2"
          />

          {reviewImages.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Review Image URL"
                value={url}
                onChange={(e) => handleReviewImageChange(idx, e.target.value)}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeReviewImageField(idx)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addReviewImageField}
            className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
          >
            Add Review Image
          </button>
          <button
            type="button"
            onClick={addReview}
            className="bg-green-600 text-white px-3 py-2 rounded w-full mb-2"
          >
            Add Review
          </button>

          {reviews.length > 0 && (
            <ul className="mt-2">
              {reviews.map((r, idx) => (
                <li key={idx} className="text-sm border-b py-1">
                  {r.name} - ⭐ {r.rating} - {r.comment}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition mt-4"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default AdminOilProductCreate;
