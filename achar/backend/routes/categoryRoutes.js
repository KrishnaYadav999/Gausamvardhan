import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);
router.put("/:id", updateCategory);        // Update
router.delete("/:id", deleteCategory);  

export default router;
