"use client";

import React from 'react';
import { ShieldCheck, Headphones, HeartHandshake, CreditCard } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const ICONS = [ShieldCheck, Headphones, HeartHandshake, CreditCard];

const FALLBACK_FEATURES = [
    { title: '100% Verified Packages', desc: 'Trusted by thousands' },
    { title: '24/7 Expert Support', desc: 'Always here for you' },
    { title: 'Best Price Guarantee', desc: 'Unbeatable value' },
    { title: 'Hassle-free Planning', desc: 'Transparent process' },
];

export const WhyChooseUs: React.FC = () => {
    const { settings } = useSettings();
    const features = (settings.whyChooseUs && settings.whyChooseUs.length > 0)
        ? settings.whyChooseUs
        : FALLBACK_FEATURES;

    return (
        <section className="pt-4 md:pt-8 pb-0 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {features.slice(0, 4).map((feature, idx) => {
                        const Icon = ICONS[idx] || ShieldCheck;
                        return (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-brand/10 scale-110 group-hover:scale-100 transition-transform duration-0 group-hover:duration-[1500ms] ease-out">
                                    <Icon className="w-5 h-5 text-brand" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-[13px] md:text-[15px] tracking-tight">{feature.title}</h3>
                                    <p className="text-gray-400 text-[10px] md:text-xs tracking-wide">{feature.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
