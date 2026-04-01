const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const { searchLimiter } = require('../middleware/rateLimiters');

// GET /api/search?q=query&category=All|Packages|Destinations
router.get('/', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || query.length < 1) {
            return res.json({ packages: [], destinations: [] });
        }

        const category = req.query.category || 'All';
        const searchRegex = new RegExp(query, 'i');

        // Search Destinations
        let destinations = [];
        if (category === 'All' || category === 'Destinations') {
            destinations = await Destination.find({
                $or: [
                    { name: searchRegex },
                    { tagline: searchRegex },
                    { description: searchRegex }
                ]
            }).limit(10).lean();
        }

        // Search Packages
        let packages = [];
        if (category === 'All' || category === 'Packages') {
            const packageFilter = {
                status: 'published',
                $or: [
                    { title: searchRegex },
                    { location: searchRegex },
                    { tags: searchRegex },
                    { overview: searchRegex }
                ]
            };
            
            // If category was specified and wasn't 'All' or 'Packages' or 'Destinations', 
            // it might be a specific travel category (e.g. 'Adventure')
            if (category !== 'All' && category !== 'Packages' && category !== 'Destinations') {
                packageFilter.category = category;
            }

            packages = await Package.find(packageFilter).limit(10).lean();
        }

        res.json({ 
            packages: packages || [], 
            destinations: destinations || [] 
        });
    } catch (error) {
        console.error('Search API error:', error);
        res.status(500).json({ message: 'Internal server error during search' });
    }
});

module.exports = router;
