import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductBySlugAndId,
  getProducts,
  getProductsByCategorySlug,
  updateProduct,
  addReview,
  deleteReview,
  getSimilarProducts,
  searchProductsByName,
  getLowStockProducts,
  addCouponToProduct,
  updateCouponOfProduct,
  deleteCouponOfProduct, // ✅ import search
} from "../controllers/productController.js";

const router = express.Router();

// -------------------- Product CRUD --------------------
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/category/:slug", getProductsByCategorySlug);
router.get("/category/:slug/:id", getProductBySlugAndId);

// -------------------- Search --------------------
router.get("/search/:query", searchProductsByName);

// -------------------- Similar Products --------------------
router.get("/:id/similar", getSimilarProducts);

// -------------------- Update & Delete --------------------
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// -------------------- Reviews --------------------
router.post("/:id/reviews", addReview);
router.delete("/:id/reviews/:reviewId", deleteReview);
router.get("/low-stock", getLowStockProducts);


router.post("/:id/coupon", addCouponToProduct);

// Update coupon of a product
router.put("/:id/coupon/:couponId", updateCouponOfProduct);

// Delete coupon from a product
router.delete("/:id/coupon/:couponId", deleteCouponOfProduct);
export default router;