const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const Destination = require('./models/Destination.js');
const Package = require('./models/Package.js');
const HomepageConfig = require('./models/HomepageConfig.js');
const PACKAGES = require('./data/packages.js');

// Load env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Data to Import (17 Destinations)
const DESTINATIONS = [];

const ADDITIONAL_PACKAGES = [];

async function restore() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Atlas.');

        // Bhaiya, in lines ko comment kar diya hai taaki aapka kraya hua asli data safe rahe.
        /* 
        console.log('Purging current production data...');
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await HomepageConfig.deleteMany({});
        console.log('Purge complete.');
        */

        // 1. Import Packages
        console.log('Importing packages...');
        const allPackages = [...PACKAGES, ...ADDITIONAL_PACKAGES];
        const importedPackages = await Package.insertMany(allPackages.map(p => ({
            ...p,
            _id: new mongoose.Types.ObjectId(),
            slug: p.slug || p.title.toLowerCase().replace(/ /g, '-')
        })));
        console.log(`Imported ${importedPackages.length} packages.`);

        // 2. Import Destinations
        console.log('Importing destinations...');
        const importedDestinations = await Destination.insertMany(DESTINATIONS);
        console.log(`Imported ${importedDestinations.length} destinations.`);

        // 3. Create HomepageConfig
        console.log('Resetting Homepage Configuration...');
        const config = new HomepageConfig({
            heroSlider: importedDestinations.map((d, index) => ({
                destinationId: d._id,
                order: index,
                enabled: true
            })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Explore our most popular destinations', type: 'destinations', enabled: true, order: 1 },
                { key: 'offersAndUpdates', title: 'Offers & Updates', subtitle: 'Exclusive deals and travel news', type: 'offers', enabled: true, order: 2, cards: [] },
                { key: 'weekendGetaways', title: 'Weekend Getaways', subtitle: 'Short breaks for the busy bees', type: 'packages', filterType: 'weekend', queryConfig: { tag: 'Weekend' }, enabled: true, order: 3 },
                { key: 'honeymoon', title: 'Honeymoon Specials', subtitle: 'Romantic destinations for couples', type: 'packages', filterType: 'honeymoon', queryConfig: { tag: 'Honeymoon' }, enabled: true, order: 4 },
                { key: 'domestic', title: 'Domestic Getaways', subtitle: 'Explore the beauty of India', type: 'packages', filterType: 'domestic', enabled: true, order: 5 },
                { key: 'international', title: 'International Getaways', subtitle: 'Explore the world', type: 'packages', filterType: 'international', enabled: true, order: 6 },
                { key: 'superSaver', title: 'Super Saver Deals', subtitle: 'Best value packages', type: 'packages', filterType: 'superSaver', enabled: true, order: 7 }
            ]
        });
        await config.save();
        console.log('Homepage configuration restored to Classic state.');

        console.log('RESTORE SUCCESSFUL.');
        process.exit(0);
    } catch (error) {
        console.error('RESTORE FAILED:', error);
        process.exit(1);
    }
}

restore();
