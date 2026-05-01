import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import multer from 'multer';
import { startPaymentReminders } from './cron/paymentReminder.js';

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
import statsRoutes from './routes/statsRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const startServer = async () => {
  try {

    await connectDB();

    const app = express();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const allowedOrigins = [
      "http://localhost:3000",
      "https://werqama-sacco-system.vercel.app"
    ];

    app.use(cors({
      origin: allowedOrigins,
      credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

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
    app.use('/api/newsletter', newsletterRoutes);
    app.use('/api/stats', statsRoutes);

    app.get('/', (req, res) => {
      res.send('WERQAMA SACCO Backend API is running...');
    });

    app.use(errorHandler);

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startPaymentReminders();
    });

  } catch (error) {
    console.error("Server failed:", error.message);
    process.exit(1);
  }
};

startServer();