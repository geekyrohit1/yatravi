const express = require('express');
const router = express.Router();
const HomepageConfig = require('../models/HomepageConfig');
const authMiddleware = require('../middleware/auth');

// GET homepage config (Public)
router.get('/', async (req, res) => {
    try {
        const config = await HomepageConfig.getConfig(); // Uses the static method
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT homepage config (Admin)
router.put('/', authMiddleware, async (req, res) => {
    try {
        let config = await HomepageConfig.findOne();
        if (!config) {
            config = new HomepageConfig(req.body);
        } else {
            Object.assign(config, req.body);
        }
        await config.save();
        res.json(config);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
