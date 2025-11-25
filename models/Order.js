import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    paymentInfo: {
      razorpay_payment_id: { type: String, required: true },
      amountPaid: { type: Number, required: true },
      status: { type: String, default: "Paid" },
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Prepaid"],
        required: true,
    },
    codFee: {
        type: Number,
        default: 0,
    },
    amountRemaining: {
        type: Number,
        default: 0,
    },
    promoCode: {
      code: { type: String },
      discount: { type: Number },
    },
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      default: "Processing",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
