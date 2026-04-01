const mongoose = require('mongoose');
require('dotenv').config();
const Package = require('./models/Package');
const Destination = require('./models/Destination');
const HomepageConfig = require('./models/HomepageConfig');

async function purge() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Purging database...');
        await Package.deleteMany({});
        await Destination.deleteMany({});
        await HomepageConfig.deleteMany({});
        console.log('Database PURGED successfully.');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

purge();
