const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const axios = require('axios');

// --- TOUR FETCHER ROUTE ---
router.get('/fetch-tour', authMiddleware, async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ message: 'URL is required' });

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    const html = response.data;

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    const imageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);

    res.json({
      title: titleMatch ? titleMatch[1].replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)).trim() : '',
      description: descMatch ? descMatch[1].replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)).trim() : '',
      image: imageMatch ? imageMatch[1].trim() : ''
    });
  } catch (error) {
    console.error('Fetch Tour Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch tour details' });
  }
});

// --- FLIGHT FETCHER ROUTE ---
router.get('/fetch-flight', authMiddleware, async (req, res) => {
  const { flightNo } = req.query;
  if (!flightNo) return res.status(400).json({ message: 'Flight number is required' });

  const flightDatabase = [
    { no: 'TG-313', airline: 'Thai Airways', from: 'Delhi (DEL)', to: 'Bangkok (BKK)', dep: '11:45 PM', arr: '05:25 AM' },
    { no: 'TG-314', airline: 'Thai Airways', from: 'Bangkok (BKK)', to: 'Delhi (DEL)', dep: '07:35 PM', arr: '10:45 PM' },
    { no: '6E-1051', airline: 'IndiGo', from: 'Delhi (DEL)', to: 'Phuket (HKT)', dep: '06:15 AM', arr: '12:30 PM' },
    { no: '6E-1052', airline: 'IndiGo', from: 'Phuket (HKT)', to: 'Delhi (DEL)', dep: '01:30 PM', arr: '06:45 PM' },
    { no: 'AI-332', airline: 'Air India', from: 'Delhi (DEL)', to: 'Bangkok (BKK)', dep: '01:45 PM', arr: '07:20 PM' }
  ];

  const found = flightDatabase.find(f => f.no.toLowerCase() === flightNo.toLowerCase());
  if (found) {
    res.json({
      airline: found.airline, departureCity: found.from, arrivalCity: found.to,
      departureTime: found.dep, arrivalTime: found.arr
    });
  } else {
    res.status(404).json({ message: 'Flight details not found' });
  }
});

module.exports = router;
