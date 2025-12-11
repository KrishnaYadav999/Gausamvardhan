// models/Prompt.js
import mongoose from "mongoose";

const PromptSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true, unique: true },
    response: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Prompt = mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);
export default Prompt;
