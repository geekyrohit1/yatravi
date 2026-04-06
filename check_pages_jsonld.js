const mongoose = require('mongoose');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yatravi';

async function checkPages() {
    try {
        await mongoose.connect(MONGO_URI);
        const Page = require('./server/models/Page');
        const pages = await Page.find({ slug: { $in: ['about', 'contact', 'join', 'privacy', 'terms', 'support-center'] } });

        console.log('--- Current JSON-LD for Informational Pages ---');
        pages.forEach(p => {
            console.log(`Page: ${p.slug}`);
            console.log(p.seo.jsonLd || 'Empty (Not Generated Yet) ❌');
            console.log('-----------------------------------');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error fetching pages:', err);
    }
}

checkPages();
