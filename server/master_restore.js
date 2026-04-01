const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Package = require('./models/Package');
const Destination = require('./models/Destination');
const Image = require('./models/Image');
const HomepageConfig = require('./models/HomepageConfig');
const GlobalSetting = require('./models/GlobalSetting');
const Admin = require('./models/Admin');

async function restoreEverything() {
    try {
        console.log('--- STARTING MASTER DITTO RESTORE (VM) ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Production MongoDB.');

        const data = JSON.parse(fs.readFileSync('master_snapshot.json', 'utf8'));

        // 1. TOTAL WIPE (Be careful!)
        const collections = ['packages', 'destinations', 'images', 'homepageconfigs', 'globalsettings', 'admins'];
        for (const col of collections) {
            await mongoose.connection.db.collection(col).deleteMany({});
            console.log(`Cleared collection: ${col}`);
        }

        // 2. 1:1 RESTORE (Keep original IDs and everything)
        if (data.destinations.length) await Destination.insertMany(data.destinations);
        if (data.packages.length) await Package.insertMany(data.packages);
        if (data.images.length) await Image.insertMany(data.images);
        if (data.homepageconfigs.length) await HomepageConfig.insertMany(data.homepageconfigs);
        if (data.globalsettings.length) await GlobalSetting.insertMany(data.globalsettings);
        if (data.admins.length) await Admin.insertMany(data.admins);

        console.log(`--- RESTORE SUCCESSFUL ---`);
        console.log(`Packages: ${data.packages.length} restored.`);
        console.log(`Destinations: ${data.destinations.length} restored.`);
        console.log(`Images: ${data.images.length} restored.`);
        process.exit(0);
    } catch (err) {
        console.error('RESTORE FAILED:', err);
        process.exit(1);
    }
}

restoreEverything();
