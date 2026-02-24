import jwt from "jsonwebtoken";

// Make sure you have cookie-parser middleware in your app
// app.use(cookieParser());

export const verifyToken = (req, res, next) => {
  try {
 
    
    // 1️⃣ Get token from cookies
    const token = req.cookies?.token;
 

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user info to request
    req.user = decoded; // decoded contains { id, role }

    next(); // allow next middleware/route handler
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
