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
import loanRoutes from './routes/loans.js';
import dashboardRoutes from './routes/dashboard.js';
import profileRoutes from './routes/profile.js';
import paymentRoutes from './routes/payment.js';

// Initialize environment
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware

app.use(cors({
    origin: 'http://localhost:3000', // frontend origin
    credentials: true,               // allow cookies/credentials
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
    startPaymentReminders();
});