import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminGanpatiUpdateDelete() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultForm = {
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
    packs: [{ name: "", price: "" }],
    reviews: [{ name: "", rating: "", comment: "", images: [] }],
    moreAboutProduct: { name: "", description: "", images: [] },

    // ⭐ Coupon Fields ⭐
    couponTitle: "",
    couponDescription: "",
    couponDiscount: "",
    couponCode: "",
    couponExpiry: "",
  };

  const [formData, setFormData] = useState(defaultForm);

  // -------------------------------------------
  // LOAD PRODUCTS AND CATEGORIES
  // -------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const [prods, cats] = await Promise.all([
          axios.get("/api/ganpati/all"),
          axios.get("/api/categories"),
        ]);
console.log("Products API response:", prods.data); // 
        setProducts(prods.data);
        setCategories(cats.data);
      } catch (err) {
        console.log("ERROR LOADING DATA", err);
      }
      setLoading(false);
    };

    load();
  }, []);

  // -------------------------------------------
  // START EDIT — SHOW ALL EXISTING FIELDS + COUPON
  // -------------------------------------------
  const startEdit = (p) => {
    setEditingProduct(p);
const firstCoupon = p.coupons?.[0] || {};
    setFormData({
      title: p.title || "",
      description: p.description || "",
      keyBenefits: p.keyBenefits?.join(", ") || "",
      ingredients: p.ingredients?.join(", ") || "",
      quantity: p.quantity || "",
      stockQuantity: p.stockQuantity || "",
      stock: p.stock ?? true,
      category: p.category?._id || "",
      images: p.images || [],
      videoUrl: p.videoUrl || "",
      packs: p.packs?.length ? p.packs : [{ name: "", price: "" }],

      reviews: p.reviews?.length
        ? p.reviews.map((r) => ({
            name: r.name || "",
            rating: r.rating || "",
            comment: r.comment || "",
            images: r.images || [],
          }))
        : [{ name: "", rating: "", comment: "", images: [] }],

      moreAboutProduct: {
        name: p.moreAboutProduct?.name || "",
        description: p.moreAboutProduct?.description || "",
        images: p.moreAboutProduct?.images || [],
      },

      // ⭐ Existing coupon load ⭐
      couponTitle: firstCoupon.title || "",
  couponDescription: firstCoupon.description || "",
  couponDiscount: firstCoupon.discountValue || "",
  couponCode: firstCoupon.code || "",
  couponExpiry: firstCoupon.expiryDate
    ? new Date(firstCoupon.expiryDate).toISOString().split("T")[0]
    : "",
    });
  };

  // BASIC INPUT
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // PACK HANDLERS
  const handlePackChange = (i, f, v) => {
    const arr = [...formData.packs];
    arr[i][f] = v;
    setFormData({ ...formData, packs: arr });
  };

  const addPack = () =>
    setFormData({
      ...formData,
      packs: [...formData.packs, { name: "", price: "" }],
    });

  const removePack = (i) =>
    setFormData({
      ...formData,
      packs: formData.packs.filter((_, x) => x !== i),
    });

  // IMAGE HANDLERS
  const handleImageChange = (i, v) => {
    const arr = [...formData.images];
    arr[i] = v;
    setFormData({ ...formData, images: arr });
  };

  const addImage = () =>
    setFormData({ ...formData, images: [...formData.images, ""] });

  const removeImage = (i) =>
    setFormData({
      ...formData,
      images: formData.images.filter((_, x) => x !== i),
    });

  // REVIEWS
  const handleReviewChange = (i, f, v) => {
    const arr = [...formData.reviews];
    arr[i][f] = v;
    setFormData({ ...formData, reviews: arr });
  };

  const addReview = () =>
    setFormData({
      ...formData,
      reviews: [
        ...formData.reviews,
        { name: "", rating: "", comment: "", images: [] },
      ],
    });

  const removeReview = (i) =>
    setFormData({
      ...formData,
      reviews: formData.reviews.filter((_, x) => x !== i),
    });

  // REVIEW IMAGES
  const handleReviewImageChange = (r, img, v) => {
    const arr = [...formData.reviews];
    arr[r].images[img] = v;
    setFormData({ ...formData, reviews: arr });
  };

  const addReviewImage = (r) => {
    const arr = [...formData.reviews];
    arr[r].images.push("");
    setFormData({ ...formData, reviews: arr });
  };

  const removeReviewImage = (r, img) => {
    const arr = [...formData.reviews];
    arr[r].images = arr[r].images.filter((_, x) => x !== img);
    setFormData({ ...formData, reviews: arr });
  };

  // MORE ABOUT PRODUCT
  const handleMoreAboutImageChange = (i, v) => {
    const arr = [...formData.moreAboutProduct.images];
    arr[i] = v;

    setFormData({
      ...formData,
      moreAboutProduct: { ...formData.moreAboutProduct, images: arr },
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

  const removeMoreAboutImage = (i) =>
    setFormData({
      ...formData,
      moreAboutProduct: {
        ...formData.moreAboutProduct,
        images: formData.moreAboutProduct.images.filter((_, x) => x !== i),
      },
    });

  // -----------------------------------------
  // UPDATE API
  // -----------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingProduct) return alert("Select a product!");

    const payload = {
      ...formData,

      keyBenefits: formData.keyBenefits
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),

      ingredients: formData.ingredients
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),

      images: formData.images.filter((x) => x.trim() !== ""),

      packs: formData.packs.filter((p) => p.name && p.price),

      reviews: formData.reviews.map((r) => ({
        ...r,
        images: r.images.filter((x) => x.trim() !== ""),
      })),
 coupons: formData.couponCode
    ? [
        {
          code: formData.couponCode,
          discountType: "flat",
          discountValue: Number(formData.couponDiscount),
          title: formData.couponTitle,
          description: formData.couponDescription,
          expiryDate: formData.couponExpiry,
          isPermanent: false,
        },
      ]
    : [],
      moreAboutProduct: {
        name: formData.moreAboutProduct.name,
        description: formData.moreAboutProduct.description,
        images: formData.moreAboutProduct.images.filter(
          (x) => x.trim() !== ""
        ),
      },
      
    };

    try {
      await axios.put(`/api/ganpati/${editingProduct._id}`, payload);

      alert("Product Updated Successfully!");

      const updated = await axios.get("/api/ganpati/all");
      setProducts(updated.data);
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  // -----------------------------------------
  // DELETE PRODUCT
  // -----------------------------------------
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`/api/ganpati/${id}`);
      alert("Deleted!");

      setProducts(products.filter((p) => p._id !== id));

      if (editingProduct?._id === id) {
        setEditingProduct(null);
        setFormData(defaultForm);
      }
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex gap-6 p-6">
      {/* LEFT LIST */}
      <div className="w-1/3 bg-white p-4 rounded-xl shadow border">
        <h2 className="text-xl font-bold mb-3">All Ganpati Products</h2>

        {products.map((p) => (
          <div
            key={p._id}
            onClick={() => startEdit(p)}
            className={`p-3 border rounded-lg mb-2 cursor-pointer ${
              editingProduct?._id === p._id ? "bg-blue-100" : "bg-gray-50"
            }`}
          >
            <p className="font-bold">{p.title}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteProduct(p._id);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT FORM */}
      <div className="w-2/3">
        {!editingProduct ? (
          <p className="text-lg font-semibold text-gray-600">
            Select product to edit
          </p>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="space-y-4 bg-white p-6 rounded-xl shadow border"
          >
            <h2 className="text-2xl font-bold mb-4">Update Ganpati Product</h2>

            {/* BASIC FIELDS */}
            {[
              { label: "Title", name: "title" },
              { label: "Description", name: "description", type: "textarea" },
              { label: "Key Benefits", name: "keyBenefits" },
              { label: "Ingredients", name: "ingredients" },
              { label: "Quantity", name: "quantity" },
              { label: "Stock Quantity", name: "stockQuantity", type: "number" },
              { label: "Video URL", name: "videoUrl" },
            ].map((f) => (
              <div key={f.name}>
                <label className="font-medium">{f.label}</label>

                {f.type === "textarea" ? (
                  <textarea
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg h-24"
                  />
                ) : (
                  <input
                    type={f.type || "text"}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                )}
              </div>
            ))}

            {/* ⭐ COUPON DETAILS ⭐ */}
            <h3 className="text-lg font-bold mt-4">Coupon Details</h3>

         


            <input
              type="number"
              name="couponDiscount"
              value={formData.couponDiscount}
              onChange={handleChange}
              placeholder="Discount %"
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="text"
              name="couponCode"
              value={formData.couponCode}
              onChange={handleChange}
              placeholder="Coupon Code"
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="date"
              name="couponExpiry"
              value={formData.couponExpiry}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />

            {/* CATEGORY */}
            <div>
              <label className="font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">-- Select --</option>

                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* IMAGES */}
            <div>
              <label className="font-medium">Main Images</label>

              {formData.images.map((img, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={img}
                    onChange={(e) => handleImageChange(i, e.target.value)}
                    className="flex-1 p-2 border rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="bg-red-500 text-white px-2 rounded-lg"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addImage}
                className="bg-green-600 text-white px-3 py-1 rounded-lg"
              >
                Add Image
              </button>
            </div>

            {/* PACKS */}
            <div>
              <label className="font-medium">Packs</label>

              {formData.packs.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={p.name}
                    onChange={(e) => handlePackChange(i, "name", e.target.value)}
                    placeholder="Name"
                    className="p-2 border rounded-lg flex-1"
                  />

                  <input
                    value={p.price}
                    onChange={(e) =>
                      handlePackChange(i, "price", e.target.value)
                    }
                    placeholder="Price"
                    type="number"
                    className="p-2 border rounded-lg w-32"
                  />

                  <button
                    type="button"
                    onClick={() => removePack(i)}
                    className="bg-red-500 text-white px-2 rounded-lg"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addPack}
                className="bg-green-600 text-white px-3 py-1 rounded-lg"
              >
                Add Pack
              </button>
            </div>

            {/* REVIEWS */}
            <div>
              <label className="font-medium">Reviews</label>

              {formData.reviews.map((r, i) => (
                <div key={i} className="border p-2 rounded-lg mb-3">
                  <input
                    value={r.name}
                    onChange={(e) =>
                      handleReviewChange(i, "name", e.target.value)
                    }
                    placeholder="Name"
                    className="w-full p-2 border rounded-lg mb-1"
                  />

                  <input
                    value={r.rating}
                    onChange={(e) =>
                      handleReviewChange(i, "rating", e.target.value)
                    }
                    placeholder="Rating"
                    type="number"
                    className="w-full p-2 border rounded-lg mb-1"
                  />

                  <textarea
                    value={r.comment}
                    onChange={(e) =>
                      handleReviewChange(i, "comment", e.target.value)
                    }
                    placeholder="Comment"
                    className="w-full p-2 border rounded-lg mb-1"
                  />

                  {r.images.map((img, imgI) => (
                    <div key={imgI} className="flex gap-2 mb-1">
                      <input
                        value={img}
                        onChange={(e) =>
                          handleReviewImageChange(i, imgI, e.target.value)
                        }
                        className="flex-1 p-2 border rounded-lg"
                      />

                      <button
                        type="button"
                        onClick={() => removeReviewImage(i, imgI)}
                        className="bg-red-500 text-white px-2 rounded-lg"
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addReviewImage(i)}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg"
                  >
                    Add Image
                  </button>

                  <button
                    type="button"
                    onClick={() => removeReview(i)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg mt-2"
                  >
                    Remove Review
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addReview}
                className="bg-green-600 text-white px-3 py-1 rounded-lg"
              >
                Add Review
              </button>
            </div>

            {/* MORE ABOUT PRODUCT */}
            <div>
              <label className="font-medium">More About Product</label>

              <input
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
                placeholder="Name"
                className="w-full p-2 border rounded-lg mb-1"
              />

              <textarea
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
                placeholder="Description"
                className="w-full p-2 border rounded-lg mb-2"
              />

              {formData.moreAboutProduct.images.map((img, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    value={img}
                    onChange={(e) =>
                      handleMoreAboutImageChange(i, e.target.value)
                    }
                    className="flex-1 p-2 border rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => removeMoreAboutImage(i)}
                    className="bg-red-500 text-white px-2 rounded-lg"
                  >
                    X
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addMoreAboutImage}
                className="bg-green-600 text-white px-3 py-1 rounded-lg"
              >
                Add Image
              </button>
            </div>

            {/* STOCK */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <label className="font-medium">In Stock</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg font-semibold"
            >
              Update Product
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
