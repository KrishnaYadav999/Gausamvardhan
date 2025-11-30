import express from "express";
import {
  createAgarbattiProduct,
  getAllAgarbattiProducts,
  getAgarbattiProduct,
  updateAgarbattiProduct,
  deleteAgarbattiProduct,
  getAgarbattiProductsByCategory,
  getAgarbattiProductBySlugAndId,
  addAgarbattiProductReview,
  getSimilarAgarbattiProducts,
  searchAgarbattiProducts,
  getLowStockAgarbattiProducts,
  addCouponToAgarbattiProduct,
  updateCouponOfAgarbattiProduct,
  deleteCouponOfAgarbattiProduct,
} from "../controllers/agarbattiController.js";

const router = express.Router();

// ---------------- CRUD ----------------
router.post("/create", createAgarbattiProduct);
router.get("/all", getAllAgarbattiProducts);
router.get("/:id", getAgarbattiProduct);
router.put("/:id", updateAgarbattiProduct);
router.delete("/:id", deleteAgarbattiProduct);

// ---------------- Category Based ----------------
router.get("/category/:slug", getAgarbattiProductsByCategory);

// ---------------- Product by Slug + ID ----------------
router.get("/details/:id", getAgarbattiProductBySlugAndId);

// ---------------- Reviews ----------------
router.post("/review/:id", addAgarbattiProductReview);

// ---------------- Similar Products ----------------
router.get("/similar/:id", getSimilarAgarbattiProducts);

// ---------------- Search ----------------
router.get("/search/:query", searchAgarbattiProducts);

// ---------------- Low Stock ----------------
router.get("/low-stock/list", getLowStockAgarbattiProducts);

router.post("/:id/coupon", addCouponToAgarbattiProduct);

// Update coupon
router.put("/:id/coupon/:couponId", updateCouponOfAgarbattiProduct);

// Delete coupon
router.delete("/:id/coupon/:couponId", deleteCouponOfAgarbattiProduct);
export default router;