const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');

// POST /api/analytics/track
// Public route to track page views, clicks, and lead intent
router.post('/track', async (req, res) => {
    try {
        const { type, path, target, metadata, sessionId, isPersonalized } = req.body;

        if (!type) {
            return res.status(400).json({ success: false, message: 'Event type is required' });
        }

        const newEvent = new Analytics({
            type,
            path,
            target,
            metadata,
            sessionId,
            isPersonalized: !!isPersonalized,
            timestamp: new Date()
        });

        await newEvent.save();
        res.status(201).json({ success: true });
    } catch (error) {
        // Silently fail logging to console but don't break the user experience
        console.error('Analytics tracking error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
