const mongoose = require('mongoose');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yatravi';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const GlobalSetting = require('./server/models/GlobalSetting');
        const settings = await GlobalSetting.findOne();

        if (settings) {
            console.log('--- Current Global SEO Settings ---');
            console.log(JSON.stringify(settings.globalSeo, null, 2));
        } else {
            console.log('No GlobalSettings found in database.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

check();
