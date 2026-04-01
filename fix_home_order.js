const mongoose = require('mongoose');
require('dotenv').config();

async function fixOrder() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const HomepageConfig = require('./server/models/HomepageConfig');
        const config = await HomepageConfig.findOne();

        if (config) {
            let sortedSections = config.sections.sort((a,b) => a.order - b.order);
            
            // Find all banner types
            const bannerKeys = ['media', 'slider', 'offers', 'consultation'];
            const banners = sortedSections.filter(s => bannerKeys.includes(s.key));
            const cityDep = sortedSections.find(s => s.key === 'citydepartures');
            const others = sortedSections.filter(s => !bannerKeys.includes(s.key) && s.key !== 'citydepartures');

            // Force all banners to be together grouped at the end of 'others', but before 'citydepartures'
            let newOrder = 1;
            const newSections = [];

            // 1. All non-banner, non-city sections
            others.forEach(s => {
                s.order = newOrder++;
                newSections.push(s);
            });

            // 2. All Banners grouped together
            banners.forEach(s => {
                s.order = newOrder++;
                newSections.push(s);
            });

            // 3. Finally City Departures below the banners
            if (cityDep) {
                cityDep.order = newOrder++;
                newSections.push(cityDep);
            }

            config.sections = newSections;
            await config.save();
            console.log('Successfully reordered database sections to put all banners together ABOVE Packages From Your City!');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixOrder();
