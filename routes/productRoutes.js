import express from "express";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  stockUpdate,
  getNewArrivals,
  getRelatedProducts
} from "../controllers/productController.js";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/related/:id", getRelatedProducts);
router.get("/:id", getProductById);



// User
router.patch("/:id/decrement-stock", verifyUser, stockUpdate);

// Admin
router.post("/", verifyUser, verifyAdmin, addProduct);
router.put("/:id", verifyUser, verifyAdmin, updateProduct);
router.delete("/:id", verifyUser, verifyAdmin, deleteProduct);

export default router;
