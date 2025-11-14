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
  { _id: false } // optional
);

// ---------------- More About Product Schema ----------------
const moreAboutProductSchema = new mongoose.Schema(
  {
    image: { type: String },       // single image
    description: { type: String }, // description text
  },
  { _id: false } // no separate _id for each item
);

const masalaProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    rating: { type: Number, default: 0 },
    cut_price: { type: String, default: null },
    current_price: { type: String, default: null },
    gram: { type: String, default: null },
    about_table: { type: [String], default: [] },
    about_more: { type: [String], default: [] },
    technical_details: { type: Object, default: {} },
    stock: { type: Boolean, default: true },
    pricepergram: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stockQuantity: { type: Number, default: 0 },  
    images: { type: [String], default: [] },
    reviews: [reviewSchema],

    // ✅ New fields
    videoUrl: { type: String, default: "" },           // video URL
    moreAboutProduct: [moreAboutProductSchema],       // array of more about product items
  },
  { timestamps: true }
);

// Auto-generate slug from title
masalaProductSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const MasalaProduct = mongoose.model("MasalaProduct", masalaProductSchema);
export default MasalaProduct;
