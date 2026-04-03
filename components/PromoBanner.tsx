"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export const PromoBanner: React.FC = () => {
    const router = useRouter();

    return (
        <section className="relative h-[500px] w-full flex items-center justify-center overflow-hidden my-16">
            {/* Background Image - Removed bg-fixed to prevent repaint overhead */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')]"
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium tracking-wider mb-4 animate-fade-in-up">
                    Seasonal Spotlight
                </span>
                <h2 className="text-4xl md:text-6xl font-heading tracking-tight font-bold tracking-tight mb-6 leading-tight drop-shadow-2xl animate-fade-in-up delay-100">
                    Winter in <span className="text-[#FFA896] italic font-serif">Switzerland</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
                    Experience the magic of the Alps. From snow-capped peaks to cozy chalets, discover the perfect winter wonderland.
                </p>

                <button
                    onClick={() => router.push('/listing')}
                    className="bg-white text-gray-800 px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 shadow-xl flex items-center gap-2 mx-auto animate-fade-in-up delay-300"
                >
                    Plan My Winter Trip
                    <ArrowRight className="w-5 h-5 transition-transform" />
                </button>
            </div>
        </section>
    );
};
