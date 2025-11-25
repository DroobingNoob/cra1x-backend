// routes/cartRoutes.js
import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyUser, addToWishlist);
router.get("/", verifyUser, getWishlist);
// router.put("/:itemId", verifyUser, updateCartItem);
router.delete("/:itemId", verifyUser, removeFromWishlist );

export default router;
