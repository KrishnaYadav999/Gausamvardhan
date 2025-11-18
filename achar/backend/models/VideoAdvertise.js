import mongoose from "mongoose";

const videoAdvertiseSchema = new mongoose.Schema(
  {
    videoAdvertiseUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("VideoAdvertise", videoAdvertiseSchema);
