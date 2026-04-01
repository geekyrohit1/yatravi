const mongoose = require('mongoose');
require('dotenv').config();

async function uncapSettings() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        // Use the connection to drop the collection
        // Mongoose pluralizes GlobalSetting to globalsettings
        try {
            await mongoose.connection.db.dropCollection('globalsettings');
            console.log('Successfully dropped capped globalsettings collection');
        } catch (e) {
            console.log('Collection globalsettings might not exist or is already dropped:', e.message);
        }
        
        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
}

uncapSettings();
