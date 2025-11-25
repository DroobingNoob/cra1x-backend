// controllers/cartController.js
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.visible)
      return res
        .status(400)
        .json({ message: "This product is currently unavailable." });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) wishlist = new Wishlist({ userId, items: [] });

    const existingItem = wishlist.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    } else {
      wishlist.items.push({ productId });
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      userId: req.user.id,
    }).populate("items.productId");

    if (!wishlist) return res.json({ items: [] });

    // Filter out hidden or deleted products
    const visibleItems = wishlist.items.filter(
      (item) => item.productId && item.productId.visible
    );

    // Auto-remove hidden ones
    if (visibleItems.length !== wishlist.items.length) {
      wishlist.items = visibleItems;
      await wishlist.save();
    }

    res.json({ ...wishlist.toObject(), items: visibleItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const updateCartItem = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const { quantity } = req.body;

//     const cart = await Cart.findOneAndUpdate(
//       { userId: req.user.id, "items._id": itemId },
//       { $set: { "items.$.quantity": quantity } },
//       { new: true }
//     ).populate("items.productId");

//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate("items.productId");

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
