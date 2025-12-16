import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectionDB from "./db/db.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import smallBannerRoutes from "./routes/smallBannerRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import gheeProductRoutes from "./routes/gheeProductRoutes.js";
import masalaProductRoutes from "./routes/masalaProductRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import oilProductRoutes from "./routes/oilProductRoutes.js";
import cupRoutes from "./routes/cupRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";
import workerAdminRoutes from "./routes/workerAdminRoutes.js";
import googleauth from "./routes/googleauth.js"
import videoAdvertiseRoutes from "./routes/videoAdvertiseRoutes.js"
import agarbattiRoutes from "./routes/agarbattiRoutes.js"
import ganpatiRoutes from "./routes/ganpatiRoutes.js"
import newsletterRoutes from "./routes/newsletterRoutes.js"

// seo
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

// dotenv config
dotenv.config();

// mongodb config
connectionDB();

const app = express();

app.use(express.json());

// ✅ Correct CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:3000",       // local frontend
      "https://gausamvardhan.com",   // live frontend
      "https://www.gausamvardhan.com"
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// Routes
app.use("/googleauth", googleauth);
app.use("/api/agarbatti", agarbattiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/smallbanners", smallBannerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ghee-products", gheeProductRoutes);
app.use("/api/masala-products", masalaProductRoutes);
app.use("/api/oils", oilProductRoutes);
app.use("/api/ganpati", ganpatiRoutes);
app.use("/api/cup", cupRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", chatRoutes);
app.use("/api/counter", counterRoutes);
app.use("/api/workeradmin", workerAdminRoutes);
app.use("/api/videoadvertise", videoAdvertiseRoutes);
app.use("/api/newsletter", newsletterRoutes)


// ser start 

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(__dirname, "public/robots.txt"));
});

app.get("/sitemap.xml", async (req, res) => {
  try {
    const staticLinks = [
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/contact-us", changefreq: "monthly", priority: 0.7 },
      { url: "/about", changefreq: "monthly", priority: 0.8 },
      { url: "/faq", changefreq: "monthly", priority: 0.7 },
      { url: "/privacy-policy", changefreq: "monthly", priority: 0.7 },
      { url: "/shipping-returns", changefreq: "monthly", priority: 0.7 },
    ];

    const stream = new SitemapStream({ hostname: "https://www.gausamvardhan.com" });
    res.writeHead(200, { "Content-Type": "application/xml" });

    const xmlString = await streamToPromise(Readable.from(staticLinks).pipe(stream));
    res.end(xmlString.toString());
  } catch (err) {
    console.error("Sitemap Error:", err);
    res.status(500).send("Server Error generating sitemap");
  }
});

// seo end 
app.get("/", (req, res) => {
  res.send("hello world");
});


app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});