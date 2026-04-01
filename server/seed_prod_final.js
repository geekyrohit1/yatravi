const mongoose = require('mongoose');
require('dotenv').config();

const Package = require('./models/Package');
const Destination = require('./models/Destination');
const HomepageConfig = require('./models/HomepageConfig');
const Admin = require('./models/Admin');
const GlobalSetting = require('./models/GlobalSetting');
const Image = require('./models/Image');

async function absoluteMirrorSync() {
    try {
        console.log('--- Yatravi ABSOLUTE MIRROR: Mirroring Media, Admin & Packages ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. MASTER PURGE (Everything)
        const collections = ['packages', 'destinations', 'homepageconfigs', 'admins', 'globalsettings', 'images'];
        for (const col of collections) {
            await mongoose.connection.db.collection(col).deleteMany({});
        }
        console.log('Data Cleaned.');

        // 2. ADMIN USER (Admin Panel Access)
        await Admin.create({
            name: 'Yatravi Admin',
            email: 'yatraviholidays@gmail.com',
            role: 'superadmin'
        });
        console.log('Admin: yatraviholidays@gmail.com');

        // 3. GLOBAL SETTINGS (Contact, Banner)
        await GlobalSetting.create({
            contactPhone: '+91 9587505726',
            whatsappNumber: '+91 9587505726',
            enableSaleBanner: true,
            saleBannerText: 'HOLI SPECIAL • UP TO 40% OFF',
            saleBannerBgColor: '#e91e63',
            saleBannerTextColor: '#ffffff',
            saleBannerTimerEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        });

        // 4. DESTINATIONS (11 Mirror)
        const dests = [
            { name: 'Bali', tagline: 'Tropical Island Paradise', heroImage: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=1000' },
            { name: 'Thailand', tagline: 'Vibrant Culture and Islands', heroImage: 'https://images.unsplash.com/photo-1577717903314-1691ae25ab3f' },
            { name: 'Switzerland', tagline: 'Alpine Luxury & Scenery', heroImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000' },
            { name: 'Dubai', tagline: 'Desert Dreams & Luxury', heroImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef6c3?q=80&w=1000' },
            { name: 'Kerala', tagline: 'God\'s Own Country', heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000' },
            { name: 'Kashmir', tagline: 'Heaven on Earth', heroImage: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=1000' },
            { name: 'Maldives', tagline: 'Ultimate Water Villas', heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000' },
            { name: 'Vietnam', tagline: 'Timeless Charm', heroImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000' },
            { name: 'Malaysia', tagline: 'Truly Asia Experience', heroImage: 'https://ik.imagekit.io/2nikzq08c/Malaysia.jpg' },
            { name: 'Singapore', tagline: 'The Lion City', heroImage: 'https://ik.imagekit.io/2nikzq08c/Singapore.jpg' },
            { name: 'Hong Kong', tagline: 'City of Lights & Magic', heroImage: 'https://ik.imagekit.io/2nikzq08c/HongKong.jpg' }
        ];
        const seededDests = await Destination.insertMany(dests.map(d => ({ 
            ...d, 
            isFeatured: true, 
            region: ['Bali', 'Thailand', 'Switzerland', 'Dubai', 'Vietnam', 'Malaysia', 'Singapore', 'Hong Kong', 'Maldives'].includes(d.name) ? 'International' : 'Domestic',
            slug: d.name.toLowerCase(), 
            startingPrice: 29999 
        })));

        // 5. PACKAGES (18 Mirror)
        const pkgs = [
            { id: 'pkg_bali_1', title: 'Bali Retreat Special', location: 'Bali', price: 29999, originalPrice: 45000, category: 'International', tags: ['Trending'], duration: 5, image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=1000' },
            { id: 'pkg_dubai_1', title: 'Luxury Dubai Staycation', location: 'Dubai', price: 45000, originalPrice: 65000, category: 'International', tags: ['Trending'], duration: 5, image: 'https://images.unsplash.com/photo-1518684079-3c830dcef6c3?q=80&w=1000' },
            { id: 'pkg_maldives_1', title: 'Maldives Water Villa Paradise', location: 'Maldives', price: 85000, originalPrice: 110000, category: 'International', tags: ['Trending'], duration: 6, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000' },
            { id: 'pkg_kashmir_1', title: 'Heavenly Kashmir Special', location: 'Kashmir', price: 32500, originalPrice: 42000, category: 'Domestic', tags: ['Super Saver'], duration: 6, image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=1000' },
            { id: 'pkg_manali_1', title: 'Manali Volvo Special', location: 'Manali, India', price: 7999, originalPrice: 12999, category: 'Domestic', tags: ['Super Saver'], duration: 4, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000' },
            { id: 'pkg_kerala_1', title: 'Kerala Backwaters Bliss', location: 'Kerala', price: 18000, originalPrice: 22000, category: 'Domestic', duration: 5, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000' },
            { id: 'pkg_kasol_1', title: 'Kasol Kheerganga Trek', location: 'Kasol', price: 6500, originalPrice: 9500, category: 'Domestic', tags: ['Super Saver'], duration: 5, image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1000' },
            { id: 'pkg_rishi_1', title: 'Rishikesh Rafting Adventure', location: 'Rishikesh', price: 5999, originalPrice: 8999, category: 'Domestic', tags: ['Super Saver'], duration: 3, image: 'https://images.unsplash.com/photo-1530590394457-e7ecbc19c08d?q=80&w=1000' },
            { id: 'pkg_munnar_1', title: 'Misty Munnar & Thekkady', location: 'Kerala', price: 12000, originalPrice: 15000, category: 'Domestic', tags: ['Super Saver'], duration: 4, image: 'https://plus.unsplash.com/premium_photo-1697729701846-e3d1d1d6a9a4?q=80&w=1000' },
            { id: 'pkg_thai_1', title: 'Thailand Super Saver', location: 'Thailand', price: 29999, originalPrice: 40000, category: 'International', tags: ['Super Saver'], duration: 5, image: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg' },
            { id: 'pkg_viet_1', title: 'Vietnam Heritage Tour', location: 'Vietnam', price: 35000, originalPrice: 50000, category: 'International', duration: 6, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000' },
            { id: 'pkg_sing_1', title: 'Singapore City Lights', location: 'Singapore', price: 48000, originalPrice: 60000, category: 'International', duration: 4, image: 'https://ik.imagekit.io/2nikzq08c/Singapore.jpg' },
            { id: 'pkg_malaysia_1', title: 'Malaysia Adventure', location: 'Malaysia', price: 38000, originalPrice: 48000, category: 'International', duration: 5, image: 'https://ik.imagekit.io/2nikzq08c/Malaysia.jpg' },
            { id: 'pkg_hk_1', title: 'Hong Kong Dreams', location: 'Hong Kong', price: 75000, originalPrice: 90000, category: 'International', duration: 5, image: 'https://ik.imagekit.io/2nikzq08c/HongKong.jpg' },
            { id: 'pkg_swiss_1', title: 'Swiss Alpine Explorer', location: 'Switzerland', price: 230000, originalPrice: 280000, category: 'International', duration: 7, image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000' },
            { id: 'pkg_goa_1', title: 'Goa Beach Party', location: 'Goa', price: 9999, originalPrice: 15000, category: 'Domestic', tags: ['Super Saver'], duration: 3, image: 'https://images.unsplash.com/photo-1512100356956-c1226c9965a8?q=80&w=1000' },
            { id: 'pkg_jaipur_1', title: 'Jaipur Heritage', location: 'Jaipur', price: 12000, originalPrice: 16000, category: 'Domestic', duration: 3, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000' },
            { id: 'pkg_darj_1', title: 'Darjeeling Tea Garden', location: 'Darjeeling', price: 24000, originalPrice: 30000, category: 'Domestic', duration: 5, image: 'https://images.unsplash.com/photo-1542931237-323a19584446?q=80&w=1000' }
        ];

        await Package.insertMany(pkgs.map(p => ({
            ...p, status: 'published', showOnHomepage: true, slug: p.title.toLowerCase().replace(/ /g, '-'),
            itinerary: [{ day: 1, title: 'Arrival', description: 'Welcome to your trip!' }]
        })));

        // 6. MIRROR MEDIA (Image Collection) - FOR ADMIN PANEL MEDIA TAB
        const allMedia = [...dests.map(d => d.heroImage), ...pkgs.map(p => p.image)];
        const uniqueMedia = [...new Set(allMedia)];
        const imageDocs = uniqueMedia.map(imgUrl => ({
            title: imgUrl.split('/').pop().split('?')[0] || 'Gallery Image',
            filename: imgUrl.split('/').pop().split('?')[0] || 'gallery_img',
            path: imgUrl
        }));
        await Image.insertMany(imageDocs);
        console.log(`Media Mirrored: ${imageDocs.length} images added to Media Tab.`);

        // 7. HOMEPAGE CONFIG
        await HomepageConfig.create({
            heroSlider: seededDests.slice(0, 5).map((d, index) => ({ destinationId: d._id, order: index + 1 })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Global Hotspots', type: 'destinations', enabled: true, order: 1, destinationItems: seededDests.slice(0, 8).map(d => d._id) },
                { key: 'offersAndUpdates', title: 'Offers & Updates', subtitle: 'Exclusive travel deals', type: 'offers', enabled: true, order: 2, cards: [
                    { title: 'Flat 10% Off on Bali', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=1000', linkType: 'destination', linkValue: 'bali' },
                    { title: 'Swiss Rail Special', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000', linkType: 'url', linkValue: '/search?q=swiss' }
                ]},
                { key: 'trendingPackages', title: 'Trending Right Now', subtitle: 'Most loved by travelers', type: 'packages', queryConfig: { tag: 'Trending', limit: 6 }, enabled: true, order: 3 },
                { key: 'promoBanner', title: 'A Little Bit of Summer', subtitle: 'Endless trips, memories', type: 'media', enabled: true, order: 4, mediaUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21' },
                { key: 'domestic', title: 'Explore India', subtitle: 'Discover India', type: 'packages', filterType: 'Domestic', enabled: true, order: 5 },
                { key: 'superSaver', title: 'Budget Friendly', subtitle: 'Best value for your money', type: 'packages', queryConfig: { tag: 'Super Saver', limit: 6 }, enabled: true, order: 6 }
            ]
        });

        console.log('--- SYNC SUCCESSFUL: Website & Admin Panel are now CLONES of Local. ---');
        process.exit(0);
    } catch (err) {
        console.error('MIRROR SYNC FAILED:', err);
        process.exit(1);
    }
}
absoluteMirrorSync();
