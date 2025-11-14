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

// ---------------- More About Product Schema ----------------
const moreAboutProductSchema = new mongoose.Schema(
  {
    image: { type: String },
    description: { type: String },
  },
  { _id: false }
);

// ---------------- Oil Product Schema ----------------
const oilProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },

    rating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },

    description: { type: String },
    cutPrice: { type: String },
    currentPrice: { type: String },
    allDetails: { type: String },
  perPriceLiter: [
      {
        volume: { type: String, required: true }, // e.g., "1L"
        price: { type: Number, required: true },  // e.g., 499
      },
    ],
    stock: { type: Boolean, default: true },
   stockQuantity: { type: Number, default: 0 },
    productImages: [{ type: String, required: true }],
    videoUrl: { type: String },                 // single video URL
    reviews: [reviewSchema],
    moreAboutProduct: [moreAboutProductSchema],

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

// Auto-generate slug from productName
oilProductSchema.pre("save", function (next) {
  if (this.isModified("productName")) {
    this.slug = slugify(this.productName, { lower: true, strict: true });
  }
  next();
});

// ---------------- Methods for avg rating update ----------------
oilProductSchema.methods.calculateAverageRating = function () {
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

const OilProduct = mongoose.model("OilProduct", oilProductSchema);
export default OilProduct;
