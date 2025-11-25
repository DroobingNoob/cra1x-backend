import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "dotenv/config";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
// app.use(cors({
//   // origin: "http://localhost:5173",
//    origin: [
//     "https://cra1123x.vercel.app",
//     "https://mitzi-purehearted-delila.ngrok-free.dev"
//   ],
//   // origin:"https://cra1123x.vercel.app/",
//   credentials: true,
// }));
app.use(cors({
  origin: [
    "https://cra1123x.vercel.app",
    "https://associate-quick-arrested-surplus.trycloudflare.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cors());
app.use(passport.initialize());

app.post("/test", (req, res) => {
  console.log("Received body:", req.body);
  res.json({ received: req.body });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

app.get("/", (req, res) => res.send("Backend running successfully!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
