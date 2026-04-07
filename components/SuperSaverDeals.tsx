"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Tag, TrendingDown, ChevronLeft, ChevronRight, Star, TrendingUp, Calendar } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import { PackageCard } from './PackageCard';
import { Package } from '../types';

type SaverDeal = Package;

const SuperSaverCard = ({ pkg }: { pkg: Package }) => {
    const router = useRouter();
    const displayImages = [pkg.verticalImage, pkg.image, ...(pkg.gallery || [])].filter(img => img && typeof img === 'string' && img.trim() !== '');
    const safeImage = displayImages[0] || '/images/placeholder.svg';

    return (
        <div
            onClick={() => router.push(`/packages/${pkg.slug || pkg.id}`)}
            className="relative h-[280px] md:h-[420px] w-full rounded-lg overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            {/* Background Image */}
            <Image
                src={safeImage}
                alt={pkg.title}
                fill
                className="object-cover"
            />




            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 md:p-6 z-20">
                <h3 className="text-white text-[12.5px] md:text-xl font-semibold leading-tight mb-1 group-hover:text-[#FFD700] transition-colors line-clamp-2 min-h-[30px] md:min-h-[56px]">
                    {pkg.title}
                </h3>

                {/* Region Breakdown Highlight Bar (Saver Variant) - Micro-Scaled for Mobile */}
                {(pkg.regionBreakdown || pkg.itinerarySummary) && (
                    <div className="flex items-center gap-1.5 py-0.5 px-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg mb-2 w-fit">
                        <p className="text-[8.5px] md:text-[10px] text-white font-medium leading-[1.4] md:leading-snug">
                            {(pkg.regionBreakdown || pkg.itinerarySummary || '').split(/[•|·]| - /).map((part, i) => (
                                <React.Fragment key={`saver-r-${i}`}>
                                    {part.trim().split(/(\d+[Nn])/).map((subPart, j) =>
                                        /^\d+[Nn]$/.test(subPart) ? <span key={`saver-s-${j}`} className="font-bold text-white">{subPart}</span> : <span key={`saver-p-${j}`} className="opacity-80">{subPart}</span>
                                    )}
                                    {i < ((pkg.regionBreakdown || pkg.itinerarySummary || '').split(/[•|·]| - /).length || 0) - 1 && <span className="mx-2 opacity-30">•</span>}
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-white/60 text-[8px] md:text-[10px] font-medium tracking-wider mb-0.5">
                        <span>Starts at</span>
                    </span>
                    <div className="flex items-baseline gap-1" translate="no">
                        <span className="text-white text-[14.5px] md:text-2xl font-bold tracking-tight">
                            <span className="mr-0.5">₹</span>
                            <span>{(pkg.price || 0).toLocaleString()}</span>
                        </span>
                        {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                            <span className="text-white/40 text-[8.5px] md:text-xs line-through font-normal ml-2">
                                <span className="mr-0.5">₹</span>
                                <span>{pkg.originalPrice.toLocaleString()}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FALLBACK_DEALS: SaverDeal[] = [
    { id: '1', title: 'Jaipur Weekend', price: 4499, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000', location: 'Jaipur', slug: 'jaipur-weekend', duration: 2, rating: 4.5, reviewsCount: 10 } as any,
    { id: '2', title: 'Agra Day Trip', price: 2999, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000', location: 'Agra', slug: 'agra-day-trip', duration: 1, rating: 4.8, reviewsCount: 25 } as any,
    { id: '3', title: 'Rishikesh Camping', price: 3999, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000', location: 'Rishikesh', slug: 'rishikesh-camping', duration: 2, rating: 4.6, reviewsCount: 18 } as any,
    { id: '4', title: 'Nainital Stay', price: 7999, image: 'https://images.unsplash.com/photo-1470246973918-29a53295c561?q=80&w=1000', location: 'Nainital', slug: 'nainital-stay', duration: 3, rating: 4.4, reviewsCount: 14 } as any
];


interface SuperSaverDealsProps {
    packages?: any[];
    data?: {
        key: string;
        title: string;
        subtitle?: string;
        queryConfig?: {
            tag?: string;
            minPrice?: number;
            maxPrice?: number;
            limit?: number;
        }
    };
}

export const SuperSaverDeals: React.FC<SuperSaverDealsProps> = ({ packages, data }) => {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [deals, setDeals] = useState<SaverDeal[]>(FALLBACK_DEALS);
    const title = data?.title || "Super Saver Deals";
    const subtitle = data?.subtitle || "Pocket friendly vacations for you";

    useEffect(() => {
        if (packages && packages.length > 0) {
            setDeals(packages);
        } else if (!packages || packages.length === 0) {
            setDeals(FALLBACK_DEALS);
        }
    }, [packages]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="pt-4 md:pt-10 pb-0 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-5 md:h-6 bg-brand rounded-full"></div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 py-1">
                                <span>{title}</span>
                            </h2>
                        </div>
                        {subtitle && <p className="text-gray-500 text-[10px] md:text-xs ml-4 pl-3 border-l-2 border-gray-200 tracking-wide font-medium">
                            <span>{subtitle}</span>
                        </p>}
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-brand/20 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all">
                            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                        <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-brand/20 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex gap-3 md:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x">
                    {deals.map((pkg) => (
                        <div
                            key={pkg._id || pkg.id}
                            className="w-[calc((100vw-40px)/1.92)] md:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/4)] flex-shrink-0 snap-start"
                        >
                            <SuperSaverCard pkg={pkg as any} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
