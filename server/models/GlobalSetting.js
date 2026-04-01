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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('GlobalSetting', globalSettingSchema);
