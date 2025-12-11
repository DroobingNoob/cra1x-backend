import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import {
  addReview,
  getProductReviews,
  editReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Add review
router.post("/", verifyUser, addReview);

// Get all reviews for a product
router.get("/:productId", getProductReviews);

// Edit review
router.put("/edit/:id", verifyUser, editReview);

// Delete review
router.delete("/delete/:id", verifyUser, deleteReview);

export default router;
