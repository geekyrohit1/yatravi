const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['page_view', 'click', 'search', 'lead_intent']
    },
    path: String,
    target: String, // e.g., 'request_callback_button'
    metadata: {
        packageId: String,
        packageName: String,
        destinationName: String,
        device: String,
        browser: String,
        referrer: String
    },
    sessionId: String,
    isPersonalized: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster queries in admin dashboard
analyticsSchema.index({ type: 1, timestamp: -1 });
analyticsSchema.index({ path: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
