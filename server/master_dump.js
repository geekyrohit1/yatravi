const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const Package = require('./models/Package');
const Destination = require('./models/Destination');
const Image = require('./models/Image');
const HomepageConfig = require('./models/HomepageConfig');
const GlobalSetting = require('./models/GlobalSetting');
const Admin = require('./models/Admin');

async function exportEverything() {
    try {
        console.log('--- STARTING MASTER DITTO EXPORT ---');
        await mongoose.connect(process.env.MONGO_URI);
        
        const data = {
            packages: await Package.find({}).lean(),
            destinations: await Destination.find({}).lean(),
            images: await Image.find({}).lean(),
            homepageconfigs: await HomepageConfig.find({}).lean(),
            globalsettings: await GlobalSetting.find({}).lean(),
            admins: await Admin.find({ email: 'yatraviholidays@gmail.com' }).lean()
        };

        fs.writeFileSync('master_snapshot.json', JSON.stringify(data, null, 2));
        console.log(`--- EXPORT SUCCESSFUL ---`);
        console.log(`Packages: ${data.packages.length}`);
        console.log(`Destinations: ${data.destinations.length}`);
        console.log(`Images: ${data.images.length}`);
        console.log(`Snapshot saved to: master_snapshot.json`);
        process.exit(0);
    } catch (err) {
        console.error('EXPORT FAILED:', err);
        process.exit(1);
    }
}

exportEverything();
