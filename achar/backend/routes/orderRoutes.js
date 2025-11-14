import express from "express";
import {
  createOrder,
  verifyPayment,
  cancelOrder,
  updateOrderStatus,
  getUserOrders,
  getOrderById,
  getAllOrders,

} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/cancel-order", cancelOrder);
router.post("/update-status", updateOrderStatus);
router.get("/user-orders/:userId", getUserOrders); // all orders of a user
router.get("/:orderId", getOrderById); // 
router.get("/admin/orders", getAllOrders);  

export default router;
