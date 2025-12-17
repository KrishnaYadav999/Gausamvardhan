import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminGetDeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");

  // Full product form including all schema fields
  const [editForm, setEditForm] = useState({
    productName: "",
    rating: 0,
    numberOfReviews: 0,
    tasteDescription: "",
    cutPrice: "",
    currentPrice: "",
    buyMoreTogether: "",
    weightOptions: "",
    moreAboutPickle: "",
    productImages: [],
    traditionalRecipes: "",
    localIngredients: "",
    driedNaturally: "",
    pricePerGram: "",
    stock: true,
    stockQuantity: 0,
    category: "",
    videoUrl: "",
    moreAboutThisPack: { header: "", description: "", images: [] },
    reviews: [],
    moreAboutProduct: [],
    coupons: [], 
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("❌ Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      alert("✅ Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Failed to delete product");
    }
  };

  // Start editing
  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      productName: product.productName || "",
      rating: product.rating || 0,
      numberOfReviews: product.numberOfReviews || 0,
      tasteDescription: product.tasteDescription || "",
      cutPrice: product.cutPrice || "",
      currentPrice: product.currentPrice || "",
      buyMoreTogether: product.buyMoreTogether || "",
      weightOptions: product.weightOptions || "",
      moreAboutPickle: product.moreAboutPickle || "",
      productImages: product.productImages || [],
      traditionalRecipes: product.traditionalRecipes || "",
      localIngredients: product.localIngredients || "",
      driedNaturally: product.driedNaturally || "",
      pricePerGram: product.pricePerGram || "",
      stock: product.stock ?? true,
      stockQuantity: product.stockQuantity || 0,
      category: product.category?._id || "",
      videoUrl: product.videoUrl || "",
      moreAboutThisPack: {
        header: product.moreAboutThisPack?.header || "",
        description: product.moreAboutThisPack?.description || "",
        images: product.moreAboutThisPack?.images || [],
      },
      reviews: product.reviews || [],
      moreAboutProduct: product.moreAboutProduct || [],
       coupons: product.coupons || [],
    });
  };

  // Handle form changes
  const handleChange = (e, nestedField = null, index = null) => {
    const { name, value, type, checked } = e.target;

    if (nestedField === "moreAboutThisPack") {
      setEditForm({
        ...editForm,
        moreAboutThisPack: {
          ...editForm.moreAboutThisPack,
          [name]: value,
        },
      });
    } else if (nestedField === "reviews" && index !== null) {
      const updatedReviews = [...editForm.reviews];
      updatedReviews[index] = { ...updatedReviews[index], [name]: value };
      setEditForm({ ...editForm, reviews: updatedReviews });
    } else if (nestedField === "moreAboutProduct" && index !== null) {
      const updatedMoreAbout = [...editForm.moreAboutProduct];
      updatedMoreAbout[index] = { ...updatedMoreAbout[index], [name]: value };
      setEditForm({ ...editForm, moreAboutProduct: updatedMoreAbout });
    } else {
      setEditForm({
        ...editForm,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // ProductImages input (comma-separated)
  const handleProductImagesChange = (e) => {
    const urls = e.target.value.split(",").map((url) => url.trim());
    setEditForm({ ...editForm, productImages: urls });
  };

  // Add/Remove Review
  const addReview = () => {
    setEditForm({
      ...editForm,
      reviews: [...editForm.reviews, { name: "", rating: 0, comment: "", images: [] }],
    });
  };
  const removeReview = (index) => {
    const updated = [...editForm.reviews];
    updated.splice(index, 1);
    setEditForm({ ...editForm, reviews: updated });
  };

  // Add/Remove MoreAboutProduct
  const addMoreAboutProduct = () => {
    setEditForm({
      ...editForm,
      moreAboutProduct: [...editForm.moreAboutProduct, { image: "", description: "" }],
    });
  };
  const removeMoreAboutProduct = (index) => {
    const updated = [...editForm.moreAboutProduct];
    updated.splice(index, 1);
    setEditForm({ ...editForm, moreAboutProduct: updated });
  };

  const addCoupon = () => {
    setEditForm({
      ...editForm,
      coupons: [
        ...editForm.coupons,
        {
          code: "",
          discountType: "percentage",
          discountValue: 0,
          isPermanent: false,
          expiryDate: "",
          usageLimit: "",
          isActive: true,
        },
      ],
    });
  };

  const removeCoupon = (idx) => {
    const newCoupons = [...editForm.coupons];
    newCoupons.splice(idx, 1);
    setEditForm({ ...editForm, coupons: newCoupons });
  };
  // Save update
  const handleUpdate = async (id) => {
    try {
      await axios.put(`/api/products/${id}`, editForm);
      alert("✅ Product updated successfully");
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("❌ Failed to update product");
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      {/* Search Bar */}
      <div className="mb-4">
        
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <ul className="space-y-3">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <li key={product._id} className="border p-3 rounded-lg bg-gray-50">
              {editingProduct === product._id ? (
                <div className="space-y-2">
                  {/* Basic Fields */}
                  <input
                    type="text"
                    name="productName"
                    placeholder="Product Name"
                    value={editForm.productName}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="number"
                    name="rating"
                    placeholder="Rating"
                    value={editForm.rating}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="number"
                    name="numberOfReviews"
                    placeholder="Number of Reviews"
                    value={editForm.numberOfReviews}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="number"
                    name="stockQuantity"
                    placeholder="Stock Quantity"
                    value={editForm.stockQuantity}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <label className="flex items-center gap-2 mt-2">
  <input
    type="checkbox"
    name="stock"
    checked={editForm.stock}
    onChange={handleChange}
  />
  In Stock
</label>
                  <textarea
                    name="tasteDescription"
                    placeholder="Taste Description"
                    value={editForm.tasteDescription}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="text"
                    name="cutPrice"
                    placeholder="Cut Price"
                    value={editForm.cutPrice}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="text"
                    name="currentPrice"
                    placeholder="Current Price"
                    value={editForm.currentPrice}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="text"
                    name="buyMoreTogether"
                    placeholder="Buy More Together"
                    value={editForm.buyMoreTogether}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="text"
                    name="weightOptions"
                    placeholder="Weight Options"
                    value={editForm.weightOptions}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <input
                    type="text"
                    name="moreAboutPickle"
                    placeholder="More About Pickle"
                    value={editForm.moreAboutPickle}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />
<h3 className="font-semibold mt-3">Product Images</h3>
                  {/* Product Images */}
                 {editForm.productImages.map((img, idx) => (
  <div key={idx} className="flex gap-2 items-center mb-2">
    <input
      type="text"
      value={img}
      onChange={(e) => {
        const updated = [...editForm.productImages];
        updated[idx] = e.target.value;
        setEditForm({ ...editForm, productImages: updated });
      }}
      placeholder="Image URL"
      className="border px-2 py-1 rounded w-full"
    />
    <button
      onClick={() => {
        const updated = [...editForm.productImages];
        updated.splice(idx, 1);
        setEditForm({ ...editForm, productImages: updated });
      }}
      className="bg-red-500 text-white px-2 py-1 rounded"
    >
      ❌
    </button>
  </div>
))}

<button
  onClick={() =>
    setEditForm({
      ...editForm,
      productImages: [...editForm.productImages, ""],
    })
  }
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  + Add Image
</button>
                  {/* Video URL */}
                  <input
                    type="text"
                    name="videoUrl"
                    placeholder="Video URL"
                    value={editForm.videoUrl}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />

                  <input
                    type="text"
                    name="driedNaturally"
                    placeholder="Dried Naturally"
                    value={editForm.driedNaturally}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />

                  <input
                    type="text"
                    name="pricePerGram"
                    placeholder="Price Per Gram"
                    value={editForm.pricePerGram}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded w-full"
                  />

                  {/* More About This Pack */}
                  <h3 className="font-semibold mt-3">More About This Pack</h3>
                  <input
                    type="text"
                    name="header"
                    placeholder="Header"
                    value={editForm.moreAboutThisPack.header}
                    onChange={(e) => handleChange(e, "moreAboutThisPack")}
                    className="border px-2 py-1 rounded w-full"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={editForm.moreAboutThisPack.description}
                    onChange={(e) => handleChange(e, "moreAboutThisPack")}
                    className="border px-2 py-1 rounded w-full"
                  />
                 <h4 className="font-medium mt-2">More About Pack Images</h4>

{editForm.moreAboutThisPack.images.map((img, idx) => (
  <div key={idx} className="flex gap-2 mb-2">
    <input
      type="text"
      value={img}
      onChange={(e) => {
        const updated = [...editForm.moreAboutThisPack.images];
        updated[idx] = e.target.value;
        setEditForm({
          ...editForm,
          moreAboutThisPack: {
            ...editForm.moreAboutThisPack,
            images: updated,
          },
        });
      }}
      className="border px-2 py-1 rounded w-full"
      placeholder="Image URL"
    />
    <button
      onClick={() => {
        const updated = [...editForm.moreAboutThisPack.images];
        updated.splice(idx, 1);
        setEditForm({
          ...editForm,
          moreAboutThisPack: {
            ...editForm.moreAboutThisPack,
            images: updated,
          },
        });
      }}
      className="bg-red-500 text-white px-2 rounded"
    >
      ❌
    </button>
  </div>
))}

<button
  onClick={() =>
    setEditForm({
      ...editForm,
      moreAboutThisPack: {
        ...editForm.moreAboutThisPack,
        images: [...editForm.moreAboutThisPack.images, ""],
      },
    })
  }
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  + Add Image
</button>


                  {/* More About Product */}
                  <h3 className="font-semibold mt-3">More About Product</h3>
                  {editForm.moreAboutProduct.map((item, index) => (
                    <div key={index} className="border p-2 rounded mb-2">
                      <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={item.image}
                        onChange={(e) => handleChange(e, "moreAboutProduct", index)}
                        className="border px-2 py-1 rounded w-full mb-1"
                      />
                      <textarea
                        name="description"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleChange(e, "moreAboutProduct", index)}
                        className="border px-2 py-1 rounded w-full mb-1"
                      />
                      <button
                        onClick={() => removeMoreAboutProduct(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addMoreAboutProduct}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    + Add More
                  </button>
{/* ------------------ COUPONS SECTION ------------------ */}
<h3 className="font-semibold mt-3 text-lg">Coupons</h3>

{editForm.coupons.map((coupon, idx) => (
  <div key={idx} className="border p-3 rounded mb-3 bg-white shadow-sm">

    <input
      type="text"
      name="code"
      placeholder="Coupon Code"
      value={coupon.code}
      onChange={(e) => {
        const updated = [...editForm.coupons];
        updated[idx].code = e.target.value;
        setEditForm({ ...editForm, coupons: updated });
      }}
      className="border px-2 py-1 rounded w-full mb-2"
    />

    <select
      name="discountType"
      value={coupon.discountType}
      onChange={(e) => {
        const updated = [...editForm.coupons];
        updated[idx].discountType = e.target.value;
        setEditForm({ ...editForm, coupons: updated });
      }}
      className="border px-2 py-1 rounded w-full mb-2"
    >
      <option value="percentage">Percentage (%)</option>
      <option value="flat">Flat (₹)</option>
    </select>

    <input
      type="number"
      name="discountValue"
      placeholder="Discount Value"
      value={coupon.discountValue}
      onChange={(e) => {
        const updated = [...editForm.coupons];
        updated[idx].discountValue = e.target.value;
        setEditForm({ ...editForm, coupons: updated });
      }}
      className="border px-2 py-1 rounded w-full mb-2"
    />

    {/* Permanent or Expiry? */}
    <label className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={coupon.isPermanent}
        onChange={() => {
          const updated = [...editForm.coupons];
          updated[idx].isPermanent = !updated[idx].isPermanent;
          setEditForm({ ...editForm, coupons: updated });
        }}
      />
      Permanent Coupon (No Expiry)
    </label>

    {!coupon.isPermanent && (
      <input
        type="date"
        name="expiryDate"
        value={coupon.expiryDate}
        onChange={(e) => {
          const updated = [...editForm.coupons];
          updated[idx].expiryDate = e.target.value;
          setEditForm({ ...editForm, coupons: updated });
        }}
        className="border px-2 py-1 rounded w-full mb-2"
      />
    )}

    <input
      type="number"
      name="usageLimit"
      placeholder="Usage Limit"
      value={coupon.usageLimit}
      onChange={(e) => {
        const updated = [...editForm.coupons];
        updated[idx].usageLimit = e.target.value;
        setEditForm({ ...editForm, coupons: updated });
      }}
      className="border px-2 py-1 rounded w-full mb-2"
    />

    <label className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={coupon.isActive}
        onChange={() => {
          const updated = [...editForm.coupons];
          updated[idx].isActive = !updated[idx].isActive;
          setEditForm({ ...editForm, coupons: updated });
        }}
      />
      Active Coupon
    </label>

    {/* Remove Button */}
    <button
      onClick={() => removeCoupon(idx)}
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
    >
      Remove Coupon
    </button>
  </div>
))}

{/* Add New Coupon Button */}
<button
  onClick={addCoupon}
  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
>
  + Add New Coupon
</button>
{/* ----------------------------------------------------- */}

                  {/* Reviews */}
                  <h3 className="font-semibold mt-3">Reviews</h3>
                  {editForm.reviews.map((review, index) => (
                    <div key={index} className="border p-2 rounded mb-2">
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={review.name}
                        onChange={(e) => handleChange(e, "reviews", index)}
                        className="border px-2 py-1 rounded w-full mb-1"
                      />
                      <input
                        type="number"
                        name="rating"
                        placeholder="Rating"
                        value={review.rating}
                        onChange={(e) => handleChange(e, "reviews", index)}
                        className="border px-2 py-1 rounded w-full mb-1"
                      />
                      <textarea
                        name="comment"
                        placeholder="Comment"
                        value={review.comment}
                        onChange={(e) => handleChange(e, "reviews", index)}
                        className="border px-2 py-1 rounded w-full mb-1"
                      />
                      <button
                        onClick={() => removeReview(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Remove Review
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addReview}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    + Add Review
                  </button>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleUpdate(product._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="font-semibold">{product.productName}</h4>
                    <p className="text-sm text-gray-600">Category: {product.category?.name || "N/A"}</p>
                    <p className="text-sm text-gray-600">Price: ₹{product.currentPrice}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.stock ? "✅ Available" : "❌ Out of Stock"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  
                </>
              )}
            </li>
          ))}
          {filteredProducts.length > visibleCount && (
            <div className="text-center mt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 30)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                See More
              </button>
            </div>
          )}
          
        </ul>
      )}
    </div>
  );
};

export default AdminGetDeleteProduct;
