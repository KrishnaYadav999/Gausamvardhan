// File: controllers/orderController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import Counter from "../models/Counter.js";
import Product from "../models/Product.js";
import OilProduct from "../models/oilProductModel.js";
import MasalaProduct from "../models/MasalaProduct.js";
import GheeProduct from "../models/GheeProduct.js";
import AgarbattiProduct from "./../models/agarbattiModel.js"
dotenv.config();

// ✅ Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ======================================================
// 🧾 CREATE ORDER
// ======================================================
export const createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, shippingAddress } = req.body;

    console.log("📦 Incoming Order Data:", {
      userId,
      totalAmount,
      productsCount: products?.length || 0,
    });

    // ✅ Input validation
    if (!userId)
      return res.status(400).json({ success: false, message: "User ID is required" });
    if (!Array.isArray(products) || products.length === 0)
      return res.status(400).json({ success: false, message: "Products array is required" });
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0)
      return res.status(400).json({ success: false, message: "Total amount must be greater than 0" });

    // ✅ Validate shipping address
    const requiredFields = ["name", "address", "city", "state", "pincode", "country"];
    for (const field of requiredFields) {
      if (!shippingAddress?.[field]) {
        return res.status(400).json({
          success: false,
          message: `Shipping address "${field}" is missing`,
        });
      }
    }

    // ✅ Ensure product details exist
    for (const item of products) {
      if (!item.product || !item.quantity || !item.price) {
        return res.status(400).json({
          success: false,
          message: "Each product must include product ID, quantity, and price",
        });
      }
    }

    // 🧠 Detect product type dynamically
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      if (!p.productType) {
      const [masala, ghee, oil, normal, agarbatti] = await Promise.all([
  MasalaProduct.findById(p.product),
  GheeProduct.findById(p.product),
  OilProduct.findById(p.product),
  Product.findById(p.product),
  AgarbattiProduct.findById(p.product), // added agarbatti
]);
if (masala) p.productType = "MasalaProduct";
else if (ghee) p.productType = "GheeProduct";
else if (oil) p.productType = "OilProduct";
else if (normal) p.productType = "Product";
else if (agarbatti) p.productType = "AgarbattiProduct"; 
      }
    }

    // 🧩 Attach missing product names/images
    for (let i = 0; i < products.length; i++) {
      const { productType, product, name, image } = products[i];
      if (name && image) continue;

      let prodData = null;
      switch (productType) {
        case "Product":
          prodData = await Product.findById(product).select("productName productImages");
          break;
        case "OilProduct":
          prodData = await OilProduct.findById(product).select("productName productImages");
          break;
        case "MasalaProduct":
          prodData = await MasalaProduct.findById(product).select("title images");
          break;
        case "GheeProduct":
          prodData = await GheeProduct.findById(product).select("title images");
          break;
          case "AgarbattiProduct":
  prodData = await AgarbattiProduct.findById(product).select("title images");
  break;
      }

 products[i] = {
  ...products[i],
  name: name || prodData?.productName || prodData?.title || "Unnamed Product",
  image:
    image ||
    prodData?.productImages?.[0] ||
    prodData?.images?.[0] ||
    "/no-image.png",
  pack: products[i].pack || products[i].selectedPack || null, // add this line
};

    }

    // 🧾 Generate Invoice & Serial Numbers
    const counter = await Counter.findOneAndUpdate(
      { id: "order" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const serialNumber = counter.seq;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const invoiceNumber = `AMBGS-${String(serialNumber).padStart(4, "0")}`;

    // 💳 Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    if (!razorpayOrder?.id)
      throw new Error("Failed to create Razorpay order. Please try again.");

    // 🧠 Save in DB
    const newOrder = await Order.create({
      orderNumber,
      invoiceNumber,
      serialNumber,
      user: userId,
      products,
      totalAmount,
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
    });

    console.log("✅ Order created:", newOrder._id);

    res.json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
      invoiceNumber: `AMBGS - ${String(serialNumber).padStart(4, "0")}`,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error during order creation",
    });
  }
};

