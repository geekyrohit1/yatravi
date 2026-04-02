"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/constants';

interface Collection {
    id: number | string;
    title: string;
    count: string;
    image: string;
    size: 'large' | 'small' | 'medium';
    filterCategory?: string;
}


interface TrendingCollectionsProps {
    data?: {
        title: string;
        subtitle?: string;
        cards?: Array<{
            title: string;
            subtitle?: string;
            image: string;
            mobileImage?: string;
            linkType: string;
            linkValue: string;
        }>;
    };
}

export const TrendingCollections: React.FC<TrendingCollectionsProps> = ({ data }) => {
    const router = useRouter();

    // If no data provided or no cards, don't render (or render fallback if you prefer, but usually better to hide)
    if (!data || !data.cards || data.cards.length === 0) return null;

    const { title, subtitle, cards } = data;

    const handleCardClick = (card: any) => {
        if (card.linkType === 'url') {
            router.push(card.linkValue || '#');
        } else if (card.linkType === 'destination') {
            // Assuming linkValue is slug or ID. 
            // If it's an ID we might need to lookup slug, but let's assume slug for now or handle ID route.
            router.push(`/destination/${card.linkValue}`);
        }
    };

    return (
        <section className="pt-4 md:pt-10 pb-0 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-5 md:h-6 bg-brand rounded-full" />
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 py-1">
                                {title}
                            </h2>
                        </div>
                        {subtitle && <p className="text-gray-500 text-[10px] md:text-xs ml-4 pl-3 border-l-2 border-gray-200 tracking-wide font-medium">{subtitle}</p>}
                    </div>
                </div>

                <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none no-scrollbar h-[300px] md:h-[500px]">
                    {cards.slice(0, 4).map((card, index) => {
                        // Layout logic: 
                        // Index 0: Large Left (col-span-2, row-span-2)
                        // Index 1, 2: Small Right (col-span-1)
                        // Index 3: Wide Bottom Right (col-span-2)

                        let className = "relative rounded-xl overflow-hidden cursor-pointer group flex-shrink-0 snap-center min-w-[85vw] md:min-w-0 isolate [transform:translateZ(0)]";

                        if (index === 0) className += " md:col-span-2 md:row-span-2";
                        else if (index === 1 || index === 2) className += " md:col-span-1 md:row-span-1";
                        else if (index === 3) className += " md:col-span-2 md:row-span-1";

                        return (
                            <div
                                key={index}
                                onClick={() => handleCardClick(card)}
                                className={className}
                            >
                                <div className="absolute inset-0">
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        fill
                                        quality={100}
                                        sizes={index === 0 ? "(max-width: 768px) 100vw, 840px" : "(max-width: 768px) 100vw, 420px"}
                                        className="object-cover"
                                    />
                                </div>
                                {card.mobileImage && (
                                    <div className="md:hidden absolute inset-0">
                                        <Image
                                            src={card.mobileImage}
                                            alt={card.title}
                                            fill
                                            quality={100}
                                            sizes="100vw"
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 text-white text-left">
                                    {card.subtitle && <p className="text-sm font-medium text-brand-light mb-1">{card.subtitle}</p>}
                                    <h3 className={`font-semibold ${index === 0 ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>{card.title}</h3>
                                    {index === 0 && <div className="h-1 w-12 bg-brand mt-3 rounded-full transition-all duration-300" />}
                                </div>
                                {index === 3 && (
                                    <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors">
                                        <ArrowRight className="text-white w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
