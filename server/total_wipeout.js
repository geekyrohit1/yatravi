const mongoose = require('mongoose');
require('dotenv').config();
const Package = require('./models/Package');
const Destination = require('./models/Destination');
const HomepageConfig = require('./models/HomepageConfig');

async function totalWipe() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- TOTAL WIPEOUT STARTED ---');
        
        const resP = await Package.deleteMany({});
        console.log(`- Deleted ${resP.deletedCount} Packages`);
        
        const resD = await Destination.deleteMany({});
        console.log(`- Deleted ${resD.deletedCount} Destinations`);
        
        const resH = await HomepageConfig.deleteMany({});
        console.log(`- Deleted ${resH.deletedCount} HomepageConfigs`);

        console.log('--- TOTAL WIPEOUT COMPLETE ---');
        process.exit(0);
    } catch (e) {
        console.error('WIPEOUT FAILED:', e);
        process.exit(1);
    }
}

totalWipe();
