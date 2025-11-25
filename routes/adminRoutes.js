import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats",verifyUser, verifyAdmin, getAdminStats);

export default router;
