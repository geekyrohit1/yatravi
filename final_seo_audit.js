const mongoose = require('mongoose');
require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yatravi';

async function finalAudit() {
    try {
        await mongoose.connect(MONGO_URI);
        const GlobalSetting = require('./server/models/GlobalSetting');
        const Page = require('./server/models/Page');

        console.log('====================================');
        console.log('🚀 FINAL SEO JSON-LD MASTER AUDIT');
        console.log('====================================\n');

        // 1. Global SEO
        const global = await GlobalSetting.findOne();
        console.log('🏠 [GLOBAL/HOME] JSON-LD:');
        console.log(global?.globalSeo?.jsonLd || 'Empty ❌');
        console.log('\n------------------------------------\n');

        // 2. Informational Pages
        const pages = await Page.find({ slug: { $in: ['about', 'contact', 'join'] } });
        pages.forEach(p => {
            console.log(`📄 [${p.slug.toUpperCase()}] JSON-LD:`);
            console.log(p.seo?.jsonLd || 'Empty ❌');
            console.log('\n------------------------------------\n');
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Audit Error:', err);
    }
}

finalAudit();
