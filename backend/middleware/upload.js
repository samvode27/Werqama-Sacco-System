// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Map field names to subfolders
const folderMap = {
  receipt: "uploads/receipts",
  newsImage: "uploads/news",
  idDocument: "uploads/idDocuments",
};

// ✅ Configure storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Pick folder based on fieldname
    const uploadPath = folderMap[file.fieldname] || "uploads/others";

    // Ensure folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// ✅ File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png) and PDFs are allowed"), false);
  }
};

// ✅ Export multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
