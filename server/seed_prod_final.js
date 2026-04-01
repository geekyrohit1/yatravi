const mongoose = require('mongoose');
require('dotenv').config();

const Package = require('./models/Package');
const Destination = require('./models/Destination');
const HomepageConfig = require('./models/HomepageConfig');

// This script ensures 11 Destinations and 18 Packages match the local "Beautiful" state.
async function perfectSync() {
    try {
        console.log('--- Yatravi PERFECT SYNC: Local-to-Prod Transformation ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. CLEAR COLLECTIONS
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await HomepageConfig.deleteMany({});
        console.log('Database Purged.');

        // 2. SEED 11 DESTINATIONS
        const destinationsData = [
            { name: 'Bali', tagline: 'Tropical Island Paradise', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Bali.jpg' },
            { name: 'Thailand', tagline: 'Vibrant Culture and Islands', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg' },
            { name: 'Switzerland', tagline: 'Alpine Luxury & Scenery', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Swiss.jpg' },
            { name: 'Dubai', tagline: 'Desert Dreams & Luxury', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Dubai.jpg' },
            { name: 'Kerala', tagline: 'God\'s Own Country', isFeatured: true, region: 'Domestic', heroImage: 'https://ik.imagekit.io/2nikzq08c/Kerala.jpg' },
            { name: 'Kashmir', tagline: 'Heaven on Earth', isFeatured: true, region: 'Domestic', heroImage: 'https://ik.imagekit.io/2nikzq08c/Kashmir.jpg' },
            { name: 'Maldives', tagline: 'Ultimate Water Villas', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Maldives.jpg' },
            { name: 'Vietnam', tagline: 'Timeless Charm', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Vietman.jpg' },
            { name: 'Malaysia', tagline: 'Truly Asia Experience', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Malaysia.jpg' },
            { name: 'Singapore', tagline: 'The Lion City', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Singapore.jpg' },
            { name: 'Hong Kong', tagline: 'City of Lights & Magic', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/HongKong.jpg' }
        ];
        const seededDests = await Destination.insertMany(destinationsData.map(d => ({ ...d, slug: d.name.toLowerCase(), startingPrice: 29999 })));
        console.log('Seeded 11 Destinations.');

        // 3. SEED 18 PACKAGES (Mock/Sample with local-like prices)
        const packagesData = [
            { title: 'Bali Retreat Special', location: 'Bali', price: 29999, originalPrice: 45000, category: 'International', tags: ['Trending'] },
            { title: 'Luxury Dubai Staycation', location: 'Dubai', price: 45000, originalPrice: 65000, category: 'International', tags: ['Trending'] },
            { title: 'Maldives Water Villa Paradise', location: 'Maldives', price: 85000, originalPrice: 110000, category: 'International', tags: ['Trending'] },
            { title: 'Swiss Alpine Explorer', location: 'Switzerland', price: 230000, originalPrice: 280000, category: 'International' },
            { title: 'Heavenly Kashmir Special', location: 'Kashmir', price: 32500, originalPrice: 42000, category: 'Domestic', tags: ['Super Saver'] },
            { title: 'Manali Volvo Bliss', location: 'Manali, India', price: 7999, originalPrice: 12999, category: 'Domestic', tags: ['Super Saver'] },
            { title: 'Kerala Backwaters Bliss', location: 'Kerala', price: 18000, originalPrice: 22000, category: 'Domestic' },
            { title: 'Misty Munnar & Thekkady', location: 'Kerala', price: 12000, originalPrice: 15000, category: 'Domestic', tags: ['Super Saver'] },
            { title: 'Thailand Super Saver', location: 'Thailand', price: 29999, originalPrice: 40000, category: 'International', tags: ['Super Saver'] },
            { title: 'Vietnam Heritage Tour', location: 'Vietnam', price: 35000, originalPrice: 50000, category: 'International' },
            { title: 'Singapore City Lights', location: 'Singapore', price: 48000, originalPrice: 60000, category: 'International' },
            { title: 'Malaysia Adventure', location: 'Malaysia', price: 38000, originalPrice: 48000, category: 'International' },
            { title: 'Hong Kong Dreams', location: 'Hong Kong', price: 75000, originalPrice: 90000, category: 'International' },
            { title: 'Goa Beach Party Special', location: 'Goa', price: 9999, originalPrice: 15000, category: 'Domestic', tags: ['Super Saver'] },
            { title: 'Kasol Kheerganga Trek', location: 'Kasol', price: 6500, originalPrice: 9500, category: 'Domestic', tags: ['Super Saver'] },
            { title: 'Rishikesh Rafting Adventure', location: 'Rishikesh', price: 5999, originalPrice: 8999, category: 'Domestic', tags: ['Super Saver'] },
            { title: 'Jaipur Heritage Tour', location: 'Jaipur', price: 12000, originalPrice: 16000, category: 'Domestic' },
            { title: 'Darjeeling Tea Garden Special', location: 'Darjeeling', price: 24000, originalPrice: 30000, category: 'Domestic' }
        ];

        await Package.insertMany(packagesData.map(p => ({
            ...p,
            status: 'published',
            showOnHomepage: true,
            slug: p.title.toLowerCase().replace(/ /g, '-'),
            image: `https://ik.imagekit.io/2nikzq08c/${p.location.split(',')[0].trim()}.jpg` || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21',
            itinerary: [{ day: 1, title: 'Arrival', description: 'Welcome to your trip!' }]
        })));
        console.log('Seeded 18 Packages.');

        // 4. CONFIGURE RICH HOMEPAGE (Match local screenshots)
        console.log('Configuring Rich Homepage Layout...');
        const bali = seededDests.find(d => d.name === 'Bali');
        const swiss = seededDests.find(d => d.name === 'Switzerland');

        await HomepageConfig.create({
            heroSlider: seededDests.slice(0, 5).map((d, index) => ({ destinationId: d._id, order: index + 1 })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Global Hotspots', type: 'destinations', enabled: true, order: 1, destinationItems: seededDests.slice(0, 8).map(d => d._id) },
                { key: 'offersAndUpdates', title: 'Offers & Updates', subtitle: 'Holi Special & Exclusive travel deals', type: 'offers', enabled: true, order: 2, cards: [
                    { title: 'Flat 10% Off on Bali', image: 'https://ik.imagekit.io/2nikzq08c/Bali.jpg', linkType: 'destination', linkValue: 'bali' },
                    { title: 'Swiss Rail Special', image: 'https://ik.imagekit.io/2nikzq08c/Swiss.jpg', linkType: 'url', linkValue: '/search?q=swiss' }
                ]},
                { key: 'trendingPackages', title: 'Trending Right Now', subtitle: 'Most loved by travelers', type: 'packages', queryConfig: { tag: 'Trending', limit: 6 }, enabled: true, order: 3 },
                { key: 'promoBanner', title: 'A Little Bit of Summer', subtitle: 'Endless trips, endless memories', type: 'media', enabled: true, order: 4, mediaUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000' },
                { key: 'domestic', title: 'Explore India', subtitle: 'Discover India', type: 'packages', filterType: 'Domestic', enabled: true, order: 5 },
                { key: 'superSaver', title: 'Budget Friendly', subtitle: 'Best value for your money', type: 'packages', queryConfig: { tag: 'Super Saver', limit: 6 }, enabled: true, order: 6 },
                { key: 'international', title: 'International Getaways', subtitle: 'Explore the world', type: 'packages', filterType: 'International', enabled: true, order: 7 }
            ]
        });

        console.log('SYNC SUCCESSFUL: VM now matches Local Beauty.');
        process.exit(0);
    } catch (err) {
        console.error('SYNC FAILED:', err);
        process.exit(1);
    }
}

perfectSync();
