require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!MONGO_URI) {
  console.error('❌ No MongoDB URI found in .env');
  process.exit(1);
}

const promoteToSuperAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Set primary email here
        const email = 'yatraviholidays@gmail.com'; 

        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            console.log(`❌ Admin with email ${email} not found.`);
            process.exit(1);
        }

        admin.role = 'superadmin';
        await admin.save();
        
        console.log(`👑 Success! ${email} is now a Super Admin.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

promoteToSuperAdmin();
