const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        // e.g. 'about', 'contact', 'support', 'privacy', 'terms'
    },
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    heroImage: {
        type: String,
        default: ''
    },
    // Flexible JSON content - structure varies by page slug
    content: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    seo: {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        keywords: { type: String, default: '' },
        focusKeyword: { type: String, default: '' },
        canonicalUrl: { type: String, default: '' },
        robots: { type: String, default: 'index, follow' },
        ogTitle: { type: String, default: '' },
        ogDescription: { type: String, default: '' },
        ogImage: { type: String, default: '' },
        twitterTitle: { type: String, default: '' },
        twitterDescription: { type: String, default: '' },
        twitterImage: { type: String, default: '' },
        jsonLd: { type: String, default: '' },
        autoGenerateSchema: { type: Boolean, default: true },
        schemaTypes: { type: [String], default: ['WebPage'] },
        sitemapPriority: { type: Number, default: 0.5 },
        sitemapFrequency: { type: String, default: 'monthly' }
    }
}, {
    timestamps: true
});

// Smart Auto-Schema Generation for Informational Pages
pageSchema.pre('save', async function () {
    if (this.seo && this.seo.autoGenerateSchema) {
        const schemas = [];
        const baseUrl = 'https://yatravi.com';

        // 1. Generic WebPage Schema (Base)
        const baseSchema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": this.seo.title || this.title,
            "description": this.seo.description,
            "url": `${baseUrl}/${this.slug}`,
            "publisher": {
                "@type": "Organization",
                "name": "Yatravi",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${baseUrl}/logo-desktop.png`
                }
            }
        };

        // 2. Specific Page Overrides
        if (this.slug === 'contact') {
            baseSchema["@type"] = "ContactPage";
            baseSchema["mainEntity"] = {
                "@type": "Organization",
                "name": "Yatravi",
                "telephone": "+91- 9587505726",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Rajasthan",
                    "addressRegion": "Rajasthan",
                    "addressCountry": "IN"
                }
            };
        } else if (this.slug === 'about') {
            baseSchema["@type"] = "AboutPage";
        }

        schemas.push(baseSchema);

        // 3. FAQ Schema (if added to informational pages)
        if (this.seo.schemaTypes.includes('FAQPage') && this.content?.faqs) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": this.content.faqs.map(f => ({
                    "@type": "Question",
                    "name": f.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": f.answer
                    }
                }))
            });
        }

        // Save generated code
        if (schemas.length > 0) {
            this.seo.jsonLd = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
        }
    }
});

module.exports = mongoose.model('Page', pageSchema);
