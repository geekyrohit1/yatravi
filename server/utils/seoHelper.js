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

const generateJSONLD = (data, type, hostname = 'yatravi.com') => {
    if (!data) return '';

    const schemas = [];
    const baseUrl = `https://${hostname}${type === 'package' ? '/packages/' : '/destination/'}${data.slug}`;

    // 1. Breadcrumb List
    schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `https://${hostname}`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": type === 'package' ? 'Packages' : 'Destinations',
                "item": `https://${hostname}/${type === 'package' ? 'packages' : 'destination'}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": data.title || data.name,
                "item": baseUrl
            }
        ]
    });

    // 2. Main Entity Schema
    if (type === 'package') {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": data.title,
            "description": data.overview || data.seo?.description,
            "image": data.image,
            "offers": {
                "@type": "Offer",
                "price": data.price,
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": baseUrl
            }
        });
    } else if (type === 'destination') {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": data.name,
            "description": data.description || data.seo?.description,
            "image": data.heroImage,
            "location": {
                "@type": "Place",
                "name": data.name
            }
        });
    }

    // 3. FAQ Schema
    if (data.faqs && data.faqs.length > 0) {
        schemas.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": data.faqs.filter(f => f.question && f.answer).map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.answer
                }
            }))
        });
    }

    return JSON.stringify(schemas, null, 2);
};

module.exports = { generateSEOQuickLinks, generateJSONLD };
