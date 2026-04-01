const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Analytics = require('../models/Analytics');
const authMiddleware = require('../middleware/auth');

// Get all admin users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new admin user
router.post('/users', authMiddleware, async (req, res) => {
  const { email, name } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) return res.status(400).json({ message: 'Email already registered' });
    const newAdmin = new Admin({ email: email.toLowerCase(), name: name || 'Admin' });
    await newAdmin.save();
    res.status(201).json({ success: true, message: 'Admin user created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete admin user
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
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
