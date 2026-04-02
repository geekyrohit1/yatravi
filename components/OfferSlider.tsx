"use client";

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OfferCard {
    image: string;
    mobileImage?: string;
    linkType: string;
    linkValue: string;
}

interface OfferSliderProps {
    data: {
        title: string;
        subtitle?: string;
        cards?: OfferCard[];
    };
}

export const OfferSlider: React.FC<OfferSliderProps> = ({ data }) => {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { title, subtitle, cards } = data;

    if (!cards || cards.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = window.innerWidth < 768 ? 300 : 500;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleCardClick = (card: OfferCard) => {
        if (card.linkType === 'url') {
            const url = card.linkValue.startsWith('http') ? card.linkValue : `https://${card.linkValue}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        } else if (card.linkType === 'destination') {
            router.push(`/destination/${card.linkValue}`);
        } else if (card.linkType === 'package') {
            router.push(`/packages/${card.linkValue}`);
        }
    };

    return (
        <section className="pt-4 md:pt-8 pb-2 md:pb-4 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory no-scrollbar"
                >
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(card)}
                            className="relative min-w-[280px] md:min-w-[450px] aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden cursor-pointer snap-start shadow-sm transition-all duration-500"
                        >
                            <div className="absolute inset-0">
                                <Image
                                    src={card.image}
                                    alt={`Offer ${index + 1}`}
                                    fill
                                    quality={100}
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    className="object-cover"
                                />
                            </div>
                            {card.mobileImage && (
                                <div className="md:hidden absolute inset-0">
                                    <Image
                                        src={card.mobileImage}
                                        alt={`Offer ${index + 1}`}
                                        fill
                                        quality={100}
                                        sizes="100vw"
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/5 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
