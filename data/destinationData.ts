
import { CheckCircle, Sun } from 'lucide-react';

export interface DestinationDetail {
    slug: string;
    currency: string;
    language: string;
    timezone: string;
    bestTime: string;
    howToReach: string;
    visaInfo: string;
    weather: string;
    budget: string;
    gettingAround: string;
    localDish: string;
    emergencyNumber: string;
    subDestinations: { name: string; image: string; tagline: string }[];
    mustVisitPlaces: { name: string; image: string; desc: string; mustTry: string[] }[];
    travelTips: { tip: string; icon: any }[];
    faqs: { q: string; a: string }[];
}

export const DESTINATION_DETAILS: Record<string, DestinationDetail> = {
    'bali-indonesia': {
        slug: 'bali-indonesia',
        currency: 'Indonesian Rupiah (IDR)',
        language: 'Indonesian, Balinese, English',
        timezone: 'GMT+8 (WITA)',
        bestTime: 'April to October',
        howToReach: 'Flight to Ngurah Rai International Airport (DPS)',
        visaInfo: 'Visa on Arrival available for many countries (approx. USD 35)',
        weather: 'Tropical, warm year-round',
        budget: '₹5,000 - ₹8,000 / day',
        gettingAround: 'Scooter Rental, Gojek, Grab',
        localDish: 'Nasi Goreng, Babi Guling',
        emergencyNumber: '112',
        subDestinations: [
            { name: 'Ubud', image: 'https://images.unsplash.com/photo-1552120630-4ba183633880', tagline: 'Cultural Heart of Bali' },
            { name: 'Kuta', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', tagline: 'Sunset & Surf' },
            { name: 'Nusa Penida', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2', tagline: 'Scenic Cliffs' },
            { name: 'Seminyak', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f', tagline: 'Luxury & Nightlife' },
        ],
        mustVisitPlaces: [
            { name: 'Ubud Monkey Forest', image: 'https://images.unsplash.com/photo-1572587356436-b15c929df05d?q=80&w=600', desc: 'Sanctuary for long-tailed macaques.', mustTry: ['Photography', 'Walking'] },
            { name: 'Tanah Lot Temple', image: 'https://images.unsplash.com/photo-1604850892019-3d19f187317e?q=80&w=600', desc: 'Iconic sea temple for sunsets.', mustTry: ['Sunset View', 'Culture'] },
            { name: 'Tegalalang Rice Terrace', image: 'https://images.unsplash.com/photo-1539651582847-a85966601441?q=80&w=600', desc: 'Famous terraced rice paddies.', mustTry: ['Swing', 'Hiking'] },
            { name: 'Uluwatu Temple', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600', desc: 'Temple on a cliff with Kecak dance.', mustTry: ['Kecak Dance', 'Ocean View'] }
        ],
        travelTips: [
            { tip: 'Drink bottled water only.', icon: CheckCircle },
            { tip: 'Standard tipping is 10%.', icon: CheckCircle },
            { tip: 'Respect temple dress codes.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is Bali safe for tourists?', a: 'Yes, Bali is generally very safe. Exercise standard precautions.' },
            { q: 'Can I rent a scooter?', a: 'Yes, but an International Driving Permit is required by law.' },
            { q: 'What is the best area to stay?', a: 'Ubud for culture, Seminyak for luxury, Kuta for nightlife.' }
        ]
    },
    'dubai-uae': {
        slug: 'dubai-uae',
        currency: 'UAE Dirham (AED)',
        language: 'Arabic, English',
        timezone: 'GMT+4',
        bestTime: 'November to March',
        howToReach: 'Flight to Dubai International Airport (DXB)',
        visaInfo: 'Visa required for most. Visa on Arrival for some nationalities.',
        weather: 'Hot desert climate',
        budget: '₹8,000 - ₹15,000 / day',
        gettingAround: 'Dubai Metro, Taxi (Careem)',
        localDish: 'Shawarma, Al Machboos',
        emergencyNumber: '999',
        subDestinations: [
            { name: 'Downtown Dubai', image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=600', tagline: 'The Centre of Now' },
            { name: 'Palm Jumeirah', image: 'https://images.unsplash.com/photo-1512453979798-5ea936a7fe63?q=80&w=600', tagline: 'Iconic Man-made Island' },
            { name: 'Dubai Marina', image: 'https://images.unsplash.com/photo-1575485994269-42b7720a4b00?q=80&w=600', tagline: 'Skyscrapers & Waterfront' }
        ],
        mustVisitPlaces: [
            { name: 'Burj Khalifa', image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=600', desc: 'Tallest building in the world.', mustTry: ['Observation Deck', 'Fountain Show'] },
            { name: 'Dubai Mall', image: 'https://images.unsplash.com/photo-1576664973347-190412803b98?q=80&w=600', desc: 'World’s largest shopping mall.', mustTry: ['Shopping', 'Aquarium'] },
            { name: 'Desert Safari', image: 'https://images.unsplash.com/photo-1451337516015-6b6fcd53e5a2?q=80&w=600', desc: 'Dune bashing and BBQ dinner.', mustTry: ['Camel Ride', 'Dune Bashing'] }
        ],
        travelTips: [
            { tip: 'Dress modestly in public areas.', icon: CheckCircle },
            { tip: 'Alcohol is restricted to hotels/bars.', icon: CheckCircle },
            { tip: 'Metro is the best way to travel.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is alcohol legal in Dubai?', a: 'Yes, but only in licensed venues and private homes.' },
            { q: 'Can unmarried couples stay together?', a: 'Recent laws have relaxed this, most hotels allow it.' }
        ]
    },
    'singapore': {
        slug: 'singapore',
        currency: 'Singapore Dollar (SGD)',
        language: 'English, Malay, Mandarin, Tamil',
        timezone: 'GMT+8',
        bestTime: 'February to April',
        howToReach: 'Flight to Changi Airport (SIN)',
        visaInfo: 'Visa required for Indian citizens (Apply in advance).',
        weather: 'Tropical rainforest climate, humid',
        budget: '₹10,000 - ₹18,000 / day',
        gettingAround: 'MRT (Train), Bus, Grab',
        localDish: 'Chilli Crab, Laksa, Hainanese Chicken Rice',
        emergencyNumber: '999',
        subDestinations: [
            { name: 'Marina Bay', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=600', tagline: 'Futuristic Cityscape' },
            { name: 'Sentosa', image: 'https://images.unsplash.com/photo-1549488344-c7052fb51c5b?q=80&w=600', tagline: 'The State of Fun' },
            { name: 'Chinatown', image: 'https://images.unsplash.com/photo-1565963672775-60927813a484?q=80&w=600', tagline: 'Heritage & Food' }
        ],
        mustVisitPlaces: [
            { name: 'Gardens by the Bay', image: 'https://images.unsplash.com/photo-1626885076624-948e945c7965?q=80&w=600', desc: 'Futuristic park with Supertree Grove.', mustTry: ['Cloud Forest', 'Light Show'] },
            { name: 'Marina Bay Sands', image: 'https://images.unsplash.com/photo-1506318182281-22ac649463ae?q=80&w=600', desc: 'Iconic hotel with rooftop pool.', mustTry: ['Skypark Observation', 'Casino'] },
            { name: 'Sentosa Island', image: 'https://images.unsplash.com/photo-1602737632616-56af80eeca3d?q=80&w=600', desc: 'Resort island with Universal Studios.', mustTry: ['Universal Studios', 'Beach'] }
        ],
        travelTips: [
            { tip: 'Chewing gum is banned.', icon: CheckCircle },
            { tip: 'Public transport is excellent.', icon: CheckCircle },
            { tip: 'Strict littering laws apply.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is Singapore expensive?', a: 'It can be, but hawker food is very affordable.' },
            { q: 'Do I need a visa for transit?', a: 'Check specific requirements, usually visa-free for <96h VFTF.' }
        ]
    },
    'thailand': {
        slug: 'thailand',
        currency: 'Thai Baht (THB)',
        language: 'Thai, English (in tourist areas)',
        timezone: 'GMT+7',
        bestTime: 'November to early April',
        howToReach: 'Flights to Bangkok (BKK/DMK) or Phuket (HKT)',
        visaInfo: 'Visa Free for Indians (Temporary) or Visa on Arrival.',
        weather: 'Tropical, hot and humid',
        budget: '₹4,000 - ₹7,000 / day',
        gettingAround: 'BTS/MRT, Tuk-tuk, Grab',
        localDish: 'Pad Thai, Tom Yum Goong',
        emergencyNumber: '1155',
        subDestinations: [
            { name: 'Bangkok', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600', tagline: 'City of Angels' },
            { name: 'Phuket', image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=600', tagline: 'Pearl of the Andaman' },
            { name: 'Krabi', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=600', tagline: 'Limestone Cliffs' }
        ],
        mustVisitPlaces: [
            { name: 'Grand Palace', image: 'https://images.unsplash.com/photo-1590772719266-9b56f8740c83?q=80&w=600', desc: 'Former residence of the Kings of Siam.', mustTry: ['Temple of Emerald Buddha', 'Architecture'] },
            { name: 'Phi Phi Islands', image: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?q=80&w=600', desc: 'Stunning islands with clear water.', mustTry: ['Boat Tour', 'Snorkeling'] },
            { name: 'Wat Arun', image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?q=80&w=600', desc: 'Temple of Dawn.', mustTry: ['Sunset View', 'Photography'] }
        ],
        travelTips: [
            { tip: 'Respect the Royal Family.', icon: CheckCircle },
            { tip: 'Negotiate prices for tuk-tuks.', icon: CheckCircle },
            { tip: 'Cover shoulders in temples.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is street food safe?', a: 'Generally yes, stick to busy stalls.' },
            { q: 'Best way to get around?', a: 'BTS/MRT in Bangkok, Grab or Songthaew elsewhere.' }
        ]
    },
    'malaysia': {
        slug: 'malaysia',
        currency: 'Malaysian Ringgit (MYR)',
        language: 'Malay, English, Chinese, Tamil',
        timezone: 'GMT+8',
        bestTime: 'December to April (West Coast), April to October (East Coast)',
        howToReach: 'Flight to Kuala Lumpur (KUL)',
        visaInfo: 'Visa Free for Indian tourists (Complete Digital Arrival Card).',
        weather: 'Equatorial, hot and humid',
        budget: '₹4,500 - ₹7,500 / day',
        gettingAround: 'KLIA Express, Grab, Monorail',
        localDish: 'Nasi Lemak, Satay',
        emergencyNumber: '999',
        subDestinations: [
            { name: 'Kuala Lumpur', image: 'https://images.unsplash.com/photo-1669212133038-7694901f4648?q=80&w=600', tagline: 'Modern Capital' },
            { name: 'Langkawi', image: 'https://images.unsplash.com/photo-1584285418504-0694e9f82d2a?q=80&w=600', tagline: 'Jewel of Kedah' },
            { name: 'Penang', image: 'https://images.unsplash.com/photo-1605626926315-9922bc9609e6?q=80&w=600', tagline: 'Food Capital' }
        ],
        mustVisitPlaces: [
            { name: 'Petronas Twin Towers', image: 'https://images.unsplash.com/photo-1537237852332-9cb7e7a88523?q=80&w=600', desc: 'Iconic twin skyscrapers.', mustTry: ['Skybridge', 'KLCC Park'] },
            { name: 'Batu Caves', image: 'https://images.unsplash.com/photo-1541364983171-ec572de52488?q=80&w=600', desc: 'Limestone hill with temples.', mustTry: ['Steps Climb', 'Murugan Statue'] },
            { name: 'Langkawi Cable Car', image: 'https://images.unsplash.com/photo-1628045688636-963d76b17c2f?q=80&w=600', desc: 'Steepest cable car ride.', mustTry: ['SkyCab', 'SkyBridge'] }
        ],
        travelTips: [
            { tip: 'Grab is the best app for travel.', icon: CheckCircle },
            { tip: 'Try the street food (Nasi Lemak).', icon: CheckCircle },
            { tip: 'Dress modestly in rural areas.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is it expensive?', a: 'Very affordable compared to Singapore.' },
            { q: 'Is English spoken?', a: 'Yes, widely spoken in major cities.' }
        ]
    },
    'vietnam': {
        slug: 'vietnam',
        currency: 'Vietnamese Dong (VND)',
        language: 'Vietnamese, English (growing)',
        timezone: 'GMT+7',
        bestTime: 'November to April',
        howToReach: 'Flights to Hanoi (HAN) or Ho Chi Minh City (SGN)',
        visaInfo: 'E-Visa required for Indians (Easy online process).',
        weather: 'Tropical monsoon',
        budget: '₹3,500 - ₹6,000 / day',
        gettingAround: 'Grab Bike, Cyclo, Train',
        localDish: 'Pho, Banh Mi, Egg Coffee',
        emergencyNumber: '113',
        subDestinations: [
            { name: 'Hanoi', image: 'https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=600', tagline: 'Historic Capital' },
            { name: 'Ha Long Bay', image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=600', tagline: 'Emerald Waters' },
            { name: 'Hoi An', image: 'https://images.unsplash.com/photo-1559592413-7cec430aa669?q=80&w=600', tagline: 'Ancient Town' }
        ],
        mustVisitPlaces: [
            { name: 'Ha Long Bay', image: 'https://images.unsplash.com/photo-1559592413-7cec430aa669?q=80&w=600', desc: 'Thousands of limestone karsts.', mustTry: ['Overnight Cruise', 'Kayaking'] },
            { name: 'Hoi An Ancient Town', image: 'https://images.unsplash.com/photo-1558231572-c82006733222?q=80&w=600', desc: 'Well-preserved trading port.', mustTry: ['Lantern Festival', 'Tailor Shops'] },
            { name: 'Cu Chi Tunnels', image: 'https://images.unsplash.com/photo-1605809798579-245f7bd48872?q=80&w=600', desc: 'Viet Cong tunnel network.', mustTry: ['History Tour', 'Firing Range'] }
        ],
        travelTips: [
            { tip: 'Cross streets confidently.', icon: CheckCircle },
            { tip: 'Try the Egg Coffee.', icon: CheckCircle },
            { tip: 'Download offline maps.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is vegetarian food available?', a: 'Yes, look for "Chay" signs for vegetarian.' },
            { q: 'Currency exchange?', a: 'Gold shops often offer best rates.' }
        ]
    },
    'maldives': {
        slug: 'maldives',
        currency: 'Maldivian Rufiyaa (MVR) / USD',
        language: 'Dhivehi, English',
        timezone: 'GMT+5',
        bestTime: 'November to April',
        howToReach: 'Flight to Velana International Airport (MLE)',
        visaInfo: 'Visa on Arrival (Free for 30 days).',
        weather: 'Tropical, hot and sunny',
        budget: '₹15,000 - ₹25,000 / day',
        gettingAround: 'Speedboat, Seaplane, Dhoni',
        localDish: 'Mas Huni, Garudhiya',
        emergencyNumber: '119',
        subDestinations: [
            { name: 'Male', image: 'https://images.unsplash.com/photo-1574614217126-613d9878206a?q=80&w=600', tagline: 'Capital City' },
            { name: 'Maafushi', image: 'https://images.unsplash.com/photo-1534969238806-69275b28a49c?q=80&w=600', tagline: 'Local Island Life' },
            { name: 'Ari Atoll', image: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=600', tagline: 'Divers Paradise' }
        ],
        mustVisitPlaces: [
            { name: 'Private Resort Island', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=600', desc: 'Luxury overwater bungalows.', mustTry: ['Snorkeling', 'Spa'] },
            { name: 'Vaadhoo Island', image: 'https://images.unsplash.com/photo-1518182170546-07bb6bbc75d0?q=80&w=600', desc: 'Sea of Stars (Bioluminescence).', mustTry: ['Night Walk', 'Photography'] },
            { name: 'Male Fish Market', image: 'https://images.unsplash.com/photo-1527567795328-98424757e791?q=80&w=600', desc: 'Heart of local life.', mustTry: ['Local Culture', 'Fresh Catch'] }
        ],
        travelTips: [
            { tip: 'Alcohol prohibited on local islands.', icon: CheckCircle },
            { tip: 'USD is widely accepted.', icon: CheckCircle },
            { tip: 'Seaplane transfers end by sunset.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is it only for couples?', a: 'No, family friendly resorts are plentiful.' },
            { q: 'Can I bring alcohol?', a: 'No, strictly prohibited to bring in.' }
        ]
    },
    'kerala-india': {
        slug: 'kerala-india',
        currency: 'Indian Rupee (INR)',
        language: 'Malayalam, English',
        timezone: 'GMT+5:30',
        bestTime: 'September to March',
        howToReach: 'Airports: Kochi (COK), Trivandrum (TRV)',
        visaInfo: 'N/A for Indians. Visa required for foreigners.',
        weather: 'Tropical, humid',
        budget: '₹3,000 - ₹5,000 / day',
        gettingAround: 'Auto Rickshaw, Houseboat, Taxi',
        localDish: 'Appam & Stew, Puttu',
        emergencyNumber: '100',
        subDestinations: [
            { name: 'Alleppey', image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=600', tagline: 'Venice of the East' },
            { name: 'Munnar', image: 'https://images.unsplash.com/photo-1593693411515-c202a014945d?q=80&w=600', tagline: 'Hill Station' },
            { name: 'Varkala', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600', tagline: 'Cliff Beach' }
        ],
        mustVisitPlaces: [
            { name: 'Alleppey Backwaters', image: 'https://images.unsplash.com/photo-1593693396865-7b82cd6705ac?q=80&w=600', desc: 'Network of canals and lagoons.', mustTry: ['Houseboat Stay', 'Canoeing'] },
            { name: 'Munnar Tea Gardens', image: 'https://images.unsplash.com/photo-1593693411515-c202a014945d?q=80&w=600', desc: 'Sprawling tea plantations.', mustTry: ['Tea Museum', 'Trekking'] },
            { name: 'Athirappilly Falls', image: 'https://images.unsplash.com/photo-1510461864197-ad2fa922a013?q=80&w=600', desc: 'Niagara of India.', mustTry: ['Viewpoint', 'Nature Walk'] }
        ],
        travelTips: [
            { tip: 'Try authentic Sadya meal.', icon: CheckCircle },
            { tip: 'Respect local culture.', icon: CheckCircle },
            { tip: 'Summer can be very humid.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is it safe for solo travelers?', a: 'Yes, considered one of the safest states.' },
            { q: 'Alcohol availability?', a: 'Available in 5-star hotels and govt outlets.' }
        ]
    },
    'kashmir-india': {
        slug: 'kashmir-india',
        currency: 'Indian Rupee (INR)',
        language: 'Kashmiri, Urdu, Hindi, English',
        timezone: 'GMT+5:30',
        bestTime: 'March to October (Snow: Dec-Feb)',
        howToReach: 'Flight to Srinagar Airport (SXR)',
        visaInfo: 'N/A for Indians.',
        weather: 'Alpine, cold winters',
        budget: '₹4,000 - ₹6,000 / day',
        gettingAround: 'Private Taxi, Shikara',
        localDish: 'Wazwan, Kahwa, Rogan Josh',
        emergencyNumber: '100',
        subDestinations: [
            { name: 'Srinagar', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=600', tagline: 'City of Lakes' },
            { name: 'Gulmarg', image: 'https://images.unsplash.com/photo-1582294101683-bc2bd808a8b5?q=80&w=600', tagline: 'Ski Resort' },
            { name: 'Pahalgam', image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=600', tagline: 'Valley of Shepherds' }
        ],
        mustVisitPlaces: [
            { name: 'Dal Lake', image: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=600', desc: 'Jewel in the crown of Kashmir.', mustTry: ['Shikara Ride', 'Houseboat'] },
            { name: 'Gulmarg Gondola', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600', desc: 'Higher cable car in the world.', mustTry: ['Skiing', 'Snow View'] },
            { name: 'Betaab Valley', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=600', desc: 'Scenic valley in Pahalgam.', mustTry: ['Picnic', 'Photography'] }
        ],
        travelTips: [
            { tip: 'Carry heavy woolens in winter.', icon: CheckCircle },
            { tip: 'Postpaid SIM cards rarely work.', icon: CheckCircle },
            { tip: 'Book Gondola tickets online.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is Kashmir safe now?', a: 'Tourism is thriving and generally safe.' },
            { q: 'Mobile network?', a: 'Only Postpaid connections (Jio/Airtel) work.' }
        ]
    },
    'europe': {
        slug: 'europe',
        currency: 'Euro (EUR), Swiss Franc (CHF)',
        language: 'English, French, German, Italian, etc.',
        timezone: 'CET/GMT+1',
        bestTime: 'May to September',
        howToReach: 'Flights to London, Paris, Zurich, ancient Rome',
        visaInfo: 'Schengen Visa required for Indians.',
        weather: 'Varied, temperate seasons',
        budget: '₹12,000 - ₹20,000 / day',
        gettingAround: 'Eurail, Metro, Tram',
        localDish: 'Croissant, Pasta, Fondue',
        emergencyNumber: '112',
        subDestinations: [
            { name: 'Switzerland', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=600', tagline: 'Alpine Paradise' },
            { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600', tagline: 'City of Light' },
            { name: 'Italy', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600', tagline: 'Historic Wonder' }
        ],
        mustVisitPlaces: [
            { name: 'Eiffel Tower', image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=600', desc: 'Global icon of France.', mustTry: ['Summit View', 'Picnic'] },
            { name: 'Jungfraujoch', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600', desc: 'Top of Europe (Swiss Alps).', mustTry: ['Ice Palace', 'Sphinx Observatory'] },
            { name: 'Colosseum', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600', desc: 'Ancient Roman amphitheater.', mustTry: ['History Tour', 'Photography'] }
        ],
        travelTips: [
            { tip: 'Get a Eurail pass for travel.', icon: CheckCircle },
            { tip: 'Book attractions in advance.', icon: CheckCircle },
            { tip: 'Watch for pickpockets in cities.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is one visa enough?', a: 'Yes, Schengen visa covers most EU countries.' },
            { q: 'Is tap water safe?', a: 'Yes, widely safe across Western Europe.' }
        ]
    },
    'ladakh-india': {
        slug: 'ladakh-india',
        currency: 'Indian Rupee (INR)',
        language: 'Ladakhi, Hindi, English',
        timezone: 'GMT+5:30',
        bestTime: 'May to September',
        howToReach: 'Flight to Leh (IXL) or Road trip via Manali/Srinagar',
        visaInfo: 'N/A for Indians. Inner Line Permit required.',
        weather: 'Cold desert, arid',
        budget: '₹3,500 - ₹5,500 / day',
        gettingAround: 'Rented Bike, Shared Taxi',
        localDish: 'Thukpa, Momos, Skyu',
        emergencyNumber: '100',
        subDestinations: [
            { name: 'Leh', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600', tagline: 'Capital City' },
            { name: 'Nubra Valley', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=600', tagline: 'Desert in Mountains' },
            { name: 'Pangong', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=600', tagline: 'Blue Lake' }
        ],
        mustVisitPlaces: [
            { name: 'Pangong Lake', image: 'https://images.unsplash.com/photo-1547922262-63b78526ee82?q=80&w=600', desc: 'Highest saltwater lake.', mustTry: ['Camping', 'Photography'] },
            { name: 'Khardung La', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600', desc: 'Highest motorable road.', mustTry: ['Bike Ride', 'Selfie'] },
            { name: 'Thiksey Monastery', image: 'https://images.unsplash.com/photo-1584885623091-64d85834d924?q=80&w=600', desc: 'Distinctive Tibetan architecture.', mustTry: ['Heritage', 'Morning Prayer'] }
        ],
        travelTips: [
            { tip: 'Acclimatize for 24-48 hours.', icon: CheckCircle },
            { tip: 'Drink plenty of water.', icon: CheckCircle },
            { tip: 'Prepaid SIMs do not work.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is it safe for kids?', a: 'Due to altitude, consult doctor first.' },
            { q: 'Best bike for rent?', a: 'Royal Enfield Himalaya is preferred.' }
        ]
    },
    'mauritius': {
        slug: 'mauritius',
        currency: 'Mauritian Rupee (MUR)',
        language: 'English, French, Creole',
        timezone: 'GMT+4',
        bestTime: 'May to December',
        howToReach: 'Flight to Sir Seewoosagur Ramgoolam Airport (MRU)',
        visaInfo: 'Visa on Arrival for Indians (Free).',
        weather: 'Tropical, mild winter',
        budget: '₹7,000 - ₹12,000 / day',
        gettingAround: 'Rented Car, Taxi, Bus',
        localDish: 'Dholl Puri, Fish Vindaye',
        emergencyNumber: '999',
        subDestinations: [
            { name: 'North Island', image: 'https://images.unsplash.com/photo-1529180184525-78f906b3a1f1?q=80&w=600', tagline: 'Beaches & Nightlife' },
            { name: 'South Island', image: 'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?q=80&w=600', tagline: 'Nature & Wildlife' },
            { name: 'Port Louis', image: 'https://images.unsplash.com/photo-1542318094-069255655519?q=80&w=600', tagline: 'Capital City' }
        ],
        mustVisitPlaces: [
            { name: 'Seven Colored Earth', image: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=600', desc: 'Geological formation in Chamarel.', mustTry: ['Photography', 'Geopark'] },
            { name: 'Ile aux Cerfs', image: 'https://images.unsplash.com/photo-1549241517-5732152f2061?q=80&w=600', desc: 'Private island with white sands.', mustTry: ['Parasailing', 'Beach BBQ'] },
            { name: 'Casela Nature Park', image: 'https://images.unsplash.com/photo-1548624971-ce45f7881c1c?q=80&w=600', desc: 'Safari and adventure park.', mustTry: ['Walking with Lions', 'Zipline'] }
        ],
        travelTips: [
            { tip: 'Rent a car to explore freely.', icon: CheckCircle },
            { tip: 'Tap water is generally safe.', icon: CheckCircle },
            { tip: 'Use sunscreen liberally.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is it expensive?', a: 'Moderate. Local food is cheap.' },
            { q: 'Best currency to carry?', a: 'EUR/USD to exchange or ATMs.' }
        ]
    },
    'seychelles': {
        slug: 'seychelles',
        currency: 'Seychellois Rupee (SCR)',
        language: 'Seychellois Creole, English, French',
        timezone: 'GMT+4',
        bestTime: 'April, May, October, November',
        howToReach: 'Flight to Victoria (SEZ)',
        visaInfo: 'Visa Free for Indians (Travel Auth required).',
        weather: 'Tropical rainforest, humid',
        budget: '₹15,000 - ₹25,000 / day',
        gettingAround: 'Ferry, Rental Car, Bike',
        localDish: 'Grilled Fish, Ladob',
        emergencyNumber: '999',
        subDestinations: [
            { name: 'Mahe', image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=600', tagline: 'Main Island' },
            { name: 'Praslin', image: 'https://images.unsplash.com/photo-1520698188172-5b96ed5e3810?q=80&w=600', tagline: 'Coco de Mer' },
            { name: 'La Digue', image: 'https://images.unsplash.com/photo-1505372134045-8772320b9122?q=80&w=600', tagline: 'Granite Boulders' }
        ],
        mustVisitPlaces: [
            { name: 'Anse Source d\'Argent', image: 'https://images.unsplash.com/photo-1518599480133-72dd37849e79?q=80&w=600', desc: 'World’s most photographed beach.', mustTry: ['Photography', 'Relaxing'] },
            { name: 'Vallee de Mai', image: 'https://images.unsplash.com/photo-1582260656041-399587447d21?q=80&w=600', desc: 'UNESCO site home to Coco de Mer.', mustTry: ['Nature Walk', 'Birdwatching'] },
            { name: 'Beau Vallon', image: 'https://images.unsplash.com/photo-1589330273594-e18d67277c63?q=80&w=600', desc: 'Popular hub for activities.', mustTry: ['Diving', 'Sunset'] }
        ],
        travelTips: [
            { tip: 'Inter-island ferries can be choppy.', icon: CheckCircle },
            { tip: 'La Digue is bicycle-friendly.', icon: CheckCircle },
            { tip: 'Expensive destination.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Can I use Credit Cards?', a: 'Yes, widely accepted.' },
            { q: 'Is it safe?', a: 'Yes, very safe for tourists.' }
        ]
    },
    'sri-lanka': {
        slug: 'sri-lanka',
        currency: 'Sri Lankan Rupee (LKR)',
        language: 'Sinhala, Tamil, English',
        timezone: 'GMT+5:30',
        bestTime: 'December to March (West/South)',
        howToReach: 'Flight to Colombo (CMB)',
        visaInfo: 'ETA required for Indians (Easy online).',
        weather: 'Tropical, two monsoons',
        budget: '₹3,000 - ₹5,000 / day',
        gettingAround: 'Train, Tuk-tuk, Private Driver',
        localDish: 'Kottu Roti, Hoppers',
        emergencyNumber: '119',
        subDestinations: [
            { name: 'Kandy', image: 'https://images.unsplash.com/photo-1577708810237-775f05327293?q=80&w=600', tagline: 'Cultural Capital' },
            { name: 'Ella', image: 'https://images.unsplash.com/photo-1580228020698-3860bb632115?q=80&w=600', tagline: 'Mountain Gem' },
            { name: 'Galle', image: 'https://images.unsplash.com/photo-1625736300986-e0e6c5269a8b?q=80&w=600', tagline: 'Dutch Fort' }
        ],
        mustVisitPlaces: [
            { name: 'Sigiriya Rock Fortress', image: 'https://images.unsplash.com/photo-1606214309329-0ec608620857?q=80&w=600', desc: 'Ancient palace on rock column.', mustTry: ['Climb', 'Frescoes'] },
            { name: 'Nine Arch Bridge', image: 'https://images.unsplash.com/photo-1566808994998-325dbb2658fa?q=80&w=600', desc: 'Iconic railway bridge in Ella.', mustTry: ['Train Ride', 'Photography'] },
            { name: 'Yala National Park', image: 'https://images.unsplash.com/photo-1560938173-8ce050d24cb6?q=80&w=600', desc: 'Highest leopard density.', mustTry: ['Jeep Safari', 'Wildlife'] }
        ],
        travelTips: [
            { tip: 'Take the Kandy-Ella train.', icon: CheckCircle },
            { tip: 'Dress conservatively in temples.', icon: CheckCircle },
            { tip: 'Hire a private driver.', icon: CheckCircle }
        ],
        faqs: [
            { q: 'Is it affordable?', a: 'Yes, very budget friendly.' },
            { q: 'Is food spicy?', a: 'Yes, generally spicy but adjustable.' }
        ]
    }
};

// Default fallback
export const DEFAULT_DESTINATION_DETAIL: DestinationDetail = {
    slug: 'default',
    currency: 'N/A',
    language: 'English',
    timezone: 'N/A',
    bestTime: 'Round the year',
    howToReach: 'Contact support for details',
    visaInfo: 'Check official embassy site',
    weather: 'Pleasant',
    budget: 'Contact support',
    gettingAround: 'N/A',
    localDish: 'Local Cuisine',
    emergencyNumber: '112',
    subDestinations: [],
    mustVisitPlaces: [],
    travelTips: [],
    faqs: []
};
