import express from "express";
import { getAllEmails, subscribeUser } from "../controllers/newsletterController.js";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/subscribe", subscribeUser);
router.get("/all", verifyUser, verifyAdmin, getAllEmails);


export default router;
