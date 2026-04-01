const mongoose = require('mongoose');

const itineraryDaySchema = new mongoose.Schema({
  day: Number,
  title: String,
  description: String,
  highlights: { type: [String], default: [] },
  meals: {
    breakfastIncluded: { type: Boolean, default: false },
    lunchIncluded: { type: Boolean, default: false },
    dinnerIncluded: { type: Boolean, default: false }
  },
  activities: { type: [String], default: [] },
  detailedActivities: [{
    title: String,
    description: String,
    inclusions: [String],
    image: String,
    time: String,
    duration: String,
    transferType: String
  }],
  stay: {
    hotelName: String,
    rating: String,
    image: String,
    nights: String,
    address: String,
    checkIn: String,
    checkOut: String
  },
  itineraryImages: { type: [String], default: [] },
  flights: [mongoose.Schema.Types.Mixed]
});

const packageSchema = new mongoose.Schema({
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
    scriptTags: String // For custom JSON-LD or tracking scripts
  },
  id: { type: String, unique: true }, // Keeping string ID to match frontend (auto-generated if missing)
  slug: { type: String, unique: true }, // SEO-friendly URL slug
  title: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  verticalImage: String,
  gallery: [String],
  category: String,
  groupSize: String,
  overview: String,
  highlights: { type: [String], default: [] },
  itinerary: { type: [itineraryDaySchema], default: [] },
  itinerarySummary: String,
  inclusions: { type: [String], default: [] },
  exclusions: { type: [String], default: [] },
  thingsToPack: { type: [String], default: [] },
  policies: {
    cancellation: { type: String, default: '' },
    refund: { type: String, default: '' },
    payment: { type: String, default: '' }
  },
  faqs: [{
    question: String,
    answer: String
  }],
  // Visibility & Status
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  showOnHomepage: { type: Boolean, default: false },
  showInCollections: { type: Boolean, default: true },
  // Badges
  isBestSeller: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isAlmostFull: { type: Boolean, default: false },
  validityDate: String,
  homepageSections: [{ type: String }],
  inclusionHighlights: { type: [String], default: [] },
  regionBreakdown: String,
  pickupPoint: String,
  dropPoint: String,

  // Categorization
  category: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

// Add Indexes for performance based on frequent API queries
packageSchema.index({ status: 1, showOnHomepage: 1 });
packageSchema.index({ status: 1, isBestSeller: 1 });

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Pre-save hook to auto-generate slug from title
packageSchema.pre('save', async function () {
  // Generate slug if it's missing OR if it's an ID-based default (starts with pkg_)
  if (!this.slug || (typeof this.slug === 'string' && this.slug.startsWith('pkg_'))) {
    let baseSlug = generateSlug(this.title);
    let slug = baseSlug;
    let counter = 1;

    // Check for existing slugs and make unique if needed
    while (await mongoose.model('Package').findOne({ slug: slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // CRITICAL: Auto-generate 'id' if missing (fixes Admin Panel compatibility)
  if (!this.id) {
    this.id = `pkg_${this.slug || generateSlug(this.title)}`;
  }
});

module.exports = mongoose.model('Package', packageSchema);