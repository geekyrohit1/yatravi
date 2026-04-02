"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoSliderProps {
    data: {
        title?: string;
        subtitle?: string;
        cards?: {
            image: string;
            mobileImage?: string;
            linkType?: string;
            linkValue?: string;
        }[];
    };
}

export const PromoSlider: React.FC<PromoSliderProps> = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cards = data.cards || [];

    useEffect(() => {
        if (cards.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [cards.length]);

    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    const next = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);

    // Swipe Gesture Handlers for Mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEndX(null);
        setTouchStartX(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEndX(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStartX === null || touchEndX === null) return;
        
        const distance = touchStartX - touchEndX;
        const minSwipeDistance = 50;

        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) {
                // Swipe Left -> Next
                next();
            } else {
                // Swipe Right -> Prev
                prev();
            }
        }
    };

    if (cards.length === 0) return null;

    return (
        <section 
            className="w-full pt-4 md:pt-8 pb-2 md:pb-4 bg-white overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-xl shadow-xl group bg-gray-50 aspect-[800/266] md:aspect-[1920/450]">
                    <div
                        className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] items-center h-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {cards.map((card, idx) => (
                            <div key={idx} className="w-full h-full flex-shrink-0 relative">
                                {/* Desktop Image */}
                                <Image
                                    src={card.image}
                                    alt={`Promo ${idx + 1}`}
                                    fill
                                    quality={100}
                                    sizes="100vw"
                                    className={`object-cover ${card.mobileImage ? 'hidden md:block' : 'block'}`}
                                />
                                {/* Mobile Image */}
                                {card.mobileImage && (
                                    <Image
                                        src={card.mobileImage}
                                        alt={`Promo ${idx + 1} Mobile`}
                                        fill
                                        quality={100}
                                        sizes="100vw"
                                        className="object-cover md:hidden block"
                                    />
                                )}
                                {/* Click Overlay */}
                                {card.linkValue && (
                                    <a
                                        href={card.linkValue}
                                        className="absolute inset-0 z-10"
                                        aria-label="View Details"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons - Brand Color #CD1C18 */}
                    {cards.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.preventDefault(); prev(); }}
                                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand text-white flex items-center justify-center opacity-70 transition-all shadow-xl z-20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); next(); }}
                                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand text-white flex items-center justify-center opacity-70 transition-all shadow-xl z-20"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                {cards.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-1 transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-5 bg-white' : 'w-1 bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};
