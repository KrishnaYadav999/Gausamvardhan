import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = path.join(process.cwd(), "invoices");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const filePath = path.join(dir, `invoice_${order.orderNumber}.pdf`);
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(18).text("Gau Samvardhan", { align: "center" });
      doc.moveDown();

      doc.fontSize(10);
      doc.text(`Invoice No: ${order.invoiceNumber}`);
      doc.text(`Order No: ${order.orderNumber}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Payment: ${order.paymentMethod}`);
      doc.moveDown();

      doc.text("Items:", { underline: true });
      order.products.forEach((p) => {
        doc.text(`${p.name} | Qty: ${p.quantity} | ₹${p.price} = ₹${p.quantity * p.price}`);
      });

      doc.moveDown();
      doc.fontSize(12).text(`Total Amount: ₹${order.totalAmount}`, { bold: true });

      doc.end();

      stream.on("finish", () => resolve(filePath));
    } catch (err) {
      reject(err);
    }
  });
};

export default generateInvoicePDF;
