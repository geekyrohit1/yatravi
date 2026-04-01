const mongoose = require('mongoose');
require('dotenv').config();

async function listDestinations() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Destination = require('./server/models/Destination');
        const destinations = await Destination.find({});
        console.log('--- Current Destinations ---');
        destinations.forEach(d => {
            console.log(`- Name: ${d.name}, Slug: ${d.slug}, Tagline: ${d.tagline}, Region: ${d.region}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listDestinations();
