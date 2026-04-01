const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const OTP = require('../models/OTP');
const { loginLimiter } = require('../middleware/rateLimiters');
const transporter = require('../config/nodemailer');

// Helper to send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'yatraviholidays@gmail.com',
    to: email,
    subject: '🔐 Yatravi Admin Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #CD1C18; margin: 0;">Yatravi</h1>
          <p style="color: #666; margin: 5px 0;">Admin Panel</p>
        </div>
        <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 10px;">Your Login OTP</h2>
          <p style="color: #666; margin-bottom: 20px;">Use this code to access the admin panel:</p>
          <div style="background: #CD1C18; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 30px; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">This code expires in 5 minutes</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// --- OTP Logic ---
// Note: sendOTPEmail is typically in a separate service, but for now we'll pass the transporter or just use console log if not configured.

// Send OTP Route
router.post('/send-otp', loginLimiter, async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'This email is not registered as admin' });
    }
    await OTP.deleteMany({ email: email.toLowerCase() });
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // Send OTP via email
    try {
      if (process.env.EMAIL_PASS) {
        await sendOTPEmail(email, otp);
      } else {
        console.log(`⚠️ SMTP not configured. Bypassing email send.`);
      }
    } catch (mailError) {
      console.error('Email Send Error (continuing...):', mailError.message);
    }

    console.log(`\n-----------------------------------------`);
    console.log(`🔑 LOCAL AUTH OTP: ${otp} (for ${email})`);
    console.log(`-----------------------------------------\n`);

    res.json({ success: true, message: 'OTP generated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP Route
router.post('/verify-otp', loginLimiter, async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp: otp,
      expiresAt: { $gt: new Date() }
    });
    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }
    await OTP.deleteMany({ email: email.toLowerCase() });
    const token = jwt.sign(
      { id: admin._id, sessionVersion: admin.sessionVersion || 0 },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.cookie('admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
