import mongoose from "mongoose";

// ---------------- Review Schema ----------------
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ---------------- More About This Pack Schema ----------------
const moreAboutThisPackSchema = new mongoose.Schema({
  header: { type: String },
  description: { type: String },
  images: [{ type: String }],
});

// ---------------- More About Product Schema ----------------
const moreAboutProductSchema = new mongoose.Schema({
  image: { type: String }, // single image
  description: { type: String }, // description text
}, { _id: false }); // optional, no separate _id for each item

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true },

    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    discountValue: { type: Number, required: true },

    // expiry / permanent
    isPermanent: { type: Boolean, default: false },

    expiryDate: { type: Date, default: null },

    // coupon allowed for how many times (optional)
    usageLimit: { type: Number, default: null },

    // how many times users used already
    usedCount: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

// ---------------- Stock History Schema ----------------
const stockHistorySchema = new mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    note: { type: String }, // optional (Admin update, Order placed, etc.)
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ---------------- Product Schema ----------------
const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },

    tasteDescription: { type: String },
    cutPrice: { type: String },
    currentPrice: { type: String },
    buyMoreTogether: { type: String },
    weightOptions: { type: String },
    moreAboutPickle: { type: String },
    productImages: [{ type: String, required: true }],
    traditionalRecipes: { type: String },
    localIngredients: { type: String },
    driedNaturally: { type: String },
    moreAboutThisPack: moreAboutThisPackSchema,

    // ✅ New fields
    pricePerGram: { type: String },
    stock: { type: Boolean, default: true },

    stockQuantity: { type: Number, required: true, default: 0 },
// ✅ Shopify-style stock status
stockStatus: {
  type: String,
  enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
  default: "IN_STOCK",
},

// ✅ Last stock update date
lastStockUpdatedAt: {
  type: Date,
  default: Date.now,
},

// ✅ Date-wise stock tracking
stockHistory: [stockHistorySchema],

    // ✅ Reviews array
    reviews: [reviewSchema],

    // ✅ Video URL
    videoUrl: { type: String },

    // ✅ More About Product array
    moreAboutProduct: [moreAboutProductSchema],
 coupons: [couponSchema],
    // Relation with Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// ---------------- Methods for avg rating update ----------------
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numberOfReviews = 0;
  } else {
    const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = (total / this.reviews.length).toFixed(1);
    this.numberOfReviews = this.reviews.length;
  }
  return this.save();
};

productSchema.pre("save", function (next) {
  if (this.stockQuantity <= 0) {
    this.stockStatus = "OUT_OF_STOCK";
    this.stock = false;
  } else if (this.stockQuantity <= 5) {
    this.stockStatus = "LOW_STOCK";
    this.stock = true;
  } else {
    this.stockStatus = "IN_STOCK";
    this.stock = true;
  }

  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
