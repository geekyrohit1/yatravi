const mongoose = require('mongoose');
require('dotenv').config();
const Destination = require('../server/models/Destination');

async function auditDestinations() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const destinations = await Destination.find({}, 'name slug heroImage isFeatured tagline').lean();
        
        console.log('\n--- DESTINATION AUDIT REPORT ---');
        console.log('Total Destinations in DB:', destinations.length);
        console.log('----------------------------');
        
        destinations.forEach(d => {
            const isDummy = d.heroImage?.includes('ik.imagekit.io/2nikzq08c/') || 
                            d.heroImage?.includes('unsplash') ||
                            d.heroImage?.includes('placeholder');
            
            const marker = isDummy ? '[❌ DUMMY]' : '[✅ REAL?]';
            console.log(`${marker} Name: ${d.name} | Slug: ${d.slug} | Featured: ${d.isFeatured}`);
        });
        
        console.log('----------------------------');
        console.log('Bhaiya, agar ye sare "Original Seed" wale hain toh inhe bhi hide kar sakte hain.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

auditDestinations();
