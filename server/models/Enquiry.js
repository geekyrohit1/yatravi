const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    packageId: {
        type: String, // Storing ID string to reference Package model's custom 'id' field if needed, or ObjectId
        default: null
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Converted', 'Closed'],
        default: 'New'
    },
    packageTitle: {
        type: String
    },
    travelDate: {
        type: String
    },
    travellers: {
        type: Number
    },
    source: {
        type: String,
        default: 'Website'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Enquiry', enquirySchema);
