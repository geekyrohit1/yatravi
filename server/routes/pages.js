const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const authMiddleware = require('../middleware/auth');

// Public: GET a page by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let page = await Page.findOne({ slug });
    if (!page) {
      return res.json({ slug, title: '', subtitle: '', heroImage: '', content: {} });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const DEFAULT_PAGES = [
    { slug: 'home', title: 'Home' },
    { slug: 'about', title: 'About Us' },
    { slug: 'contact', title: 'Contact Us' },
    { slug: 'privacy', title: 'Privacy Policy' },
    { slug: 'terms', title: 'Terms & Conditions' },
    { slug: 'join', title: 'Join Us' },
    { slug: 'support-center', title: 'Support Center' },
    { slug: 'web-check-in', title: 'Web Check-in' }
];

// Admin: GET all pages
router.get('/admin/list', authMiddleware, async (req, res) => {
  try {
    // Ensure default pages exist
    for (const p of DEFAULT_PAGES) {
        let exists = await Page.findOne({ slug: p.slug });
        if (!exists) {
            await Page.create({ 
                slug: p.slug, 
                title: p.title,
                seo: {
                    title: p.title,
                    description: `Explore ${p.title} at Yatravi.`
                }
            });
        }
    }

    const pages = await Page.find().sort({ slug: 1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: GET a page by ID
router.get('/id/:id', authMiddleware, async (req, res) => {
    try {
        const page = await Page.findById(req.params.id);
        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json(page);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: PUT (upsert) a page by slug
router.put('/:slug', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, subtitle, heroImage, content, seo } = req.body;
    let page = await Page.findOne({ slug });
    if (!page) page = new Page({ slug });
    if (title !== undefined) page.title = title;
    if (subtitle !== undefined) page.subtitle = subtitle;
    if (heroImage !== undefined) page.heroImage = heroImage;
    if (content !== undefined) {
      page.content = content;
      page.markModified('content');
    }
    if (seo !== undefined) {
      page.seo = seo;
      page.markModified('seo');
    }
    await page.save();
    res.json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: PUT a page by ID
router.put('/id/:id', authMiddleware, async (req, res) => {
    try {
        const page = await Page.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json(page);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
