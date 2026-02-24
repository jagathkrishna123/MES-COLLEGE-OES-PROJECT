import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

import ControllerRoute from "./Routes/Controller/routes.js";
import TeacherRoute from "./Routes/Teacher/routes.js";
import StudentRoute from "./Routes/Student/route.js"

import cookieParser from 'cookie-parser'



const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser()) // ✅ REQUIRED
// CORS configuration (allow all origins)
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // allow cookies
}));

// logout route
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only HTTPS in production
    sameSite: "Strict",
    path: "/", // must match the path used when creating the cookie
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'Middleware/public/uploads')));
// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection using Mongoose
const MONGO_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Routes
app.use("/api", ControllerRoute);
app.use("/api", TeacherRoute);
app.use("/api", StudentRoute);

// Start server only after successful DB connection
mongoose.connection.once("open", () => {
  console.log("MongoDB connection is ready");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
