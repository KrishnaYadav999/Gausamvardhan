import React, { useState, useEffect } from "react";
import axios from "axios";

// -----------------------------------------------------
//                 PACKS COMPONENT
// -----------------------------------------------------
const Packs = ({ packs, setPacks }) => {
  const handlePackChange = (index, field, value) => {
    const newPacks = [...packs];
    newPacks[index][field] = value;
    setPacks(newPacks);
  };

  const addPack = () => setPacks([...packs, { name: "", price: "" }]);
  const removePack = (index) => setPacks(packs.filter((_, i) => i !== index));

  return (
    <div>
      <label className="block font-medium mb-2">Packs</label>
      {packs.map((pack, index) => (
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

          {/* Remove button */}
          {packs.length > 1 && (
            <button
              type="button"
              onClick={() => removePack(index)}
              className="bg-red-500 text-white px-3 rounded-lg"
            >
              X
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

// -----------------------------------------------------
//                 REVIEWS COMPONENT
// -----------------------------------------------------
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
    setReviews([
      ...reviews,
      { name: "", rating: "", comment: "", images: [""] },
    ]);

  const removeReview = (index) =>
    setReviews(reviews.filter((_, i) => i !== index));

  const addReviewImage = (reviewIndex) => {
    const newReviews = [...reviews];
    newReviews[reviewIndex].images.push("");
    setReviews(newReviews);
  };

  const removeReviewImage = (reviewIndex, imgIndex) => {
    const newReviews = [...reviews];
    newReviews[reviewIndex].images = newReviews[
      reviewIndex
    ].images.filter((_, i) => i !== imgIndex);
    setReviews(newReviews);
  };

  return (
    <div>
      <label className="block font-medium mb-2">Reviews</label>

      {reviews.map((review, index) => (
        <div key={index} className="mb-3 border p-3 rounded-lg">
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

          {review.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                type="text"
                value={img}
                onChange={(e) =>
                  handleReviewImageChange(index, i, e.target.value)
                }
                placeholder="Image URL"
                className="flex-1 p-2 border rounded-lg"
              />

              {review.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReviewImage(index, i)}
                  className="bg-red-500 text-white px-2 rounded-lg"
                >
                  X
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
              className="bg-red-500 text-white px-3 rounded-lg mt-1"
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

// -----------------------------------------------------
//           MORE ABOUT PRODUCT COMPONENT
// -----------------------------------------------------
const MoreAboutProduct = ({ moreAbout, setMoreAbout }) => {
  const handleChange = (field, value) =>
    setMoreAbout({ ...moreAbout, [field]: value });

  const handleImageChange = (index, value) => {
    const newImages = [...moreAbout.images];
    newImages[index] = value;
    setMoreAbout({ ...moreAbout, images: newImages });
  };

  const addImage = () =>
    setMoreAbout({
      ...moreAbout,
      images: [...moreAbout.images, ""],
    });

  const removeImage = (index) =>
    setMoreAbout({
      ...moreAbout,
      images: moreAbout.images.filter((_, i) => i !== index),
    });

  return (
    <div>
      <label className="block font-medium mb-1">More About Product</label>

      <input
        type="text"
        placeholder="Name"
        value={moreAbout.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="w-full p-2 border rounded-lg mb-1"
      />

      <textarea
        placeholder="Description"
        value={moreAbout.description}
        onChange={(e) =>
          handleChange("description", e.target.value)
        }
        className="w-full p-2 border rounded-lg mb-1"
      />

      {moreAbout.images.map((img, index) => (
        <div key={index} className="flex gap-2 mb-1">
          <input
            type="text"
            value={img}
            onChange={(e) => handleImageChange(index, e.target.value)}
            placeholder="Image URL"
            className="flex-1 p-2 border rounded-lg"
          />

          {moreAbout.images.length > 1 && (
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="bg-red-500 text-white px-2 rounded-lg"
            >
              X
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

// -----------------------------------------------------
//           MAIN COMPONENT (CREATE CUP PRODUCT)
// -----------------------------------------------------

export default function AdminCupCreate() {
  const [categories, setCategories] = useState([]);

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
      cut_price: "",
  current_price: "",
    packs: [{ name: "", price: "" }],
    reviews: [{ name: "", rating: "", comment: "", images: [""] }],
    moreAboutProduct: {
      name: "",
      description: "",
      images: [""],
    },
  });

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ------------------ MAIN IMAGES ------------------
  const handleMainImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addMainImage = () =>
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });

  const removeMainImage = (index) =>
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });

  // ------------------ SUBMIT FORM ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      keyBenefits:
        formData.keyBenefits
          ?.split(",")
          .map((k) => k.trim())
          .filter(Boolean) || [],
cut_price: formData.cut_price,
current_price: formData.current_price,
      ingredients:
        formData.ingredients
          ?.split(",")
          .map((i) => i.trim())
          .filter(Boolean) || [],

      images: formData.images.filter(Boolean),

      packs: formData.packs.filter((p) => p.name && p.price),

      reviews: formData.reviews
        .filter((r) => r.name && r.rating && r.comment)
        .map((r) => ({
          ...r,
          images: r.images.filter(Boolean),
        })),

      moreAboutProduct: {
        ...formData.moreAboutProduct,
        images: formData.moreAboutProduct.images.filter(Boolean),
      },
    };

    try {
      await axios.post("/api/cup/create", payload);
      alert("Cup Product Created Successfully!");

      // RESET FORM
      setFormData({
        title: "",
        description: "",
        keyBenefits: "",
        ingredients: "",
        quantity: "",
        stockQuantity: "",
        stock: true,
        category: "",
        cut_price: "",
current_price: "",
        images: [""],
        videoUrl: "",
        packs: [{ name: "", price: "" }],
        reviews: [{ name: "", rating: "", comment: "", images: [""] }],
        moreAboutProduct: {
          name: "",
          description: "",
          images: [""],
        },
      });
    } catch (err) {
      console.error(err);
      alert("Error creating Cup product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create New Cup Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* MAIN FIELDS */}
        {[
          {
            label: "Title",
            name: "title",
            placeholder: "Premium Cup Set - 6 pieces",
          },
          {
            label: "Description",
            name: "description",
            placeholder: "High quality Cup set...",
            type: "textarea",
          },
          {
            label: "Key Benefits (comma-separated)",
            name: "keyBenefits",
            placeholder: "Durable, Lightweight, Eco-friendly",
          },
          {
            label: "Ingredients (comma-separated)",
            name: "ingredients",
            placeholder: "Material, Coating, Color",
          },
          {
            label: "Quantity",
            name: "quantity",
            placeholder: "1 Set / Piece",
          },
          {
            label: "Stock Quantity",
            name: "stockQuantity",
            placeholder: "50",
            type: "number",
          },
          {
            label: "Video URL",
            name: "videoUrl",
            placeholder: "https://youtube.com/example",
          },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium mb-1">
              {field.label}
            </label>

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

        {/* CATEGORY */}
        <div>
          <label className="block font-medium mb-1">
            Select Category
          </label>
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

        {/* IMAGES */}
        <div>
          <label className="block font-medium mb-2">Main Images</label>
          {formData.images.map((img, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={img}
                onChange={(e) =>
                  handleMainImageChange(index, e.target.value)
                }
                placeholder="Image URL"
                className="flex-1 p-2 border rounded-lg"
              />

              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMainImage(index)}
                  className="bg-red-500 text-white px-2 rounded-lg"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addMainImage}
            className="bg-green-600 text-white px-4 py-1 rounded-lg"
          >
            Add More
          </button>
        </div>
{/* PRICING FIELDS */}
<div>
  <label className="block font-medium mb-1">Cut Price</label>
  <input
    type="number"
    name="cut_price"
    value={formData.cut_price}
    onChange={handleChange}
    placeholder="999"
    className="w-full p-2 border rounded-lg"
  />
</div>

<div>
  <label className="block font-medium mb-1">Current Price</label>
  <input
    type="number"
    name="current_price"
    value={formData.current_price}
    onChange={handleChange}
    placeholder="499"
    className="w-full p-2 border rounded-lg"
  />
</div>

        {/* Packs */}
        <Packs
          packs={formData.packs}
          setPacks={(packs) => setFormData({ ...formData, packs })}
        />

        {/* Reviews */}
        <Reviews
          reviews={formData.reviews}
          setReviews={(reviews) =>
            setFormData({ ...formData, reviews })
          }
        />

        {/* More About Product */}
        <MoreAboutProduct
          moreAbout={formData.moreAboutProduct}
          setMoreAbout={(moreAbout) =>
            setFormData({
              ...formData,
              moreAboutProduct: moreAbout,
            })
          }
        />

        {/* STOCK */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="stock"
            name="stock"
            checked={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.checked })
            }
            className="w-4 h-4"
          />
          <label htmlFor="stock" className="font-medium">
            In Stock
          </label>
        </div>

        {/* SUBMIT BUTTON */}
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
