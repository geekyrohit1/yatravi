const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Models
const Destination = require('./models/Destination.js');
const Package = require('./models/Package.js');
const HomepageConfig = require('./models/HomepageConfig.js');
const PACKAGES = require('./data/packages.js');

// Load env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Data to Import (17 Destinations)
const DESTINATIONS = [
    { name: "BALI", slug: "bali-indonesia", heroImage: "https://ik.imagekit.io/2nikzq08c/Bali.jpg", tagline: "Island of the Gods", startingPrice: 29999, isFeatured: true, description: "Explore the tropical paradise of Bali." },
    { name: "THAILAND", slug: "thailand", heroImage: "https://ik.imagekit.io/2nikzq08c/Thailand.jpg", tagline: "Land of Smiles", startingPrice: 29999, isFeatured: true, description: "Enjoy the vibrant culture of Thailand." },
    { name: "SWITZERLAND", slug: "europe", heroImage: "https://ik.imagekit.io/2nikzq08c/Swiss.jpg", tagline: "Alpine Wonder", startingPrice: 145000, isFeatured: true, description: "Experience the majestic Swiss Alps." },
    { name: "KERALA", slug: "kerala-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Kerala.jpg", tagline: "God's Own Country", startingPrice: 12000, isFeatured: true, description: "Relax in the backwaters of Kerala." },
    { name: "DUBAI", slug: "dubai-uae", heroImage: "https://ik.imagekit.io/2nikzq08c/Dubai.jpg", tagline: "City of Superlatives", startingPrice: 45000, isFeatured: true, description: "Witness the futuristic skyline of Dubai." },
    { name: "KASHMIR", slug: "kashmir-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Kashmir.jpg", tagline: "Paradise on Earth", startingPrice: 32500, isFeatured: true, description: "Discover the breathtaking beauty of Kashmir." },
    { name: "MALDIVES", slug: "maldives", heroImage: "https://ik.imagekit.io/2nikzq08c/Maldives.jpg", tagline: "Turquoise Haven", startingPrice: 85000, isFeatured: true, description: "Ultimate island luxury in Maldives." },
    { name: "VIETNAM", slug: "vietnam", heroImage: "https://ik.imagekit.io/2nikzq08c/Vietnam.jpg", tagline: "Jewel of SE Asia", startingPrice: 48000, isFeatured: true, description: "Ancient history and stunning landscapes." },
    { name: "MALAYSIA", slug: "malaysia", heroImage: "https://ik.imagekit.io/2nikzq08c/Malaysia.jpg", tagline: "Truly Asia", startingPrice: 42000, isFeatured: true, description: "Modernity meets tradition in Malaysia." },
    { name: "SINGAPORE", slug: "singapore", heroImage: "https://ik.imagekit.io/2nikzq08c/Singapore.jpg", tagline: "The Lion City", startingPrice: 65000, isFeatured: true, description: "A futuristic city-state experience." },
    { name: "LADAKH", slug: "ladakh-india", heroImage: "https://ik.imagekit.io/2nikzq08c/Ladakh.jpg", tagline: "The High Passes", startingPrice: 28000, isFeatured: true, description: "Adventure in the cold desert of Ladakh." },
    { name: "SRI LANKA", slug: "sri-lanka", heroImage: "https://ik.imagekit.io/2nikzq08c/Srilanka.jpg", tagline: "Pearl of the Indian Ocean", startingPrice: 38000, isFeatured: true, description: "Lush greenery and ancient temples." },
    { name: "MAURITIUS", slug: "mauritius", heroImage: "https://ik.imagekit.io/2nikzq08c/Mauritius.jpg", tagline: "Beyond the Blue", startingPrice: 72000, isFeatured: true, description: "Stunning beaches and diverse culture." },
    { name: "SEYCHELLES", slug: "seychelles", heroImage: "https://ik.imagekit.io/2nikzq08c/Seychelles.jpg", tagline: "Isolated Paradise", startingPrice: 125000, isFeatured: true, description: "Granite boulders and pristine shores." },
    { name: "JAPAN", slug: "japan", heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", tagline: "Land of Rising Sun", startingPrice: 95000, isFeatured: true, description: "Experience the unique blend of tradition and future." },
    { name: "HONG KONG", slug: "hong-kong", heroImage: "https://ik.imagekit.io/2nikzq08c/HongKong.jpg", tagline: "Asia's World City", startingPrice: 75000, isFeatured: true, description: "Vibrant city life and stunning skyline." },
    { name: "PARIS", slug: "paris-france", heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", tagline: "City of Lights", startingPrice: 115000, isFeatured: true, description: "The most romantic city in the world." }
];

const ADDITIONAL_PACKAGES = [
    { id: 't_1', title: 'Thailand Adventure Buffet', location: 'Thailand', duration: 5, price: 29999, originalPrice: 45000, category: 'International', image: 'https://ik.imagekit.io/2nikzq08c/Thailand.jpg', status: 'published', showOnHomepage: true },
    { id: 'w_1', title: 'Rishikesh Rafting Adventure', location: 'Rishikesh, India', duration: 3, price: 5999, originalPrice: 8999, category: 'Adventure', image: 'https://images.unsplash.com/photo-1530590394457-e7ecbc19c08d', groupSize: '1-10', status: 'published', showOnHomepage: true },
    { id: 'w_2', title: 'Manali Volvo Special', location: 'Manali, India', duration: 4, price: 7999, originalPrice: 12999, category: 'Family', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', groupSize: '1-12', status: 'published', showOnHomepage: true },
    { id: 'w_3', title: 'Kasol Kheerganga Trek', location: 'Kasol, India', duration: 5, price: 6500, originalPrice: 9500, category: 'Nature', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd', groupSize: '1-8', status: 'published', showOnHomepage: true },
    { id: 'w_4', title: 'McLeodGanj Triund Trek', location: 'Dharamshala, India', duration: 4, price: 5500, originalPrice: 8500, category: 'Adventure', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2', groupSize: '1-10', status: 'published', showOnHomepage: true },
    { id: 's_1', title: 'Jaipur Weekend Getaway', location: 'Jaipur, India', duration: 2, price: 4999, originalPrice: 7999, category: 'Culture', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41', groupSize: 'Private', status: 'published', showOnHomepage: true },
    { id: 's_2', title: 'Agra Day Trip', location: 'Agra, India', duration: 1, price: 2500, originalPrice: 4500, category: 'Culture', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea023', groupSize: 'Private', status: 'published', showOnHomepage: true }
];

async function restore() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to Atlas.');

        console.log('Purging current production data...');
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await HomepageConfig.deleteMany({});
        console.log('Purge complete.');

        // 1. Import Packages
        console.log('Importing packages...');
        const allPackages = [...PACKAGES, ...ADDITIONAL_PACKAGES];
        const importedPackages = await Package.insertMany(allPackages.map(p => ({
             ...p,
             _id: new mongoose.Types.ObjectId(),
             slug: p.slug || p.title.toLowerCase().replace(/ /g, '-')
        })));
        console.log(`Imported ${importedPackages.length} packages.`);

        // 2. Import Destinations
        console.log('Importing destinations...');
        const importedDestinations = await Destination.insertMany(DESTINATIONS);
        console.log(`Imported ${importedDestinations.length} destinations.`);

        // 3. Create HomepageConfig
        console.log('Resetting Homepage Configuration...');
        const config = new HomepageConfig({
            heroSlider: importedDestinations.map((d, index) => ({
                destinationId: d._id,
                order: index,
                enabled: true
            })),
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Explore our most popular destinations', type: 'destinations', enabled: true, order: 1 },
                { key: 'offersAndUpdates', title: 'Offers & Updates', subtitle: 'Exclusive deals and travel news', type: 'offers', enabled: true, order: 2, cards: [] },
                { key: 'weekendGetaways', title: 'Weekend Getaways', subtitle: 'Short breaks for the busy bees', type: 'packages', filterType: 'weekend', queryConfig: { tag: 'Weekend' }, enabled: true, order: 3 },
                { key: 'honeymoon', title: 'Honeymoon Specials', subtitle: 'Romantic destinations for couples', type: 'packages', filterType: 'honeymoon', queryConfig: { tag: 'Honeymoon' }, enabled: true, order: 4 },
                { key: 'domestic', title: 'Domestic Getaways', subtitle: 'Explore the beauty of India', type: 'packages', filterType: 'domestic', enabled: true, order: 5 },
                { key: 'international', title: 'International Getaways', subtitle: 'Explore the world', type: 'packages', filterType: 'international', enabled: true, order: 6 },
                { key: 'superSaver', title: 'Super Saver Deals', subtitle: 'Best value packages', type: 'packages', filterType: 'superSaver', enabled: true, order: 7 }
            ],
            mobileHeroVideo: "/videos/hero-mobile.mp4", 
            showMobileHeroVideo: true 
        });
        await config.save();
        console.log('Homepage configuration restored to Classic state.');

        console.log('RESTORE SUCCESSFUL.');
        process.exit(0);
    } catch (error) {
        console.error('RESTORE FAILED:', error);
        process.exit(1);
    }
}

restore();
