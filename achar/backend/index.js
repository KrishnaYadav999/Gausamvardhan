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
import orderRoutes from "./routes/orderRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";
import workerAdminRoutes from "./routes/workerAdminRoutes.js";
import googleauth from "./routes/googleauth.js"
import videoAdvertiseRoutes from "./routes/videoAdvertiseRoutes.js"

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
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/smallbanners", smallBannerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ghee-products", gheeProductRoutes);
app.use("/api/masala-products", masalaProductRoutes);
app.use("/api/oils", oilProductRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", chatRoutes);
app.use("/api/counter", counterRoutes);
app.use("/api/workeradmin", workerAdminRoutes);
app.use("/api/videoadvertise", videoAdvertiseRoutes);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on ${process.env.PORT}`);
});
