import express from "express";
import { getAllEmails, subscribeUser, deleteEmail } from "../controllers/newsletterController.js";
import { verifyAdmin, verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/subscribe", subscribeUser);
router.get("/all", verifyUser, verifyAdmin, getAllEmails);
router.delete("/:id", verifyToken, verifyAdmin, deleteEmail);


export default router;