// ======================================================
// 💳 VERIFY PAYMENT
// ======================================================
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)
      return res.status(400).json({
        success: false,
        message: "Incomplete payment details",
      });

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (razorpaySignature !== expectedSignature)
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, razorpaySignature, status: "paid" },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    // ✅ Reduce stock for each product
    for (const item of order.products) {
      let prodModel = null;
      switch (item.productType) {
        case "Product":
          prodModel = Product;
          break;
        case "OilProduct":
          prodModel = OilProduct;
          break;
        case "MasalaProduct":
          prodModel = MasalaProduct;
          break;
        case "GheeProduct":
          prodModel = GheeProduct;
          break;
          case "AgarbattiProduct":
        prodModel = AgarbattiProduct;
  break;
      }
      if (prodModel) {
        const prod = await prodModel.findById(item.product);
        if (prod) {
          prod.stockQuantity = Math.max((prod.stockQuantity || 0) - item.quantity, 0);
          if (prod.stockQuantity === 0) prod.stock = false;
          await prod.save();
        }
      }
    }

    console.log("✅ Payment verified:", order._id);
    res.json({ success: true, message: "Payment verified successfully", order });
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================================================
// 🚫 CANCEL ORDER
// ======================================================
export const cancelOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = "cancelled";
    order.isCancelled = true;
    order.cancelReason = reason || "User cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================================================
// 🔄 UPDATE ORDER STATUS (Admin)
// ======================================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const validStatuses = [
      "pending",
      "paid",
      "shipped",
      "out-for-delivery",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================================================
// 👤 GET USER ORDERS
// ======================================================
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate({
        path: "products.product",
        select: "productName title productImages images cutPrice currentPrice",
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Get user orders error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================================================
// 🔍 GET ORDER BY ID
// ======================================================
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate({
        path: "products.product",
        select: "productName title productImages images cutPrice currentPrice",
      })
      .populate({
        path: "user",
        select: "name email mobile",
      });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    console.error("Get order by ID error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================================================
// 📦 GET ALL ORDERS (Admin + Filter)
// ======================================================
export const getAllOrders = async (req, res) => {
  try {
    const { filter } = req.query;
    const now = new Date();

    let filterQuery = {};
    if (filter && filter !== "all") {
      const cutoff = new Date();
      switch (filter) {
        case "24h":
          cutoff.setTime(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          cutoff.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          cutoff.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "60d":
          cutoff.setTime(now.getTime() - 60 * 24 * 60 * 60 * 1000);
          break;
        case "today":
          cutoff.setHours(0, 0, 0, 0);
          break;
      }
      filterQuery = { createdAt: { $gte: cutoff } };
    }

    const orders = await Order.find(filterQuery)
      .populate("user", "name email")
      .populate({
        path: "products.product",
        select: "productName title productImages images",
      })
      .sort({ createdAt: -1 });

    const allOrders = await Order.find();
    const counts = {
      all: allOrders.length,
      today: allOrders.filter(
        (o) => new Date(o.createdAt) >= new Date().setHours(0, 0, 0, 0)
      ).length,
      "24h": allOrders.filter(
        (o) => new Date(o.createdAt) >= new Date(now - 24 * 60 * 60 * 1000)
      ).length,
      "7d": allOrders.filter(
        (o) => new Date(o.createdAt) >= new Date(now - 7 * 24 * 60 * 60 * 1000)
      ).length,
      "30d": allOrders.filter(
        (o) => new Date(o.createdAt) >= new Date(now - 30 * 24 * 60 * 60 * 1000)
      ).length,
      "60d": allOrders.filter(
        (o) => new Date(o.createdAt) >= new Date(now - 60 * 24 * 60 * 60 * 1000)
      ).length,
    };

    res.json({ success: true, orders, orderCounts: counts });
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
