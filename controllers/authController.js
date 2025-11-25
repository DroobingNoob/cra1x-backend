import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (!user.password)
      return res.status(400).json({ message: "This account uses Google login" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // get all users
    const users = await User.find({}, "name email createdAt"); // only pick safe fields

    // Optional: If you want to include order count
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const cart = await Cart.findOne({ userId: user._id });
        const wishlist = await Wishlist.findOne({ userId: user._id });
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          cartCount: cart ? cart.items.length : 0,
          cartItems: cart ? cart.items : [],
          wishlistCount: wishlist ? wishlist.items.length : 0,
          wishlistItems: wishlist ? wishlist.items : [],
        };
      })
    );

    res.json(usersWithOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Fetch full details (only when modal opens)
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");

    const cartItems = cart
      ? cart.items.map((i) => ({
          id: i._id,
          name: i.productId?.name,
          image: i.productId?.images?.[0],
          price: i.productId?.discounted_price,
          quantity: i.quantity,
        }))
      : [];

    const wishlistItems = wishlist
      ? wishlist.items.map((i) => ({
          id: i._id,
          name: i.productId?.name,
          image: i.productId?.images?.[0],
          price: i.productId?.discounted_price,
        }))
      : [];

    res.json({ cartItems, wishlistItems });
  } catch (error) {
    console.error("Admin get user details error:", error);
    res.status(500).json({ message: error.message });
  }
};