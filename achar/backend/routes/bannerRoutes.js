import express from "express";
import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";


const router = express.Router();

// Public route
router.get("/", getBanners);
router.get("/:id", getBannerById);

// Protected routes (admin only)
router.post("/", createBanner);
router.put("/:id",  updateBanner);
router.delete("/:id",   deleteBanner);

export default router;
