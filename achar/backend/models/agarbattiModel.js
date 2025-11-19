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

const agarbattiProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },

    // ⭐ AGARBATTI FIELDS
    description: { type: String, required: true },
    keyBenefits: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    quantity: { type: String, default: "" },

    // ✅ Updated to store multiple packs with name + price
    packs: { type: [packSchema], default: [] },

    // ⭐ OTHER PRODUCT FIELDS
    rating: { type: Number, default: 0 },
    cut_price: { type: String, default: null },
    current_price: { type: String, default: null },

    stock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 0 },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: { type: [String], default: [] },
    reviews: [reviewSchema],

    videoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-generate slug
agarbattiProductSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const AgarbattiProduct = mongoose.model(
  "AgarbattiProduct",
  agarbattiProductSchema
);

export default AgarbattiProduct;