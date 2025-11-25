import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discount: {
      type: Number, // percentage
      required: true,
      min: 0,
    },
    maxAmount: {
      type: Number, // maximum discount value
      required: true,
      min: 0,
    },
    minimumAmountValue: {
      type: Number, // minimum cart total required
      required: true,
      min: 0,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
