import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
    // Google login fields
    googleId: { type: String, default: null },
    picture: { type: String, default: null },
  
}, { timestamps: true });

export default mongoose.model("User", userSchema);
