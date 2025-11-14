import express from "express";
import {
  createMasalaProduct,
  getAllMasalaProducts,
  getMasalaProduct,
  updateMasalaProduct,
  deleteMasalaProduct,
  getMasalaProductsByCategory,
  getMasalaProductBySlugAndId,
  addMasalaProductReview,
  getSimilarMasalaProducts,
  searchMasalaProducts,
  getLowStockMasalaProducts, // ✅ import the new review controller
} from "../controllers/masalaProductController.js";

const router = express.Router();

// -------------------- Product Routes --------------------

// Create product
router.post("/", createMasalaProduct);

// Get all products
router.get("/", getAllMasalaProducts);

// Get products by category slug
router.get("/category/:slug", getMasalaProductsByCategory);

// Get single product by ID
router.get("/:id", getMasalaProduct);

router.get("/:id/similar", getSimilarMasalaProducts);
// Update product
router.put("/:id", updateMasalaProduct);

// Delete product
router.delete("/:id", deleteMasalaProduct);

// -------------------- Review Routes --------------------

// Add a review to a product
router.post("/:id/review", addMasalaProductReview);

router.get("/search/:query", searchMasalaProducts);
router.get("/masala/lowstock", getLowStockMasalaProducts);
export default router;
