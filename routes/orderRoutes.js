import express from "express";
import Order from "../models/Order.js";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post("/create", verifyUser, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentInfo,
      promoCode,
      totalAmount,
      codFee
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items found" });
    }

    const orderData = {
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      promoCode,
      totalAmount,
    };

    if (paymentMethod === "Prepaid") {
      if (!paymentInfo?.razorpay_payment_id) {
        return res.status(400).json({ message: "Payment info missing for prepaid order" });
      }

      orderData.paymentInfo = {
        razorpay_payment_id: paymentInfo.razorpay_payment_id,
        amountPaid: paymentInfo.amountPaid,
        status: "Paid",
      };

      orderData.orderStatus = "Processing";
      orderData.codFee = 0;
      orderData.amountRemaining = 0;
    }

    if (paymentMethod === "COD") {
      if (!paymentInfo?.razorpay_payment_id) {
        return res.status(400).json({
          message: "₹100 COD confirmation fee must be prepaid"
        });
      }

      orderData.codFee = codFee || 100;
      orderData.amountRemaining = totalAmount;

      orderData.paymentInfo = {
        razorpay_payment_id: paymentInfo.razorpay_payment_id,
        amountPaid: codFee || 100,
        status: "Paid",
      };

      orderData.orderStatus = "Processing";
    }

    const createdOrder = await Order.create(orderData);

    // Clear cart
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });

    res.status(201).json({
      message: "Order created successfully",
      order: createdOrder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
});


// ✅ Get logged-in user's orders
router.get("/my-orders", verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/all", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
});

// PUT /api/orders/:id/status
router.put("/:id/status", verifyUser, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const order = await Order.findByIdAndUpdate(
    id,
    { orderStatus },
    { new: true }
  );

  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json({ message: "Order status updated", order });
});


export default router;
