import nodemailer from "nodemailer";

// ============================================
// 📩 BASE MAIL SENDER
// ============================================
export const sendPaymentMail = async (to, subject, htmlMessage) => {
   console.log("📨 Creating transporter...");
  try {
    const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"GausamVardhan" <${process.env.EMAIL_USER}>`,
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
  <h2 style="color:green">🎉 Thank You, ${name}!</h2>
  <p>Your order has been <b>successfully placed & paid</b>.</p>
  <p><b>Order ID:</b> ${orderId}</p>
  <p><b>Amount Paid:</b> ₹${amount}</p>
  <p>We will notify you when your order is shipped!</p>
`;

// ============================================
// ❌ FAILED TEMPLATE
// ============================================
export const failedOrderTemplate = (name, reason) => `
  <h2 style="color:red">⚠ Payment Failed</h2>
  <p>Hello ${name || "User"},</p>
  <p>Your payment attempt was unsuccessful.</p>
  <p><b>Reason:</b> ${reason}</p>
  <p>Please try again!</p>
`;

// ============================================
// 🛑 CANCELLED TEMPLATE
// ============================================
export const cancelledOrderTemplate = (name, orderId) => `
  <h2 style="color:#ff4d4d;">🛑 Order Cancelled</h2>
  <p>Hello ${name},</p>
  <p>Your order has been <b>successfully cancelled</b>.</p>
  <p><b>Order ID:</b> ${orderId}</p>
  <p>If payment was deducted, refund will be processed as per the policy.</p>
  <p>Feel free to place a new order anytime.</p>
`;

// ============================================
// 📤 SEND SUCCESS MAIL
// ============================================
export const sendPaymentSuccessMail = async (email, name, orderId, amount) => {
  const html = successOrderTemplate(name, orderId, amount);
  await sendPaymentMail(email, "Order Successful - Thank You!", html);
};

// ============================================
// 📤 SEND FAILED MAIL
// ============================================
export const sendPaymentFailedMail = async (email, reason) => {
  const html = failedOrderTemplate(email, reason);
  await sendPaymentMail(email, "Payment Failed - Please Try Again", html);
};

// ============================================
// 📤 SEND CANCELLED MAIL
// ============================================
export const sendOrderCancelledMail = async (email, name, orderId) => {
  const html = cancelledOrderTemplate(name, orderId);
  await sendPaymentMail(email, "Order Cancelled - Refund (If Applicable)", html);
};
