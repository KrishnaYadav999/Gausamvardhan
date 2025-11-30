import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminAgarbatiCreate() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keyBenefits: "",
    ingredients: "",
    quantity: "",
    stockQuantity: "",
    stock: true,
    cutPrice: "",
    currentPrice: "",
    rating: "",
    category: "",
    images: [""], // Array for multiple main images
    videoUrl: "",
    packs: [{ name: "", price: "" }],
    reviews: [{ name: "", rating: "", comment: "", images: [""] }],
    moreAboutProduct: { name: "", description: "", images: [""] },
  });

  // ---------------- Coupon State ----------------
  const [couponCode, setCouponCode] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [isActive, setIsActive] = useState(true);

  // ---------------- Add Coupon ----------------
  const addCoupon = () => {
    if (!couponCode || !discountValue) {
      return alert("Coupon code and discount value required");
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

    // Reset
    setCouponCode("");
    setDiscountType("percentage");
    setDiscountValue("");
    setIsPermanent(false);
    setExpiryDate("");
    setUsageLimit("");
    setIsActive(true);
  };

  // Fetch categories
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

  // Main field change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Pack change
  const handlePackChange = (index, field, value) => {
    const newPacks = [...formData.packs];
    newPacks[index][field] = value;
    setFormData({ ...formData, packs: newPacks });
  };

  const addPack = () => {
    setFormData({
      ...formData,
      packs: [...formData.packs, { name: "", price: "" }],
    });
  };

  const removePack = (index) => {
    const newPacks = formData.packs.filter((_, i) => i !== index);
    setFormData({ ...formData, packs: newPacks });
  };

  // Review change
  const handleReviewChange = (index, field, value) => {
    const newReviews = [...formData.reviews];
    newReviews[index][field] = value;
    setFormData({ ...formData, reviews: newReviews });
  };

  const addReview = () => {
    setFormData({
      ...formData,
      reviews: [
        ...formData.reviews,
        { name: "", rating: "", comment: "", images: [""] },
      ],
    });
  };

  const removeReview = (index) => {
    const newReviews = formData.reviews.filter((_, i) => i !== index);
    setFormData({ ...formData, reviews: newReviews });
  };

  // Image field handlers
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // Review image change
  const handleReviewImageChange = (reviewIndex, imageIndex, value) => {
    const newReviews = [...formData.reviews];
    newReviews[reviewIndex].images[imageIndex] = value;
    setFormData({ ...formData, reviews: newReviews });
  };

  const addReviewImage = (reviewIndex) => {
    const newReviews = [...formData.reviews];
    newReviews[reviewIndex].images.push("");
    setFormData({ ...formData, reviews: newReviews });
  };

  const removeReviewImage = (reviewIndex, imageIndex) => {
    const newReviews = [...formData.reviews];
    newReviews[reviewIndex].images = newReviews[reviewIndex].images.filter(
      (_, i) => i !== imageIndex
    );
    setFormData({ ...formData, reviews: newReviews });
  };

  // More about product image change
  const handleMoreAboutImageChange = (index, value) => {
    const newImages = [...formData.moreAboutProduct.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      moreAboutProduct: { ...formData.moreAboutProduct, images: newImages },
    });
  };

  const addMoreAboutImage = () => {
    setFormData({
      ...formData,
      moreAboutProduct: {
        ...formData.moreAboutProduct,
        images: [...formData.moreAboutProduct.images, ""],
      },
    });
  };

  const removeMoreAboutImage = (index) => {
    const newImages = formData.moreAboutProduct.images.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      moreAboutProduct: { ...formData.moreAboutProduct, images: newImages },
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      description: formData.description,
      keyBenefits: formData.keyBenefits
        ? formData.keyBenefits.split(",").map((k) => k.trim())
        : [],
      ingredients: formData.ingredients
        ? formData.ingredients.split(",").map((i) => i.trim())
        : [],
      quantity: formData.quantity,
      stockQuantity: formData.stockQuantity,
      stock: formData.stock,
      category: formData.category,
      images: formData.images.filter((img) => img),
      videoUrl: formData.videoUrl,
      cut_price: formData.cutPrice ? Number(formData.cutPrice) : null,
      current_price: formData.currentPrice
        ? Number(formData.currentPrice)
        : null,
      rating: formData.rating ? Number(formData.rating) : null,
      packs: formData.packs.filter((p) => p.name && p.price),
      reviews: formData.reviews
        .filter((r) => r.name && r.rating && r.comment)
        .map((r) => ({ ...r, images: r.images.filter((img) => img) })),
      moreAboutProduct: {
        ...formData.moreAboutProduct,
        images: formData.moreAboutProduct.images.filter((img) => img),
      },
      coupons: coupons,
    };

    try {
      await axios.post("/api/agarbatti/create", payload);
      alert("Agarbatti Created Successfully!");
      // Reset form
      setFormData({
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
      });
    } catch (err) {
      console.error(err);
      alert("Error creating agarbatti");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create New Agarbatti Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Fields */}
        {[
          {
            label: "Title",
            name: "title",
            placeholder: "Premium Sandalwood Agarbatti",
          },
          {
            label: "Description",
            name: "description",
            placeholder: "This sandalwood agarbatti gives calming fragrance...",
            type: "textarea",
          },
          {
            label: "Key Benefits (comma-separated)",
            name: "keyBenefits",
            placeholder: "Stress relief, Pleasant aroma, Long lasting",
          },
          {
            label: "Ingredients (comma-separated)",
            name: "ingredients",
            placeholder: "Sandalwood, Natural Oils, Charcoal",
          },
          {
            label: "Quantity",
            name: "quantity",
            placeholder: "e.g., 10 sticks",
          },
          {
            label: "Stock Quantity",
            name: "stockQuantity",
            placeholder: "100",
            type: "number",
          },
          {
            label: "Rating",
            name: "rating",
            placeholder: "1 to 5",
            type: "number",
          },

          {
            label: "Video URL",
            name: "videoUrl",
            placeholder: "https://youtube.com/xyz",
          },
          {
            label: "Cut Price",
            name: "cutPrice",
            placeholder: "e.g., 499",
            type: "number",
          },
          {
            label: "Current Price",
            name: "currentPrice",
            placeholder: "e.g., 299",
            type: "number",
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium mb-1">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full p-2 border rounded-lg h-24"
              />
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full p-2 border rounded-lg"
              />
            )}
          </div>
        ))}

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Select Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Images */}
        <div>
          <label className="block font-medium mb-2">Main Images</label>
          {formData.images.map((img, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Image URL (e.g., https://img1.jpg)"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 p-2 border rounded-lg"
              />
              {formData.images.length > 1 && (
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
            Add More
          </button>
        </div>
        {/* Cut Price */}

        {/* Packs */}
        <div>
          <label className="block font-medium mb-2">Packs</label>
          {formData.packs.map((pack, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Pack Name"
                value={pack.name}
                onChange={(e) =>
                  handlePackChange(index, "name", e.target.value)
                }
                className="flex-1 p-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Price"
                value={pack.price}
                onChange={(e) =>
                  handlePackChange(index, "price", e.target.value)
                }
                className="w-32 p-2 border rounded-lg"
              />
              {formData.packs.length > 1 && (
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

        {/* Reviews */}
        <div>
          <label className="block font-medium mb-2">Reviews</label>
          {formData.reviews.map((review, index) => (
            <div key={index} className="mb-2 border p-2 rounded-lg">
              <input
                type="text"
                placeholder="Reviewer Name"
                value={review.name}
                onChange={(e) =>
                  handleReviewChange(index, "name", e.target.value)
                }
                className="w-full p-2 border rounded-lg mb-1"
              />
              <input
                type="number"
                placeholder="Rating (1-5)"
                value={review.rating}
                onChange={(e) =>
                  handleReviewChange(index, "rating", e.target.value)
                }
                className="w-full p-2 border rounded-lg mb-1"
              />
              <textarea
                placeholder="Comment"
                value={review.comment}
                onChange={(e) =>
                  handleReviewChange(index, "comment", e.target.value)
                }
                className="w-full p-2 border rounded-lg mb-1"
              />
              {/* Review Images */}
              {review.images.map((img, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder="Image URL (e.g., https://img1.jpg)"
                    value={img}
                    onChange={(e) =>
                      handleReviewImageChange(index, i, e.target.value)
                    }
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

              {formData.reviews.length > 1 && (
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

        {/* More About Product */}
        <div>
          <label className="block font-medium mb-1">More About Product</label>
          <input
            type="text"
            placeholder="Name (e.g., Sandalwood Benefits)"
            value={formData.moreAboutProduct.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                moreAboutProduct: {
                  ...formData.moreAboutProduct,
                  name: e.target.value,
                },
              })
            }
            className="w-full p-2 border rounded-lg mb-1"
          />
          <textarea
            placeholder="Description"
            value={formData.moreAboutProduct.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                moreAboutProduct: {
                  ...formData.moreAboutProduct,
                  description: e.target.value,
                },
              })
            }
            className="w-full p-2 border rounded-lg mb-1"
          />
          {/* More About Images */}
          {formData.moreAboutProduct.images.map((img, index) => (
            <div key={index} className="flex gap-2 mb-1">
              <input
                type="text"
                placeholder="Image URL (e.g., https://img1.jpg)"
                value={img}
                onChange={(e) =>
                  handleMoreAboutImageChange(index, e.target.value)
                }
                className="flex-1 p-2 border rounded-lg"
              />
              {formData.moreAboutProduct.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMoreAboutImage(index)}
                  className="bg-red-500 text-white px-2 rounded-lg"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMoreAboutImage}
            className="bg-green-600 text-white px-4 py-1 rounded-lg"
          >
            Add More Images
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="stock"
            checked={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.checked })
            }
            className="w-5 h-5"
          />
          <label className="font-medium">In Stock</label>
        </div>
        {/* ---------------- COUPON ---------------- */}
        <div className="border p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Add Coupons</h3>

          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
          />

          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat Amount (₹)</option>
          </select>

          <input
            type="number"
            placeholder="Discount Value"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
          />

          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={isPermanent}
              onChange={(e) => setIsPermanent(e.target.checked)}
            />
            <label>Permanent Coupon (No Expiry)</label>
          </div>

          {!isPermanent && (
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
            />
          )}

          <input
            type="number"
            placeholder="Usage Limit (optional)"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
          />

          <button
            type="button"
            onClick={addCoupon}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Add Coupon
          </button>
        </div>
        {/* Show Added Coupons */}
        {coupons.length > 0 && (
          <div className="border p-4 rounded-lg mt-4">
            <h3 className="font-semibold mb-2">Added Coupons</h3>
            {coupons.map((c, i) => (
              <div key={i} className="p-2 border rounded mb-2 bg-gray-50">
                <p>
                  <strong>Code:</strong> {c.code}
                </p>
                <p>
                  <strong>Discount:</strong>{" "}
                  {c.discountType === "percentage"
                    ? `${c.discountValue}%`
                    : `₹${c.discountValue}`}
                </p>

                <p>
                  <strong>Expiry:</strong>{" "}
                  {c.isPermanent ? "Permanent" : c.expiryDate}
                </p>

                <p>
                  <strong>Usage Limit:</strong>{" "}
                  {c.usageLimit ? c.usageLimit : "Unlimited"}
                </p>
              </div>
            ))}
          </div>
        )}

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
