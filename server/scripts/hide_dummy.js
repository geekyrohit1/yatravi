const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Package = require('../models/Package');
const Destination = require('../models/Destination');

async function totalCleanup() {
    try {
        console.log('\n--- STARTING TOTAL DUMMY CLEANUP ---');
        console.log('Connecting to Database...');
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected Successfully.');

        // 1. DUMMY PACKAGES (18 IDs + 6 Slugs)
        const dummyPkgIds = [
            'bali_classic_1', 'bali_honeymoon_1', 'bali_culture_1', 
            'swiss_alpine_1', 'swiss_paris_1', 
            'kerala_backwaters_1', 'kerala_munnar_1', 
            'dubai_classic_1', 'dubai_luxury_1', 
            'maldives_beach_1', 'kashmir_paradise_1', 
            'vietnam_explorer_1', 't_1', 'w_1', 'w_2', 'w_3', 'w_4', 's_1', 's_2'
        ];

        const stubbornSlugs = [
            'kasol-kheerganga-trek', 'rishikesh-rafting-adventure', 
            'malaysia-truly-asia-genting-kl', 'thailand-super-saver-special', 
            'manali-volvo-special', 'hong-kong-dreams-disney-lantau'
        ];

        // 2. DUMMY DESTINATIONS (10 Slugs)
        const dummyDestSlugs = [
            'hong-kong', 'thailand', 'malaysia', 'maldives', 'dubai', 
            'bali', 'vietnam', 'switzerland', 'kashmir', 'himachal'
        ];

        console.log('Hiding Dummy Packages...');
        const pkgResult = await Package.updateMany(
            { 
                $or: [ 
                    { id: { $in: dummyPkgIds } }, 
                    { slug: { $in: stubbornSlugs } },
                    { title: { $regex: /dummy|test/i } } 
                ] 
            },
            { $set: { status: 'draft', showOnHomepage: false } }
        );

        console.log('Hiding Dummy Destinations...');
        const destResult = await Destination.updateMany(
            { slug: { $in: dummyDestSlugs } },
            { $set: { isFeatured: false, status: 'draft' } }
        );

        console.log('\n--- CLEANUP COMPLETE ---');
        console.log(`✅ Packages Hidden: ${pkgResult.modifiedCount}`);
        console.log(`✅ Destinations Hidden: ${destResult.modifiedCount}`);
        console.log('-------------------------');
        console.log('Bhaiya, aapki website ab ek-dum "Clean" aur Professional hai! ✨');
        
        process.exit(0);
    } catch (err) {
        console.error('ERROR DURING CLEANUP:', err);
        process.exit(1);
    }
}

totalCleanup();
