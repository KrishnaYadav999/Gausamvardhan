import mongoose from "mongoose";
import slugify from "slugify";

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

// ---------------- Pack Schema ----------------
const packSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
  },
  { _id: false }
);

// ---------------- More About Product Schema ----------------
const moreAboutProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    description: { type: String, required: false },
    images: [{ type: String }],
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
    isPermanent: { type: Boolean, default: false },
    expiryDate: { type: Date, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const ganpatiProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },

    // ⭐ GANPATI PRODUCT FIELDS (same as agarbatti)
    description: { type: String, required: true },
    keyBenefits: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    quantity: { type: String, default: "" },

    // Packs array
    packs: { type: [packSchema], default: [] },

    rating: { type: Number, default: 0 },
    cut_price: { type: Number, default: 0 },
current_price: { type: Number, default: 0 },

    stock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: { type: [String], default: [] },
    reviews: [reviewSchema],
coupons: [couponSchema],
    videoUrl: { type: String, default: "" },

    // ⭐ NEW FIELD added
     moreAboutProduct: {
      type: moreAboutProductSchema,
      default: {},
    },
  },
  { timestamps: true }
);

ganpatiProductSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let newSlug = baseSlug;
    let counter = 1;

    while (await mongoose.models.GanpatiProduct.findOne({ slug: newSlug })) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = newSlug;
  }
  next();
});


const GanpatiProduct = mongoose.model(
  "GanpatiProduct",
  ganpatiProductSchema
);

export default GanpatiProduct;
