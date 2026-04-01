const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    seo: {
        title: String,
        description: String,
        keywords: String,
        canonicalUrl: String,
        ogTitle: String,
        ogDescription: String,
        ogImage: String,
        twitterTitle: String,
        twitterDescription: String,
        twitterImage: String,
        jsonLd: String, // Custom Structured Data
        sitemapPriority: { type: Number, default: 0.8 },
        sitemapFrequency: { type: String, default: 'weekly' },
        robots: { type: String, default: 'index, follow' },
        scriptTags: String
    },
    slug: {
        type: String,
        unique: true
    },
    heroImage: {
        type: String,
        required: true
    },
    verticalImage: {
        type: String, // Mobile-optimized vertical portrait
        required: false
    },
    bannerImage: {
        type: String, // Full-width banner for desktop
        required: false
    },
    tagline: {
        type: String // e.g. "The Island of Gods"
    },
    description: {
        type: String // SEO Description
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isVisaFree: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    startingPrice: {
        type: Number,
        default: 0 // Lowest package price for this destination
    },
    priceLabel: {
        type: String,
        default: 'per person'
    },
    packageCount: {
        type: Number,
        default: 0 // Number of packages available
    },
    region: {
        type: String,
        enum: ['Domestic', 'International'],
        default: 'International',
        index: true
    },
    // Expanded Fields for Dynamic Page
    facts: {
        currency: { type: String, default: '' },
        language: { type: String, default: '' },
        timezone: { type: String, default: '' },
        bestTime: { type: String, default: '' },
        budget: { type: String, default: '' },
        visaInfo: { type: String, default: '' },
        gettingAround: { type: String, default: '' },
        localDish: { type: String, default: '' }
    },
    attractions: [{
        name: String,
        image: String,
        description: String
    }],
    faqs: [{
        question: String,
        answer: String
    }]
}, {
    timestamps: true
});

// Helper function to generate slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Pre-save hook to generate slug
destinationSchema.pre('save', async function () {
    if (this.isModified('name')) {
        let baseSlug = generateSlug(this.name);
        let slug = baseSlug;
        let counter = 1;

        // Check for existing slugs and make unique
        while (await mongoose.model('Destination').findOne({ slug: slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
});

module.exports = mongoose.model('Destination', destinationSchema);
