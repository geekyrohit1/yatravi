const mongoose = require('mongoose');
require('dotenv').config();
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const HomepageConfig = require('./models/HomepageConfig');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

async function seedFinalV2() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- FINAL SEED V2 STARTED ---');

        console.log('Cleaning all existing data...');
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await HomepageConfig.deleteMany({});

        // 1. DESTINATIONS (10 PREMIUM)
        const destinations = [
            { name: "Bali", slug: "bali-indonesia", heroImage: "https://ik.imagekit.io/2nikzq08c/Bali.jpg", tagline: "Island of Gods", isFeatured: true, region: 'International', facts: { currency: "IDR", language: "Indonesian", bestTime: "Apr-Oct", visaInfo: "VOA for Indians" } },
            { name: "Thailand", slug: "thailand", heroImage: "https://ik.imagekit.io/2nikzq08c/Thailand.jpg", tagline: "Land of Smiles", isFeatured: true, region: 'International', facts: { currency: "THB", language: "Thai", bestTime: "Nov-Feb", visaInfo: "Visa Free" } },
            { name: "Dubai", slug: "dubai-uae", heroImage: "https://ik.imagekit.io/2nikzq08c/Dubai.jpg", tagline: "City of Gold", isFeatured: true, region: 'International', facts: { currency: "AED", language: "Arabic, English", bestTime: "Nov-Mar", visaInfo: "E-Visa" } },
            { name: "Kerala", slug: "kerala-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Kerala.jpg", tagline: "God's Own Country", isFeatured: true, region: 'Domestic', facts: { currency: "INR", language: "Malayalam", bestTime: "Sep-Mar", visaInfo: "Domestic" } },
            { name: "Kashmir", slug: "kashmir-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Kashmir.jpg", tagline: "Paradise on Earth", isFeatured: true, region: 'Domestic', facts: { currency: "INR", language: "Kashmiri, Hindi", bestTime: "All Year", visaInfo: "Domestic" } },
            { name: "Maldives", slug: "maldives-package", heroImage: "https://ik.imagekit.io/2nikzq08c/Maldives.jpg", tagline: "Luxury Escape", isFeatured: true, region: 'International' },
            { name: "Switzerland", slug: "switzerland-eu", heroImage: "https://ik.imagekit.io/2nikzq08c/Swiss.jpg", tagline: "Alpine Swiss", isFeatured: true, region: 'International' },
            { name: "Vietnam", slug: "vietnam-tours", heroImage: "https://ik.imagekit.io/2nikzq08c/Vietnam.jpg", tagline: "Timeless Vietnam", isFeatured: true, region: 'International' },
            { name: "Singapore", slug: "singapore-city", heroImage: "https://ik.imagekit.io/2nikzq08c/Singapore.jpg", tagline: "Global Hub", isFeatured: true, region: 'International' },
            { name: "Malaysia", slug: "malaysia-asia", heroImage: "https://ik.imagekit.io/2nikzq08c/Malaysia.jpg", tagline: "Truly Asia", isFeatured: true, region: 'International' }
        ];
        const seededDests = await Destination.insertMany(destinations);
        console.log(`- Seeded ${seededDests.length} Destinations`);

        // 2. PACKAGES (12+ PREMIUM)
        const basePackages = [
            { title: "Bali Bliss: 6-Day Romantic Getaway", location: "Bali, Indonesia", category: "International", price: 29999, originalPrice: 45000, duration: 6, image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000", isTrending: true, showOnHomepage: true },
            { title: "Thailand Highlights: Phuket & Krabi", location: "Thailand", category: "International", price: 34999, originalPrice: 48000, duration: 5, image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000", isBestSeller: true, showOnHomepage: true },
            { title: "Dubai Luxury: Burj Khalifa & Sahara", location: "Dubai, UAE", category: "International", price: 45000, originalPrice: 58000, duration: 5, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000", showOnHomepage: true },
            { title: "Kerala: Houseboat & Tea Gardens", location: "Kerala, India", category: "Domestic", price: 18500, originalPrice: 25000, duration: 5, image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000", showOnHomepage: true },
            { title: "Kashmir: Srinagar & Gulmarg Special", location: "Kashmir, India", category: "Domestic", price: 34000, originalPrice: 42000, duration: 6, image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1000", showOnHomepage: true },
            { title: "Maldives: Overwater Villa Experience", location: "Maldives", category: "International", price: 95000, originalPrice: 135000, duration: 5, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1000", showOnHomepage: true },
            { title: "Switzerland: Alpine Peaks & Rail", location: "Switzerland", category: "International", price: 155000, originalPrice: 195000, duration: 8, image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=1000", showOnHomepage: true },
            { title: "Vietnam Heritage: Hanoi & Ha Long", location: "Vietnam", category: "International", price: 52000, originalPrice: 68000, duration: 7, image: "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?q=80&w=1000", showOnHomepage: true },
            { title: "Singapore Magic: Universal Studios", location: "Singapore", category: "International", price: 64000, originalPrice: 78000, duration: 5, image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1000", showOnHomepage: true },
            { title: "Malaysia Splendor: Genting Highlands", location: "Malaysia", category: "International", price: 43000, originalPrice: 55000, duration: 6, image: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?q=80&w=1000", showOnHomepage: true },
            { title: "Andaman: Scuba & Beach Vacation", location: "Andaman, India", category: "Domestic", price: 32000, originalPrice: 45000, duration: 6, image: "https://images.unsplash.com/photo-1589136777351-fdc6c93803c5?q=80&w=1000", showOnHomepage: true },
            { title: "Rajasthan: Cultural Jaipur & Udaipur", location: "Rajasthan, India", category: "Domestic", price: 26500, originalPrice: 35000, duration: 6, image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=1000", showOnHomepage: true }
        ];

        const packagesWithDetails = basePackages.map((p, idx) => ({
            ...p,
            id: `pkg_final_v2_${idx}`,
            slug: slugify(p.title),
            status: 'published',
            showInCollections: true,
            inclusionHighlights: ['stay', 'breakfast', 'transfer', 'sightseeing'],
            itinerary: [
                { day: 1, title: 'Arrival', description: `Welcome to ${p.location}. Check-in and relax.` },
                { day: 2, title: 'Local Tour', description: 'Experience the culture and scenic beauty.' }
            ],
            seo: { title: `${p.title} | Yatravi`, description: `Book your ${p.title} now for the best travel experience.` }
        }));

        const seededPkgs = await Package.insertMany(packagesWithDetails);
        console.log(`- Seeded ${seededPkgs.length} Packages`);

        // 3. UPDATE STATS
        for (const dest of seededDests) {
            const related = seededPkgs.filter(p => p.location.includes(dest.name));
            dest.packageCount = related.length;
            dest.startingPrice = related.length > 0 ? Math.min(...related.map(p => p.price)) : 0;
            await dest.save();
        }

        // 4. HOMEPAGE CONFIG
        const config = new HomepageConfig({
            heroSlider: seededDests.slice(0, 5).map((d, index) => ({ destinationId: d._id, order: index, enabled: true })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Global Hotspots', type: 'destinations', destinationItems: seededDests.slice(0, 8).map(d => d._id), enabled: true, order: 1 },
                { key: 'international', title: 'International Getaways', type: 'packages', filterType: 'international', enabled: true, order: 2 },
                { key: 'domestic', title: 'Domestic Getaways', type: 'packages', filterType: 'domestic', enabled: true, order: 3 }
            ]
        });
        await config.save();

        console.log('--- FINAL SEED V2 SUCCESSFUL ---');
        process.exit(0);
    } catch (e) {
        console.error('SEED FAILED:', e);
        process.exit(1);
    }
}

seedFinalV2();
