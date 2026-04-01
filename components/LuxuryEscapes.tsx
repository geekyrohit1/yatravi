"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Crown, Star, ArrowUpRight } from 'lucide-react';

const LUXURY_ESCAPES = [
    {
        id: 1,
        title: 'The Royal Rajasthan',
        description: 'Stay in palaces, travel in vintage cars.',
        image: 'https://images.unsplash.com/photo-1599661046289-e318d6d4deed?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Dubai Ultra Luxury',
        description: 'Burj Al Arab stay & private yacht cruise.',
        image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?q=80&w=1000&auto=format&fit=crop'
    }
];

export const LuxuryEscapes: React.FC = () => {
    const router = useRouter();

    return (
        <section className="pt-6 pb-6 md:pt-8 md:pb-8 bg-[#1a0505] text-white overflow-hidden relative">
            {/* Golden Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-6 md:h-8 bg-brand rounded-full shrink-0" />
                            <h2 className="text-3xl md:text-5xl font-semibold text-white py-1">Luxury Escapes</h2>
                        </div>
                        <div className="flex items-center gap-3 mb-4 ml-4">
                            <Crown className="w-6 h-6 text-[#FFD700]" />
                            <span className="text-[#FFD700] text-xs font-medium">Yatravi signature</span>
                        </div>
                    </div>
                    <p className="text-gray-400 max-w-sm text-sm leading-relaxed border-l border-white/20 pl-6">
                        Curated experiences for the discerning traveler. Expect nothing less than perfection, privacy, and personalization.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {LUXURY_ESCAPES.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => router.push('/listing')}
                            className="group relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                quality={100}
                                sizes="(max-width: 768px) 100vw, 800px"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />

                            <div className="absolute inset-0 border border-white/10 m-4 transition-all duration-500 group-hover:border-[#FFD700]/50" />

                            <div className="absolute bottom-0 left-0 p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-3xl font-heading tracking-tight font-light mb-2 group-hover:text-[#FFD700] transition-colors">{item.title}</h3>
                                <p className="text-gray-300 font-light mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">{item.description}</p>
                                <span className="inline-flex items-center gap-2 text-xs tracking-wider border-b border-[#FFD700] pb-1 text-[#FFD700]">
                                    Explore <ArrowUpRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
