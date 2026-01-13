import Order from "../models/orderModel.js";
import generateInvoicePDF from "../utils/generateInvoicePDF.js";
import { sendInvoiceEmail } from "../utils/emailService.js";

/* =========================================================
   📧 EMAIL INVOICE CONTROLLER
========================================================= */
export const emailInvoiceController = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId is required" });
    }

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const email = order.user?.email || order.shippingAddress?.email;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Customer email missing" });
    }

    // Generate Invoice PDF
    const pdfPath = await generateInvoicePDF(order);

    // Send Email
    await sendInvoiceEmail({
      to: email,
      subject: `Invoice – Order #${order.orderNumber}`,
      text: `Dear Customer,

Please find your invoice attached.

Thank you for shopping with Gau Samvardhan.

Regards,
Gau Samvardhan`,
      attachmentPath: pdfPath,
    });

    return res.json({
      success: true,
      message: "Invoice email sent successfully",
    });
  } catch (error) {
    console.error("❌ Email Invoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Email service failed",
    });
  }
};

/* =========================================================
   🔄 UPDATE ORDER STATUS (ADMIN)
========================================================= */
export const updateOrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const allowedStatus = [
      "pending",
      "shipped",
      "out-for-delivery",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Update Order Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

/* =========================================================
   📦 GET ALL ORDERS (ADMIN)
========================================================= */
export const getAllOrdersAdminController = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Fetch Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
