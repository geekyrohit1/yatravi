/**
 * SEO Helper for generating automatic Quick Links for Packages and Destinations.
 * Matches the logic used in the Magic Generate button.
 */

const generateSEOQuickLinks = (title, type, slug) => {
    if (!title) return [];

    const cities = ["Mumbai", "Delhi", "Bangalore", "Ahmedabad", "Kolkata", "Hyderabad", "Pune", "Surat", "Jaipur", "Lucknow", "Chennai", "Chandigarh", "Amritsar", "Ludhiana", "Kanpur"];
    const variations = ["Packages from", "Tour from", "Holidays from", "Trip from"];
    const otherPhrases = [
        "Itinerary", "Couple Package", "Family Trip", "7 Days Package", 
        "5 Nights Package", "6 Nights Package", "Luxury Package", 
        "Budget Tour", "Best Time to Visit", "Visa for Indians", 
        "Cheap Packages", "Customized Tour", "Top Places to visit in"
    ];

    const generated = [];
    const baseUrl = type === 'package' ? `/packages/${slug}` : `/destination/${slug}`;

    // 1. City Variations
    cities.forEach(city => {
        const verb = variations[Math.floor(Math.random() * variations.length)];
        generated.push({
            label: `${title} ${verb} ${city}`,
            url: baseUrl
        });
    });

    // 2. Keyword Variations
    otherPhrases.forEach(phrase => {
        const label = phrase.includes('visit') ? `${phrase} ${title}` : `${title} ${phrase}`;
        generated.push({
            label: label,
            url: baseUrl
        });
    });

    // Return unique top 35 links
    return generated.slice(0, 35);
};

module.exports = { generateSEOQuickLinks };
