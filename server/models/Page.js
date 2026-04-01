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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Page', pageSchema);
