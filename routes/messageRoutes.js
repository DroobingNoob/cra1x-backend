import express from "express";
import { submitMessage,getAllMessages } from "../controllers/messageController.js";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", submitMessage);          // Public → everyone can send message
router.get("/", verifyUser, verifyAdmin, getAllMessages);  // Admin only

export default router;
