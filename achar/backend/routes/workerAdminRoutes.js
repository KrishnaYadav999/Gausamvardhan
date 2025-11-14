import express from "express";
import {
  createWorker,
  workerLogin,
  getAllWorkers,
  toggleBlockWorker,
} from "../controllers/workerAdminController.js";

const router = express.Router();

// POST create worker (main admin)
router.post("/create", createWorker);

// POST login (worker)
router.post("/login", workerLogin);

// GET all workers
router.get("/", getAllWorkers);

// PATCH block/unblock worker
router.patch("/block/:id", toggleBlockWorker);

export default router;
