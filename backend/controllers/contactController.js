import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

// POST /api/contact
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, reason, message } = req.body;

    if (!name || !email || !reason || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to DB
    const contact = await Contact.create({ name, email, reason, message });

    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // admin receives it
      subject: `New Contact Request: ${reason}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Message sent successfully", contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
