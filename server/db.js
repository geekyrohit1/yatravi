const mongoose = require('mongoose');

// MONGO_URI must be set in .env
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env');
  process.exit(1);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`\n=============================================`);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log(`=============================================\n`);

  } catch (error) {
    console.error(`\n❌ Error connecting to MongoDB: ${error.message}`);
    console.log(`\nPossible Fixes:`);
    console.log(`1. Check internet connection.`);
    console.log(`2. Check if IP is whitelisted in MongoDB Atlas.`);
    console.log(`3. Verify MONGO_URI in .env file.\n`);
    process.exit(1);
  }
};

module.exports = connectDB;