const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const authMiddleware = require('../middleware/auth');
const { generateSEOQuickLinks } = require('../utils/seoHelper');

// GET all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ name: 1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET hero destinations (featured)
router.get('/hero', async (req, res) => {
  try {
    const destinations = await Destination.find({ isFeatured: true }).limit(6);
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single destination by identifier (slug or id)
router.get('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let destination = await Destination.findOne({ slug: identifier });
    
    if (!destination && mongoose.Types.ObjectId.isValid(identifier)) {
      destination = await Destination.findById(identifier);
    }
    
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create destination
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Smart SEO: Auto-generate quick links if empty
    if (req.body.seo && (!req.body.seo.quickLinks || req.body.seo.quickLinks.length === 0)) {
        if (req.body.name && req.body.slug) {
            req.body.seo.quickLinks = generateSEOQuickLinks(req.body.name, 'destination', req.body.slug);
        }
    }
    const destination = new Destination(req.body);
    const saved = await destination.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update destination
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const paramId = req.params.id;
    let destination = null;
    
    if (mongoose.Types.ObjectId.isValid(paramId)) {
        destination = await Destination.findById(paramId);
    }
    
    if (!destination) {
        destination = await Destination.findOne({ slug: paramId });
    }

    if (!destination) return res.status(404).json({ message: 'Destination not found for update' });

    Object.assign(destination, req.body);
    
    // Smart SEO: Auto-generate quick links if empty during update
    if (destination.seo && (!destination.seo.quickLinks || destination.seo.quickLinks.length === 0)) {
        if (destination.name && destination.slug) {
            destination.seo.quickLinks = generateSEOQuickLinks(destination.name, 'destination', destination.slug);
        }
    }

    destination.markModified('seo'); // Force Mongoose to detect nested seo object changes
    const saved = await destination.save();
    res.json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE destination
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const paramId = req.params.id;
    let deleted = null;

    if (mongoose.Types.ObjectId.isValid(paramId)) {
        deleted = await Destination.findByIdAndDelete(paramId);
    }

    if (!deleted) {
        deleted = await Destination.findOneAndDelete({ slug: paramId });
    }

    if (!deleted) return res.status(404).json({ message: 'Destination not found for deletion' });
    
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
