import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminGheeProductCreate = () => {
  // ---------------- Product Fields ----------------
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [cutPrice, setCutPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [weightVolume, setWeightVolume] = useState("");
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [images, setImages] = useState([""]);
  const [videoUrl, setVideoUrl] = useState(""); // ✅ single video URL
  const [moreAboutProduct, setMoreAboutProduct] = useState([
    { image: "", description: "" },
  ]); // ✅ dynamic array
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(true);
  const [pricePerGram, setPricePerGram] = useState("");
const [stockQuantity, setStockQuantity] = useState(0);
  // ---------------- Review Fields ----------------
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([""]);
  const [reviews, setReviews] = useState([]);

  const [message, setMessage] = useState("");
const [couponCode, setCouponCode] = useState("");
const [coupons, setCoupons] = useState([]);
const [discountType, setDiscountType] = useState("percentage");
const [discountValue, setDiscountValue] = useState("");
const [isPermanent, setIsPermanent] = useState(false);
const [expiryDate, setExpiryDate] = useState("");
const [usageLimit, setUsageLimit] = useState("");
const [isActive, setIsActive] = useState(true);
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

const addCoupon = () => {
  if (!couponCode || !discountValue) {
    return toast.error("Coupon code and discount value required");
  }

  const newCoupon = {
    code: couponCode,
    discountType,
    discountValue: Number(discountValue),
    isPermanent,
    expiryDate: isPermanent ? null : expiryDate,
    usageLimit: usageLimit ? Number(usageLimit) : null,
    usedCount: 0,
    isActive,
  };

  setCoupons([...coupons, newCoupon]);

  // reset
  setCouponCode("");
  setDiscountType("percentage");
  setDiscountValue("");
  setIsPermanent(false);
  setExpiryDate("");
  setUsageLimit("");
  setIsActive(true);

  toast.success("Coupon added!");
};

 
  // ---------------- Dynamic Fields ----------------
  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };
  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index) =>
    setImages(images.filter((_, i) => i !== index));

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
      if (!title.trim()) return toast.error("Title is required");
      if (!currentPrice.trim()) return toast.error("Current price is required");
      if (!category) return toast.error("Please select category");

      const productData = {
        title,
        rating,
        cutPrice,
        currentPrice,
        weightVolume,
        description,
        specifications,
        images: images.filter((url) => url !== ""),
        videoUrl, // ✅ new field
        moreAboutProduct: moreAboutProduct.filter(
          (item) => item.image || item.description
        ), // ✅ new field
        category,
        stock,
         stockQuantity, 
        pricePerGram,
        reviews,
         coupons
      };

      const res = await axios.post("/api/ghee-products", productData);
      setMessage("✅ Product created successfully!");
      console.log(res.data);

      // Reset all fields
      setTitle("");
      setRating(0);
      setCutPrice("");
      setCurrentPrice("");
      setWeightVolume("");
      setDescription("");
      setSpecifications("");
      setImages([""]);
      setVideoUrl("");
      setMoreAboutProduct([{ image: "", description: "" }]);
      setCategory("");
      setStock(true);
      setPricePerGram("");
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
      <h2 className="text-2xl font-bold mb-4">Create Ghee Product</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title & Rating */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

        {/* Weight / Volume */}
        <input
          type="text"
          placeholder="Weight / Volume"
          value={weightVolume}
          onChange={(e) => setWeightVolume(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        {/* Description & Specifications */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Specifications"
          value={specifications}
          onChange={(e) => setSpecifications(e.target.value)}
          rows="4"
          className="w-full border rounded px-3 py-2"
        />

        {/* Stock & Price per gram */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={stock}
            onChange={(e) => setStock(e.target.checked)}
            id="stock"
            className="w-4 h-4"
          />
          <label htmlFor="stock">In Stock</label>
        </div>
        <input
  type="number"
  placeholder="Stock Quantity"
  value={stockQuantity}
  onChange={(e) => setStockQuantity(e.target.value)}
  required
  className="w-full border rounded px-3 py-2"
/>
        <input
          type="text"
          placeholder="Price per gram/weight"
          value={pricePerGram}
          onChange={(e) => setPricePerGram(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        {/* Images */}
        <div>
          <h4 className="font-semibold mb-2">Images (URLs)</h4>
          {images.map((url, idx) => (
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
        <div>
          <h4 className="font-semibold mb-2">Video URL</h4>
          <input
            type="text"
            placeholder="Paste video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* More About Product */}
        <div>
          <h4 className="font-semibold mb-2">More About Product</h4>
          {moreAboutProduct.map((item, idx) => (
            <div key={idx} className="mb-3 p-3 border rounded">
              <input
                type="text"
                placeholder="Image URL"
                value={item.image}
                onChange={(e) =>
                  handleMoreAboutChange(idx, "image", e.target.value)
                }
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleMoreAboutChange(idx, "description", e.target.value)
                }
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

          {/* Review Preview */}
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
{/* ---------------- Coupons ---------------- */}
{/* ---------------- Coupons ---------------- */}
<div className="mt-4 border p-4 rounded">
  <h4 className="font-semibold mb-2">Add Coupon</h4>

  <input
    type="text"
    placeholder="Coupon Code"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
    className="w-full border rounded px-3 py-2 mb-2"
  />

  {/* Discount Type */}
  <select
    value={discountType}
    onChange={(e) => setDiscountType(e.target.value)}
    className="w-full border rounded px-3 py-2 mb-2"
  >
    <option value="percentage">Percentage (%)</option>
    <option value="flat">Flat Amount (₹)</option>
  </select>

  <input
    type="number"
    placeholder="Discount Value"
    value={discountValue}
    onChange={(e) => setDiscountValue(e.target.value)}
    className="w-full border rounded px-3 py-2 mb-2"
  />

  {/* Permanent Checkbox */}
  <div className="flex items-center gap-2 mb-2">
    <input
      type="checkbox"
      checked={isPermanent}
      onChange={(e) => setIsPermanent(e.target.checked)}
    />
    <label>Permanent Coupon (No Expiry)</label>
  </div>

  {/* Expiry if NOT permanent */}
  {!isPermanent && (
    <input
      type="date"
      value={expiryDate}
      onChange={(e) => setExpiryDate(e.target.value)}
      className="w-full border rounded px-3 py-2 mb-2"
    />
  )}

  <input
    type="number"
    placeholder="Usage Limit (optional)"
    value={usageLimit}
    onChange={(e) => setUsageLimit(e.target.value)}
    className="w-full border rounded px-3 py-2 mb-2"
  />

  {/* Active Status */}
  <div className="flex items-center gap-2 mb-3">
    <input
      type="checkbox"
      checked={isActive}
      onChange={(e) => setIsActive(e.target.checked)}
    />
    <label>Active</label>
  </div>

  <button
    type="button"
    onClick={addCoupon}
    className="bg-purple-600 text-white px-3 py-2 rounded w-full"
  >
    Add Coupon
  </button>

  {/* Preview */}
  {coupons.length > 0 && (
    <ul className="mt-3 text-sm">
      {coupons.map((c, idx) => (
        <li key={idx} className="border-b py-1">
          <strong>{c.code}</strong> - {c.discountType} - {c.discountValue}
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

export default AdminGheeProductCreate;
