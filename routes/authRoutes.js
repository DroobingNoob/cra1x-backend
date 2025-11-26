import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { registerUser, loginUser, getAllUsers, getUserDetails } from "../controllers/authController.js";
import { verifyUser, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Email-password auth
router.post("/register", registerUser);
router.post("/login", loginUser);



// Google SSO
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
   const payload = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.profilePicture,
 // <-- include the profile picture
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Redirect back to frontend with token
    // res.redirect(`http://localhost:5173?token=${token}`);
    res.redirect(`http://72.61.227.209:4173?token=${token}`);
  }
);

router.get("/check-admin", verifyUser, (req, res) => {
  const allowedAdmins = ["aayushdasgupta0408@gmail.com","cra1xwebsite@gmail.com","cra1x.queries@gmail.com"]; // add more if needed
  console.log("Decoded user:", req.user);
  const isAdmin = req.user && allowedAdmins.includes(req.user.email);
  res.json({ isAdmin });
});

router.get("/", verifyUser, verifyAdmin, getAllUsers);
router.get("/:userId", verifyUser, verifyAdmin, getUserDetails);


export default router;
