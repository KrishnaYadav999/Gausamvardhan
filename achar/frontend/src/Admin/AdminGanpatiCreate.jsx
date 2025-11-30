import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminGanpatiCreate() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    keyBenefits: "",
    ingredients: "",
    quantity: "",
    stockQuantity: "",
    stock: true,
    rating: "", 
    category: "",
    images: [], // FIXED: no blank default
    videoUrl: "",
 cut_price: "",
        current_price: "",
    packs: [{ name: "", price: "" }],
    reviews: [{ name: "", rating: "", comment: "", images: [] }], // FIXED
    moreAboutProduct: { name: "", description: "", images: [] }, // FIXED
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

  // Reset the form fields
  setCouponCode("");
  setDiscountType("percentage");
  setDiscountValue("");
  setIsPermanent(false);
  setExpiryDate("");
  setUsageLimit("");
  setIsActive(true);
};



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

  // ---------------- Handlers ----------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

  // ---------------- Review Handlers ----------------
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
        { name: "", rating: "", comment: "", images: [] },
      ],
    });

  const removeReview = (index) =>
    setFormData({
      ...formData,
      reviews: formData.reviews.filter((_, i) => i !== index),
    });

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

  // ---------------- More About Product ----------------
  const handleMoreAboutImageChange = (index, value) => {
    const newImages = [...formData.moreAboutProduct.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      moreAboutProduct: {
        ...formData.moreAboutProduct,
        images: newImages,
      },
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
        images: formData.moreAboutProduct.images.filter(
          (_, i) => i !== index
        ),
      },
    });

  // ---------------- Submit Form ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
       rating: formData.rating ? Number(formData.rating) : 0,
      keyBenefits: formData.keyBenefits
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k),
 cutPrice: Number(formData.cut_price) || 0,
  currentPrice: Number(formData.current_price) || 0,
  ingredients: formData.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i),
      images: formData.images.filter((i) => i.trim() !== ""),
      packs: formData.packs.filter((p) => p.name && p.price),
      reviews: formData.reviews.map((r) => ({
        ...r,
        images: r.images.filter((img) => img.trim() !== ""),
      })),
      moreAboutProduct: {
        name: formData.moreAboutProduct.name,
        description: formData.moreAboutProduct.description,
        images: formData.moreAboutProduct.images.filter(
          (i) => i.trim() !== ""
        ), // FIXED GOOD FILTER
        
      },
          coupons: coupons.length > 0 ? coupons : null,
    };

    try {
      await axios.post("/api/ganpati/create", payload);
      alert("Ganpati Product Created Successfully!");

      // RESET FIXED STATE
      setFormData({
        title: "",
        description: "",
        keyBenefits: "",
        ingredients: "",
        quantity: "",
        stockQuantity: "",
        stock: true,
        category: "",
        images: [],
        videoUrl: "",
        cut_price: "",
current_price: "",
        packs: [{ name: "", price: "" }],
        reviews: [{ name: "", rating: "", comment: "", images: [] }],
        moreAboutProduct: { name: "", description: "", images: [] },
      });
    } catch (err) {
      console.error(err);
      alert("Error creating Ganpati product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create New Ganpati Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* BASIC FIELDS */}
        {[
          {
            label: "Title",
            name: "title",
            placeholder: "Ganpati Idol - 12 inch",
          },
          {
            label: "Description",
            name: "description",
            placeholder: "Eco-friendly Ganpati idol...",
            type: "textarea",
          },
          {
            label: "Key Benefits (comma-separated)",
            name: "keyBenefits",
            placeholder: "Eco-friendly, Handcrafted",
          },
          {
            label: "Ingredients (comma-separated)",
            name: "ingredients",
            placeholder: "Clay, Color, Decoration",
          },
          {
            label: "Quantity",
            name: "quantity",
            placeholder: "e.g., 1 piece",
          },
          {
            label: "Stock Quantity",
            name: "stockQuantity",
            placeholder: "100",
            type: "number",
          },
          {
            label: "Video URL",
            name: "videoUrl",
            placeholder: "https://youtube.com/xyz",
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
{/* PRODUCT RATING */}
<div>
  <label className="block font-medium mb-1">Rating (1 - 5)</label>
  <input
    type="number"
    name="rating"
    value={formData.rating}
    onChange={handleChange}
    placeholder="4.5"
    min="1"
    max="5"
    step="0.1"
    className="w-full p-2 border rounded-lg"
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
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* MAIN IMAGES */}
        <div>
          <label className="block font-medium mb-2">Main Images</label>

          {formData.images.map((img, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={img}
                onChange={(e) =>
                  handleImageChange(index, e.target.value)
                }
                placeholder="Image URL"
                className="flex-1 p-2 border rounded-lg"
              />
              {formData.images.length > 0 && (
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
{/* PRICE FIELDS */}
<input
  type="number"
  name="cut_price"
  value={formData.cut_price}
  onChange={(e) =>
    setFormData({ ...formData, cut_price: Number(e.target.value) })
  }
  placeholder="999"
  className="w-full p-2 border rounded-lg"
/>

<input
  type="number"
  name="current_price"
  value={formData.current_price}
  onChange={(e) =>
    setFormData({ ...formData, current_price: Number(e.target.value) })
  }
  placeholder="799"
  className="w-full p-2 border rounded-lg"
/>


        {/* PACKS */}
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

        {/* REVIEWS */}
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

              {review.images.map((img, imgIndex) => (
                <div key={imgIndex} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={img}
                    onChange={(e) =>
                      handleReviewImageChange(
                        index,
                        imgIndex,
                        e.target.value
                      )
                    }
                    className="flex-1 p-2 border rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeReviewImage(index, imgIndex)
                    }
                    className="bg-red-500 text-white px-2 rounded-lg"
                  >
                    Remove
                  </button>
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

        {/* MORE ABOUT PRODUCT */}
        <div>
          <label className="block font-medium mb-1">
            More About Product
          </label>

          <input
            type="text"
            placeholder="Name"
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

          {formData.moreAboutProduct.images.map((img, index) => (
            <div key={index} className="flex gap-2 mb-1">
              <input
                type="text"
                placeholder="Image URL"
                value={img}
                onChange={(e) =>
                  handleMoreAboutImageChange(index, e.target.value)
                }
                className="flex-1 p-2 border rounded-lg"
              />

              <button
                type="button"
                onClick={() => removeMoreAboutImage(index)}
                className="bg-red-500 text-white px-2 rounded-lg"
              >
                Remove
              </button>
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

        {/* STOCK */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="stock"
            name="stock"
            checked={formData.stock}
            onChange={(e) =>
              setFormData({
                ...formData,
                stock: e.target.checked,
              })
            }
            className="w-4 h-4"
          />
          <label htmlFor="stock" className="font-medium">
            In Stock
          </label>
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
