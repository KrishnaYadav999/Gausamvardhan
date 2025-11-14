import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  
}, { timestamps: true });

export default mongoose.model("User", userSchema);
