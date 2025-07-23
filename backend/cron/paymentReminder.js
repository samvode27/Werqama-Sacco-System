import cron from 'node-cron';
import User from '../models/User.js';
import { sendEmail } from '../utils/emailSender.js';

export const startPaymentReminders = () => {
    // Runs at 8 AM on the 1st of every month
    cron.schedule('0 8 28 * *', async () => {
        console.log('Running monthly payment reminders...');

        try {
            const members = await User.find({ role: 'member', status: 'active' });

            for (const member of members) {
                await sendEmail(
                    member.email,
                    'Monthly Savings Reminder - WERQAMA SACCO',
                    `<p>Dear ${member.name},</p>
                    <p>This is a friendly reminder to make your monthly savings contribution to WERQAMA SACCO.</p>
                    <p>Consistent contributions enable you to:</p>
                    <ul>
                        <li>Remain in good standing for loan eligibility</li>
                        <li>Grow your savings consistently</li>
                        <li>Access SACCO services seamlessly</li>
                    </ul>
                    <p>Please visit your nearest SACCO office or use the Telebirr/Bank payment option to complete your payment.</p>
                    <p>Thank you for your continued cooperation.</p>
                    <p>WERQAMA SACCO Team</p>`
                );
            }

            console.log(`Payment reminders sent to ${members.length} members.`);
        } catch (error) {
            console.error('Error sending payment reminders:', error.message);
        }
    });
};
