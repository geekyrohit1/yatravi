const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    customTitle: String,
    customTagline: String,
    customImage: String // URL
});

const cardSchema = new mongoose.Schema({
    title: String,
    image: String, // URL
    mobileImage: String, // Separate image for mobile
    linkType: { type: String, enum: ['package', 'destination', 'url'], default: 'destination' },
    linkValue: String, // ID or Slug or URL
    subtitle: String,
    badge: String // e.g. "5+ Packages"
});

const homepageSectionSchema = new mongoose.Schema({
    key: { type: String, required: true }, // e.g., 'topDestinations', 'trending', 'weekendGetaways'
    title: String, // Made optional as per user request for "no text"
    subtitle: String,
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    type: { type: String, enum: ['packages', 'destinations', 'cards', 'offers', 'media', 'slider', 'links'], default: 'packages' },
    destinationItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    cards: [cardSchema], // For 'cards', 'offers', and 'slider' types
    mediaUrl: String, // For 'media' type (Desktop)
    mobileMediaUrl: String, // For 'media' type (Mobile)
    mediaSlides: [{
        desktop: String,
        mobile: String
    }], // For multiple images in media type
    isVideo: { type: Boolean, default: false }, // For 'media' type
    filterType: String, // e.g., 'bestSeller', 'trending', 'honeymoon'
    // Dynamic Query Config
    queryConfig: {
        tag: String, // e.g. "Weekend", "Honeymoon"
        minPrice: Number,
        maxPrice: Number,
        limit: { type: Number, default: 6 }
    }
});

const homepageFaqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 }
});

const linkItemSchema = new mongoose.Schema({
    label: { type: String, required: true },
    url: { type: String, required: true }
});

const homepageConfigSchema = new mongoose.Schema({
    heroSlider: [heroSlideSchema],
    sections: [homepageSectionSchema],
    faq: [homepageFaqSchema],
    mobileHeroVideo: String, // URL for background video on mobile
    showMobileHeroVideo: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

// Ensure this is a singleton (only one document)
homepageConfigSchema.statics.getConfig = async function () {
    let config = await this.findOne()
        .populate('heroSlider.destinationId')
        .populate('sections.destinationItems');

    if (!config) {
        config = await this.create({
            heroSlider: [],
            sections: [
                { key: 'topDestinations', title: 'Top Destinations', subtitle: 'Explore our most popular destinations', type: 'destinations', enabled: true, order: 1 },
                {
                    key: 'offersAndUpdates',
                    title: 'Offers & Updates',
                    subtitle: 'Exclusive deals and travel news',
                    type: 'offers',
                    enabled: true,
                    order: 2,
                    cards: []
                },
                { key: 'weekendGetaways', title: 'Weekend Getaways', subtitle: 'Short breaks for the busy bees', type: 'packages', queryConfig: { tag: 'Weekend' }, enabled: true, order: 3 },
                { key: 'honeymoon', title: 'Honeymoon Specials', subtitle: 'Romantic destinations for couples', type: 'packages', filterType: 'honeymoon', queryConfig: { tag: 'Honeymoon' }, enabled: true, order: 4 },
                { key: 'domestic', title: 'Domestic Getaways', subtitle: 'Explore the beauty of India', type: 'packages', filterType: 'domestic', enabled: true, order: 5 },
                { key: 'international', title: 'International Getaways', subtitle: 'Explore the world', type: 'packages', filterType: 'international', enabled: true, order: 6 },
                { key: 'superSaver', title: 'Super Saver Deals', subtitle: 'Best value packages', type: 'packages', filterType: 'superSaver', enabled: true, order: 7 }
            ],
            faq: []
        });
        
        // Re-fetch to get populated fields if just created (though it will be empty)
        config = await this.findOne()
            .populate('heroSlider.destinationId')
            .populate('sections.destinationItems');
    }

    // Transform for frontend compatibility (Flattening populated destination references)
    const leanConfig = config.toObject();
    
    // Transform heroSlider
    if (leanConfig.heroSlider) {
        leanConfig.heroSlider = leanConfig.heroSlider.map(slide => {
            const dest = slide.destinationId;
            if (dest && typeof dest === 'object') {
                return {
                    ...slide,
                    name: slide.customTitle || dest.name,
                    tagline: slide.customTagline || dest.tagline,
                    heroImage: slide.customImage || dest.heroImage,
                    startingPrice: dest.startingPrice,
                    slug: dest.slug,
                    // Keep destinationId as string ID for reference
                    destinationId: dest._id
                };
            }
            return slide;
        });
    }

    // Transform sections to ensure destinationItems are consistent
    if (leanConfig.sections) {
        leanConfig.sections = leanConfig.sections.map(section => {
            if (section.type === 'destinations' && section.destinationItems) {
                // Ensure we return the full destination objects
                return section; 
            }
            return section;
        });
    }

    return leanConfig;
};

module.exports = mongoose.model('HomepageConfig', homepageConfigSchema);
