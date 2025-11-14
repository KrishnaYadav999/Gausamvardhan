import express from "express";
import { getCounter, incrementCounter } from "../controllers/counterController.js";

const router = express.Router();

// Get current counter value
router.get("/:id", getCounter);

// Increment counter
router.post("/increment/:id", incrementCounter);

export default router;
