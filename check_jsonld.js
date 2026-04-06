const mongoose = require('mongoose');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yatravi';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const GlobalSetting = require('./server/models/GlobalSetting');
        const settings = await GlobalSetting.findOne();

        if (settings) {
            console.log('--- Current Global JSON-LD (Calculated) ---');
            console.log(settings.globalSeo.jsonLd || 'Still Empty (Click Save in Admin to Generate)');
        } else {
            console.log('No GlobalSettings found.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

check();
