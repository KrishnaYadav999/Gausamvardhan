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
import AgarbattiProduct from "./../models/agarbattiModel.js";
import GanpatiProduct from "../models/ganpatimodel.js";
import axios from "axios";
import { sendOrderToDelhivery } from "../utils/delhivery.js";
import { cancelDelhiveryOrder } from "../utils/delhivery.js";
import {
  sendPaymentSuccessMail,
  sendOrderCancelledMail,
  sendPaymentFailedMail,
  sendOrderShippedMail,
  sendOrderOutForDeliveryMail ,
  sendOrderDeliveredMail,
  sendCODOrderPlacedMail ,
   sendAdminNewOrderMail 
} from "../utils/paymentMail.js";


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
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    if (!Array.isArray(products) || products.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Products array is required" });
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0)
      return res
        .status(400)
        .json({
          success: false,
          message: "Total amount must be greater than 0",
        });

    // ✅ Validate shipping address
    const requiredFields = [
      "name",
      "address",
      "city",
      "state",
      "pincode",
      "country",
    ];
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
          GanpatiProduct.findById(p.product),
        ]);
        if (masala) p.productType = "MasalaProduct";
        else if (ghee) p.productType = "GheeProduct";
        else if (oil) p.productType = "OilProduct";
        else if (normal) p.productType = "Product";
        else if (agarbatti) p.productType = "AgarbattiProduct";
        else if (ganpati) p.productType = "GanpatiProduct";
      }
    }

    // 🧩 Attach missing product names/images
    for (let i = 0; i < products.length; i++) {
      const { productType, product, name, image } = products[i];
      if (name && image) continue;

      let prodData = null;
      switch (productType) {
        case "Product":
          prodData = await Product.findById(product).select(
            "productName productImages"
          );
          break;
        case "OilProduct":
          prodData = await OilProduct.findById(product).select(
            "productName productImages"
          );
          break;
        case "MasalaProduct":
          prodData = await MasalaProduct.findById(product).select(
            "title images"
          );
          break;
        case "GheeProduct":
          prodData = await GheeProduct.findById(product).select("title images");
          break;
        case "AgarbattiProduct":
          prodData = await AgarbattiProduct.findById(product).select(
            "title images"
          );
          break;
        case "GanpatiProduct": // ✅ added Ganpati
          prodData = await GanpatiProduct.findById(product).select(
            "title images"
          );
          break;
      }

      products[i] = {
        ...products[i],
        name:
          name || prodData?.productName || prodData?.title || "Unnamed Product",
        image:
          image ||
          prodData?.productImages?.[0] ||
          prodData?.images?.[0] ||
          "/no-image.png",
        pack:
          products[i].pack ||
          products[i].selectedPack ||
          prodData?.pack ||
          null,
        weight: products[i].weight || prodData?.weight || null,
        volume: products[i].volume || prodData?.volume || null,
      };
    }

    // 🧾 Generate Invoice & Serial Numbers
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

const customerEmail = req.body.email || shippingAddress?.email || null;

// 🧠 Save Order in DB
const paymentMethod = req.body.paymentMethod || "Online";
const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";

const newOrder = await Order.create({
  orderNumber,
  invoiceNumber,
  serialNumber,
  user: userId,
  userEmail: customerEmail,
  products,
  totalAmount,
  shippingAddress,
  paymentMethod,
  paymentStatus,
  razorpayOrderId: razorpayOrder.id,
});
try {
  await sendAdminNewOrderMail(
    shippingAddress.name,
    newOrder._id,
    totalAmount,
    paymentMethod,
    products.length
  );
  console.log("📩 Admin notified for new order");
} catch (err) {
  console.log("❌ Admin mail failed:", err.message);
}
// ===============================
// 📩 SEND MAIL FOR COD ORDERS
// ===============================
if (paymentMethod === "COD") {
  try {
    // 🔥 FINAL email fallback logic
    const finalEmail =
      customerEmail ||
      shippingAddress?.email ||
      newOrder?.userEmail ||
      newOrder?.user?.email;

    console.log("📧 Final email used for COD:", finalEmail);

    if (!finalEmail) {
      console.log("❌ No email found for COD order, skipping email send.");
    } else {
      await sendCODOrderPlacedMail(
        finalEmail,
        shippingAddress.name,
        newOrder._id,
        totalAmount
      );
      console.log("📩 COD mail sent successfully!");
    }
  } catch (err) {
    console.log("❌ COD mail failed:", err.message);
  }
}

// 🚚 Send order to Delhivery
try {
  const delhiveryRes = await sendOrderToDelhivery(newOrder);
const waybill =
  delhiveryRes?.packages?.[0]?.waybill || null;


  newOrder.delhiveryResponse = delhiveryRes;
  newOrder.delhiveryWaybill = waybill;
  await newOrder.save();

  console.log("✅ Delhivery response saved in order");
} catch (delhiveryErr) {
  console.error(
    "⚠ Delhivery failed, but order is safe:",
    delhiveryErr.message
  );
}

