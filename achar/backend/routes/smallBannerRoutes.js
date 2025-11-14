// routes/smallBannerRoutes.js
import express from "express";
import {
  createSmallBanner,
  getSmallBanners,
  deleteSmallBanner,
} from "../controllers/smallBannerController.js";

const router = express.Router();

router.post("/", createSmallBanner);      // Create SmallBanner
router.get("/", getSmallBanners);         // Get All SmallBanners
router.delete("/:id", deleteSmallBanner); // Delete SmallBanner

export default router;
