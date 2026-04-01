const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Destination = require('./server/models/Destination');
        const HomepageConfig = require('./server/models/HomepageConfig');

        const dests = await Destination.find({});
        console.log(`Common Destinations found: ${dests.length}`);
        dests.forEach(d => {
            if (['bali', 'switzerland', 'pakistan', 'kerala', 'kashmir', 'uae', 'thailand', 'vietnam'].includes(d.slug)) {
                console.log(`- [Match] ${d.name} (${d.slug})`);
            }
        });

        const config = await HomepageConfig.findOne();
        if (config) {
            console.log('\n--- Homepage Config Sections (Order) ---');
            config.sections
                .sort((a,b) => a.order - b.order)
                .forEach(s => console.log(`${s.order}: ${s.key} (${s.title})`));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
