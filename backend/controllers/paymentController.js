import axios from 'axios';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Saving from '../models/Saving.js';
import { sendEmail } from '../utils/emailSender.js';

// Initialize Chapa Payment
export const initializeChapaPayment = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found.');
    }

    if (!user.email || !user.email.includes('@')) {
        res.status(400);
        throw new Error('User email is missing or invalid. Please update your profile with a valid email.');
    }

    const tx_ref = `WERQAMA_${Date.now()}`;

    const paymentData = {
        amount,
        currency: 'ETB',
        email: user.email,
        first_name: user.name || 'Member',
        last_name: '',
        tx_ref,
        return_url: `${process.env.FRONTEND_URL}/savings?status=success&tx_ref=${tx_ref}`,
        callback_url: `${process.env.BASE_URL}/api/payment/chapa/webhook`,
        customization: {
            title: 'WERQAMA SACCO',
            description: 'Monthly Savings',
        },
    };

    try {
        const response = await axios.post(
            'https://api.chapa.co/v1/transaction/initialize',
            paymentData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                },
            }
        );
        res.json({ checkout_url: response.data.data.checkout_url });
    } catch (error) {
        console.error("==== CHAPA INIT ERROR ====");
        console.error(error.response?.data || error.message, error.stack);
        res.status(500).json({
            message: 'Failed to initialize payment',
            error: error.response?.data || error.message
        });
    }
});

// Chapa Webhook Handler with Email Notification
export const chapaWebhook = asyncHandler(async (req, res) => {
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));

    if (req.body.event === 'charge.success' && req.body.status === 'success') {
        const { email, amount, tx_ref } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            console.error('User not found for webhook email:', email);
            return res.status(404).json({ message: 'User not found for this email.' });
        }

        const saving = new Saving({
            member: user._id,
            amount,
            method: 'Chapa',
            tx_ref,
            date: new Date(),
        });

        await saving.save();
        console.log('Saving recorded from webhook:', saving);

        // Send Email Notification
        const subject = 'WERQAMA SACCO: Payment Received';
        const html = `
            <p>Dear ${user.name || 'Member'},</p>
            <p>We have successfully received your payment of <strong>ETB ${amount}</strong> via Chapa.</p>
            <p>
                Reference: <strong>${tx_ref}</strong><br>
                Date: ${new Date().toLocaleString()}
            </p>
            <p>Thank you for saving with WERQAMA SACCO.</p>
            <p>Best regards,<br/>WERQAMA SACCO Team</p>
        `;

        try {
            await sendEmail(user.email, subject, html);
            console.log(`📧 Payment confirmation email sent to ${user.email}`);
        } catch (error) {
            console.error('❌ Failed to send payment confirmation email:', error);
        }

        res.sendStatus(200);
    } else {
        console.log('Webhook received non-success status:', req.body.status);
        res.sendStatus(400);
    }
});
