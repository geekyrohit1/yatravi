"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, Zap, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import { PackageCard } from './PackageCard';
import { Package } from '../types';

// Local type removed in favor of global Package type to prevent data loss
type WeekendPackage = Package;



interface WeekendTripsProps {
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

export const WeekendTrips: React.FC<WeekendTripsProps> = ({ packages, data }) => {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [trips, setTrips] = useState<WeekendPackage[]>(packages || []);
    const title = data?.title || "Weekend Getaways";
    const subtitle = data?.subtitle || "Short breaks for the busy bees";

    useEffect(() => {
        if (packages && packages.length > 0) {
            setTrips(packages);
        } else {
            setTrips([]);
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
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-1 h-5 md:h-6 bg-brand rounded-full"></div>
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 py-1">
                                <span>{title}</span>
                            </h3>
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

                <div ref={scrollRef} className="flex gap-3 md:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
                    {trips.map((pkg) => (
                        <div
                            key={pkg._id || pkg.id}
                            className="w-[calc((100vw-40px)/1.3)] md:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/4)] flex-shrink-0 snap-start rounded-lg overflow-hidden"
                        >
                            <PackageCard pkg={pkg as any} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
