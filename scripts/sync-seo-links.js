const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { generateSEOQuickLinks } = require('../server/utils/seoHelper');
const Package = require('../server/models/Package');
const Destination = require('../server/models/Destination');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ FATAL ERROR: MONGO_URI not found in root .env');
    process.exit(1);
}

async function syncSEOLinks() {
    try {
        console.log('🔄 Connecting to Database...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected Successfully.');

        // 1. Sync Packages
        console.log('\n--- Syncing Packages ---');
        const packages = await Package.find({
            $or: [
                { 'seo.quickLinks': { $exists: false } },
                { 'seo.quickLinks': { $size: 0 } }
            ]
        });

        console.log(`🔍 Found ${packages.length} packages without SEO links.`);

        let pCount = 0;
        for (const pkg of packages) {
            if (pkg.title && pkg.slug) {
                if (!pkg.seo) pkg.seo = {};
                pkg.seo.quickLinks = generateSEOQuickLinks(pkg.title, 'package', pkg.slug);
                pkg.markModified('seo');
                await pkg.save();
                pCount++;
                console.log(`✅ [${pCount}/${packages.length}] Linked: ${pkg.title}`);
            }
        }

        // 2. Sync Destinations
        console.log('\n--- Syncing Destinations ---');
        const destinations = await Destination.find({
            $or: [
                { 'seo.quickLinks': { $exists: false } },
                { 'seo.quickLinks': { $size: 0 } }
            ]
        });

        console.log(`🔍 Found ${destinations.length} destinations without SEO links.`);

        let dCount = 0;
        for (const dest of destinations) {
            if (dest.name && dest.slug) {
                if (!dest.seo) dest.seo = {};
                dest.seo.quickLinks = generateSEOQuickLinks(dest.name, 'destination', dest.slug);
                dest.markModified('seo');
                await dest.save();
                dCount++;
                console.log(`✅ [${dCount}/${destinations.length}] Linked: ${dest.name}`);
            }
        }

        console.log('\n=============================================');
        console.log(`🎉 SUCCESS: ${pCount} Packages & ${dCount} Destinations Synced!`);
        console.log('=============================================\n');

    } catch (error) {
        console.error('❌ Sync Failed:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database Connection Closed.');
        process.exit(0);
    }
}

syncSEOLinks();