// 🟢 Final response
console.log("✅ Order created:", newOrder._id);

res.json({
  success: true,
  message: "Order created successfully",
  order: newOrder,
  invoiceNumber, // <-- final correct value (AMBGS-0001)
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

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      await sendPaymentFailedMail("unknown", "Incomplete payment details");
      return res.status(400).json({
        success: false,
        message: "Incomplete payment details",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // ❌ Signature Mismatch → Payment Failed Email
    if (razorpaySignature !== expectedSignature) {
      await sendPaymentFailedMail("unknown", "Signature mismatch");
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✔ Payment is valid → Update order
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId },
      { razorpayPaymentId, razorpaySignature, status: "paid" },
      { new: true }
    ).populate("user");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    // -------------------------------------
    // 🔥 Reduce Stock For Each Product
    // -------------------------------------
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
        case "GanpatiProduct":
          prodModel = GanpatiProduct;
          break;
      }

      if (prodModel) {
        const prod = await prodModel.findById(item.product);
        if (prod) {
          prod.stockQuantity = Math.max(
            (prod.stockQuantity || 0) - item.quantity,
            0
          );
          if (prod.stockQuantity === 0) prod.stock = false;
          await prod.save();
        }
      }
    }

    console.log(
      "💌 Sending payment success mail to:",
      order.user?.email || order.userEmail
    );

    // -------------------------------------
    // 📩 Send Payment SUCCESS Email
    // -------------------------------------
    await sendPaymentSuccessMail(
      order.user?.email || order.userEmail,
      order.user.name,
      order._id,
      order.totalAmount
    );

    return res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Payment verification error:", err);

    // Payment failed email
    await sendPaymentFailedMail("unknown", err.message);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// 🚫 CANCEL ORDER
// ======================================================
export const cancelOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId).populate("user");
    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    // Already cancelled check
    if (order.status === "cancelled") {
      return res.json({
        success: true,
        message: "Order already cancelled",
      });
    }
    if (
      order.status === "shipped" ||
      order.status === "out-for-delivery" ||
      order.status === "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled after shipment",
      });
    }

    // 🔍 Extract Waybill from Delhivery response
// 🔍 Use saved waybill
const waybill = order.delhiveryWaybill;

console.log("📦 Cancelling Delhivery Waybill:", waybill);

// ❗ Safety check
if (waybill) {
  await cancelDelhiveryOrder(
    waybill,
    reason || "User cancelled order"
  );
} else {
  console.log("⚠ No waybill found, skipping Delhivery cancel");
}


    

    // Updating order status
    order.status = "cancelled";
    order.isCancelled = true;
    order.cancelReason = reason || "User cancelled";
    await order.save();

    // 📩 SEND CANCEL EMAIL
    if (order.user && order.user.email) {
      await sendOrderCancelledMail(
        order.user.email,
        order.user.name,
        order._id,
        order.cancelReason
      );
    }

    return res.json({
      success: true,
      message: "Order cancelled successfully",
    });
    
  } catch (err) {
    console.error("Cancel order error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });

    const order = await Order.findById(orderId).populate("user");
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const userEmail = order.user?.email || order.userEmail;
    const userName =
      order.user?.name || order.shippingAddress?.name || "Customer";

    if (status === "shipped") {
      await sendOrderShippedMail(userEmail, userName, order._id);
    }

    if (status === "outForDelivery" || status === "out-for-delivery") {
      await sendOrderOutForDeliveryMail(userEmail, userName, order._id);
    }

    if (status === "delivered") {
      await sendOrderDeliveredMail(userEmail, userName, order._id);
    }

    if (status === "cancelled") {
      await sendOrderCancelledMail(userEmail, userName, order._id);
    }

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

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
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




export const calculateShippingCharge = async (req, res) => {
  try {
    const { destinationPincode, totalWeight, isCOD } = req.body;

    if (!destinationPincode) {
      return res.status(400).json({
        success: false,
        message: "Destination pincode is required",
      });
    }

    const originPincode = "110042"; // your origin
    const weight = totalWeight || 500; // grams
    const paymentType = isCOD ? "COD" : "Pre-paid";

    const url = "https://track.delhivery.com/api/kinko/v1/invoice/charges/.json";

    const params = {
      o_pin: originPincode,
      d_pin: destinationPincode,
      cgm: weight,
      pt: paymentType,
      md: "E",
      ss: "Delivered",
    };

    const response = await axios.get(url, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
      },
    });

    console.log("📦 SHIPPING RESPONSE:", response.data);

    // ✅ Correctly extract total_amount from first element
    const chargeData = response.data[0]; // first object in array
    const totalCharge = chargeData?.total_amount || 0;

    return res.json({
      success: true,
      charges: totalCharge,
      breakdown: chargeData,
    });
  } catch (err) {
    console.error("❌ SHIPPING ERROR:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate shipping charges",
    });
  }
};