const mongoose = require('mongoose');
require('dotenv').config();
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const HomepageConfig = require('./models/HomepageConfig');

async function seedManual() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        console.log('Cleaning all existing data...');
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await HomepageConfig.deleteMany({});
        console.log('Database cleaned.');

        // 1. CREATE DESTINATIONS
        const destinations = [
            {
                name: "Bali",
                slug: "bali-indonesia",
                heroImage: "https://ik.imagekit.io/2nikzq08c/Bali.jpg",
                tagline: "Paradise Island of the Gods",
                isFeatured: true,
                region: 'International',
                facts: { currency: "IDR", language: "Indonesian", bestTime: "April-Oct", visaInfo: "VOA for Indians" }
            },
            {
                name: "Kashmir",
                slug: "kashmir-india",
                heroImage: "https://ik.imagekit.io/2nikzq08c/Kashmir.jpg",
                tagline: "Heaven on Earth",
                isFeatured: true,
                region: 'Domestic',
                facts: { currency: "INR", language: "Hindi, English", bestTime: "All Year", visaInfo: "Domestic" }
            },
            {
                name: "Switzerland",
                slug: "europe-switzerland",
                heroImage: "https://ik.imagekit.io/2nikzq08c/Swiss.jpg",
                tagline: "The Alpine Wonderland",
                isFeatured: true,
                region: 'International',
                facts: { currency: "CHF", language: "German", bestTime: "June-Sept", visaInfo: "Schengen Visa" }
            },
            {
                name: "Thailand",
                slug: "thailand",
                heroImage: "https://ik.imagekit.io/2nikzq08c/Thailand.jpg",
                tagline: "The Land of Smiles",
                isFeatured: true,
                region: 'International',
                facts: { currency: "THB", language: "Thai", bestTime: "Nov-Feb", visaInfo: "Visa Free" }
            },
            {
                name: "Kerala",
                slug: "kerala-india",
                heroImage: "https://ik.imagekit.io/2nikzq08c/Kerala.jpg",
                tagline: "God's Own Country",
                isFeatured: true,
                region: 'Domestic',
                facts: { currency: "INR", language: "Malayalam", bestTime: "Sept-March", visaInfo: "Domestic" }
            }
        ];
        const seededDests = await Destination.insertMany(destinations);
        console.log(`Seeded ${seededDests.length} Destinations.`);

        // 2. CREATE PACKAGES
        const packages = [
            {
                id: 'pkg_bali_m1',
                slug: 'bali-luxury-escape-6d',
                title: 'Bali Ultimate Escape: 6-Day Luxury Retreat',
                location: 'Bali, Indonesia',
                duration: 6,
                price: 34999,
                originalPrice: 48000,
                category: 'International',
                image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000',
                isTrending: true,
                status: 'published',
                showOnHomepage: true,
                itinerary: [
                    { day: 1, title: "Arrival", description: "V.I.P Pickup and transfer to Seminyak Villa." },
                    { day: 2, title: "Tegalalang", description: "Rice terraces and jungle swing experience." },
                    { day: 3, title: "Nusa Penida", description: "Private boat tour to Kelingking beach." }
                ],
                inclusionHighlights: ['stay', 'breakfast', 'transfer']
            },
            {
                id: 'pkg_kashmir_m1',
                slug: 'kashmir-winter-paradise-5d',
                title: 'Kashmir: Srinagar & Gulmarg Special',
                location: 'Kashmir, India',
                duration: 5,
                price: 28500,
                originalPrice: 38000,
                category: 'Domestic',
                image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1000',
                isBestSeller: true,
                status: 'published',
                showOnHomepage: true,
                itinerary: [
                    { day: 1, title: "Houseboat Stay", description: "Dal Lake experience with Shikara ride." },
                    { day: 2, title: "Gulmarg", description: "World's highest gondola ride." }
                ],
                inclusionHighlights: ['stay', 'breakfast', 'dinner']
            },
            {
                id: 'pkg_swiss_m1',
                slug: 'swiss-alps-panorama-7d',
                title: 'Swiss Alps: 7-Day Scenic Panorama',
                location: 'Switzerland',
                duration: 7,
                price: 155000,
                originalPrice: 195000,
                category: 'International',
                image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000',
                status: 'published',
                showOnHomepage: true,
                itinerary: [
                    { day: 1, title: "Lucerne", description: "Lake Lucerne cruise and city walk." },
                    { day: 2, title: "Mt. Titlis", description: "Snow adventure and ice palace." }
                ],
                inclusionHighlights: ['stay', 'breakfast', 'sightseeing']
            },
            {
                id: 'pkg_thai_m1',
                slug: 'thailand-island-hopper-5d',
                title: 'Thailand: Phuket & Phi Phi Islands',
                location: 'Thailand',
                duration: 5,
                price: 32999,
                originalPrice: 42000,
                category: 'International',
                image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000',
                status: 'published',
                showOnHomepage: true,
                itinerary: [
                    { day: 1, title: "Phuket Arrival", description: "Beachfront resort check-in." },
                    { day: 2, title: "Phi Phi Island", description: "Speedboat tour and snorkeling." }
                ],
                inclusionHighlights: ['stay', 'breakfast', 'transfer']
            },
            {
                id: 'pkg_kerala_m1',
                slug: 'kerala-backwaters-6d',
                title: 'Kerala: Houseboat & Tea Gardens',
                location: 'Kerala, India',
                duration: 6,
                price: 18500,
                originalPrice: 25000,
                category: 'Domestic',
                image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000',
                status: 'published',
                showOnHomepage: true,
                inclusionHighlights: ['stay', 'breakfast', 'transfer']
            }
        ];
        const seededPkgs = await Package.insertMany(packages);
        console.log(`Seeded ${seededPkgs.length} Packages.`);

        // 3. UPDATE DESTINATION STATS
        for (const dest of seededDests) {
            const related = seededPkgs.filter(p => p.location.includes(dest.name));
            dest.packageCount = related.length;
            dest.startingPrice = related.length > 0 ? Math.min(...related.map(p => p.price)) : 0;
            await dest.save();
        }

        // 4. HOMEPAGE CONFIG
        const config = new HomepageConfig({
            heroSlider: seededDests.slice(0, 4).map((d, index) => ({ destinationId: d._id, order: index, enabled: true })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Manually Curated Premium Hotspots', type: 'destinations', destinationItems: seededDests.map(d => d._id), enabled: true, order: 1 },
                { key: 'international', title: 'International Getaways', subtitle: 'World class travel experiences', type: 'packages', filterType: 'international', enabled: true, order: 2 },
                { key: 'domestic', title: 'Domestic Getaways', subtitle: 'Treasures of India', type: 'packages', filterType: 'domestic', enabled: true, order: 3 }
            ]
        });
        await config.save();
        console.log('Homepage Configuration Stabilized.');

        console.log('\nMANUAL SEED SUCCESSFUL.');
        process.exit(0);
    } catch (e) {
        console.error('SEED FAILED:', e);
        process.exit(1);
    }
}

seedManual();
