import express from "express";
import {
  createGanpatiProduct,
  getAllGanpatiProducts,
  getGanpatiProduct,
  updateGanpatiProduct,
  deleteGanpatiProduct,
  getGanpatiProductsByCategory,
  getGanpatiProductBySlugAndId,
  addGanpatiProductReview,
  getSimilarGanpatiProducts,
  searchGanpatiProducts,
  getLowStockGanpatiProducts,
  addCouponToGanpatiProduct,
  updateCouponOfGanpatiProduct,
  deleteCouponOfGanpatiProduct,
} from "../controllers/ganpatiController.js";

const router = express.Router();

// ---------------- CRUD ----------------
router.post("/create", createGanpatiProduct);
router.get("/all", getAllGanpatiProducts);

// ---------------- SPECIAL ROUTES (KEEP THESE ABOVE :id) ----------------

// Category products
router.get("/category/:slug", getGanpatiProductsByCategory);

// Product details by slug/id
router.get("/details/:id", getGanpatiProductBySlugAndId);

// Similar products
router.get("/similar/:id", getSimilarGanpatiProducts);

// Search
router.get("/search/:query", searchGanpatiProducts);

// Low stock list
router.get("/low-stock/list", getLowStockGanpatiProducts);

// Add review
router.post("/review/:id", addGanpatiProductReview);
// Add coupon to a Ganpati product
router.post("/:id/coupon", addCouponToGanpatiProduct);

// Update coupon of a Ganpati product
router.put("/:id/coupon/:couponId", updateCouponOfGanpatiProduct);

// Delete coupon of a Ganpati product
router.delete("/:id/coupon/:couponId", deleteCouponOfGanpatiProduct);
// ---------------- DEFAULT CRUD WITH :id (ALWAYS KEEP AT LAST) ----------------
router.get("/:id", getGanpatiProduct);
router.put("/:id", updateGanpatiProduct);
router.delete("/:id", deleteGanpatiProduct);

export default router;
