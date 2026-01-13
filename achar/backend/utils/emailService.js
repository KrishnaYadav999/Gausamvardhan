import nodemailer from "nodemailer";

/* ================= SMTP TRANSPORTER ================= */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= VERIFY SMTP ================= */
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter error:", err);
  } else {
    console.log("✅ Email transporter ready");
  }
});

/* ================= SEND INVOICE EMAIL ================= */
export const sendInvoiceEmail = async ({
  to,
  subject = "Your Invoice from Gau Samvardhan",
  text,
  html,
  attachmentPath,
}) => {
  try {
    if (!to) {
      throw new Error("Recipient email address is required");
    }

    const mailOptions = {
      from: `"Gau Samvardhan" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text:
        text ||
        "Thank you for your order. Please find your invoice attached with this email.",
      html:
        html ||
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Thank you for your order!</h2>
          <p>Dear Customer,</p>
          <p>
            We have attached your invoice with this email.  
            Please keep it for your records.
          </p>
          <p>
            If you have any questions, feel free to contact us at  
            <b>${process.env.FROM_EMAIL}</b>
          </p>
          <br/>
          <p>Regards,</p>
          <p><b>Gau Samvardhan Team</b></p>
        </div>
      `,
      attachments: attachmentPath
        ? [
            {
              filename: "Invoice.pdf",
              path: attachmentPath,
              contentType: "application/pdf",
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw err;
  }
};

export default sendInvoiceEmail;
