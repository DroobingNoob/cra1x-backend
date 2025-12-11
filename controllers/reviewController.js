import Review from "../models/Review.js";
import Order from "../models/Order.js";

// ⭐ Add review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if purchased
    const hasBought = await Order.findOne({
      user: userId,
      "orderItems.productId": productId,
    });

    if (!hasBought) {
      return res.status(403).json({
        message: "You can review only products you have purchased.",
      });
    }

    const newReview = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to add review" });
  }
};

// ⭐ Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// ⭐ Edit review
export const editReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can edit only your own review",
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    res.json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update review" });
  }
};

// ⭐ Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review)
      return res.status(404).json({ message: "Review not found" });

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can delete only your own review",
      });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
