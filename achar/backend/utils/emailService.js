import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional transporter test
transporter.verify((err, success) => {
  if (err) console.error("Email transporter error:", err);
  else console.log("✅ Email transporter ready");
});

export const sendInvoiceEmail = async ({ to, subject, text, attachmentPath }) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
      attachments: attachmentPath
        ? [
            {
              filename: "invoice.pdf",
              path: attachmentPath,
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err;
  }
};
