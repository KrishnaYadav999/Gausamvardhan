import nodemailer from "nodemailer";

// ============================================
// 📩 BASE MAIL SENDER
// ============================================
export const sendPaymentMail = async (to, subject, htmlMessage) => {
  try {
    console.log("📨 Creating transporter...");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


    await transporter.sendMail({
    from: `"GausamVardhan" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlMessage,
    });

    console.log("📧 Email sent successfully!");
  } catch (error) {
    console.log("❌ Email error:", error.message);
  }
};

// ============================================
// ✔ SUCCESS TEMPLATE
// ============================================
export const successOrderTemplate = (name, orderId, amount) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#28a745;">🎉 Thank You, ${name}!</h2>
    <p>Your order has been <strong>successfully placed and paid</strong>.</p>

    <div style="margin-top: 15px; padding: 15px; background:#f8f9fa; border-left:4px solid #28a745;">
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Amount Paid:</strong> ₹${amount}</p>
    </div>

    <p style="margin-top: 20px;">We’ll notify you once your order is shipped.</p>
    <p style="margin-top: 20px;">Thank you for choosing <strong>GausamVardhan</strong> 🌿</p>
  </div>
`;

// ============================================
// ❌ FAILED TEMPLATE
// ============================================
export const failedOrderTemplate = (name, reason) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#dc3545;">⚠ Payment Failed</h2>

    <p>Hello ${name || "Customer"},</p>
    <p>Your recent payment attempt could not be processed.</p>

    <div style="margin-top: 15px; padding: 15px; background:#fff3f3; border-left:4px solid #dc3545;">
      <p><strong>Reason:</strong> ${reason}</p>
    </div>

    <p style="margin-top: 20px;">Please try again. If the issue continues, feel free to contact our support team.</p>
  </div>
`;


// ============================================
// 🛑 CANCELLED TEMPLATE
// ============================================
export const cancelledOrderTemplate = (name, orderId) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#ff4d4d;">🛑 Order Cancelled</h2>

    <p>Hello ${name},</p>
    <p>Your order has been <strong>successfully cancelled</strong>.</p>

    <div style="margin-top: 15px; padding: 15px; background:#fff1f1; border-left:4px solid #ff4d4d;">
      <p><strong>Order ID:</strong> ${orderId}</p>
    </div>

    <p style="margin-top: 20px;">If a payment was deducted, the refund will be processed as per our policy.</p>
    <p>You’re welcome to place a new order anytime.</p>
  </div>
`;

// ============================================
// 🚚 SHIPPED TEMPLATE
// ============================================
export const shippedOrderTemplate = (name, orderId) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#007bff;">📦 Your Order Has Been Shipped!</h2>

    <p>Hello ${name},</p>
    <p>Your order is now <strong>on its way</strong> to your delivery address.</p>

    <div style="margin-top: 15px; padding: 15px; background:#eaf3ff; border-left:4px solid #007bff;">
      <p><strong>Order ID:</strong> ${orderId}</p>
    </div>

    <p style="margin-top: 20px;">You can expect delivery soon. Thank you for shopping with us!</p>
  </div>
`;


// ============================================
// 🚚 OUT FOR DELIVERY TEMPLATE
// ============================================
export const outForDeliveryTemplate = (name, orderId) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#ff9800;">🚚 Out for Delivery</h2>

    <p>Hello ${name},</p>
    <p>Your package is <strong>out for delivery</strong> and will reach you shortly.</p>

    <div style="margin-top: 15px; padding: 15px; background:#fff8e1; border-left:4px solid #ff9800;">
      <p><strong>Order ID:</strong> ${orderId}</p>
    </div>

    <p style="margin-top: 20px;">Please keep your phone available for coordination.</p>
  </div>
`;

console.log("Sending OUT FOR DELIVERY mail using new template");
// ============================================
// ✅ DELIVERED TEMPLATE
// ============================================
export const deliveredOrderTemplate = (name, orderId) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#28a745;">✅ Order Delivered Successfully</h2>

    <p>Hello ${name},</p>
    <p>Your order has been delivered successfully.</p>

    <div style="margin-top: 15px; padding: 15px; background:#f0fff4; border-left:4px solid #28a745;">
      <p><strong>Order ID:</strong> ${orderId}</p>
    </div>

    <p style="margin-top: 20px;">We hope you enjoy your purchase!  
    If you liked our service, feel free to leave a review 😊</p>
  </div>
`;

// ============================================
// 💸 COD ORDER PLACED TEMPLATE
// ============================================
export const codOrderPlacedTemplate = (name, orderId, amount) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#ff9800;">🧾 Cash on Delivery Order Placed</h2>

    <p>Hello ${name},</p>
    <p>Your order has been successfully placed with <strong>Cash on Delivery</strong>.</p>

    <div style="margin-top: 15px; padding: 15px; background:#fff8e1; border-left:4px solid #ff9800;">
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
    </div>

    <p style="margin-top: 20px;">We will notify you once your order is shipped.</p>
  </div>
`;

export const adminNewOrderTemplate = (
  customerName,
  orderId,
  amount,
  paymentMethod,
  productsCount
) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color:#007bff;">🛒 New Order Received</h2>

    <p><strong>A new order has been placed on GausamVardhan.</strong></p>

    <div style="margin-top: 15px; padding: 15px; background:#f1f7ff; border-left:4px solid #007bff;">
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <p><strong>Total Items:</strong> ${productsCount}</p>
    </div>

    <p style="margin-top: 20px;">
      Please login to admin panel to process this order.
    </p>
  </div>
`;
// ============================================
// 📤 SEND SUCCESS MAIL
// ============================================
export const sendPaymentSuccessMail = async (email, name, orderId, amount) => {
  const html = successOrderTemplate(name, orderId, amount);
  await sendPaymentMail(email, "Order Successful - Thank You!", html);
};

// ============================================
// 📤 SEND FAILED MAIL (FIXED BUG)
// ============================================
export const sendPaymentFailedMail = async (email, name, reason) => {
  const html = failedOrderTemplate(name, reason);  // FIXED!
  await sendPaymentMail(email, "Payment Failed - Please Try Again", html);
};

// ============================================
// 📤 SEND CANCELLED MAIL
// ============================================
export const sendOrderCancelledMail = async (email, name, orderId) => {
  const html = cancelledOrderTemplate(name, orderId);
  await sendPaymentMail(email, "Order Cancelled - Refund (If Applicable)", html);
};


// ============================================
// 📤 SEND SHIPPED MAIL
// ============================================
export const sendOrderShippedMail = async (email, name, orderId) => {
  const html = shippedOrderTemplate(name, orderId);
  await sendPaymentMail(email, "Your Order Has Been Shipped", html);
};

// ============================================
// 📤 SEND OUT-FOR-DELIVERY MAIL
// ============================================
export const sendOrderOutForDeliveryMail = async (email, name, orderId) => {
  const html = outForDeliveryTemplate(name, orderId);
  await sendPaymentMail(email, "Your Order Is Out For Delivery", html);
};

// ============================================
// 📤 SEND DELIVERED MAIL
// ============================================
export const sendOrderDeliveredMail = async (email, name, orderId) => {
  const html = deliveredOrderTemplate(name, orderId);
  await sendPaymentMail(email, "Order Delivered Successfully", html);
};


export const sendCODOrderPlacedMail = async (email, name, orderId, amount) => {
  const html = codOrderPlacedTemplate(name, orderId, amount);
  await sendPaymentMail(email, "COD Order Placed Successfully", html);
};

export const sendAdminNewOrderMail = async (
  customerName,
  orderId,
  amount,
  paymentMethod,
  productsCount
) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const html = adminNewOrderTemplate(
    customerName,
    orderId,
    amount,
    paymentMethod,
    productsCount
  );

  await sendPaymentMail(
    adminEmail,
    "🛒 New Order Received - GausamVardhan",
    html
  );
};
