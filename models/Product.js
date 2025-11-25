import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    actual_price: { type: Number, required: true },
    discounted_price: { type: Number , required: true },
    stock: { type: Number, default: 0, required: true },
    visible: { type: Boolean, default: true },
    bestseller: { type: Boolean, default: false },
    images: [String], // store Base64 URLs (as in your frontend)
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
