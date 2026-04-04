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
        focusKeyword: String, // Admin tool helper - not sent to Google
        canonicalUrl: String,
        ogTitle: String,
        ogDescription: String,
        ogImage: String,
        twitterTitle: String,
        twitterDescription: String,
        twitterImage: String,
        jsonLd: String, // Custom Structured Data
        autoGenerateSchema: { type: Boolean, default: true },
        schemaTypes: { type: [String], default: ['TouristDestination', 'FAQPage', 'BreadcrumbList'] },
        sitemapPriority: { type: Number, default: 0.8 },
        sitemapFrequency: { type: String, default: 'weekly' },
        robots: { type: String, default: 'index, follow' },
        scriptTags: String,
        currentRank: { type: Number, default: 0 },
        previousRank: { type: Number, default: 0 },
        rankHistory: [{
          rank: Number,
          date: { type: Date, default: Date.now }
        }],
        lastRankCheck: Date,
        quickLinks: [{
            label: { type: String, trim: true },
            url: { type: String, trim: true }
        }]
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

// Pre-save hook to generate slug and auto-schema
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

    // Smart Auto-Schema Generation
    if (!this.seo) this.seo = {};
    
    if (this.seo.autoGenerateSchema) {
        const schemas = [];

        // 1. TouristDestination Schema
        if (this.seo.schemaTypes.includes('TouristDestination')) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "TouristDestination",
                "name": this.name,
                "description": this.seo.description || this.description,
                "image": this.heroImage,
                "url": `https://yatravi.com/destination/${this.slug}`
            });
        }

        // 2. FAQ Schema
        if (this.seo.schemaTypes.includes('FAQPage') && this.faqs && this.faqs.length > 0) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": this.faqs.filter(i => i.question && i.answer).map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                    }
                }))
            });
        }

        // 3. Breadcrumb Schema
        if (this.seo.schemaTypes.includes('BreadcrumbList')) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://yatravi.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Destinations",
                        "item": "https://yatravi.com/destinations"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": this.name,
                        "item": `https://yatravi.com/destination/${this.slug}`
                    }
                ]
            });
        }

        // Combine all and save
        if (schemas.length > 0) {
            this.seo.jsonLd = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
        }
    }
});

module.exports = mongoose.model('Destination', destinationSchema);
