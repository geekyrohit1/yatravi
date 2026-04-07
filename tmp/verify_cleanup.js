const mongoose = require('mongoose');
require('dotenv').config();
const Package = require('../server/models/Package');
const Destination = require('../server/models/Destination');

async function verifyCleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const packages = await Package.find({});
        const destinations = await Destination.find({});
        
        const publishedPkgs = packages.filter(p => p.status === 'published');
        const publishedDests = destinations.filter(d => d.status === 'published' || d.isFeatured);
        
        console.log('\n--- FINAL CLEANUP VERIFICATION ---');
        console.log(`Packages: Total ${packages.length} | Published: ${publishedPkgs.length}`);
        console.log(`Destinations: Total ${destinations.length} | Published/Featured: ${publishedDests.length}`);
        
        if (publishedPkgs.length > 0) {
            console.log('\nStill Published Packages:');
            publishedPkgs.forEach(p => console.log(`- ${p.title} (${p.slug})`));
        }
        
        if (publishedDests.length > 0) {
            console.log('\nStill Published Destinations:');
            publishedDests.forEach(d => console.log(`- ${d.name} (${d.slug})`));
        }
        
        if (publishedPkgs.length === 0 && publishedDests.length === 0) {
            console.log('\n✅ ALL CLEAR: Everything is Draft/Hidden.');
        } else {
            console.log('\n⚠️ Some items are still live.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyCleanup();
