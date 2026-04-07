const mongoose = require('mongoose');
require('dotenv').config();
const Package = require('../server/models/Package');

async function inspectPackages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const packages = await Package.find({}, 'name title slug image price status createdAt').lean();
        
        console.log('\n--- PACKAGE AUDIT REPORT ---');
        console.log('Total Packages in DB:', packages.length);
        console.log('----------------------------');
        
        packages.forEach(p => {
            const isDummy = p.image?.includes('unsplash') || 
                            p.image?.includes('ik.imagekit.io/2nikzq08c/') ||
                            p.image?.includes('placeholder') ||
                            p.title?.toLowerCase().includes('dummy') ||
                            p.title?.toLowerCase().includes('test');
            
            const marker = isDummy ? '[❌ DUMMY]' : '[✅ REAL?]';
            console.log(`${marker} Title: ${p.title || p.name} | Slug: ${p.slug} | Status: ${p.status}`);
        });
        
        console.log('----------------------------');
        console.log('Bhaiya, jo [DUMMY] hain sirf unhe hide karenge.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectPackages();
