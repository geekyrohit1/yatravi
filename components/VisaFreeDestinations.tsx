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
    const [destinations, setDestinations] = useState<DestinationItem[]>(data?.destinationItems || []);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const handleImageLoad = (id: string) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    useEffect(() => {
        if (data?.destinationItems && data.destinationItems.length > 0) {
            setDestinations(data.destinationItems);
        } else {
            setDestinations([]);
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

    const displayDestinations = destinations.map((d, idx) => ({
        id: String(d._id || d.id || idx),
        idx,
        country: d.name || d.country || 'Destination',
        prefix: d.tagline || d.prefix || 'EXPLORE',
        image: (d.verticalImage && d.verticalImage.trim() !== '') ? d.verticalImage : ((d.heroImage && d.heroImage.trim() !== '') ? d.heroImage : (d.image && d.image.trim() !== '' ? d.image : '/images/placeholder.svg')),
        startingPrice: d.startingPrice || 0,
        slug: d.slug || (d.name || d.country || '').toLowerCase().replace(/\s+/g, '-')
    }));

    return (
        <section className="pt-4 md:pt-10 pb-0 bg-white lg:bg-brand/[0.04]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-5 md:h-6 bg-brand rounded-full" />
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 py-1">
                                <span>{data?.title || 'Top Destinations'}</span>
                            </h2>
                        </div>
                        <p className="text-gray-500 text-[10px] md:text-xs ml-4 pl-3 border-l-2 border-gray-200 tracking-wide font-medium">
                            <span>{data?.subtitle || 'Explore our most popular getaways and hidden gems across the globe.'}</span>
                        </p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-brand/20 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-brand/20 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto pb-4 snap-x no-scrollbar">
                    {displayDestinations.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => router.push(`/destination/${item.slug}`)}
                            className="w-[calc((100vw-40px)/1.3)] md:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/4)] h-auto min-h-[290px] md:min-h-[360px] bg-white rounded-lg p-2 transition-all duration-500 cursor-pointer group shrink-0 snap-start border border-gray-100 flex flex-col hover:border-gray-200"
                        >
                            <div className="relative aspect-[16/17] w-full rounded-lg overflow-hidden bg-gray-50 shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.country}
                                    fill
                                    quality={90}
                                    priority={item.idx < 2}
                                    onLoadingComplete={() => handleImageLoad(item.id)}
                                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 280px, 320px"
                                    className={`object-cover object-center img-blur-reveal ${loadedImages[item.id] ? 'img-reveal-complete' : ''}`}
                                />
                            </div>

                            <div className="px-1.5 pt-3 mb-3 flex-1">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-gray-900 text-[15px] md:text-[17px] font-bold tracking-tight truncate leading-tight transition-colors">
                                            {item.country}
                                        </h3>
                                        <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-widest mt-0.5">
                                            {item.prefix || 'EXPLORE'}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[8px] text-gray-500 font-semibold uppercase tracking-tight mb-0.5">
                                            <span>Starts at</span>
                                        </p>
                                        <p className="text-gray-900 text-sm md:text-base font-bold tracking-tighter">
                                            <span translate="no" className="mr-0.5">₹</span>
                                            <span translate="no">{new Intl.NumberFormat('en-IN').format(item.startingPrice)}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-1 pb-1 mt-auto">
                                <button className="w-full bg-gray-900 text-white font-bold py-3 md:py-3.5 rounded-lg text-[10px] uppercase tracking-widest transition-all hover:bg-black active:scale-[0.98] flex items-center justify-center gap-2">
                                    View all tours
                                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 5L20 12L13 19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
