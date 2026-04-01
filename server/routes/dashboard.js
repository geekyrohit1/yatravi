const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const Enquiry = require('../models/Enquiry');
const authMiddleware = require('../middleware/auth');

// --- DASHBOARD STATS ---
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalPackages = await Package.countDocuments();
    const publishedPackages = await Package.countDocuments({ status: { $ne: 'draft' } });
    const draftPackages = await Package.countDocuments({ status: 'draft' });
    const featuredPackages = await Package.countDocuments({ isBestSeller: true });
    const totalDestinations = await Destination.countDocuments();
    const featuredDestinations = await Destination.countDocuments({ isFeatured: true });
    const totalEnquiries = await Enquiry.countDocuments();
    const pendingEnquiries = await Enquiry.countDocuments({ status: 'New' });

    // Insights
    const recentPackages = await Package.find().sort({ createdAt: -1 }).limit(5);
    const packagesNoImage = await Package.find({ $or: [{ image: { $exists: false } }, { image: '' }, { image: null }] }).select('id title slug').limit(5);
    const pendingPublish = await Package.find({ status: 'draft' }).sort({ createdAt: -1 }).limit(5).select('id title slug createdAt');
    const destinationsLowPackages = await Destination.find({ packageCount: { $lte: 0 } }).limit(5).select('name slug');

    res.json({
      totalPackages, publishedPackages, draftPackages, totalDestinations,
      featuredDestinations, totalEnquiries, pendingEnquiries, featuredPackages,
      recentPackages, packagesNoImage, pendingPublish, destinationsLowPackages
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
