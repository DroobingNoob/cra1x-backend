// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
      if (!product.visible)
      return res
        .status(400)
        .json({ message: "This product is currently unavailable." });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
//     res.json(cart || { items: [] });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );

    if (!cart) return res.json({ items: [] });

    // Filter out hidden or deleted products
    const visibleItems = cart.items.filter(
      (item) => item.productId && item.productId.visible
    );

    // Auto-remove hidden ones from DB
    if (visibleItems.length !== cart.items.length) {
      cart.items = visibleItems;
      await cart.save();
    }

    res.json({ ...cart.toObject(), items: visibleItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id, "items._id": itemId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    ).populate("items.productId");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    ).populate("items.productId");

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
