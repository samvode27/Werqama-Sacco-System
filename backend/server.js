import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import multer from 'multer';
import { startPaymentReminders } from './cron/paymentReminder.js';

// Routes
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import newsRoutes from './routes/news.js';
import serviceRoutes from './routes/services.js';
import contactRoutes from './routes/contacts.js';
import savingRoutes from './routes/savings.js';
import loanRoutes from './routes/loanApplicationRoutes.js';
import dashboardRoutes from './routes/dashboard.js';
import profileRoutes from './routes/profile.js';
import paymentRoutes from './routes/payment.js';
import membershipRoutes from './routes/membershipRoutes.js';
import loanApplicationRoutes from './routes/loanApplicationRoutes.js';
import newsletterRoutes from "./routes/newsletterRoutes.js";


// Initialize environment
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware

const allowedOrigins = [
  'https://werqama-sacco-3guv.vercel.app', // ✅ your Vercel frontend
  'http://localhost:3000' // ✅ for local development
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // ✅ Added PATCH here
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded receipts
app.use("/uploads/receipts", express.static(path.join(__dirname, "uploads/receipts")));

app.use("/uploads/news", express.static(path.join(__dirname, "uploads/news")));

app.use("/uploads/idDocuments", express.static(path.join(__dirname, "uploads/idDocuments")));

app.use('/uploads/profilePictures', express.static(path.join(process.cwd(), 'uploads/profilePictures')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/savings', savingRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes); 
app.use('/api/memberships', membershipRoutes);
app.use('/api/loan-applications', loanApplicationRoutes);
app.use("/api/newsletter", newsletterRoutes);


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(500).json({ message: err.message });
    }
    next();
});
// Root
app.get('/', (req, res) => {
    res.send('WERQAMA SACCO Backend API is running...');
});

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
    startPaymentReminders();
});