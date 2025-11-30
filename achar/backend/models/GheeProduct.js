import mongoose from "mongoose";
import slugify from "slugify";

// ---------------- Review Schema ----------------
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // reviewer name
    rating: { type: Number, required: true, min: 1, max: 5 }, // ⭐ 1-5 rating
    comment: { type: String, required: true }, // feedback / review text
    images: [{ type: String }], // multiple review images
    createdAt: { type: Date, default: Date.now }, // auto date
  },
  { _id: false }
);

// ---------------- More About Product Schema ----------------
const moreAboutProductSchema = new mongoose.Schema(
  {
    image: { type: String },       // single image
    description: { type: String }, // description text
  },
  { _id: false }
);

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

    // max usage limit
    usageLimit: { type: Number, default: null },

    // how many used
    usedCount: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

// ---------------- Ghee Product Schema ----------------
const gheeProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    rating: { type: Number, default: 0 },
    cutPrice: { type: String },
    currentPrice: { type: String },
    weightVolume: { type: String },
    description: { type: String },
    specifications: { type: String },
    images: [{ type: String }],  // multiple images
    videos: [{ type: String }],  // optional videos
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Boolean, default: true },
    pricePerGram: { type: String },
 stockQuantity: { type: Number, default: 0 },
    // ✅ Reviews array
    reviews: [reviewSchema],
coupons: [couponSchema],
    // ✅ New Fields
    videoUrl: { type: String },                  // single video url
    moreAboutProduct: [moreAboutProductSchema],  // array of { image, description }
  },
  { timestamps: true }
);

// Auto-generate slug from title
gheeProductSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const GheeProduct = mongoose.model("GheeProduct", gheeProductSchema);
export default GheeProduct;
