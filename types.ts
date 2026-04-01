export interface Destination {
  id: string;
  name: string;
  image: string;
  heroImage?: string;
  verticalImage?: string;
  packageCount: number;
  startPrice: number;
}

export interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  text: string;
  images?: string[];
}

export interface FlightDetail {
  flightNo?: string;
  airline?: string;
  departureCity?: string;
  arrivalCity?: string;
  departureTime?: string;
  arrivalTime?: string;
  isIncluded?: boolean;
}


export interface StayDetail {
  hotelName?: string;
  location?: string;
  image?: string;
  meals?: {
    breakfastIncluded?: boolean;
    lunchIncluded?: boolean;
    dinnerIncluded?: boolean;
  };
  rating?: number;
  nights?: string;
  address?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface Activity {
  time?: string;
  duration?: string;
  title: string;
  description?: string;
  inclusions?: string[];
  tags?: string[];
  image?: string;
  icon?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  highlights?: string[];
  meals?: {
    breakfastIncluded: boolean;
    lunchIncluded: boolean;
    dinnerIncluded: boolean;
  };
  activities?: string[];
  detailedActivities?: Activity[];
  stay?: StayDetail;
  itineraryImages?: string[];
}

export interface Package {
  id: string;
  _id?: string;
  slug?: string;
  title: string;
  location: string;
  duration: number; // days
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  verticalImage?: string;
  gallery: string[];
  category: string;
  groupSize: string;
  overview: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  itinerarySummary?: string;
  inclusions: string[];
  exclusions: string[];
  thingsToPack: string[];
  policies: {
    cancellation: string;
    refund: string;
    payment: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  // Visibility & Status
  status: 'draft' | 'published';
  showOnHomepage: boolean;
  showInCollections: boolean;
  // Badges
  isBestSeller: boolean;
  isTrending: boolean;
  isAlmostFull: boolean;
  validityDate?: string;
  tags?: string[];
  homepageSections?: string[];
  inclusionHighlights?: string[];
  regionBreakdown?: string;
  pickupPoint?: string;
  dropPoint?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    jsonLd?: string;
    sitemapPriority?: number;
    sitemapFrequency?: string;
    robots?: string;
    scriptTags?: string;
  };
}
