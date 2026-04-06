const mongoose = require('mongoose');

const globalSettingSchema = new mongoose.Schema({
    // Contact Information
    contactPhone: {
        type: String,
        default: '+91 98765 43210'
    },
    whatsappNumber: {
        type: String,
        default: '+91 9587505726'
    },

    // Social Links
    socialLinks: {
        instagram: { type: String, default: '' },
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        youtube: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    },

    // Feature Toggles
    enableWhatsappChat: {
        type: Boolean,
        default: true
    },
    enableInquiryPopup: {
        type: Boolean,
        default: true
    },
    enableNewsletter: {
        type: Boolean,
        default: true
    },
    enableAIChat: {
        type: Boolean,
        default: true
    },

    // Sale Banner
    enableSaleBanner: {
        type: Boolean,
        default: true
    },
    enableSaleBannerAnimation: {
        type: Boolean,
        default: true
    },
    enableSaleBannerTimer: {
        type: Boolean,
        default: true
    },
    saleBannerTimerEndDate: {
        type: Date,
        default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Default 2 days from now
    },
    saleBannerText: {
        type: String,
        default: '🎉 Special Offer: Get 20% off on all packages!'
    },
    saleBannerLink: {
        type: String,
        default: ''
    },
    saleBannerBgColor: {
        type: String,
        default: '#0055ff' // Blue
    },
    saleBannerTextColor: {
        type: String,
        default: '#e91e63' // Pink
    },
    saleBannerBorderColor: {
        type: String,
        default: '#ffaa00' // Orange/Yellow
    },

    // Consultation Banner Content
    consultationBannerHeadline: {
        type: String,
        default: 'Confused about where to go?'
    },
    consultationBannerSubtext: {
        type: String,
        default: 'Talk to our travel experts and get a personalized itinerary crafted just for you.'
    },

    // Newsletter Content
    newsletterHeadline: {
        type: String,
        default: 'Unlock Exclusive Travel Deals!'
    },
    newsletterSubtext: {
        type: String,
        default: 'Subscribe to our newsletter and get up to'
    },
    newsletterDiscount: {
        type: String,
        default: '40% OFF'
    },

    // Why Choose Us Trust Strip
    whyChooseUs: {
        type: [{
            title: { type: String },
            desc: { type: String }
        }],
        default: [
            { title: '100% Verified Packages', desc: 'Trusted by thousands' },
            { title: '24/7 Expert Support', desc: 'Always here for you' },
            { title: 'Best Price Guarantee', desc: 'Unbeatable value' },
            { title: 'Hassle-free Planning', desc: 'Transparent process' }
        ]
    },
    // Join Page Content
    joinPageHeroTitle: {
        type: String,
        default: 'Grow with Yatravi'
    },
    joinPageHeroSubtitle: {
        type: String,
        default: "Join India's fastest-growing travel network. Whether you're a travel agent, hotelier, or corporate partner, let's build success together."
    },
    joinPageHeroBadge: {
        type: String,
        default: 'Partner with Excellence'
    },
    joinPageHeroImage: {
        type: String,
        default: '/images/placeholder.svg'
    },
    // Hero Section
    heroMobileTagline: {
        type: String,
        default: 'We care your trip • Yatravi'
    },
    heroSearchPlaceholder: {
        type: String,
        default: 'Search your destination'
    },
    heroPriceLabel: {
        type: String,
        default: 'Starting from'
    },
    // Global SEO Defaults
    globalSeo: {
        siteName: { type: String, default: 'Yatravi' },
        titleSeparator: { type: String, default: '|' },
        defaultTitle: { type: String, default: 'Yatravi | We Care Your Trip - Lowest Price Holiday Packages' },
        defaultDescription: { type: String, default: 'Explore the world with Yatravi. Lowest price holiday packages and premium travel experiences.' },
        defaultKeywords: { type: String, default: 'travel agency, holiday packages, tour packages, cheapest tours' },
        defaultOgImage: { type: String, default: '/og-image.png' },
        fbAppId: { type: String, default: '' },
        twitterHandle: { type: String, default: '@yatravi' },
        organizationSchema: {
            name: { type: String, default: 'Yatravi' },
            url: { type: String, default: 'https://yatravi.com' },
            logo: { type: String, default: '/logo-desktop.png' },
            sameAs: { type: [String], default: [] }
        },
        autoGenerateSchema: { type: Boolean, default: true },
        schemaTypes: { type: [String], default: ['Organization', 'WebSite', 'FAQPage'] },
        jsonLd: { type: String, default: '' }
    }
}, {
    timestamps: true
});

// Smart Auto-Schema Generation for Global SEO
globalSettingSchema.pre('save', async function () {
    if (this.globalSeo && this.globalSeo.autoGenerateSchema) {
        const schemas = [];

        // 1. Organization / TravelAgency Schema
        if (this.globalSeo.schemaTypes.includes('Organization')) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "TravelAgency",
                "name": this.globalSeo.organizationSchema?.name || this.globalSeo.siteName || 'Yatravi',
                "url": this.globalSeo.organizationSchema?.url || 'https://yatravi.com',
                "logo": `https://yatravi.com${this.globalSeo.organizationSchema?.logo || '/logo-desktop.png'}`,
                "image": `https://yatravi.com${this.globalSeo.defaultOgImage || '/og-image.png'}`,
                "description": this.globalSeo.defaultDescription,
                "telephone": "+91- 9587505726",
                "priceRange": "$$",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Rajasthan",
                    "addressRegion": "Rajasthan",
                    "addressCountry": "IN"
                },
                "sameAs": this.globalSeo.organizationSchema?.sameAs || []
            });
        }

        // 2. WebSite (Sitelinks Search Box) Schema
        if (this.globalSeo.schemaTypes.includes('WebSite')) {
            schemas.push({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "url": "https://yatravi.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://yatravi.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            });
        }

        // Combine all and save as a single script block if multiple, or single object
        if (schemas.length > 0) {
            this.globalSeo.jsonLd = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);
        }
    }
});

module.exports = mongoose.model('GlobalSetting', globalSettingSchema);
