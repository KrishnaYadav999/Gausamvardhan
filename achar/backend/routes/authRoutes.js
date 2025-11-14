import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { getAllUsers, login, logout, register, requestOtp,  verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.get("/all", getAllUsers);


// Protected route example
router.get("/me", protect, (req, res) => {
  res.json({ msg: "User authenticated", userId: req.userId });
});

export default router;
