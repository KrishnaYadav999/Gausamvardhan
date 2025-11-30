import express from "express";
import {
  createGheeProduct,
  getGheeProducts,
  updateGheeProduct,
  deleteGheeProduct,
  getGheeProductsByCategory,
  getGheeProductBySlugAndId,
  addGheeReview,
  getSimilarGheeProducts, // ✅ new import
  searchProductsByName,
  getLowStockGheeProducts,
  addCouponToGheeProduct,
  updateCouponOfGheeProduct,
  deleteCouponOfGheeProduct,

} from "../controllers/gheeProductController.js";

const router = express.Router();

// ---------------- Product CRUD ----------------
router.post("/", createGheeProduct);                 // Create product
router.get("/", getGheeProducts);                    // Get all products
router.get("/category/:slug", getGheeProductsByCategory);          // Get products by category
router.get("/category/:slug/:id", getGheeProductBySlugAndId);      // Get product by slug & id
router.get("/:id/similar", getSimilarGheeProducts); // ✅ new route
router.put("/:id", updateGheeProduct);               // Update product
router.delete("/:id", deleteGheeProduct);  
router.get("/search/:query", searchProductsByName);          

// ---------------- Reviews ----------------
router.post("/:id/review", addGheeReview);           // Add review to product
router.get("/ghee/lowstock", getLowStockGheeProducts);

// Add coupon to a ghee product
router.post("/:id/coupon", addCouponToGheeProduct);

// Update coupon of a ghee product
router.put("/:id/coupon/:couponId", updateCouponOfGheeProduct);

// Delete coupon of a ghee product
router.delete("/:id/coupon/:couponId", deleteCouponOfGheeProduct);
export default router;