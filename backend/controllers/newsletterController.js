import Newsletter from "../models/Newsletter.js";
import nodemailer from "nodemailer";

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSub = new Newsletter({ email });
    await newSub.save();

    // --- Send confirmation email ---
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Subscription Confirmed - WERQAMA SACCO",
      html: `
        <h3>Thank you for subscribing to WERQAMA SACCO Newsletter!</h3>
        <p>You will now receive the latest updates and financial tips.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email error:", err);
      } 
    });

    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNewsletterCount = async (req, res) => {
  try {
    const count = await Newsletter.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

