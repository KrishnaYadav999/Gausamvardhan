import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminMasalaProduct = () => {
  // ---------------- Product Fields ----------------
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [cutPrice, setCutPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [gram, setGram] = useState("");
  const [aboutTable, setAboutTable] = useState([]);
  const [aboutMore, setAboutMore] = useState([]);
  const [technicalDetails, setTechnicalDetails] = useState({});
  const [images, setImages] = useState([""]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState(true);
  const [pricePerGram, setPricePerGram] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // ✅ new field
  const [moreAboutProduct, setMoreAboutProduct] = useState([{ image: "", description: "" }]); // ✅ new field
const [stockQuantity, setStockQuantity] = useState(0); 
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

  // ---------------- Dynamic Fields ----------------
  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };
  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index) => setImages(images.filter((_, i) => i !== index));

  const handleReviewImageChange = (index, value) => {
    const newImages = [...reviewImages];
    newImages[index] = value;
    setReviewImages(newImages);
  };
  const addReviewImageField = () => setReviewImages([...reviewImages, ""]);
  const removeReviewImageField = (index) => setReviewImages(reviewImages.filter((_, i) => i !== index));

  // ---------------- More About Product Fields ----------------
  const handleMoreAboutProductChange = (index, field, value) => {
    const newList = [...moreAboutProduct];
    newList[index][field] = value;
    setMoreAboutProduct(newList);
  };
  const addMoreAboutProductField = () => setMoreAboutProduct([...moreAboutProduct, { image: "", description: "" }]);
  const removeMoreAboutProductField = (index) => setMoreAboutProduct(moreAboutProduct.filter((_, i) => i !== index));

  // ---------------- Add Review ----------------
  const addReview = () => {
    if (!reviewName || !reviewComment || reviewRating <= 0) {
      return toast.error("Please fill review name, comment and rating");
    }

    const reviewObj = {
      name: reviewName,
      rating: Number(reviewRating),
      comment: reviewComment,
      images: reviewImages.filter((url) => url !== ""),
    };

    const updatedReviews = [...reviews, reviewObj];

    // Update overall product rating
    const avgRating =
      updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
    setRating(parseFloat(avgRating.toFixed(1)));

    setReviews(updatedReviews);

    // Reset review form
    setReviewName("");
    setReviewRating(0);
    setReviewComment("");
    setReviewImages([""]);

    toast.success("Review added");
  };

  // ---------------- Submit Form ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return toast.error("Select a category");

    try {
      const productData = {
        title,
        rating,
        cut_price: cutPrice,
        current_price: currentPrice,
        gram,
        about_table: aboutTable,
        about_more: aboutMore,
        technical_details: technicalDetails,
        images: images.filter((url) => url !== ""),
        category,
        stock,
        pricepergram: pricePerGram,
        videoUrl, // ✅ send videoUrl
        moreAboutProduct: moreAboutProduct.filter(m => m.image || m.description), // ✅ send moreAboutProduct
        reviews,
        stockQuantity,
      };

      const res = await axios.post("/api/masala-products", productData);
      setMessage("✅ Product created successfully!");
      console.log(res.data);

      // Reset fields
      setTitle("");
      setRating(0);
      setCutPrice("");
      setCurrentPrice("");
      setGram("");
      setAboutTable([]);
      setAboutMore([]);
      setTechnicalDetails({});
      setImages([""]);
      setCategory("");
      setStock(true);
      setPricePerGram("");
      setVideoUrl("");
      setMoreAboutProduct([{ image: "", description: "" }]);
      setReviews([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md my-10">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Create Masala Product</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Product Fields */}
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border rounded px-3 py-2" />
        <input type="number" placeholder="Rating" value={rating} onChange={(e) => setRating(e.target.value)} step="0.1" min="0" max="5" className="w-full border rounded px-3 py-2" />

        <div className="flex gap-4">
          <input type="text" placeholder="Cut Price" value={cutPrice} onChange={(e) => setCutPrice(e.target.value)} className="flex-1 border rounded px-3 py-2" />
          <input type="text" placeholder="Current Price" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} className="flex-1 border rounded px-3 py-2" />
        </div>

        <input type="text" placeholder="Gram" value={gram} onChange={(e) => setGram(e.target.value)} className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="About Table (comma separated)" value={aboutTable.join(", ")} onChange={(e) => setAboutTable(e.target.value.split(",").map(i => i.trim()))} className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="About More (comma separated)" value={aboutMore.join(", ")} onChange={(e) => setAboutMore(e.target.value.split(",").map(i => i.trim()))} className="w-full border rounded px-3 py-2" />
        <textarea placeholder='Technical Details (JSON format, e.g. {"Weight":"50g"})' onChange={(e) => {
          try { setTechnicalDetails(JSON.parse(e.target.value)); } catch {} 
        }} className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Price per gram/weight" value={pricePerGram} onChange={(e) => setPricePerGram(e.target.value)} className="w-full border rounded px-3 py-2" />

        {/* Video URL */}
        <input type="text" placeholder="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full border rounded px-3 py-2" />

        {/* More About Product */}
        <div>
          <h4 className="font-semibold mb-2">More About Product</h4>
          {moreAboutProduct.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input type="text" placeholder="Image URL" value={item.image} onChange={(e) => handleMoreAboutProductChange(idx, "image", e.target.value)} className="flex-1 border rounded px-3 py-2" />
              <input type="text" placeholder="Description" value={item.description} onChange={(e) => handleMoreAboutProductChange(idx, "description", e.target.value)} className="flex-1 border rounded px-3 py-2" />
              <button type="button" onClick={() => removeMoreAboutProductField(idx)} className="bg-red-500 text-white px-2 rounded">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addMoreAboutProductField} className="bg-blue-500 text-white px-3 py-1 rounded">Add More About Product</button>
        </div>

        {/* Images */}
        <div>
          <h4 className="font-semibold mb-2">Images (URLs)</h4>
          {images.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input type="text" value={url} onChange={(e) => handleImageChange(idx, e.target.value)} className="flex-1 border rounded px-3 py-2" />
              <button type="button" onClick={() => removeImageField(idx)} className="bg-red-500 text-white px-2 rounded">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addImageField} className="bg-blue-500 text-white px-3 py-1 rounded">Add Image URL</button>
        </div>

        {/* Category & Stock */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full border rounded px-3 py-2">
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} />
          In Stock
        </label>
<div className="flex gap-4">
  <input
    type="number"
    placeholder="Stock Quantity"
    value={stockQuantity}
    onChange={(e) => setStockQuantity(Number(e.target.value))}
    min="0"
    className="flex-1 border rounded px-3 py-2"
    onKeyDown={(e) => e.preventDefault()} // 🚫 prevents typing
  />
  </div>
        {/* Reviews */}
        <div className="mt-4 border p-4 rounded">
          <h4 className="font-semibold mb-2">Add Review</h4>
          <input type="text" placeholder="Reviewer Name" value={reviewName} onChange={(e) => setReviewName(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
          <input type="number" placeholder="Rating" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} step="1" min="1" max="5" className="w-full border rounded px-3 py-2 mb-2" />
          <textarea placeholder="Comment" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows="3" className="w-full border rounded px-3 py-2 mb-2" />

          {reviewImages.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input type="text" value={url} onChange={(e) => handleReviewImageChange(idx, e.target.value)} className="flex-1 border rounded px-3 py-2" />
              <button type="button" onClick={() => removeReviewImageField(idx)} className="bg-red-500 text-white px-2 rounded">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addReviewImageField} className="bg-blue-500 text-white px-3 py-1 rounded mb-2">Add Review Image</button>
          <button type="button" onClick={addReview} className="bg-green-600 text-white px-3 py-2 rounded w-full">Add Review</button>

          {reviews.length > 0 && (
            <ul className="mt-2">
              {reviews.map((r, idx) => (
                <li key={idx} className="text-sm border-b py-1">{r.name} - ⭐ {r.rating} - {r.comment}</li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition mt-4">Create Product</button>
      </form>
    </div>
  );
};

export default AdminMasalaProduct;
