import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/* ================= COMPANY CONFIG ================= */
const COMPANY = {
  name: "Gau Samvardhan",
  address:
    "BLDG NO. A-18, FLAT NO-303, DAFFODILS, SHRUSHTI, AMBARNATH, MAHARASHTRA – 421503, INDIA",
  phone: "+91 9326539055",
  email: "customercare@gausamvardhan.com",
  gstin: "27ABOCS1120M1Z4",
  state: "maharashtra",
};

/* ================= HELPERS ================= */
const paymentLabel = (m) =>
  m?.toLowerCase() === "cod" ? "Cash on Delivery" : "Online Payment";

const sameStateGST = (buyerState) =>
  buyerState?.toLowerCase() === COMPANY.state.toLowerCase();

/* ================= MAIN ================= */
const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const invoiceDir = path.join(process.cwd(), "invoices");
      if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

      const filePath = path.join(
        invoiceDir,
        `Invoice_${order.orderNumber}.pdf`
      );

      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      /* ================= ADDRESS SAFE ================= */
      const billing = order.billingAddress || order.shippingAddress || {};
      const shipping = order.shippingAddress || billing;

      const isSameState = sameStateGST(shipping.state);

      /* ================= HEADER ================= */
      doc.font("Helvetica-Bold").fontSize(18).text("TAX INVOICE", {
        align: "right",
      });

      doc.moveDown(1);

      doc.fontSize(12).font("Helvetica-Bold").text(COMPANY.name);
      doc.font("Helvetica").fontSize(10).text(COMPANY.address, { width: 250 });
      doc.text(`GSTIN: ${COMPANY.gstin}`);
      doc.text(`Phone: ${COMPANY.phone}`);
      doc.text(`Email: ${COMPANY.email}`);

      doc.moveDown(2);

      /* ================= ORDER META ================= */
      doc.font("Helvetica-Bold");
      doc.text(`Invoice No: ${order.invoiceNumber}`);
      doc.text(`Order No: ${order.orderNumber}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-GB")}`);
      doc.text(`Payment: ${paymentLabel(order.paymentMethod)}`);

      doc.moveDown(2);

      /* ================= ADDRESSES ================= */
      const startY = doc.y;

      doc.font("Helvetica-Bold").text("BILLING ADDRESS", 40, startY);
      doc.text("SHIPPING ADDRESS", 320, startY);

      doc.font("Helvetica").fontSize(10);

      const billingText = `
${billing.name || ""}
${billing.address || ""}
${billing.city || ""}, ${billing.state || ""} - ${billing.pincode || ""}
${billing.country || ""}
Phone: ${billing.phone || ""}
`.trim();

      const shippingText = `
${shipping.name || ""}
${shipping.address || ""}
${shipping.city || ""}, ${shipping.state || ""} - ${shipping.pincode || ""}
${shipping.country || ""}
Phone: ${shipping.phone || ""}
`.trim();

      const billHeight = doc.heightOfString(billingText, { width: 220 });
      const shipHeight = doc.heightOfString(shippingText, { width: 220 });

      doc.text(billingText, 40, startY + 15, { width: 220 });
      doc.text(shippingText, 320, startY + 15, { width: 220 });

      doc.y = startY + Math.max(billHeight, shipHeight) + 30;

      /* ================= TABLE HEADER ================= */
      doc.moveDown(1);
      const tableTop = doc.y;

      const col = {
        item: 40,
        qty: 260,
        rate: 300,
        taxable: 360,
        gst: 440,
        total: 510,
      };

      doc.font("Helvetica-Bold");
      doc.text("Item", col.item, tableTop);
      doc.text("Qty", col.qty, tableTop);
      doc.text("Rate", col.rate, tableTop);
      doc.text("Taxable", col.taxable, tableTop);
      doc.text(isSameState ? "CGST+SGST" : "IGST", col.gst, tableTop);
      doc.text("Total", col.total, tableTop);

      let y = tableTop + 15;
      doc.font("Helvetica");

      let subtotal = 0;

      order.products.forEach((p) => {
        const qty = p.quantity;
        const rate = p.price;
        const taxable = qty * rate;
        subtotal += taxable;

        const gstText = isSameState ? "2.5% + 2.5%" : "5%";

        doc.text(p.name, col.item, y, { width: 200 });
        doc.text(qty.toString(), col.qty, y);
        doc.text(`₹${rate.toFixed(2)}`, col.rate, y);
        doc.text(`₹${taxable.toFixed(2)}`, col.taxable, y);
        doc.text(gstText, col.gst, y);
        doc.text(`₹${taxable.toFixed(2)}`, col.total, y);

        y += 20;
      });

      /* ================= TOTAL ================= */
      y += 10;
      doc.font("Helvetica-Bold");

      doc.text(`Grand Total: ₹${order.totalAmount.toFixed(2)}`, col.total - 80, y);

      y += 20;
      doc.font("Helvetica").fontSize(9);
      doc.text(
        "✔ GST shown for compliance only. Amount already included in total.",
        40,
        y
      );

      /* ================= CANCELLED ================= */
      if (order.isCancelled) {
        doc.fillColor("red").fontSize(40).opacity(0.3);
        doc.text("CANCELLED", 150, 350, { angle: 45 });
        doc.opacity(1).fillColor("black");
      }

      /* ================= FOOTER ================= */
      doc.moveDown(4);
      doc.fontSize(9).text(
        "This is a system generated invoice. No signature required.",
        { align: "center" }
      );

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

export default generateInvoicePDF;
