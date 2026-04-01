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

// Import the rich local dataset
const PACKAGES = require('./data/packages.js');

async function masterRestore() {
    try {
        console.log('--- Yatravi Lighthouse Performance Restoration V13.0 ---');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. ABSOLUTE TOTAL WIPEOUT (Except Admins)
        const collections = ['packages', 'destinations', 'homepageconfigs', 'analytics', 'enquiries', 'otps', 'images', 'pages', 'globalsettings'];
        console.log('MASTER PURGE: Executing total database cleanup...');
        for (const col of collections) {
            await mongoose.connection.db.collection(col).deleteMany({});
        }
        console.log('Purge Complete: Database is now 100% Clean.');

        // 2. EXTRACT DESTINATIONS FROM PACKAGES
        console.log('Synthesizing Destinations from local packages...');
        const uniqueLocations = [...new Set(PACKAGES.map(p => p.location.split(',')[0].trim()))];
        const destinationsData = uniqueLocations.map(loc => {
            // Find a sample package for this location to get a representative image
            const sample = PACKAGES.find(p => p.location.includes(loc));
            return {
                name: loc,
                slug: loc.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                heroImage: sample ? sample.image : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
                tagline: `Experience the beauty of ${loc}`,
                isFeatured: true,
                startingPrice: sample ? sample.price : 0,
                region: ['Bali', 'Thailand', 'Switzerland', 'Dubai', 'Malaysia', 'Singapore', 'Vietnam', 'Hong Kong', 'Japan', 'Paris', 'Zurich', 'Interlaken'].includes(loc) ? 'International' : 'Domestic'
            };
        });

        const seededDestinations = await Destination.insertMany(destinationsData);
        console.log(`Seeded ${seededDestinations.length} Destinations.`);

        // 3. SEED PACKAGES
        console.log(`Seeding ${PACKAGES.length} High-Fidelity Local Packages...`);
        const seededPackages = await Package.insertMany(PACKAGES.map(p => ({
            ...p,
            status: 'published',
            showOnHomepage: true,
            slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
        })));
        console.log(`Seeded ${seededPackages.length} Packages.`);

        // 4. CONFIGURE HOMEPAGE (Rich Performance State)
        console.log('Configuring Homepage (Rich Performance State)...');
        const bali = seededDestinations.find(d => d.name === 'Bali');
        const swiss = seededDestinations.find(d => d.name === 'Switzerland' || d.name === 'Interlaken');
        const thai = seededDestinations.find(d => d.name === 'Thailand');
        const dubai = seededDestinations.find(d => d.name === 'Dubai');
        const kerala = seededDestinations.find(d => d.name === 'Kerala');

        await HomepageConfig.create({
            heroSlider: [
                { destinationId: bali?._id || seededDestinations[0]?._id, order: 1, customTitle: 'Bali Luxury Escape', customTagline: 'Island Happiness' },
                { destinationId: swiss?._id || seededDestinations[1]?._id, order: 2, customTitle: 'Swiss Alpine Wonder', customTagline: 'Sky High Adventure' },
                { destinationId: thai?._id || seededDestinations[2]?._id, order: 3, customTitle: 'Thailand Island Hopper', customTagline: 'Sun, Sand & Sea' }
            ],
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Explore our most popular spots', type: 'destinations', enabled: true, order: 1, destinationItems: seededDestinations.slice(0, 8).map(d => d._id) },
                { key: 'international', title: 'International Getaways', subtitle: 'World class travel', type: 'packages', filterType: 'International', enabled: true, order: 2 },
                { key: 'trendingPackages', title: 'Trending Right Now', subtitle: 'Our hottest deals', type: 'packages', queryConfig: { limit: 6 }, enabled: true, order: 3 },
                { 
                    key: 'promoBanner', 
                    title: 'Special Summer Offer', 
                    subtitle: 'Up to 40% off on Early Bird Bookings', 
                    type: 'media', 
                    enabled: true, 
                    order: 4, 
                    mediaUrl: 'https://ik.imagekit.io/2nikzq08c/Swiss.jpg', 
                    isVideo: false 
                },
                { key: 'domestic', title: 'Destinations in India', subtitle: 'Hidden gems of our country', type: 'packages', filterType: 'Domestic', enabled: true, order: 5 },
                { key: 'quicklinks', title: 'Quick Links', subtitle: '', type: 'links', enabled: true, order: 6 },
                { key: 'citydepartures', title: 'Packages from Your City', subtitle: 'Regional departures', type: 'packages', enabled: true, order: 7 }
            ],
            quickLinks: [
                { label: 'Packages for Thailand', url: '/thailand' },
                { label: 'Bali Tour Packages', url: '/bali-indonesia' },
                { label: 'Europe Trip', url: '/europe' }
            ],
            importantLinks: [
                { label: 'About Us', url: '/about' },
                { label: 'Contact', url: '/contact' }
            ]
        });

        console.log('\nMASTER RESTORATION SUCCESSFUL.');
        process.exit(0);
    } catch (err) {
        console.error('RESTORATION FAILED:', err);
        process.exit(1);
    }
}

masterRestore();
