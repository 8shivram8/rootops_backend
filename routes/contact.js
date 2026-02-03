const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const sendEmail = require("../config/email");

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Save to DB FIRST
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    // ✅ Respond immediately (IMPORTANT)
    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });

    // ================================
    // 🔁 EMAILS RUN IN BACKGROUND
    // ================================
    const userEmailHtml = `
      <h2>Thank you for contacting RootOps!</h2>
      <p>Hi ${name},</p>
      <p>We received your inquiry and will get back to you soon.</p>
      <br/>
      <h3>Your Message:</h3>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
      <br/>
      <p>Best regards,<br/>RootOps Team</p>
    `;

    const adminEmailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Fire-and-forget emails (NO await)
    sendEmail(email, "Thank You for Contacting RootOps", userEmailHtml)
      .catch(err => console.error("User email failed:", err));

    sendEmail(process.env.ADMIN_EMAIL, `New Inquiry: ${subject}`, adminEmailHtml)
      .catch(err => console.error("Admin email failed:", err));

  } catch (error) {
    console.error("Contact API Error:", error);
    return res.status(500).json({
      error: "An error occurred while processing your request",
    });
  }
});

module.exports = router;
