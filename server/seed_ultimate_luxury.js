const mongoose = require('mongoose');
require('dotenv').config();

const Package = require('./models/Package');
const Destination = require('./models/Destination');
const HomepageConfig = require('./models/HomepageConfig');
const GlobalSetting = require('./models/GlobalSetting');
const Image = require('./models/Image');
const Page = require('./models/Page');
const Enquiry = require('./models/Enquiry');
const Analytics = require('./models/Analytics');
const OTP = require('./models/OTP');

// Data Sources
const BASE_PACKAGES = require('./data/packages.js');
const ADDITIONAL_PACKAGES = [
    { id: 'thai_adventure_1', title: 'Thailand Super Saver Special', location: 'Thailand', duration: 5, price: 29999, originalPrice: 45000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg', status: 'published', showOnHomepage: true },
    { id: 'rishi_rafting_1', title: 'Rishikesh Rafting Adventure', location: 'Rishikesh, India', duration: 3, price: 5999, originalPrice: 8999, category: 'Domestic', image: 'https://images.unsplash.com/photo-1530590394457-e7ecbc19c08d', status: 'published', showOnHomepage: true },
    { id: 'manali_volvo_1', title: 'Manali Volvo Special', location: 'Manali, India', duration: 4, price: 7999, originalPrice: 12999, category: 'Domestic', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', status: 'published', showOnHomepage: true },
    { id: 'kasol_trek_1', title: 'Kasol Kheerganga Trek', location: 'Kasol, India', duration: 5, price: 6500, originalPrice: 9500, category: 'Domestic', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd', status: 'published', showOnHomepage: true },
    { id: 'pkg_hong_kong_disney', title: 'Hong Kong Dreams: Disney & Lantau', location: 'Hong Kong', duration: 5, price: 75000, originalPrice: 95000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/HongKong.jpg', status: 'published', showOnHomepage: true },
    { id: 'dubai_luxury_1', title: 'Dubai Luxury: Burj Khalifa & Desert Safari', location: 'Dubai, UAE', duration: 5, price: 48000, originalPrice: 65000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Dubai.jpg', status: 'published', showOnHomepage: true },
    { id: 'malaysia_truly_1', title: 'Malaysia Truly Asia: Genting & KL', location: 'Malaysia', duration: 6, price: 42000, originalPrice: 55000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Malaysia.jpg', status: 'published', showOnHomepage: true }
];

async function ultimateRestore() {
    try {
        console.log('--- Yatravi Ultimate Luxury Restoration V14.0 ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. ABSOLUTE TOTAL WIPEOUT
        const collections = ['packages', 'destinations', 'homepageconfigs', 'analytics', 'enquiries', 'otps', 'images', 'pages', 'globalsettings'];
        console.log('MASTER PURGE: Executing total database cleanup...');
        for (const col of collections) {
            await mongoose.connection.db.collection(col).deleteMany({});
        }
        console.log('Purge Complete: Database is now 100% Clean.');

        // 2. MERGE PACKAGES
        const ALL_SOURCE = [...BASE_PACKAGES, ...ADDITIONAL_PACKAGES];
        const uniquePackages = [];
        const seenIds = new Set();
        for (const p of ALL_SOURCE) {
            if (!seenIds.has(p.id)) {
                seenIds.add(p.id);
                uniquePackages.push(p);
            }
        }

        // 3. SYNTHESIZE DESTINATIONS
        console.log('Synthesizing Destinations from merged dataset...');
        const uniqueLocations = [...new Set(uniquePackages.map(p => p.location.split(',')[0].trim()))];
        const destinationsData = uniqueLocations.map(loc => {
            const sample = uniquePackages.find(p => p.location.includes(loc));
            return {
                name: loc,
                slug: loc.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                heroImage: sample ? sample.image : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
                tagline: `Unforgettable journey to ${loc}`,
                isFeatured: true,
                startingPrice: sample ? sample.price : 0,
                region: ['Bali', 'Thailand', 'Switzerland', 'Dubai', 'Malaysia', 'Singapore', 'Vietnam', 'Hong Kong', 'Japan', 'Paris', 'Dubai', 'UAE'].includes(loc) ? 'International' : 'Domestic'
            };
        });
        const seededDestinations = await Destination.insertMany(destinationsData);
        console.log(`Seeded ${seededDestinations.length} Destinations.`);

        // 4. SEED PACKAGES WITH TAGS
        console.log(`Seeding ${uniquePackages.length} High-Fidelity Combined Packages...`);
        const trendingIds = ['thai_adventure_1', 'bali_retreat_1', 'pkg_hong_kong_disney', 'swiss_alpine_1', 'dubai_luxury_1'];
        const seededPackages = await Package.insertMany(uniquePackages.map(p => ({
            ...p,
            status: 'published',
            showOnHomepage: true,
            tags: [
                ...(p.tags || []),
                ...(p.price <= 30000 ? ['Super Saver'] : []),
                ...(trendingIds.includes(p.id) ? ['Trending'] : [])
            ],
            slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
            itinerary: p.itinerary && p.itinerary.length > 0 ? p.itinerary : [
                { day: 1, title: 'Arrival & Welcome', description: `Check-in to your hotel in ${p.location} and enjoy the evening at leisure.` },
                { day: 2, title: 'Local Sightseeing', description: 'Explore the iconic landmarks and hidden gems of the city.' },
                { day: 3, title: 'Adventure & Culture', description: 'Experience the local traditions and outdoor activities.' }
            ]
        })));
        console.log(`Seeded ${seededPackages.length} Packages.`);

        // 5. CONFIGURE HOMEPAGE (The Exact user Sequence)
        console.log('Configuring Homepage (Exact User Sequence)...');
        await HomepageConfig.create({
            heroSlider: seededDestinations.slice(0, 5).map((d, index) => ({ destinationId: d._id, order: index + 1 })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Global Hotspots', type: 'destinations', enabled: true, order: 1, destinationItems: seededDestinations.slice(0, 8).map(d => d._id) },
                { key: 'offersAndUpdates', title: 'Offers & Updates', subtitle: 'Exclusive travel deals', type: 'offers', enabled: true, order: 2, cards: [
                    { title: 'Flat 10% Off on Bali', image: 'https://ik.imagekit.io/2nikzq08c/Bali.jpg', linkType: 'destination', linkValue: 'bali' },
                    { title: 'Swiss Rail Special', image: 'https://ik.imagekit.io/2nikzq08c/Swiss.jpg', linkType: 'url', linkValue: '/search?q=swiss' }
                ]},
                { key: 'trendingPackages', title: 'Trending Right Now', subtitle: 'Most loved by travelers', type: 'packages', queryConfig: { tag: 'Trending', limit: 6 }, enabled: true, order: 3 },
                { key: 'promoBanner', title: 'Summer Sale Live!', subtitle: 'Get up to 30% off on all bookings', type: 'media', enabled: true, order: 4, mediaUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2000' },
                { key: 'communityBanner', title: 'Join Our Community', subtitle: 'Connect with fellow travelers and get exclusive tips', type: 'media', enabled: true, order: 5, mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000' },
                { key: 'international', title: 'International Getaways', subtitle: 'Explore the world', type: 'packages', filterType: 'International', enabled: true, order: 6 },
                { key: 'domestic', title: 'Domestic Getaways', subtitle: 'Discover India', type: 'packages', filterType: 'Domestic', enabled: true, order: 7 },
                { key: 'superSaver', title: 'Super Saver Deals', subtitle: 'Best value for your money', type: 'packages', queryConfig: { tag: 'Super Saver', limit: 6 }, enabled: true, order: 8 },
                { key: 'citydepartures', title: 'Packages from Your City', subtitle: 'Regional departures', type: 'packages', enabled: true, order: 9 },
                { key: 'quicklinks', title: 'Quick Links', subtitle: '', type: 'links', enabled: true, order: 10 }
            ],
            quickLinks: [{ label: 'Thailand Tour', url: '/thailand' }, { label: 'Bali Holidays', url: '/bali-indonesia' }],
            importantLinks: [{ label: 'About', url: '/about' }, { label: 'Contact', url: '/contact' }]
        });

        console.log('\nULTIMATE RECONSTRUCTION SUCCESSFUL.');
        process.exit(0);
    } catch (err) {
        console.error('RESTORATION FAILED:', err);
        process.exit(1);
    }
}

ultimateRestore();
