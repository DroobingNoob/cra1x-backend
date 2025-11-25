import express from "express";
import {
  getCoupons,
  getCoupon,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  verifyCoupon
} from "../controllers/couponController.js";
import { verifyUser,verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCoupons);
router.get("/:id", getCoupon);
router.post("/",verifyUser,verifyAdmin, addCoupon);
router.put("/:id",verifyUser,verifyAdmin, updateCoupon);
router.delete("/:id",verifyUser,verifyAdmin, deleteCoupon);
router.post("/verify", verifyCoupon);

export default router;
