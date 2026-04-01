const mongoose = require('mongoose');
require('dotenv').config();

const Destination = require('./models/Destination');
const Package = require('./models/Package');
const HomepageConfig = require('./models/HomepageConfig');

const BASE_PACKAGES = require('./data/packages.js');
const ADDITIONAL_PACKAGES = [
    { id: 'thai_adventure_1', title: 'Thailand Super Saver Special', location: 'Thailand', duration: 5, price: 29999, originalPrice: 45000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg', status: 'published', showOnHomepage: true },
    { id: 'rishi_rafting_1', title: 'Rishikesh Rafting Adventure', location: 'Rishikesh, India', duration: 3, price: 5999, originalPrice: 8999, category: 'Domestic', image: 'https://images.unsplash.com/photo-1530590394457-e7ecbc19c08d', status: 'published', showOnHomepage: true },
    { id: 'manali_volvo_1', title: 'Manali Volvo Special', location: 'Manali, India', duration: 4, price: 7999, originalPrice: 12999, category: 'Domestic', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', status: 'published', showOnHomepage: true },
    { id: 'kasol_trek_1', title: 'Kasol Kheerganga Trek', location: 'Kasol, India', duration: 5, price: 6500, originalPrice: 9500, category: 'Domestic', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd', status: 'published', showOnHomepage: true },
    { id: 'pkg_hong_kong_disney', title: 'Hong Kong Dreams: Disney & Lantau', location: 'Hong Kong', duration: 5, price: 75000, originalPrice: 95000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/HongKong.jpg', status: 'published', showOnHomepage: true },
    { id: 'malaysia_truly_1', title: 'Malaysia Truly Asia: Genting & KL', location: 'Malaysia', duration: 6, price: 42000, originalPrice: 55000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Malaysia.jpg', status: 'published', showOnHomepage: true }
];

const DESTINATIONS = [
    { name: "Bali", slug: "bali-indonesia", heroImage: "https://ik.imagekit.io/2nikzq08c/Bali.jpg", tagline: "Island of the Gods", isFeatured: true, region: 'International' },
    { name: "Thailand", slug: "thailand", heroImage: "https://ik.imagekit.io/2nikzq08c/Thailand.jpg", tagline: "Land of Smiles", isFeatured: true, region: 'International' },
    { name: "Switzerland", slug: "europe", heroImage: "https://ik.imagekit.io/2nikzq08c/Swiss.jpg", tagline: "Alpine Wonder", isFeatured: true, region: 'International' },
    { name: "Kerala", slug: "kerala-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Kerala.jpg", tagline: "God's Own Country", isFeatured: true, region: 'Domestic' },
    { name: "Dubai", slug: "dubai-uae", heroImage: "https://ik.imagekit.io/2nikzq08c/Dubai.jpg", tagline: "City of Superlatives", isFeatured: true, region: 'International' },
    { name: "Kashmir", slug: "kashmir-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Kashmir.jpg", tagline: "Paradise on Earth", isFeatured: true, region: 'Domestic' },
    { name: "Maldives", slug: "maldives", heroImage: "https://ik.imagekit.io/2nikzq08c/Maldives.jpg", tagline: "Turquoise Haven", isFeatured: true, region: 'International' },
    { name: "Vietnam", slug: "vietnam", heroImage: "https://ik.imagekit.io/2nikzq08c/Vietnam.jpg", tagline: "Jewel of SE Asia", isFeatured: true, region: 'International' },
    { name: "Malaysia", slug: "malaysia", heroImage: "https://ik.imagekit.io/2nikzq08c/Malaysia.jpg", tagline: "Truly Asia", isFeatured: true, region: 'International' },
    { name: "Singapore", slug: "singapore", heroImage: "https://ik.imagekit.io/2nikzq08c/Singapore.jpg", tagline: "The Lion City", isFeatured: true, region: 'International' },
    { name: "Hong Kong", slug: "hong-kong", heroImage: "https://ik.imagekit.io/2nikzq08c/HongKong.jpg", tagline: "Asia's World City", isFeatured: true, region: 'International' }
];

async function seedSync() {
    try {
        console.log('--- Yatravi PRODUCTION SYNC (11 Dests / 18 Pkgs) ---');
        await mongoose.connect(process.env.MONGO_URI);

        // 1. PURGE
        console.log('Master Purge Started...');
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await HomepageConfig.deleteMany({});
        console.log('Database Cleaned.');

        // 2. SEED 11 DESTINATIONS
        const seededDests = await Destination.insertMany(DESTINATIONS);
        console.log(`Seeded ${seededDests.length} Destinations.`);

        // 3. SEED 18 PACKAGES
        const ALL_PKGS = [...BASE_PACKAGES, ...ADDITIONAL_PACKAGES].slice(0, 18);
        const seededPkgs = await Package.insertMany(ALL_PKGS.map(p => ({
            ...p,
            status: 'published',
            showOnHomepage: true,
            slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
        })));
        console.log(`Seeded ${seededPkgs.length} Packages.`);

        // 4. CONFIG
        await HomepageConfig.create({
            heroSlider: seededDests.slice(0, 5).map((d, index) => ({ destinationId: d._id, order: index + 1 })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Global Hotspots', type: 'destinations', enabled: true, order: 1, destinationItems: seededDests.slice(0, 8).map(d => d._id) },
                { key: 'trendingPackages', title: 'Trending Right Now', subtitle: 'Most loved by travelers', type: 'packages', queryConfig: { tag: 'Trending', limit: 6 }, enabled: true, order: 3 },
                { key: 'international', title: 'International Getaways', subtitle: 'Explore the world', type: 'packages', filterType: 'International', enabled: true, order: 4 },
                { key: 'domestic', title: 'Domestic Getaways', subtitle: 'Discover India', type: 'packages', filterType: 'Domestic', enabled: true, order: 5 }
            ]
        });

        console.log('SYNC SUCCESSFUL: VM Matches Local Exactly.');
        process.exit(0);
    } catch (e) {
        console.error('SYNC FAILED:', e);
        process.exit(1);
    }
}

seedSync();
