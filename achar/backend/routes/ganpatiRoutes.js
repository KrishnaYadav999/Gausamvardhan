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

// ---------------- DEFAULT CRUD WITH :id (ALWAYS KEEP AT LAST) ----------------
router.get("/:id", getGanpatiProduct);
router.put("/:id", updateGanpatiProduct);
router.delete("/:id", deleteGanpatiProduct);

export default router;
