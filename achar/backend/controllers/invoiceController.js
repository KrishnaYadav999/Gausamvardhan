import Order from "../models/orderModel.js";
import generateInvoicePDF from "../utils/generateInvoicePDF.js";
import { sendInvoiceEmail } from "../utils/emailService.js";

export const emailInvoiceController = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: "orderId is required" });

    const order = await Order.findById(orderId).populate("user");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const email = order.user?.email || order.shippingAddress?.email;
    if (!email) return res.status(400).json({ success: false, message: "Customer email missing" });

    const pdfPath = await generateInvoicePDF(order);

    await sendInvoiceEmail({
      to: email,
      subject: `Invoice – Order #${order.orderNumber}`,
      text: `Dear Customer,\n\nPlease find your invoice attached.\n\nThank you for shopping with Gau Samvardhan.\n\nRegards,\nGau Samvardhan`,
      attachmentPath: pdfPath,
    });

    res.json({ success: true, message: "Invoice email sent successfully" });
  } catch (error) {
    console.error("❌ Email Invoice Error:", error);
    res.status(500).json({ success: false, message: "Email service failed" });
  }
};
