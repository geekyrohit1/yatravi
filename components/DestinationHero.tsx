"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface DestinationHeroProps {
    destination: {
        name: string;
        image: string;
        bannerImage?: string; // New field
        packageCount: number;
        startPrice?: number;
        startingPrice?: number;
        priceLabel?: string;
    };
}

export const DestinationHero: React.FC<DestinationHeroProps> = ({ destination }) => {
    // Use bannerImage if available, fallback to regular heroImage
    const bgImage = destination.bannerImage || destination.image;

    return (
        <div className="relative h-[50vh] md:h-[60vh] min-h-[400px] md:min-h-[500px] flex items-end pb-10 md:pb-16 overflow-hidden w-full">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={bgImage || '/images/placeholder.svg'}
                    alt={destination.name || 'Destination'}
                    fill
                    quality={100}
                    priority
                    className="object-cover object-center shrink-0"
                />
            </div>

            {/* Gradient Overlay - darker at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-white/80 mb-2 md:mb-3 bg-white/10 backdrop-blur-md inline-flex px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10 tracking-wide font-medium animate-fade-up">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span className="text-white/30">/</span>
                    <span className="text-white">{destination.name} Tour packages</span>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6 animate-fade-up [animation-delay:200ms]">
                    <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
                            <span className="bg-brand/90 backdrop-blur-md text-white text-[9px] md:text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/10">
                                Best seller
                            </span>
                            <div className="flex items-center gap-1.5 text-yellow-400 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                <div className="flex items-center">
                                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                                </div>
                                <span className="text-white text-[10px] ml-0.5 font-semibold">4.8/5</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-sans tracking-tight font-semibold text-white mb-1 md:mb-2 drop-shadow-2xl leading-[1.1]">
                            {destination.name} <span className="text-gray-300 font-normal opacity-90 block md:inline md:text-2xl lg:text-3xl mt-1 md:mt-0">Tour packages</span>
                        </h1>
                        <p className="text-gray-100/90 max-w-2xl text-sm md:text-base font-normal drop-shadow-lg leading-relaxed">
                            Explore the best of {destination.name} with our handpicked itineraries.
                        </p>
                        
                        {/* Price Section - Minimalist Hierarchy */}
                        <div className="mt-4 md:mt-6 animate-fade-up [animation-delay:400ms]">
                            <div className="flex flex-col">
                                <span className="text-[10px] md:text-[11px] text-gray-400 font-medium leading-none mb-2 md:mb-3">Starting from</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-white font-semibold text-3xl md:text-4xl lg:text-5xl tracking-tighter tabular-nums">
                                        ₹{((destination.startingPrice || destination.startPrice) || 0).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] md:text-[11px] font-medium text-gray-300 opacity-80">/person</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
