const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const OTP = require('../models/OTP');
const { loginLimiter } = require('../middleware/rateLimiters');
const authMiddleware = require('../middleware/auth');
const transporter = require('../config/nodemailer');

// ─── Email Helpers ───────────────────────────────────────────────────────────

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

const sendLoginAlertEmail = async (email, name) => {
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const mailOptions = {
    from: process.env.EMAIL_USER || 'yatraviholidays@gmail.com',
    to: email,
    subject: '🔔 New Login - Yatravi Admin Panel',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #CD1C18; margin: 0;">Yatravi</h1>
          <p style="color: #666; margin: 5px 0;">Admin Panel Security Alert</p>
        </div>
        <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 12px; padding: 20px;">
          <h2 style="color: #856404; margin-top: 0;">New Login Detected</h2>
          <p style="color: #856404;">Hello ${name || 'Admin'},</p>
          <p style="color: #856404;">A new login was made to your Yatravi Admin Panel account.</p>
          <p style="color: #856404;"><strong>Time:</strong> ${time} (IST)</p>
          <p style="color: #856404; margin-bottom: 0;">If this wasn't you, please contact your super admin immediately and change your password.</p>
        </div>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'yatraviholidays@gmail.com',
    to: email,
    subject: '🔑 Password Reset OTP - Yatravi Admin',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #CD1C18; margin: 0;">Yatravi</h1>
          <p style="color: #666; margin: 5px 0;">Admin Panel</p>
        </div>
        <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 10px;">Password Reset OTP</h2>
          <p style="color: #666; margin-bottom: 20px;">Use this code to reset your password:</p>
          <div style="background: #1a1a2e; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 30px; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 20px;">This code expires in 5 minutes</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};

// ─── OTP Generator ───────────────────────────────────────────────────────────

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── Routes ──────────────────────────────────────────────────────────────────

// NEW: Step 1 of 2FA — Verify email + password, then send OTP
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // Generic error — don't reveal if email exists
    if (!admin || !admin.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Password correct → generate & send OTP
    await OTP.deleteMany({ email: email.toLowerCase() });
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    try {
      if (process.env.EMAIL_PASS) {
        await sendOTPEmail(email, otp);
      }
    } catch (mailError) {
      console.error('Email Send Error (continuing...):', mailError.message);
    }

    console.log(`\n-----------------------------------------`);
    console.log(`🔑 2FA OTP: ${otp} (for ${email})`);
    console.log(`-----------------------------------------\n`);

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// KEPT for backward compatibility (direct OTP without password - kept as fallback)
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

// Step 2 of 2FA — Verify OTP → issue 12hr JWT + send login alert
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

    // 12hr session (bank-level)
    const token = jwt.sign(
      { id: admin._id, sessionVersion: admin.sessionVersion || 0 },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in ms
    });

    // Send login alert email (non-blocking)
    try {
      if (process.env.EMAIL_PASS) {
        sendLoginAlertEmail(admin.email, admin.name).catch(() => {});
      }
    } catch (_) {}

    res.json({
      success: true,
      message: 'Login successful',
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// NEW: Forgot Password — send reset OTP
router.post('/forgot-password', loginLimiter, async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // Always return same response (don't leak if email exists)
    if (!admin) {
      return res.json({ success: true, message: 'If this email is registered, you will receive a reset OTP' });
    }

    await OTP.deleteMany({ email: email.toLowerCase() });
    const otp = generateOTP();
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    try {
      if (process.env.EMAIL_PASS) {
        await sendPasswordResetEmail(email, otp);
      }
    } catch (mailError) {
      console.error('Reset Email Error:', mailError.message);
    }

    console.log(`\n-----------------------------------------`);
    console.log(`🔑 PASSWORD RESET OTP: ${otp} (for ${email})`);
    console.log(`-----------------------------------------\n`);

    res.json({ success: true, message: 'If this email is registered, you will receive a reset OTP' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// NEW: Reset Password — verify OTP + set new password
router.post('/reset-password', loginLimiter, async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

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

    // bcrypt hashing handled by Admin model pre-save hook
    admin.password = newPassword;
    await admin.save();
    await OTP.deleteMany({ email: email.toLowerCase() });

    res.json({ success: true, message: 'Password reset successfully. Please login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// NEW: Update Password (from Settings — requires active session)
router.post('/update-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }

  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    if (!admin.password) {
      return res.status(400).json({ message: 'No password set. Please use forgot password.' });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.cookie('admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
