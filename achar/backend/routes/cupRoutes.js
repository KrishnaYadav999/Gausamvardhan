import express from "express";
import {
  createCupProduct,
  getAllCupProducts,
  getCupProduct,
  updateCupProduct,
  deleteCupProduct,
  getCupProductsByCategory,
  getCupProductBySlugAndId,
  addCupProductReview,
  getSimilarCupProducts,
  searchCupProducts,
  getLowStockCupProducts,
} from "../controllers/cupController.js";

const router = express.Router();

// ---------------- CRUD ----------------
router.post("/create", createCupProduct);
router.get("/all", getAllCupProducts);

// ⭐ Specific first
router.get("/category/:slug", getCupProductsByCategory);
router.get("/details/:id", getCupProductBySlugAndId);
router.post("/review/:id", addCupProductReview);
router.get("/similar/:id", getSimilarCupProducts);
router.get("/search/:query", searchCupProducts);
router.get("/low-stock/list", getLowStockCupProducts);

// ⭐ Catch-all ID last
router.get("/:id", getCupProduct);
router.put("/:id", updateCupProduct);
router.delete("/:id", deleteCupProduct);


export default router;