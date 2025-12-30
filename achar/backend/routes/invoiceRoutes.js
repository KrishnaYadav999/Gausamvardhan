import express from "express";
import { emailInvoiceController } from "../controllers/invoiceController.js";

const router = express.Router();

// POST /api/invoice/email
router.post("/email", emailInvoiceController);

export default router;
