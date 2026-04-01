const mongoose = require('mongoose');
require('dotenv').config();

const Package = require('./models/Package');
const Destination = require('./models/Destination');
const HomepageConfig = require('./models/HomepageConfig');
const Admin = require('./models/Admin');
const GlobalSetting = require('./models/GlobalSetting');

async function absoluteSync() {
    try {
        console.log('--- Yatravi ABSOLUTE SYNC: Mirroring Local to Prod ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. MASTER PURGE
        const collections = ['packages', 'destinations', 'homepageconfigs', 'admins', 'globalsettings'];
        for (const col of collections) {
            await mongoose.connection.db.collection(col).deleteMany({});
        }
        console.log('Database Clear.');

        // 2. CREATE ADMIN (Fixes Login Issue)
        await Admin.create({
            name: 'Yatravi Admin',
            email: 'yatraviholidays@gmail.com',
            role: 'superadmin'
        });
        console.log('Admin User Created: yatraviholidays@gmail.com');

        // 3. SEED GLOBAL SETTINGS (Banner, WhatsApp, etc.)
        await GlobalSetting.create({
            contactPhone: '+91 9587505726',
            whatsappNumber: '+91 9587505726',
            enableSaleBanner: true,
            saleBannerText: 'HOLI SPECIAL • UP TO 40% OFF',
            saleBannerBgColor: '#e91e63',
            saleBannerTextColor: '#ffffff',
            saleBannerTimerEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        });
        console.log('Global Settings Mirrored.');

        // 4. SEED 11 DESTINATIONS
        const dests = [
            { name: 'Bali', tagline: 'Tropical Island Paradise', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Bali.jpg', startingPrice: 29999 },
            { name: 'Thailand', tagline: 'Vibrant Culture and Islands', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg', startingPrice: 29999 },
            { name: 'Switzerland', tagline: 'Alpine Luxury & Scenery', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Swiss.jpg', startingPrice: 230000 },
            { name: 'Dubai', tagline: 'Desert Dreams & Luxury', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Dubai.jpg', startingPrice: 45000 },
            { name: 'Kerala', tagline: 'God\'s Own Country', isFeatured: true, region: 'Domestic', heroImage: 'https://ik.imagekit.io/2nikzq08c/Kerala.jpg', startingPrice: 18000 },
            { name: 'Kashmir', tagline: 'Heaven on Earth', isFeatured: true, region: 'Domestic', heroImage: 'https://ik.imagekit.io/2nikzq08c/Kashmir.jpg', startingPrice: 32500 },
            { name: 'Maldives', tagline: 'Ultimate Water Villas', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Maldives.jpg', startingPrice: 85000 },
            { name: 'Vietnam', tagline: 'Timeless Charm', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Vietman.jpg', startingPrice: 35000 },
            { name: 'Malaysia', tagline: 'Truly Asia Experience', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Malaysia.jpg', startingPrice: 38000 },
            { name: 'Singapore', tagline: 'The Lion City', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/Singapore.jpg', startingPrice: 48000 },
            { name: 'Hong Kong', tagline: 'City of Lights & Magic', isFeatured: true, region: 'International', heroImage: 'https://ik.imagekit.io/2nikzq08c/HongKong.jpg', startingPrice: 75000 }
        ];
        const seededDests = await Destination.insertMany(dests.map(d => ({ ...d, slug: d.name.toLowerCase() })));
        console.log('11 Destinations Seeded.');

        // 5. SEED 18 PACKAGES (With Unique IDs)
        const pkgs = [
            { id: 'pkg_bali_1', title: 'Bali Retreat Special', location: 'Bali', price: 29999, originalPrice: 45000, category: 'International', tags: ['Trending'], duration: 5 },
            { id: 'pkg_dubai_1', title: 'Luxury Dubai Staycation', location: 'Dubai', price: 45000, originalPrice: 65000, category: 'International', tags: ['Trending'], duration: 5 },
            { id: 'pkg_maldives_1', title: 'Maldives Water Villa Paradise', location: 'Maldives', price: 85000, originalPrice: 110000, category: 'International', tags: ['Trending'], duration: 6 },
            { id: 'pkg_kashmir_1', title: 'Heavenly Kashmir Special', location: 'Kashmir', price: 32500, originalPrice: 42000, category: 'Domestic', tags: ['Super Saver'], duration: 6 },
            { id: 'pkg_manali_1', title: 'Manali Volvo Special', location: 'Manali, India', price: 7999, originalPrice: 12999, category: 'Domestic', tags: ['Super Saver'], duration: 4 },
            { id: 'pkg_kerala_1', title: 'Kerala Backwaters Bliss', location: 'Kerala', price: 18000, originalPrice: 22000, category: 'Domestic', duration: 5 },
            { id: 'pkg_kasol_1', title: 'Kasol Kheerganga Trek', location: 'Kasol', price: 6500, originalPrice: 9500, category: 'Domestic', tags: ['Super Saver'], duration: 5 },
            { id: 'pkg_rishi_1', title: 'Rishikesh Rafting Adventure', location: 'Rishikesh', price: 5999, originalPrice: 8999, category: 'Domestic', tags: ['Super Saver'], duration: 3 },
            { id: 'pkg_munnar_1', title: 'Misty Munnar & Thekkady', location: 'Kerala', price: 12000, originalPrice: 15000, category: 'Domestic', tags: ['Super Saver'], duration: 4 },
            { id: 'pkg_thai_1', title: 'Thailand Super Saver', location: 'Thailand', price: 29999, originalPrice: 40000, category: 'International', tags: ['Super Saver'], duration: 5 },
            { id: 'pkg_viet_1', title: 'Vietnam Heritage Tour', location: 'Vietnam', price: 35000, originalPrice: 50000, category: 'International', duration: 6 },
            { id: 'pkg_sing_1', title: 'Singapore City Lights', location: 'Singapore', price: 48000, originalPrice: 60000, category: 'International', duration: 4 },
            { id: 'pkg_malaysia_1', title: 'Malaysia Adventure', location: 'Malaysia', price: 38000, originalPrice: 48000, category: 'International', duration: 5 },
            { id: 'pkg_hk_1', title: 'Hong Kong Dreams', location: 'Hong Kong', price: 75000, originalPrice: 90000, category: 'International', duration: 5 },
            { id: 'pkg_swiss_1', title: 'Swiss Alpine Explorer', location: 'Switzerland', price: 230000, originalPrice: 280000, category: 'International', duration: 7 },
            { id: 'pkg_goa_1', title: 'Goa Beach Party', location: 'Goa', price: 9999, originalPrice: 15000, category: 'Domestic', tags: ['Super Saver'], duration: 3 },
            { id: 'pkg_jaipur_1', title: 'Jaipur Heritage', location: 'Jaipur', price: 12000, originalPrice: 16000, category: 'Domestic', duration: 3 },
            { id: 'pkg_darj_1', title: 'Darjeeling Tea Garden', location: 'Darjeeling', price: 24000, originalPrice: 30000, category: 'Domestic', duration: 5 }
        ];

        await Package.insertMany(pkgs.map(p => ({
            ...p, status: 'published', showOnHomepage: true, slug: p.title.toLowerCase().replace(/ /g, '-'),
            image: `https://ik.imagekit.io/2nikzq08c/${p.location.split(',')[0].trim()}.jpg`,
            itinerary: [{ day: 1, title: 'Arrival', description: 'Check-in and relax.' }]
        })));
        console.log('18 Packages Seeded.');

        // 6. HOMEPAGE CONFIG
        await HomepageConfig.create({
            heroSlider: seededDests.slice(0, 5).map((d, index) => ({ destinationId: d._id, order: index + 1 })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Global Hotspots', type: 'destinations', enabled: true, order: 1, destinationItems: seededDests.slice(0, 8).map(d => d._id) },
                { key: 'offersAndUpdates', title: 'Offers & Updates', subtitle: 'Exclusive travel deals', type: 'offers', enabled: true, order: 2, cards: [
                    { title: 'Flat 10% Off on Bali', image: 'https://ik.imagekit.io/2nikzq08c/Bali.jpg', linkType: 'destination', linkValue: 'bali' },
                    { title: 'Swiss Rail Special', image: 'https://ik.imagekit.io/2nikzq08c/Swiss.jpg', linkType: 'url', linkValue: '/search?q=swiss' }
                ]},
                { key: 'trendingPackages', title: 'Trending Right Now', subtitle: 'Most loved by travelers', type: 'packages', queryConfig: { tag: 'Trending', limit: 6 }, enabled: true, order: 3 },
                { key: 'promoBanner', title: 'A Little Bit of Summer', subtitle: 'Endless trips, memories', type: 'media', enabled: true, order: 4, mediaUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21' },
                { key: 'domestic', title: 'Explore India', subtitle: 'Discover India', type: 'packages', filterType: 'Domestic', enabled: true, order: 5 },
                { key: 'superSaver', title: 'Budget Friendly', subtitle: 'Best value for your money', type: 'packages', queryConfig: { tag: 'Super Saver', limit: 6 }, enabled: true, order: 6 }
            ]
        });

        console.log('SYNC COMPLETE: Admin Fixed, Layout Mirrored.');
        process.exit(0);
    } catch (err) {
        console.error('SYNC FAILED:', err);
        process.exit(1);
    }
}
absoluteSync();
