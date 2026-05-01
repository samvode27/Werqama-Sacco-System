import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { startPaymentReminders } from "./cron/paymentReminder.js";

// Routes
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import newsRoutes from "./routes/news.js";
import serviceRoutes from "./routes/services.js";
import contactRoutes from "./routes/contacts.js";
import savingRoutes from "./routes/savings.js";
import loanRoutes from "./routes/loanApplicationRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import profileRoutes from "./routes/profile.js";
import paymentRoutes from "./routes/payment.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import loanApplicationRoutes from "./routes/loanApplicationRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();


// ========================================
// Fix __dirname for ES modules
// ========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ========================================
// Connect MongoDB
// ========================================
connectDB();


// ========================================
// CORS Configuration
// ========================================
const allowedOrigins = [
  "http://localhost:3000",
  "https://werqama-sacco-system.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {

      // allow requests without origin (mobile apps / postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true
  })
);


// ========================================
// Body Parsers
// ========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ========================================
// Static File Serving
// ========================================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use(
  "/uploads/receipts",
  express.static(path.join(__dirname, "uploads/receipts"))
);

app.use(
  "/uploads/news",
  express.static(path.join(__dirname, "uploads/news"))
);

app.use(
  "/uploads/idDocuments",
  express.static(path.join(__dirname, "uploads/idDocuments"))
);

app.use(
  "/uploads/profilePictures",
  express.static(path.join(__dirname, "uploads/profilePictures"))
);


// ========================================
// API Routes
// ========================================
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/savings", savingRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/loan-applications", loanApplicationRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/stats", statsRoutes);


// ========================================
// Root Route
// ========================================
app.get("/", (req, res) => {
  res.send("WERQAMA SACCO Backend API is running...");
});


// ========================================
// Multer Error Handler
// ========================================
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }

  next();
});


// ========================================
// Global Error Handler
// ========================================
app.use(errorHandler);


// ========================================
// Start Server
// ========================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // start cron jobs
  startPaymentReminders();
});