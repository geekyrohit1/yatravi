const mongoose = require('mongoose');
require('dotenv').config();

const Package = require('./models/Package');
const Destination = require('./models/Destination');
const HomepageConfig = require('./models/HomepageConfig');

async function runAudit() {
    console.log('--- Yatravi Data Integrity Audit V12.9 ---');
    
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. Count Audit
        const packageCount = await Package.countDocuments();
        const destCount = await Destination.countDocuments();
        const configCount = await HomepageConfig.countDocuments();
        
        console.log(`\nDocument Counts:`);
        console.log(`- Packages: ${packageCount}`);
        console.log(`- Destinations: ${destCount}`);
        console.log(`- HomepageConfigs: ${configCount}`);

        // 2. Conflict Check (Duplicates)
        const packageSlugs = await Package.aggregate([
            { $group: { _id: "$slug", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);
        
        const destSlugs = await Destination.aggregate([
            { $group: { _id: "$slug", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        console.log(`\nConflict Analysis:`);
        console.log(`- Duplicate Package Slugs: ${packageSlugs.length}`);
        if (packageSlugs.length > 0) console.log(JSON.stringify(packageSlugs, null, 2));
        
        console.log(`- Duplicate Destination Slugs: ${destSlugs.length}`);
        if (destSlugs.length > 0) console.log(JSON.stringify(destSlugs, null, 2));

        // 3. Homepage Integrity
        const config = await HomepageConfig.findOne();
        if (config) {
            console.log(`\nHomepage Section Audit:`);
            console.log(`- Total Sections: ${config.sections.length}`);
            
            const orphanedDests = [];
            for (const section of config.sections) {
                if (section.type === 'destinations' && section.destinationItems) {
                    for (const destId of section.destinationItems) {
                        const exists = await Destination.exists({ _id: destId });
                        if (!exists) orphanedDests.push({ section: section.key, destId });
                    }
                }
            }
            
            console.log(`- Orphaned Destination References: ${orphanedDests.length}`);
            if (orphanedDests.length > 0) console.log(JSON.stringify(orphanedDests, null, 2));
        } else {
            console.log(`\nCRITICAL: HomepageConfig missing!`);
        }

        console.log('\n--- Audit Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('Audit Failed:', err);
        process.exit(1);
    }
}

runAudit();
