import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
  prompt: { type: String, required: true, index: true },
  response: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Prompt", promptSchema);