"use client";

import React from 'react';
import { ShieldCheck, Headphones, HeartHandshake, CreditCard } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const ICONS = [ShieldCheck, Headphones, HeartHandshake, CreditCard];


export const WhyChooseUs: React.FC = () => {
    const { settings } = useSettings();
    const features = settings.whyChooseUs || [];

    return (
        <section className="pt-4 md:pt-8 pb-0 bg-white min-h-[100px] md:min-h-[140px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-8">
                    {features.slice(0, 4).map((feature, idx) => {
                        const Icon = ICONS[idx] || ShieldCheck;
                        return (
                            <div key={idx} className="flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-1.5 md:gap-4 group">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-brand/10 group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 text-[8px] md:text-[15px] leading-tight tracking-tight break-words">{feature.title}</h3>
                                    <p className="text-gray-400 text-[7px] md:text-xs tracking-tight hidden md:block">{feature.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
