const express = require('express');
const router = express.Router();
const GlobalSetting = require('../models/GlobalSetting');
const authMiddleware = require('../middleware/auth');

// GET settings (Public)
router.get('/', async (req, res) => {
    try {
        let settings = await GlobalSetting.findOne();
        if (!settings) settings = await GlobalSetting.create({});
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT settings (Admin)
router.put('/', authMiddleware, async (req, res) => {
    try {
        let settings = await GlobalSetting.findOne();
        if (!settings) {
            settings = new GlobalSetting(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
