import mongoose from "mongoose";

const smallBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    btnText: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    links: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SmallBanner = mongoose.model("SmallBanner", smallBannerSchema);
export default SmallBanner;
