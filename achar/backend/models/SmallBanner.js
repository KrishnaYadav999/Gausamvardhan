import mongoose from "mongoose";

const smallBannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  link: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("SmallBanner", smallBannerSchema);
