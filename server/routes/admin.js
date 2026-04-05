const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const OTP = require('../models/OTP');
const Analytics = require('../models/Analytics');
const authMiddleware = require('../middleware/auth');
const transporter = require('../config/nodemailer');

// ─── Email Helpers ───────────────────────────────────────────────────────────
const sendSuperAdminOTPEmail = async (email, otp, newUserName, newUserEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'yatraviholidays@gmail.com',
    to: email,
    subject: '⚠️ Admin Approval OTP - Yatravi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #CD1C18;">Authorize New Admin User</h2>
        <p>You requested to add a new admin user to the Yatravi Panel:</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Name:</strong> ${newUserName}</p>
          <p><strong>Email:</strong> ${newUserEmail}</p>
        </div>
        <p>Please enter this OTP to authorize the creation:</p>
        <div style="background: #1a1a2e; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px 30px; border-radius: 8px; display: inline-block;">
          ${otp}
        </div>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email, name) => {
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/forgot-password`;
  const mailOptions = {
    from: process.env.EMAIL_USER || 'yatraviholidays@gmail.com',
    to: email,
    subject: '🎉 Welcome to Yatravi Admin Panel',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #CD1C18;">Welcome to Yatravi!</h2>
        <p>Hello ${name},</p>
        <p>An admin account has been created for you. To get started, you need to set your password.</p>
        <p>Click the link below to verify your email and set a new password:</p>
        <a href="${loginUrl}" style="display: inline-block; background: #1a1a2e; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 10px;">Set Password</a>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">If the button doesn't work, copy this link: ${loginUrl}</p>
      </div>
    `
  };
  return transporter.sendMail(mailOptions);
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Get current logged in admin
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all admin users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Step 1: Request Create User (Send OTP to Super Admin)
router.post('/users/request-create', authMiddleware, async (req, res) => {
  const { email, name, role } = req.body;
  try {
    // Only superadmin can create users
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only Super Admin can create users' });
    }

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) return res.status(400).json({ message: 'User email already registered' });

    // Generate OTP for Super Admin
    await OTP.deleteMany({ email: req.admin.email });
    const otp = generateOTP();
    await OTP.create({
      email: req.admin.email,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    try {
      if (process.env.EMAIL_PASS) {
        await sendSuperAdminOTPEmail(req.admin.email, otp, name, email);
      }
    } catch (mailError) {
      console.error('Super Admin OTP Email Error:', mailError.message);
    }

    console.log(`\n-----------------------------------------`);
    console.log(`👑 SUPER ADMIN CREATE OTP: ${otp} (for ${req.admin.email})`);
    console.log(`-----------------------------------------\n`);

    res.json({ success: true, message: `OTP sent to your email (${req.admin.email}) for verification` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Step 2: Verify OTP and Create User
router.post('/users', authMiddleware, async (req, res) => {
  const { email, name, role, otp } = req.body;
  try {
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only Super Admin can create users' });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email: req.admin.email,
      otp: otp,
      expiresAt: { $gt: new Date() }
    });
    
    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) return res.status(400).json({ message: 'Email already registered' });

    // Create user
    const newAdmin = new Admin({ 
      email: email.toLowerCase(), 
      name: name || 'Admin',
      role: role || 'admin'
    });
    
    await newAdmin.save();
    await OTP.deleteMany({ email: req.admin.email });

    // Send welcome email to new user
    try {
      if (process.env.EMAIL_PASS) {
        await sendWelcomeEmail(email, name || 'Admin');
      }
    } catch (mailError) {
      console.error('Welcome Email Error:', mailError.message);
    }

    res.status(201).json({ success: true, message: 'Admin user created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete admin user
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only Super Admin can delete users' });
    }

    if (req.admin._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Terminate all sessions for a user
router.post('/users/:id/terminate-sessions', authMiddleware, async (req, res) => {
  try {
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only Super Admin can terminate sessions' });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    admin.sessionVersion = (admin.sessionVersion || 0) + 1;
    await admin.save();
    res.json({ success: true, message: 'Sessions terminated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- ANALYTICS DASHBOARD STATS ---
router.get('/analytics/stats', authMiddleware, async (req, res) => {
    const { range } = req.query;
    let startDate = new Date();
    
    // Calculate start date based on range
    if (range === '24h') startDate.setHours(startDate.getHours() - 24);
    else if (range === '30d') startDate.setDate(startDate.getDate() - 30);
    else startDate.setDate(startDate.getDate() - 7); // Default to 7d

    try {
        // 1. Page Views (Daily trend)
        const pageViews = await Analytics.aggregate([
            { $match: { type: 'page_view', timestamp: { $gte: startDate } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Lead Intent (Total count)
        const leadIntent = await Analytics.countDocuments({ 
            type: 'lead_intent', 
            timestamp: { $gte: startDate } 
        });

        // 3. Device Distribution
        const devices = await Analytics.aggregate([
            { $match: { type: 'page_view', timestamp: { $gte: startDate } } },
            { $group: { _id: "$metadata.device", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // 4. Popular Destinations (Top 10)
        const popularDestinations = await Analytics.aggregate([
            { 
                $match: { 
                    type: 'page_view', 
                    path: { $regex: /^\/destination\// },
                    timestamp: { $gte: startDate } 
                } 
            },
            { 
                $group: { 
                    _id: { $arrayElemAt: [{ $split: ["$path", "/"] }, 2] },
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({
            pageViews,
            leadIntent,
            devices: devices.filter(d => d._id), // Clean up nulls
            popularDestinations: popularDestinations.map(d => ({
                _id: d._id ? d._id.charAt(0).toUpperCase() + d._id.slice(1) : 'Unknown',
                count: d.count
            }))
        });
    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
