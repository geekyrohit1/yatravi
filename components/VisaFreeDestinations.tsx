"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '@/constants';

interface DestinationItem {
    _id?: string;
    id?: number;
    name?: string;
    country?: string;
    prefix?: string;
    tagline?: string;
    image?: string;
    heroImage?: string;
    verticalImage?: string;
    startingPrice?: number;
    slug?: string;
}

// Fallback data in case API is empty
// Fallback data in case API is empty
const FALLBACK_DESTINATIONS = [
    { id: 1, country: 'Europe', prefix: 'THE BEAUTY OF', image: '/images/placeholder.svg', startingPrice: 149999 },
    { id: 2, country: 'Vietnam', prefix: 'THE HIDDEN GEM', image: '/images/placeholder.svg', startingPrice: 59999 },
    { id: 3, country: 'Bali', prefix: 'THE ISLAND OF GODS', image: '/images/placeholder.svg', startingPrice: 49999 },
    { id: 4, country: 'Thailand', prefix: 'THE KINGDOM OF', image: '/images/placeholder.svg', startingPrice: 44999 },
    { id: 5, country: 'Japan', prefix: 'THE LAND OF RISING SUN', image: '/images/placeholder.svg', startingPrice: 129999 },
    { id: 6, country: 'Malaysia', prefix: 'TRULY ASIA', image: '/images/placeholder.svg', startingPrice: 38000 },
];

interface VisaFreeDestinationsProps {
    data?: {
        title: string;
        subtitle?: string;
        destinationItems?: any[];
    };
}

export const VisaFreeDestinations: React.FC<VisaFreeDestinationsProps> = ({ data }) => {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [destinations, setDestinations] = useState<DestinationItem[]>([]);

    useEffect(() => {
        if (data && data.destinationItems && data.destinationItems.length > 0) {
            setDestinations(data.destinationItems);
        } else if (!data) {
            // Only fallback if no data prop provided at all (legacy usage)
            setDestinations(FALLBACK_DESTINATIONS);
        }
    }, [data]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Map API data to display format
    const displayDestinations = destinations.map((d, idx) => ({
        id: d._id || d.id || idx,
        idx, // Keep track of original index for priority loading
        country: d.name || d.country || 'Destination',
        prefix: d.tagline || d.prefix || 'EXPLORE',
        image: (d.verticalImage && d.verticalImage.trim() !== '') ? d.verticalImage : ((d.heroImage && d.heroImage.trim() !== '') ? d.heroImage : (d.image && d.image.trim() !== '' ? d.image : '/images/placeholder.svg')),
        startingPrice: d.startingPrice || 0,
        slug: d.slug || (d.name || d.country || '').toLowerCase().replace(/\s+/g, '-')
    }));

    return (
        <section className="pt-4 md:pt-10 pb-0 bg-white lg:bg-brand/[0.04]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header with Navigation */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-5 md:h-6 bg-brand rounded-full" />
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 py-1">
                                {data?.title || 'Top Destinations'}
                            </h2>
                        </div>
                        <p
                            className="text-gray-500 text-[10px] md:text-xs ml-4 pl-3 border-l-2 border-gray-200 tracking-wide font-medium"
                        >
                            {data?.subtitle || 'Explore our most popular getaways and hidden gems across the globe.'}
                        </p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full border border-brand/20 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full border border-brand/20 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto pb-4 snap-x no-scrollbar"
                >
                    {displayDestinations.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => router.push(`/destination/${item.slug}`)}
                            className="w-[calc((100vw-40px)/1.92)] md:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/4)] h-[260px] md:h-[420px] relative rounded-lg overflow-hidden cursor-pointer group shrink-0 snap-start shadow-md hover:shadow-xl transition-all duration-700 border border-white/10 isolate gpu-accelerated no-flicker"
                        >
                            {/* Background Image with Zoom Effect */}
                            <Image
                                src={item.image}
                                alt={item.country}
                                fill
                                quality={90}
                                priority={item.idx < 2} // Preload first two cards to prevent flash
                                sizes="(max-width: 640px) 250px, (max-width: 1024px) 240px, 280px"
                                className="object-cover object-center"
                            />

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                            {/* Bottom-aligned Content (Budget Style) */}
                            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-6 md:p-8 z-20 text-center">
                                <h3 className="text-white text-2xl md:text-3xl font-bold font-heading tracking-tight leading-tight mb-0.5 transform transition-all duration-500 group-hover:scale-105 group-hover:text-brand-light line-clamp-2 drop-shadow-md">
                                    {item.country}
                                </h3>
                                
                                <div className="flex flex-col mt-0 items-center">
                                    <span className="text-white/60 text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] mb-1 drop-shadow-sm">
                                        Starts at
                                    </span>
                                    <div className="flex items-baseline gap-1 justify-center">
                                        <span className="text-white text-lg md:text-xl font-medium tracking-wide drop-shadow-md">
                                            ₹{new Intl.NumberFormat('en-IN').format(item.startingPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>








                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
