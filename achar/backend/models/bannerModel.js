import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    buttonText: { type: String, default: "Shop Now" },
    buttonLink: { type: String, default: "/" },
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
