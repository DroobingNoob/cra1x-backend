// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

   console.log("🔍 Incoming auth header:", authHeader);

  console.log("Auth Header:", req.headers.authorization);


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // e.g. { id: user._id }
     console.log("✅ Decoded user:", decoded);

    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const verifyAdmin = (req, res, next) => {
    console.log("🧠 Checking admin access for:", req.user?.email);
  // if (!req.user || req.user.email !== "aayushdasgupta0408@gmail.com" || req.user.email !== "cra1xwebsite@gmail.com" || req.user.email !== "cra1x.queries@gmail.com") {
  //   return res.status(403).json({ message: "Access denied" });
  // }
  if (
    !req.user || 
    !["aayushdasgupta0408@gmail.com", "cra1xwebsite@gmail.com", "cra1x.queries@gmail.com"].includes(req.user.email)
  ) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};