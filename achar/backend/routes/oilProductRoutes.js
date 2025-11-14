import express from "express";
import {
  createOilProduct,
  getOilProducts,
  getOilProductById,
  getOilProductBySlugAndId,
  updateOilProduct,
  deleteOilProduct,
  addOilReview,
  deleteOilReview,
  getSimilarOilProducts,
  getOilProductsByCategory,
  searchOilProducts,
  getLowStockOilProducts,
} from "../controllers/oilProductController.js";

const router = express.Router();
router.get("/low-stock-oil", getLowStockOilProducts);
// ---------------- Product CRUD ----------------
router.post("/", createOilProduct);
router.get("/", getOilProducts);
router.get("/:id", getOilProductById);
router.get("/category/:slug", getOilProductsByCategory);
router.get("/category/:slug/:id", getOilProductBySlugAndId);
router.put("/:id", updateOilProduct);
router.delete("/:id", deleteOilProduct);

// ---------------- Reviews ----------------
router.post("/:id/reviews", addOilReview);
router.delete("/:id/reviews/:reviewId", deleteOilReview);

// ---------------- Similar Products ----------------
router.get("/:id/similar", getSimilarOilProducts);

router.get("/search/:query", searchOilProducts);

export default router;
