import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
userEmail: {
  type: String,
  required: false,
},

    // Add orderNumber here
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
invoiceNumber: {
  type: String,
  unique: true,
  required: true,
},

    products: [
      {
        productType: { type: String, required: true }, // e.g., 'Product', 'OilProduct', 'MasalaProduct', 'GheeProduct,'AgarbattiProduct''
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "products.productType", // dynamic model reference
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: String, // optional fallback
        name: String,  // optional fallback
          weight: String, // ✅ must be here
    volume: String,
    pack: String, 
      },
    ],

    totalAmount: { type: Number, required: true },

    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
    },
 paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "Online",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped","out-for-delivery", "delivered", "cancelled","refunded"],
      default: "pending",
    },
    isCancelled: { type: Boolean, default: false },
    cancelReason: { type: String, default: "" },
delhiveryWaybill: {
  type: String,
},

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);