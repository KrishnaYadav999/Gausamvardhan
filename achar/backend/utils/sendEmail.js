import nodemailer from "nodemailer";

export default async function sendEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,      // smtp-relay.brevo.com
      port: Number(process.env.SMTP_PORT), // 587
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,  // 9d34…
        pass: process.env.EMAIL_PASS   // xsmtpsib-...
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: `"GausamVardhan" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("📧 OTP email sent!");
  } catch (err) {
    console.log("❌ Email error:", err.message);
  }
}
