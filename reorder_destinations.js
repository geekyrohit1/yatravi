const mongoose = require('mongoose');
require('dotenv').config();

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Destination = require('./server/models/Destination');
        const Package = require('./server/models/Package');
        const HomepageConfig = require('./server/models/HomepageConfig');

        console.log('--- Starting Destination Consolidation ---');

        // 1. Define mappings (City/Island -> Premium Country/Region)
        const mappings = [
            { from: ['bali', 'ubud'], to: { name: 'Bali', tagline: 'THE ISLAND OF GODS', region: 'International' } },
            { from: ['dubai'], to: { name: 'Dubai', tagline: 'THE GOLDEN CITY', region: 'International' } },
            { from: ['thailand'], to: { name: 'Thailand', tagline: 'THE LAND OF SMILES', region: 'International' } },
            { from: ['maldives'], to: { name: 'Maldives', tagline: 'THE TROPICAL PARADISE', region: 'International' } },
            { from: ['malaysia'], to: { name: 'Malaysia', tagline: 'TRULY ASIA', region: 'International' } },
            { from: ['hong-kong'], to: { name: 'Hong Kong', tagline: 'THE PEARL OF THE ORIENT', region: 'International' } },
            { from: ['hanoi'], to: { name: 'Vietnam', tagline: 'THE HIDDEN GEM', region: 'International' } },
            { from: ['interlaken', 'zurich'], to: { name: 'Switzerland', tagline: 'THE HEART OF EUROPE', region: 'International' } },
            { from: ['munnar', 'alleppey'], to: { name: 'Kerala', tagline: 'GODS OWN COUNTRY', region: 'Domestic' } },
            { from: ['srinagar'], to: { name: 'Kashmir', tagline: 'HEAVEN ON EARTH', region: 'Domestic' } },
            { from: ['manali', 'kasol', 'rishikesh'], to: { name: 'Himachal', tagline: 'LAND OF THE GODS', region: 'Domestic' } }
        ];

        for (const map of mappings) {
            console.log(`Processing group: ${map.to.name}...`);
            
            // Generate slug for the destination
            const slug = map.to.name.toLowerCase().replace(/\s+/g, '-');
            
            // Find or Create the target Destination
            let targetDest = await Destination.findOne({ slug });
            if (!targetDest) {
                targetDest = new Destination({
                    name: map.to.name,
                    slug: slug,
                    tagline: map.to.tagline,
                    region: map.to.region,
                    heroImage: '/images/placeholder.svg', // Fallback
                    isFeatured: true
                });
                await targetDest.save();
                console.log(`Created new destination: ${map.to.name}`);
            }

            // Find all source destinations
            const sourceDests = await Destination.find({ slug: { $in: map.from } });
            const sourceIds = sourceDests.map(d => d._id);

            // Update packages pointing to these sources
            const pkgUpdateResult = await Package.updateMany(
                { destinationItems: { $in: sourceIds } }, // If there was a direct link (unlikely with string location)
                { $set: { category: map.to.region } } // Basic categorization
            );
            
            // If packages use string locations like "Manali", we should ideally update them or at least ensure they are found by the country slug
            // (The current search logic seems to use regex on location/title)

            // Delete old city-level destinations if they are different from target
            if (sourceDests.length > 0) {
                await Destination.deleteMany({ 
                    slug: { $in: map.from }, 
                    _id: { $ne: targetDest._id } 
                });
                console.log(`Cleaned up city-level destinations for ${map.to.name}`);
            }
        }

        // 2. Reorder Homepage sections
        console.log('--- Updating Homepage Configuration ---');
        let config = await HomepageConfig.findOne();
        if (config) {
            const desiredOrder = [
                { key: 'topDestinations', order: 1, title: 'Top Destinations', enabled: true },
                { key: 'trendingPackages', order: 2, title: 'Trending Right Now', enabled: true },
                { key: 'international', order: 3, title: 'World at your reach', enabled: true },
                { key: 'domestic', order: 4, title: 'Explore India', enabled: true },
                { key: 'offersAndUpdates', order: 5, title: 'Exclusive Offers', enabled: true },
                { key: 'superSaver', order: 6, title: 'Budget Friendly', enabled: true },
                { key: 'citydepartures', order: 7, title: 'From Your City', enabled: true },
                { key: 'quicklinks', order: 8, title: 'Quick Links', enabled: true }
            ];

            desiredOrder.forEach(item => {
                const section = config.sections.find(s => s.key === item.key);
                if (section) {
                    section.order = item.order;
                    section.title = item.title;
                    section.enabled = item.enabled;
                }
            });

            // Update Top Destinations content with the new country IDs
            const topDestSection = config.sections.find(s => s.key === 'topDestinations');
            if (topDestSection) {
                const featuredSlugs = ['bali', 'dubai', 'thailand', 'maldives', 'switzerland', 'vietnam', 'kerala', 'kashmir'];
                const featuredDests = await Destination.find({ slug: { $in: featuredSlugs } });
                topDestSection.destinationItems = featuredDests.map(d => d._id);
            }

            await config.save();
            console.log('Homepage order and curation updated.');
        }

        console.log('--- Migration Completed Successfully ---');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
