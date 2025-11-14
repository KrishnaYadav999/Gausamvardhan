import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminProductCreate = () => {
  const [formData, setFormData] = useState({
    productName: "",
    rating: 0,
    numberOfReviews: 0,
    tasteDescription: "",
    cutPrice: "",
    currentPrice: "",
    buyMoreTogether: "",
    weightOptions: "",
    moreAboutPickle: "",
    productImages: [""],
    traditionalRecipes: "",
    localIngredients: "",
    driedNaturally: "",
    moreAboutThisPack: { header: "", description: "", images: [""] },
    moreAboutProduct: [{ image: "", description: "" }],
    videoUrl: "",
    pricePerGram: "",
    stock: true,
     stockQuantity: 0, 
    category: "",
    reviews: [],
    
  });

  const [categories, setCategories] = useState([]);

  // Review Fields
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([""]);

  // Fetch categories
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

  // Auto-calculate average rating & number of reviews
  useEffect(() => {
    const numReviews = formData.reviews.length;
    const avgRating =
      numReviews > 0
        ? formData.reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
        : 0;

    setFormData((prev) => ({
      ...prev,
      rating: parseFloat(avgRating.toFixed(1)),
      numberOfReviews: numReviews,
    }));
  }, [formData.reviews]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "stock") {
      setFormData((prev) => ({ ...prev, stock: checked }));
    } else if (name.startsWith("moreAboutThisPack.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        moreAboutThisPack: { ...prev.moreAboutThisPack, [field]: value },
      }));
    } else if (name === "productImages") {
      const imgs = value.split(",").map((i) => i.trim());
      setFormData((prev) => ({ ...prev, productImages: imgs }));
    } else if (name.startsWith("moreAboutProduct")) {
      const [_, index, field] = name.split(".");
      const arr = [...formData.moreAboutProduct];
      arr[index][field] = value;
      setFormData((prev) => ({ ...prev, moreAboutProduct: arr }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Dynamic Product Images
  const handleProductImageChange = (index, value) => {
    const imgs = [...formData.productImages];
    imgs[index] = value;
    setFormData((prev) => ({ ...prev, productImages: imgs }));
  };
  const addProductImage = () =>
    setFormData((prev) => ({ ...prev, productImages: [...prev.productImages, ""] }));
  const removeProductImage = (index) => {
    const imgs = formData.productImages.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, productImages: imgs }));
  };

  // Dynamic Review Images
  const handleReviewImageChange = (index, value) => {
    const imgs = [...reviewImages];
    imgs[index] = value;
    setReviewImages(imgs);
  };
  const addReviewImageField = () => setReviewImages([...reviewImages, ""]);
  const removeReviewImageField = (index) =>
    setReviewImages(reviewImages.filter((_, i) => i !== index));

  // Add Review
  const addReview = () => {
    if (!reviewName || !reviewComment || reviewRating <= 0) {
      return toast.error("Please fill review name, comment, and rating");
    }

    const newReview = {
      name: reviewName,
      rating: Number(reviewRating),
      comment: reviewComment,
      images: reviewImages.filter((i) => i.trim() !== ""),
      createdAt: new Date(),
    };

    setFormData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, newReview],
    }));

    // Reset review fields
    setReviewName("");
    setReviewRating(0);
    setReviewComment("");
    setReviewImages([""]);

    toast.success("Review added");
  };

  // Dynamic More About Product
  const addMoreAboutProduct = () =>
    setFormData((prev) => ({
      ...prev,
      moreAboutProduct: [...prev.moreAboutProduct, { image: "", description: "" }],
    }));
  const removeMoreAboutProduct = (index) =>
    setFormData((prev) => ({
      ...prev,
      moreAboutProduct: prev.moreAboutProduct.filter((_, i) => i !== index),
    }));

  // Submit Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productName.trim()) return toast.error("Product Name required");
    if (!formData.productImages.length || !formData.productImages[0])
      return toast.error("At least one product image is required");
    if (!formData.category) return toast.error("Please select category");

    try {
      await axios.post("/api/products", formData);
      toast.success("Product created successfully!");

      // Reset form
      setFormData({
        productName: "",
        rating: 0,
        numberOfReviews: 0,
        tasteDescription: "",
        cutPrice: "",
        currentPrice: "",
        buyMoreTogether: "",
        weightOptions: "",
        moreAboutPickle: "",
        productImages: [""],
        traditionalRecipes: "",
        localIngredients: "",
        driedNaturally: "",
        moreAboutThisPack: { header: "", description: "", images: [""] },
        moreAboutProduct: [{ image: "", description: "" }],
        videoUrl: "",
        pricePerGram: "",
        stock: true,
        category: "",
        reviews: [],
        stockQuantity: 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md my-10">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Info */}
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
  type="number"
  name="rating"
  placeholder="Rating (0-5)"
  value={formData.rating}
  onChange={handleChange}
  min="0"
  max="5"
  step="0.1"
  className="w-full border rounded px-3 py-2 mt-2"
/>
<input
  type="number"
  name="numberOfViews"
  placeholder="Number of Views"
  value={formData.numberOfViews}
  onChange={handleChange}
  min="0"
  className="w-full border rounded px-3 py-2 mt-2"
/>
   <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={formData.stockQuantity}
          onChange={handleChange}
          min="0"
          required
          className="w-full border rounded px-3 py-2 mb-3"
        />
        <input
          type="text"
          name="videoUrl"
          placeholder="Video URL"
          value={formData.videoUrl}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="tasteDescription"
          placeholder="Taste Description"
          value={formData.tasteDescription}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="cutPrice"
            placeholder="Cut Price"
            value={formData.cutPrice}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          />
          <input
            type="text"
            name="currentPrice"
            placeholder="Current Price"
            value={formData.currentPrice}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          />
        </div>
        <input
          type="text"
          name="buyMoreTogether"
          placeholder="Buy More Together"
          value={formData.buyMoreTogether}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="weightOptions"
          placeholder="Weight Options"
          value={formData.weightOptions}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="moreAboutPickle"
          placeholder="More About Pickle"
          value={formData.moreAboutPickle}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="traditionalRecipes"
          placeholder="Traditional Recipes"
          value={formData.traditionalRecipes}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="localIngredients"
          placeholder="Local Ingredients"
          value={formData.localIngredients}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="driedNaturally"
          placeholder="Dried Naturally"
          value={formData.driedNaturally}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="pricePerGram"
          placeholder="Price per Gram"
          value={formData.pricePerGram}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />

        {/* More About This Pack */}
        <h4 className="font-semibold mt-4">More About This Pack</h4>
        <input
          type="text"
          name="moreAboutThisPack.header"
          placeholder="Header"
          value={formData.moreAboutThisPack.header}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <textarea
          name="moreAboutThisPack.description"
          placeholder="Description"
          value={formData.moreAboutThisPack.description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        {formData.moreAboutThisPack.images.map((url, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                const imgs = [...formData.moreAboutThisPack.images];
                imgs[idx] = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  moreAboutThisPack: { ...prev.moreAboutThisPack, images: imgs },
                }));
              }}
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              type="button"
              onClick={() => {
                const imgs = formData.moreAboutThisPack.images.filter((_, i) => i !== idx);
                setFormData((prev) => ({
                  ...prev,
                  moreAboutThisPack: { ...prev.moreAboutThisPack, images: imgs },
                }));
              }}
              className="bg-red-500 text-white px-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              moreAboutThisPack: {
                ...prev.moreAboutThisPack,
                images: [...prev.moreAboutThisPack.images, ""],
              },
            }))
          }
          className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
        >
          Add Pack Image
        </button>

        {/* Product Images */}
        <div>
          <h4 className="font-semibold mb-2">Product Images</h4>
          {formData.productImages.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleProductImageChange(idx, e.target.value)}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeProductImage(idx)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProductImage}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add Image URL
          </button>
        </div>

        {/* More About Product */}
        <h4 className="font-semibold mt-4">More About Product</h4>
        {formData.moreAboutProduct.map((item, idx) => (
          <div key={idx} className="border p-2 mb-2 rounded">
            <input
              type="text"
              name={`moreAboutProduct.${idx}.image`}
              placeholder="Image URL"
              value={item.image}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mb-1"
            />
            <textarea
              name={`moreAboutProduct.${idx}.description`}
              placeholder="Description"
              value={item.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
            <button
              type="button"
              onClick={() => removeMoreAboutProduct(idx)}
              className="bg-red-500 text-white px-2 py-1 mt-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addMoreAboutProduct}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add More About Product
        </button>

        {/* Category & Stock */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 mt-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="stock"
            checked={formData.stock}
            onChange={handleChange}
          />
          In Stock
        </label>

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
            className="bg-green-600 text-white px-3 py-2 rounded w-full"
          >
            Add Review
          </button>

          {/* Review Preview */}
          {formData.reviews.length > 0 && (
            <ul className="mt-2">
              {formData.reviews.map((r, idx) => (
                <li key={idx} className="text-sm border-b py-1">
                  {r.name} - ⭐ {r.rating} - {r.comment}
                </li>
              ))}
            </ul>
          )}
        </div>

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

export default AdminProductCreate;
