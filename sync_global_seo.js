const mongoose = require('mongoose');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yatravi';

async function sync() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const GlobalSetting = require('./server/models/GlobalSetting');
        
        const preferredDefaults = {
            defaultTitle: 'Yatravi | We Care Your Trip - Lowest Price Holiday Packages',
            defaultDescription: 'Explore the world with Yatravi. Lowest price holiday packages and premium travel experiences.',
            defaultKeywords: 'travel agency, holiday packages, tour packages, cheapest tours',
            siteName: 'Yatravi',
            titleSeparator: '|',
            defaultOgImage: '/og-image.png'
        };

        const settings = await GlobalSetting.findOne();
        if (settings) {
            console.log('Found GlobalSetting. Updating current metadata...');
            settings.globalSeo = {
                ...settings.globalSeo,
                ...preferredDefaults
            };
            await settings.save();
            console.log('✅ Global SEO data updated successfully!');
        } else {
            console.log('No settings record found to update.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error Syncing:', err);
    }
}

sync();
