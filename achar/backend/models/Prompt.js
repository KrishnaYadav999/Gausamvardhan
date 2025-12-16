import mongoose from "mongoose";

const PromptSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, unique: true },
    response: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Prompt", PromptSchema);
