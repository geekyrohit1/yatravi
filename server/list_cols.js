const mongoose = require('mongoose');
require('dotenv').config();

async function listCollections() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('--- MongoDB Collections ---');
        collections.forEach(c => console.log(`- ${c.name}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listCollections();
