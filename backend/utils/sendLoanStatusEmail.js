import nodemailer from 'nodemailer';

// Optional: load from environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_email_password',
  },
});

const sendLoanStatusEmail = async (to, status) => {
  const subject = `Loan ${status.charAt(0).toUpperCase() + status.slice(1)}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #007bff;">WERQAMA SACCO Notification</h2>
      <p>Hello,</p>
      <p>Your loan application has been <strong style="text-transform: uppercase; color: ${status === 'approved' ? 'green' : 'red'};">${status}</strong>.</p>
      <p>If you have any questions, please contact the SACCO office.</p>
      <br />
      <p>Thank you,</p>
      <p><strong>WERQAMA SACCO Team</strong></p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"WERQAMA SACCO" <${process.env.EMAIL_USER || 'your_email@gmail.com'}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to} for loan ${status}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

export default sendLoanStatusEmail;
