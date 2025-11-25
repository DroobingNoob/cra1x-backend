import Coupon from "../models/Coupon.js";

// Get all coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single coupon
export const getCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new coupon
export const addCoupon = async (req, res) => {
  try {
    const { code, discount, maxAmount, minimumAmountValue, validFrom, expiry } = req.body;

    const existing = await Coupon.findOne({ code });
    if (existing)
      return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code,
      discount,
      maxAmount,
      minimumAmountValue,
      validFrom,
      expiry,
    });

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon updated successfully", coupon: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const verifyCoupon = async (req, res) => {
  const { couponCode, cartTotal } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon)
      return res.json({ valid: false, message: "Invalid coupon" });

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.expiry)
      return res.json({ valid: false, message: "Coupon expired" });

    // ✅ Check minimum cart total
    if (cartTotal < coupon.minimumAmountValue)
      return res.json({
        valid: false,
        message: `Minimum cart amount should be ₹${coupon.minimumAmountValue} to use this coupon.`,
      });

    // ✅ Calculate discount
    let discountValue = (cartTotal * coupon.discount) / 100;
    if (discountValue > coupon.maxAmount) {
      discountValue = coupon.maxAmount; // cap at max discount limit
    }

    const finalTotal = cartTotal - discountValue;

    return res.json({
      valid: true,
      message: "Coupon applied successfully",
      discountValue,
      finalTotal,
      coupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ valid: false, message: "Server error" });
  }
};
