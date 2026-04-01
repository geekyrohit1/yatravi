const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const Destination = require('./models/Destination.js');
const Package = require('./models/Package.js');
const HomepageConfig = require('./models/HomepageConfig.js');
const Analytics = require('./models/Analytics.js');
const Enquiry = require('./models/Enquiry.js');
const OTP = require('./models/OTP.js');
const GlobalSetting = require('./models/GlobalSetting.js');

// Data
const BASE_PACKAGES = require('./data/packages.js');

// Load env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const DESTINATIONS = [
    { name: "Bali", slug: "bali-indonesia", heroImage: "https://ik.imagekit.io/2nikzq08c/Bali.jpg", tagline: "Island of the Gods", startingPrice: 29999, isFeatured: true, region: 'International' },
    { name: "Thailand", slug: "thailand", heroImage: "https://ik.imagekit.io/2nikzq08c/Thailand.jpg", tagline: "Land of Smiles", startingPrice: 29999, isFeatured: true, region: 'International' },
    { name: "Switzerland", slug: "europe", heroImage: "https://ik.imagekit.io/2nikzq08c/Swiss.jpg", tagline: "Alpine Wonder", startingPrice: 145000, isFeatured: true, region: 'International' },
    { name: "Kerala", slug: "kerala-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Kerala.jpg", tagline: "God's Own Country", startingPrice: 12000, isFeatured: true, region: 'Domestic' },
    { name: "Dubai", slug: "dubai-uae", heroImage: "https://ik.imagekit.io/2nikzq08c/Dubai.jpg", tagline: "City of Superlatives", startingPrice: 45000, isFeatured: true, region: 'International' },
    { name: "Kashmir", slug: "kashmir-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Kashmir.jpg", tagline: "Paradise on Earth", startingPrice: 32500, isFeatured: true, region: 'Domestic' },
    { name: "Maldives", slug: "maldives", heroImage: "https://ik.imagekit.io/2nikzq08c/Maldives.jpg", tagline: "Turquoise Haven", startingPrice: 85000, isFeatured: true, region: 'International' },
    { name: "Vietnam", slug: "vietnam", heroImage: "https://ik.imagekit.io/2nikzq08c/Vietnam.jpg", tagline: "Jewel of SE Asia", startingPrice: 48000, isFeatured: true, region: 'International' },
    { name: "Malaysia", slug: "malaysia", heroImage: "https://ik.imagekit.io/2nikzq08c/Malaysia.jpg", tagline: "Truly Asia", startingPrice: 42000, isFeatured: true, region: 'International' },
    { name: "Singapore", slug: "singapore", heroImage: "https://ik.imagekit.io/2nikzq08c/Singapore.jpg", tagline: "The Lion City", startingPrice: 65000, isFeatured: true, region: 'International' },
    { name: "Ladakh", slug: "ladakh-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Ladakh.jpg", tagline: "The High Passes", startingPrice: 28000, isFeatured: true, region: 'Domestic' },
    { name: "Sri Lanka", slug: "sri-lanka", heroImage: "https://ik.imagekit.io/2nikzq08c/Srilanka.jpg", tagline: "Pearl of the Indian Ocean", startingPrice: 38000, isFeatured: true, region: 'International' },
    { name: "Mauritius", slug: "mauritius", heroImage: "https://ik.imagekit.io/2nikzq08c/Mauritius.jpg", tagline: "Beyond the Blue", startingPrice: 72000, isFeatured: true, region: 'International' },
    { name: "Seychelles", slug: "seychelles", heroImage: "https://ik.imagekit.io/2nikzq08c/Seychelles.jpg", tagline: "Isolated Paradise", startingPrice: 125000, isFeatured: true, region: 'International' },
    { name: "Japan", slug: "japan", heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", tagline: "Land of Rising Sun", startingPrice: 95000, isFeatured: true, region: 'International' },
    { name: "Hong Kong", slug: "hong-kong", heroImage: "https://ik.imagekit.io/2nikzq08c/HongKong.jpg", tagline: "Asia's World City", startingPrice: 75000, isFeatured: true, region: 'International' },
    { name: "Paris", slug: "paris-france", heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", tagline: "City of Lights", startingPrice: 115000, isFeatured: true, region: 'International' }
];

const ADDITIONAL_PACKAGES = [
    { id: 'thai_adventure_1', title: 'Thailand Adventure Buffet', location: 'Thailand', duration: 5, price: 29999, originalPrice: 45000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg', status: 'published', showOnHomepage: true },
    { id: 'rishi_rafting_1', title: 'Rishikesh Rafting Adventure', location: 'Rishikesh, India', duration: 3, price: 5999, originalPrice: 8999, category: 'Domestic', image: 'https://images.unsplash.com/photo-1530590394457-e7ecbc19c08d', status: 'published', showOnHomepage: true },
    { id: 'manali_volvo_1', title: 'Manali Volvo Special', location: 'Manali, India', duration: 4, price: 7999, originalPrice: 12999, category: 'Domestic', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', status: 'published', showOnHomepage: true },
    { id: 'kasol_trek_1', title: 'Kasol Kheerganga Trek', location: 'Kasol, India', duration: 5, price: 6500, originalPrice: 9500, category: 'Domestic', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd', status: 'published', showOnHomepage: true },
    { id: 'mcleod_trek_1', title: 'McLeodGanj Triund Trek', location: 'Dharamshala, India', duration: 4, price: 5500, originalPrice: 8500, category: 'Domestic', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2', status: 'published', showOnHomepage: true },
    { id: 'jaipur_weekend_1', title: 'Jaipur Weekend Getaway', location: 'Jaipur, India', duration: 2, price: 4999, originalPrice: 7999, category: 'Domestic', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41', status: 'published', showOnHomepage: true },
    { id: 'agra_day_1', title: 'Agra Day Trip', location: 'Agra, India', duration: 1, price: 2500, originalPrice: 4500, category: 'Domestic', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea023', status: 'published', showOnHomepage: true },
    {
        id: 'pkg_hong_kong_disney',
        title: 'Hong Kong Dreams: Disney & Lantau Island',
        location: 'Hong Kong',
        duration: 5,
        price: 75000,
        originalPrice: 95000,
        category: 'International',
        image: 'https://ik.imagekit.io/2nikzq08c/HongKong.jpg',
        rating: 4.9,
        reviewsCount: 132,
        showOnHomepage: true,
        inclusionHighlights: ['stay', 'breakfast', 'transfer', 'sightseeing'],
        itinerary: [
            { day: 1, title: "Arrival & Victoria Peak", description: "Arrival and check-in. Evening visit to Victoria Peak via Peak Tram for skyline view." },
            { day: 2, title: "Hong Kong Disneyland", description: "Full day of magic at Hong Kong Disneyland Park." },
            { day: 3, title: "Lantau Island & Big Buddha", description: "Ngong Ping 360 Cable Car ride and visit to the Tian Tan Buddha." },
            { day: 4, title: "Aberdeen & Repulse Bay", description: "Discover the Aberdeen Fishing Village and the scenic Repulse Bay beach." },
            { day: 5, title: "Leisure & Departure", description: "Last minute shopping at Mong Kok and transfer to airport." }
        ]
    },
    { id: 'delhi_bali_1', title: 'Bali from Delhi Special', location: 'Bali', duration: 6, price: 34999, originalPrice: 48000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Bali.jpg', status: 'published', showOnHomepage: true, homepageSections: ['cityDepartures'] },
    { id: 'mumbai_thai_1', title: 'Thailand from Mumbai Buffet', location: 'Thailand', duration: 5, price: 31999, originalPrice: 46000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg', status: 'published', showOnHomepage: true, homepageSections: ['cityDepartures'] },
    { id: 'amd_kashmir_1', title: 'Kashmir from Ahmedabad', location: 'Kashmir', duration: 6, price: 33500, originalPrice: 45000, category: 'Domestic', image: 'https://ik.imagekit.io/2nikzq08c/Kashmir.jpg', status: 'published', showOnHomepage: true, homepageSections: ['cityDepartures'] }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        console.log('MASTER PURGE: Executing total database cleanup...');
        await Promise.all([
            Destination.deleteMany({}),
            Package.deleteMany({}),
            HomepageConfig.deleteMany({}),
            Analytics.deleteMany({}),
            Enquiry.deleteMany({}),
            OTP.deleteMany({}),
            GlobalSetting.deleteMany({})
        ]);
        console.log('Purge Complete: Database is now 100% Clean.');

        const ALL_PACKAGES = [...BASE_PACKAGES, ...ADDITIONAL_PACKAGES];

        console.log(`Seeding ${ALL_PACKAGES.length} Classic + Restored Packages...`);
        const trendingIds = ['thai_adventure_1', 'bali_retreat_1', 'pkg_hong_kong_disney', 'kasol_trek_1', 'amd_kashmir_1'];
        const seededPackages = await Package.insertMany(ALL_PACKAGES.map(p => ({
            ...p,
            status: 'published',
            tags: trendingIds.includes(p.id) ? [...(p.tags || []), 'Trending'] : p.tags,
            slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
        })));

        console.log(`Seeding ${DESTINATIONS.length} Classic Destinations...`);
        const seededDestinations = await Destination.insertMany(DESTINATIONS);

        console.log('Configuring Homepage Sections (Final Audit V12.4 Sync)...');
        const config = new HomepageConfig({
            heroSlider: seededDestinations.slice(0, 8).map((d, index) => ({
                destinationId: d._id,
                order: index,
                enabled: true
            })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Explore our most popular destinations', type: 'destinations', enabled: true, order: 1, destinationItems: seededDestinations.slice(0, 6).map(d => d._id) },
                { 
                    key: 'offersAndUpdates', 
                    title: 'Offers & Updates', 
                    subtitle: 'Exclusive deals and travel news', 
                    type: 'offers', 
                    enabled: true, 
                    order: 2, 
                    cards: [
                        { title: 'Flat 10% Off on Bali', image: 'https://ik.imagekit.io/2nikzq08c/Bali.jpg', linkType: 'destination', linkValue: 'bali-indonesia', badge: 'Limited Offer' },
                        { title: 'Thailand Summer Deal', image: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg', linkType: 'destination', linkValue: 'thailand', badge: 'Best Seller' }
                    ] 
                },
                { 
                    key: 'promoBanner', 
                    title: 'Limited Time Offer', 
                    subtitle: 'Up to 30% off on International Packages', 
                    type: 'media', 
                    enabled: true, 
                    order: 3, 
                    mediaUrl: 'https://ik.imagekit.io/2nikzq08c/Swiss.jpg', 
                    mobileMediaUrl: 'https://ik.imagekit.io/2nikzq08c/Swiss.jpg',
                    isVideo: false 
                },
                { key: 'honeymoon', title: 'Honeymoon Specials', subtitle: 'Romantic destinations for couples', type: 'packages', queryConfig: { tag: 'Honeymoon', limit: 6 }, enabled: true, order: 4 },
                { key: 'international', title: 'International Getaways', subtitle: 'Explore the world', type: 'packages', filterType: 'International', enabled: true, order: 5 },
                { key: 'domestic', title: 'Domestic Getaways', subtitle: 'Explore the beauty of India', type: 'packages', filterType: 'Domestic', enabled: true, order: 6 },
                { key: 'trendingPackages', title: 'Trending Packages', subtitle: 'Hottest deals this week', type: 'packages', queryConfig: { tag: 'Trending', limit: 6 }, enabled: true, order: 7 },
                { key: 'superSaver', title: 'Super Saver deals', subtitle: 'Best value for money', type: 'packages', queryConfig: { tag: 'Super Saver', limit: 6 }, enabled: true, order: 8 },
                { key: 'quicklinks', title: 'Quick Links', subtitle: '', type: 'links', enabled: true, order: 9 },
                { key: 'citydepartures', title: 'Packages from Your City', subtitle: 'Regional departures for you', type: 'packages', enabled: true, order: 10 },
                { key: 'weekendGetaways', title: 'Weekend Getaways', subtitle: 'Short breaks for you', type: 'packages', queryConfig: { tag: 'Weekend', limit: 4 }, enabled: false, order: 11 }
            ],
            mobileHeroVideo: "https://ik.imagekit.io/2nikzq08c/hero-mobile.mp4",
            showMobileHeroVideo: true,
            faq: [
                { question: "How do I book a package?", answer: "You can book directly through our website or contact our 24/7 support team.", order: 1 },
                { question: "What is your cancellation policy?", answer: "Cancellation policies vary by package. Please check the 'Terms & Conditions' on the package page.", order: 2 }
            ],
            quickLinks: [
                { label: "Packages from Delhi", url: "/search?city=delhi" },
                { label: "Packages from Mumbai", url: "/search?city=mumbai" },
                { label: "Packages from Ahmedabad", url: "/search?city=ahmedabad" },
                { label: "Packages from Bangalore", url: "/search?city=bangalore" },
                { label: "Packages from Kolkata", url: "/search?city=kolkata" }
            ],
            importantLinks: [
                { label: "Andaman from Delhi", url: "/search?q=andaman" },
                { label: "Bali from Mumbai", url: "/search?q=bali" },
                { label: "Kerala from Ahmedabad", url: "/search?q=kerala" }
            ]
        });
        await config.save();

        console.log('\n✅ RESTORATION V10.3 FINAL COMPLETE - OLD LIVE STATE');
        console.log(`- Destinations: ${seededDestinations.length}`);
        console.log(`- Packages: ${seededPackages.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('SEED FAILED:', error);
        process.exit(1);
    }
}

seed();
