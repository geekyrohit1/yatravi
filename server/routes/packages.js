const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const authMiddleware = require('../middleware/auth');
const { generateSEOQuickLinks, generateJSONLD } = require('../utils/seoHelper');

// Search Packages & Destinations (Fallback)
router.get('/search/all', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json({ packages: [], destinations: [] });
        const regex = new RegExp(query, 'i');
        const [packages, destinations] = await Promise.all([
            Package.find({ status: 'published', $or: [{ title: regex }, { location: regex }] }).limit(10).lean(),
            Destination.find({ $or: [{ name: regex }, { tagline: regex }] }).limit(10).lean()
        ]);
        res.json({ packages, destinations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all packages (public: only published, admin: all with ?all=true)
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true';
    const filter = showAll ? {} : { status: { $ne: 'draft' } };
    const packages = await Package.find(filter).sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single package (by slug or id)
router.get('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    let pkg = await Package.findOne({ slug: identifier }).lean();
    if (!pkg) {
      pkg = await Package.findOne({ id: identifier }).lean();
    }
    if (!pkg && mongoose.Types.ObjectId.isValid(identifier)) {
      pkg = await Package.findById(identifier).lean();
    }
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a package
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Smart SEO: Auto-generate quick links if empty
    if (req.body.seo && (!req.body.seo.quickLinks || req.body.seo.quickLinks.length === 0)) {
        if (req.body.title && req.body.slug) {
            req.body.seo.quickLinks = generateSEOQuickLinks(req.body.title, 'package', req.body.slug);
        }
    }
    const newPackage = new Package(req.body);
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a package
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const packageId = req.params.id;
    let pkg = await Package.findOne({ id: packageId });
    if (!pkg && mongoose.Types.ObjectId.isValid(packageId)) {
      pkg = await Package.findById(packageId);
    }
    if (!pkg) {
      // Final fallback: try search by slug if ID/ObjectId fails
      pkg = await Package.findOne({ slug: packageId });
    }
    
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    const oldSeo = pkg.seo || {};
    Object.assign(pkg, req.body);
    
    // Smart SEO: Handle Schema Auto-generation
    if (pkg.seo && pkg.seo.autoGenerateSchema) {
        pkg.seo.jsonLd = generateJSONLD(pkg, 'package', req.headers.host || 'yatravi.com');
    }

    // Safety Lock: Restore manual SEO if incoming is empty/missing
    if (req.body.seo) {
        pkg.seo = {
            ...oldSeo,
            ...pkg.seo, // Use the updated SEO (including generated schema)
            // Only overwrite if new value is actually provided (not just an empty string from an unset form field)
            title: req.body.seo.title || oldSeo.title,
            description: req.body.seo.description || oldSeo.description,
            keywords: req.body.seo.keywords || oldSeo.keywords,
            focusKeyword: req.body.seo.focusKeyword || oldSeo.focusKeyword,
            jsonLd: (pkg.seo && pkg.seo.autoGenerateSchema) ? pkg.seo.jsonLd : (req.body.seo.jsonLd || oldSeo.jsonLd)
        };
    }
    
    pkg.markModified('seo'); // Force Mongoose to detect nested seo object changes
    const saved = await pkg.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE package
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const paramId = req.params.id;
    let deleted = await Package.findOneAndDelete({ id: paramId });
    
    if (!deleted && mongoose.Types.ObjectId.isValid(paramId)) {
      deleted = await Package.findByIdAndDelete(paramId);
    }
    
    if (!deleted) {
      deleted = await Package.findOneAndDelete({ slug: paramId });
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Package not found for deletion' });
    }
    
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
