const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const authMiddleware = require('../middleware/auth');
const { enquiryLimiter } = require('../middleware/rateLimiters');

// GET all enquiries (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create enquiry
router.post('/', enquiryLimiter, async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    const saved = await enquiry.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update enquiry status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedBy = req.admin ? req.admin.name : 'Unknown Admin';
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    
    // Add to history if status changed
    if (req.body.status && req.body.status !== enquiry.status) {
      enquiry.history.push({
        status: req.body.status,
        updatedBy: updatedBy,
        at: new Date()
      });
      enquiry.status = req.body.status;
    }

    if (req.body.adminNotes !== undefined) enquiry.adminNotes = req.body.adminNotes;
    
    const saved = await enquiry.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE enquiry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
