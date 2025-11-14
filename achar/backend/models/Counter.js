import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true },  // identifier, e.g., "orderId"
  seq: { type: Number, default: 0 },     // auto-increment sequence
});

export default mongoose.model("Counter", counterSchema);
