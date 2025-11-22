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
// ---------------- More About Product Schema ----------------
const moreAboutProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, default: [] }], 
  },
  { _id: false }
);


// ---------------- Cup Product Schema ----------------
const cupProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },

    description: { type: String, required: true },
    keyBenefits: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    quantity: { type: String, default: "" },

    packs: { type: [packSchema], default: [] },

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

    // ⭐ NEW FIELD
    moreAboutProduct: moreAboutProductSchema,
  },
  { timestamps: true }
);

// Auto-generate slug
cupProductSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const CupProduct = mongoose.model("CupProduct", cupProductSchema);

export default CupProduct;
