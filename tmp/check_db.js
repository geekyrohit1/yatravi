const mongoose = require('mongoose');
const Package = require('./server/models/Package');
require('dotenv').config();

const mongoURI = 'mongodb://localhost:27017/yatravi'; // Using local URI for now

async function checkPackages() {
    try {
        await mongoose.connect(mongoURI);
        const count = await Package.countDocuments();
        const packages = await Package.find({}, 'name slug price isBestSeller isTrending').lean();
        
        console.log(`TOTAL_PACKAGES_COUNT: ${count}`);
        console.log('LIST_OF_PACKAGES:');
        packages.forEach(p => {
            console.log(`- NAME: ${p.name}, SLUG: ${p.slug}, PRICE: ${p.price}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkPackages();
