import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";


// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload folder
const UPLOAD_FOLDER = path.join(__dirname, "public/uploads");

// Ensure upload folder exists
try {
  if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
  }
} catch (err) {
  console.error("❌ Failed to create upload folder:", err);
  throw new Error("File upload directory setup failed");
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_FOLDER),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`));
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
});

// --------------------
// Middleware wrapper for multiple files
// --------------------
export const addFilesMiddleware = (fieldsConfig) => (req, res, next) => {



  const handler = upload.fields(fieldsConfig);

  handler(req, res, (err) => {
    if (err) {
      console.error("❌ File upload error:", err);
      return next(err); // Pass to global Express error handler
    }
    next(); // continue to next middleware/controller
  });
};
