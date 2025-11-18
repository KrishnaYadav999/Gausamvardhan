import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  
  googleId: { type: String, default: null },
  picture: { type: String, default: null },

  authType: { type: String, enum: ["local", "google"], default: "local" }
  
}, { timestamps: true });

export default mongoose.model("User", userSchema);
