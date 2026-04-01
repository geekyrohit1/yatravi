const mongoose = require('mongoose');
const ImageKit = require('imagekit');
require('dotenv').config();

// Init ImageKit to fetch all gallery media
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function runImageAssignment() {
    try {
        console.log('--- Connecting to Database & ImageKit ---');
        await mongoose.connect(process.env.MONGO_URI);
        const Package = require('./server/models/Package');
        const Destination = require('./server/models/Destination');

        // Fetch all Images from ImageKit
        console.log('Fetching media from ImageKit...');
        const mediaFiles = await imagekit.listFiles({
            limit: 100, // Fetch up to 100 images
            fileType: 'image'
        });
        console.log(`Found ${mediaFiles.length} images in ImageKit.`);

        if (mediaFiles.length === 0) {
            console.log('No images found in your ImageKit account. Exiting.');
            process.exit(0);
        }

        let packageUpdates = 0;
        let destUpdates = 0;

        console.log('\n--- Analyzing Destinations ---');
        const destinations = await Destination.find({});
        for (const dest of destinations) {
            const isPlaceholder = !dest.heroImage || dest.heroImage.includes('placeholder');
            
            // Search ImageKit for images that match the destination name (e.g. "Bali")
            const matches = mediaFiles.filter(f => 
                f.name.toLowerCase().includes(dest.name.toLowerCase()) || 
                f.name.toLowerCase().includes(dest.slug.toLowerCase())
            );

            if (matches.length > 0 && isPlaceholder) {
                // Pick the first matching image for the hero
                dest.heroImage = matches[matches.length - 1].url; // Taking the most recent matching upload
                await dest.save();
                console.log(`✅ Assigned [${matches[0].name}] to Destination: ${dest.name}`);
                destUpdates++;
            }
        }

        console.log('\n--- Analyzing Packages ---');
        const packages = await Package.find({});
        for (const pkg of packages) {
            const isPlaceholder = !pkg.image || pkg.image.includes('placeholder');
            const hasEmptyGallery = !pkg.gallery || pkg.gallery.length === 0;

            // Generate search words from package title & location
            const searchWords = [...pkg.location.toLowerCase().split(/[,\s]+/), ...pkg.title.toLowerCase().split(/[\s-]+/)];
            
            // Find images matching any location keyword
            const matches = mediaFiles.filter(f => {
                const fileName = f.name.toLowerCase();
                return searchWords.some(word => word.length > 3 && fileName.includes(word));
            });

            if (matches.length > 0) {
                let updated = false;

                // Update main image if it's a placeholder
                if (isPlaceholder) {
                    pkg.image = matches[0].url;
                    updated = true;
                    console.log(`🖼️ Assigned main image [${matches[0].name}] to Package: ${pkg.title}`);
                }

                // Fill the gallery array with all relevant images
                if (hasEmptyGallery || pkg.gallery.length < matches.length) {
                    const galleryUrls = [...new Set(matches.map(m => m.url))];
                    pkg.gallery = galleryUrls.slice(0, 5); // Limit gallery to top 5 matches
                    updated = true;
                    console.log(`📸 Added ${galleryUrls.length} images to gallery for Package: ${pkg.title}`);
                }

                if (updated) {
                    await pkg.save();
                    packageUpdates++;
                }
            }
        }

        console.log('\n--- Summary ---');
        console.log(`Destinations updated: ${destUpdates}`);
        console.log(`Packages updated: ${packageUpdates}`);
        console.log('Finished updating missing images!');
        
        process.exit(0);
    } catch (err) {
        console.error('Migration Error:', err.message);
        process.exit(1);
    }
}

runImageAssignment();
