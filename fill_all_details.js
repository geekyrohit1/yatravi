const mongoose = require('mongoose');
const ImageKit = require('imagekit');
require('dotenv').config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Rich Fallback Data
const standardPolicies = {
    cancellation: 'Free cancellation up to 7 days before departure. 50% refund within 7 days. No refund for no-shows.',
    refund: 'Refunds are automatically processed to your original payment method within 5-7 business days.',
    payment: 'Book initially with just 20%. The remaining 80% is securely payable up to 7 days before your departure.'
};

const standardFacts = {
    currency: 'Local Currency (USD accepted widely)',
    language: 'English & Regional Dialects',
    timezone: 'Depends on location',
    bestTime: 'Peak Season: September to May',
    budget: 'Premium & Luxury Options Available',
    visaInfo: 'Check Visa-on-Arrival eligibility or e-Visa requirements prior to booking.',
    gettingAround: 'Private chauffeurs, premium cabs, and scenic domestic flights.',
    localDish: 'Authentic regional delicacies with curated dining experiences.'
};

const genericInclusions = [
    'Premium Accommodation in 4/5 Star Hotels',
    'Daily Buffet Breakfast',
    'Private Airport Transfers',
    'Expert Local Guide for Sightseeing',
    'All Taxes and Service Charges'
];

const genericExclusions = [
    'International & Domestic Flights',
    'Lunch and Dinner (unless specified)',
    'Personal Expenses & Shopping',
    'Visa Fees',
    'Travel Insurance'
];

