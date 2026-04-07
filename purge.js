const mongoose = require('mongoose');
require('dotenv').config();

const Package = require('./server/models/Package');
const Destination = require('./server/models/Destination');
const HomepageConfig = require('./server/models/HomepageConfig');

const DUMMY_PACKAGE_SLUGS = [
    'bali-retreat', 
    'romantic-bali-honeymoon-escape', 
    'cultural-heart-of-bali', 
    'swiss-alpine-wonder', 
    'best-of-paris-swiss', 
    'kerala-backwaters-bliss', 
    'misty-munnar-thekkady', 
    'dubai-delight-burj-khalifa',
    'thailand-adventure-buffet',
    'bali-classic_1',
    'kerala-india',
    'kashmir-india'
];

const DUMMY_DESTINATION_SLUGS = [
    'bali-indonesia', 'thailand', 'europe', 'kerala-india', 'dubai-uae', 
    'kashmir-india', 'maldives', 'vietnam', 'malaysia', 'singapore', 
    'ladakh-india', 'sri-lanka', 'mauritius', 'seychelles', 'japan', 
    'hong-kong', 'paris-france'
];

async function superSmartPurge() {
    try {
        console.log('--- STARTING SUPER SMART CLEANUP (FULL PROTECTION) ---');
        if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing!');
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database.');

        // 1. Delete Dummy Packages (Only those in the dummy list)
        const pRes = await Package.deleteMany({ slug: { $in: DUMMY_PACKAGE_SLUGS } });
        console.log(`Deleted ${pRes.deletedCount} Template Packages. (Aapke custom packages safe hain!)`);
        
        // 2. Clear Ghost Slider Entries
        await HomepageConfig.deleteMany({});
        console.log('Cleared Homepage Config (Ghost slides removed).');

        // 3. Delete Destinations ONLY IF they have no packages
        console.log('Checking Destinations for active associations...');
        const dummyDestinations = await Destination.find({ slug: { $in: DUMMY_DESTINATION_SLUGS } });
        
        let deletedDests = 0;
        let skippedDests = 0;

        for (const dest of dummyDestinations) {
            // Check if any package is using this destination (by ID or Slug)
            const isUsed = await Package.exists({ 
                $or: [
                    { destinationId: dest._id },
                    { location: { $regex: dest.name, $options: 'i' } }
                ]
            });

            if (isUsed) {
                console.log(`[SAFE] Skipped: ${dest.name} - It is currently being used by your packages! ✅`);
                skippedDests++;
            } else {
                await Destination.findByIdAndDelete(dest._id);
                console.log(`[CLEAN] Deleted: ${dest.name} - No packages linked.`);
                deletedDests++;
            }
        }

        console.log('\n--- CLEANUP COMPLETE ---');
        console.log(`Summary: ${deletedDests} Destinations deleted, ${skippedDests} Destinations kept safe.`);
        console.log('Website ab ek-dum professional hai!');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup Failed:', err.message);
        process.exit(1);
    }
}

superSmartPurge();
