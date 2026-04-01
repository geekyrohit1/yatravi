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

// Admin: GET all pages
router.get('/admin/list', authMiddleware, async (req, res) => {
  try {
    const pages = await Page.find().sort({ slug: 1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: PUT (upsert) a page by slug
router.put('/:slug', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, subtitle, heroImage, content } = req.body;
    let page = await Page.findOne({ slug });
    if (!page) page = new Page({ slug });
    if (title !== undefined) page.title = title;
    if (subtitle !== undefined) page.subtitle = subtitle;
    if (heroImage !== undefined) page.heroImage = heroImage;
    if (content !== undefined) {
      page.content = content;
      page.markModified('content');
    }
    await page.save();
    res.json(page);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