async function fillAllDetails() {
    try {
        console.log('--- Connecting to Yatravi Database ---');
        await mongoose.connect(process.env.MONGO_URI);
        const Package = require('./server/models/Package');
        const Destination = require('./server/models/Destination');

        // Fetch ImageKit files
        console.log('Fetching media from ImageKit (up to 200 files)...');
        const mediaFiles = await imagekit.listFiles({ limit: 200, fileType: 'image' });
        
        let destUpdates = 0;
        let pkgUpdates = 0;

        console.log('\n--- 1. Enriching Destinations ---');
        const destinations = await Destination.find({});
        for (const dest of destinations) {
            let updated = false;

            // Facts
            if (!dest.facts || !dest.facts.currency) {
                dest.facts = { ...standardFacts };
                // Custom overrides based on name
                if (dest.name === 'Switzerland') dest.facts.currency = 'CHF (Swiss Franc)';
                if (dest.name === 'Bali' || dest.name === 'Indonesia') dest.facts.currency = 'IDR (Indonesian Rupiah)';
                if (dest.name === 'Dubai') dest.facts.currency = 'AED (Emirati Dirham)';
                if (['Kerala', 'Kashmir', 'Himachal', 'Andaman'].includes(dest.name)) dest.facts.currency = 'INR (Indian Rupee)';
                updated = true;
            }

            // SEO & Descriptions
            if (!dest.seo || !dest.seo.description) {
                dest.seo = {
                    title: `Premium ${dest.name} Tour Packages | Yatravi Holidays`,
                    description: `Discover the best luxury and premium tour packages for ${dest.name}. Unforgettable experiences await with Yatravi Holidays.`,
                    keywords: `${dest.name} tours, ${dest.name} holiday packages, luxury travel ${dest.name}, Yatravi`
                };
                updated = true;
            }
            if (!dest.description) {
                dest.description = `Experience the ultimate journey to ${dest.name}. Explore breathtaking landscapes, rich culture, and world-class hospitality curated specifically for you by Yatravi Holidays.`;
                updated = true;
            }

            // ImageKit Fallbacks
            if (!dest.heroImage || dest.heroImage.includes('placeholder')) {
                const exactMatch = mediaFiles.filter(f => f.name.toLowerCase().includes(dest.name.toLowerCase()) || f.name.toLowerCase().includes(dest.slug.toLowerCase()));
                if (exactMatch.length > 0) {
                    dest.heroImage = exactMatch[0].url;
                    updated = true;
                } else if (mediaFiles.length > 0) {
                    // Random fallback to ensure no empty image
                    dest.heroImage = mediaFiles[Math.floor(Math.random() * 5)].url;
                    updated = true;
                }
            }

            if (updated) {
                await dest.save();
                destUpdates++;
            }
        }
        console.log(`Updated ${destUpdates} Destinations with rich content.`);

        console.log('\n--- 2. Enriching Packages ---');
        const packages = await Package.find({});
        for (const pkg of packages) {
            let updated = false;

            // Overview
            if (!pkg.overview || pkg.overview.trim() === '') {
                pkg.overview = `Embark on an unforgettable ${pkg.duration}-day journey to ${pkg.location}. This meticulously crafted premium package by Yatravi Holidays ensures a seamless and luxurious experience from the moment you arrive. Discover the best of ${pkg.title} and create memories that will last a lifetime.`;
                updated = true;
            }
            if (!pkg.itinerarySummary) {
                pkg.itinerarySummary = `A curated ${pkg.duration}-day exploration covering the top highlights and hidden gems of ${pkg.location}.`;
                updated = true;
            }

            // Inclusions / Exclusions
            if (!pkg.inclusions || pkg.inclusions.length === 0) {
                pkg.inclusions = genericInclusions;
                updated = true;
            }
            if (!pkg.exclusions || pkg.exclusions.length === 0) {
                pkg.exclusions = genericExclusions;
                updated = true;
            }

            // Policies
            if (!pkg.policies || pkg.policies.cancellation === '') {
                pkg.policies = standardPolicies;
                updated = true;
            }

            // SEO
            if (!pkg.seo || !pkg.seo.title) {
                pkg.seo = {
                    title: `${pkg.title} | ${pkg.duration} Days Luxury Tour | Yatravi`,
                    description: pkg.overview ? pkg.overview.substring(0, 160) : `Book the ultimate ${pkg.title} package spanning ${pkg.duration} days. Enjoy luxury travel with Yatravi Holidays.`,
                    keywords: `${pkg.location} travel, ${pkg.title}, luxury tours, Yatravi holidays`
                };
                updated = true;
            }

            // ImageKit Assignment
            if (!pkg.image || pkg.image.includes('placeholder') || (!pkg.gallery || pkg.gallery.length === 0)) {
                // Tiered matching algorithm
                let matches = mediaFiles.filter(f => f.name.toLowerCase().includes(pkg.location.toLowerCase()));
                if (matches.length === 0) {
                    // Fallback to title keywords
                    const keywords = pkg.title.toLowerCase().split(' ');
                    matches = mediaFiles.filter(f => keywords.some(k => k.length > 4 && f.name.toLowerCase().includes(k)));
                }
                
                if (matches.length > 0) {
                    if (!pkg.image || pkg.image.includes('placeholder')) pkg.image = matches[0].url;
                    
                    const uniqueMatches = [...new Set(matches.map(m => m.url))];
                    if (!pkg.gallery || pkg.gallery.length === 0) {
                         pkg.gallery = uniqueMatches.slice(0, 5);
                    }
                    updated = true;
                } else if (mediaFiles.length >= 5) {
                    // Ultimate Fallback: Ensure no package ever has an empty image/gallery again
                    if (!pkg.image || pkg.image.includes('placeholder')) pkg.image = mediaFiles[0].url;
                    if (!pkg.gallery || pkg.gallery.length === 0) pkg.gallery = [mediaFiles[1].url, mediaFiles[2].url, mediaFiles[3].url, mediaFiles[4].url];
                    updated = true;
                }
            }

            if (updated) {
                await pkg.save();
                pkgUpdates++;
            }
        }
        console.log(`Updated ${pkgUpdates} Packages with rich content and media.`);

        console.log('\n--- 100% Data Completion Successful ---');
        process.exit(0);

    } catch (err) {
        console.error('Migration Error:', err);
        process.exit(1);
    }
}

fillAllDetails();
