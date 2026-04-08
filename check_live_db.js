const mongoose = require('mongoose');

async function checkLive() {
    // Live cluster URI (database name: yatravi)
    const uri = "mongodb+srv://rohit:30gZXF3x7152qVV8@ytr.fkz3udk.mongodb.net/yatravi";
    
    try {
        console.log('Connecting to Live MongoDB Atlas...');
        await mongoose.connect(uri);
        console.log('Connected successfully! ✅');

        // Dynamically get the collection
        const db = mongoose.connection.db;
        const packages = await db.collection('packages').find({}, { projection: { title: 1, location: 1 } }).toArray();

        console.log(`\n--- FOUND ${packages.length} PACKAGES IN LIVE DB ---`);
        packages.forEach((p, i) => {
            console.log(`${i + 1}. ${p.title} (${p.location})`);
        });

        const destinations = await db.collection('destinations').find({}, { projection: { name: 1 } }).toArray();
        console.log(`\n--- FOUND ${destinations.length} DESTINATIONS IN LIVE DB ---`);
        destinations.forEach((d, i) => {
            console.log(`${i + 1}. ${d.name}`);
        });

    } catch (err) {
        console.error('Error connecting:', err.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

checkLive();
