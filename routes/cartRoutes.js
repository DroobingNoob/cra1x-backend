// routes/cartRoutes.js
import express from "express";
import { addToCart, getCart, updateCartItem, removeFromCart } from "../controllers/cartController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyUser, addToCart);
router.get("/", verifyUser, getCart);
router.put("/:itemId", verifyUser, updateCartItem);
router.delete("/:itemId", verifyUser, removeFromCart);

export default router;
