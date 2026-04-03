const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const axios = require('axios');
const Package = require('../models/Package');
const Destination = require('../models/Destination');

// --- LSI KEYWORDS GENERATOR (AI-POWERED) ---
router.post('/generate-lsi', authMiddleware, async (req, res) => {
  const { keyword, type, title } = req.body;
  
  if (!keyword) {
    return res.status(400).json({ message: 'Focus keyword is required' });
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    return res.status(500).json({ message: 'AI API Key not configured in .env.local' });
  }

  try {
    const prompt = `
      You are a Senior Travel SEO Expert. 
      Generate exactly 15 semantically related (LSI) keywords for a ${type} titled "${title}" 
      with the focus keyword "${keyword}".
      
      Requirements:
      - Focus on high-intent travel keywords (booking, itinerary, best time, cost, things to do).
      - Keywords should be relevant for Indian travelers.
      - Return ONLY a comma-separated list of keywords. 
    `;

    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "stepfun/step-3.5-flash:free",
      messages: [
        { role: "user", content: prompt }
      ],
      reasoning: { enabled: true }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://yatravi.com',
        'X-Title': 'Yatravi SEO Admin'
      },
      timeout: 30000
    });

    const data = response.data;
    
    if (data.choices && data.choices[0]) {
      const text = data.choices[0].message.content.trim();
      const keywords = text.split(',').map(k => k.trim()).filter(k => k.length > 0);
      res.json({ keywords });
    } else {
      console.error('AI API ERROR:', data);
      res.status(500).json({ message: 'Invalid AI response from StepFun' });
    }

  } catch (error) {
    console.error('LSI Generation Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: error.response?.data?.error?.message || 'AI Connection Failed' 
    });
  }
});

// --- ALPHA RANK TRACKER (GOOGLE SCRAPER) ---
router.post('/check-rank', authMiddleware, async (req, res) => {
  const { keyword, type, id } = req.body;

  if (!keyword || !id || !type) {
    return res.status(400).json({ message: 'Keyword, ID, and Type are required' });
  }

  try {
    // 1. Search Google (Top 100)
    // We use a high-fidelity User-Agent to avoid early detection
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=100`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: 10000
    });

    const html = response.data;
    
    // 2. Parse Rank using Regex (isolate links)
    // Google result links usually look like: /url?q=https://yatravi.com/...
    const linkRegex = /<a href="\/url\?q=(https?:\/\/[^&]+)/g;
    let match;
    let foundRank = -1;
    let currentPos = 0;
    const seenLinks = new Set();

    while ((match = linkRegex.exec(html)) !== null) {
      const url = decodeURIComponent(match[1]);
      // Skip duplicate links and internal google links
      if (seenLinks.has(url) || url.includes('google.com')) continue;
      
      seenLinks.add(url);
      currentPos++;

      if (url.includes('yatravi.com')) {
        foundRank = currentPos;
        break; // Found the highest rank
      }
    }

    // 3. Update Database
    const Model = type === 'package' ? Package : Destination;
    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found in database' });
    }

    if (!item.seo) item.seo = {};

    const oldRank = item.seo.currentRank || 0;
    item.seo.previousRank = oldRank;
    item.seo.currentRank = foundRank > 0 ? foundRank : 0; // 0 means not found in top 100
    item.seo.lastRankCheck = new Date();

    // Maintain a history of last 10 checks
    if (!item.seo.rankHistory) item.seo.rankHistory = [];
    item.seo.rankHistory.unshift({ rank: foundRank > 0 ? foundRank : 101, date: new Date() });
    if (item.seo.rankHistory.length > 10) item.seo.rankHistory.pop();

    // Force Mongoose to save nested object
    item.markModified('seo');
    await item.save();

    res.json({
      success: true,
      rank: item.seo.currentRank,
      previousRank: item.seo.previousRank,
      lastChecked: item.seo.lastRankCheck,
      history: item.seo.rankHistory
    });

  } catch (error) {
    console.error('Rank Tracker Error:', error.response?.status, error.message);
    if (error.response?.status === 429) {
      return res.status(429).json({ message: 'Google blocked the request (Rate Limited). Please try again in 30 minutes.' });
    }
    res.status(500).json({ message: 'Failed to fetch rank from Google' });
  }
});

module.exports = router;
