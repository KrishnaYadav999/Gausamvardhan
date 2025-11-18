import express from "express";
import {
  createVideoAd,
  getAllVideoAds,
  getSingleVideoAd,
  updateVideoAd,
  deleteVideoAd,
} from "../controllers/videoAdvertiseController.js";

const router = express.Router();

router.post("/", createVideoAd);
router.get("/", getAllVideoAds);
router.get("/:id", getSingleVideoAd);
router.put("/:id", updateVideoAd);
router.delete("/:id", deleteVideoAd);

export default router;
