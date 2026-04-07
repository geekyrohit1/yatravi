"use client";

import React, { useState } from 'react';
import { Phone, Calendar, ArrowRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useTracking } from '@/context/useTracking';

export const ConsultationBanner: React.FC = () => {
    const { settings } = useSettings();
    const { trackEvent } = useTracking();
    const [email, setEmail] = useState('');
    // Assuming setIsQuotePopupOpen is a state setter from a parent component or context
    // For this specific component, we'll assume it's not directly used here,
    // or it needs to be defined if the button is meant to open a local popup.
    // Since the original component doesn't have this state, I'll remove the onClick for now
    // or replace it with the existing callback logic if that's the intent.
    // Given the instruction "Transition banner and popup side panel to Tangelo",
    // and the presence of a button with `setIsQuotePopupOpen(true)`, it implies a new popup mechanism.
    // However, without the full context of `setIsQuotePopupOpen`, I'll adapt the existing callback logic.
    // For now, I'll keep the existing callback link and remove the new button that uses `setIsQuotePopupOpen`.

    const phoneNumber = settings.contactPhone || '+91 95875 05726';
    const headline = settings.consultationBannerHeadline || 'Confused about where to go?';
    const subtext = settings.consultationBannerSubtext || 'Talk to our travel experts and get a personalized itinerary crafted just for you.';

    return (
        <section className="relative py-7 md:py-20 overflow-hidden bg-brand shrink-0">
            {/* Decorative Background Elements - Refined for professional look */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-light/20 rounded-full translate-x-1/3 translate-y-1/3 blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] uppercase font-bold tracking-widest mb-6 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            Expert travel guidance
                        </div>
                        <h2 className="text-[22px] md:text-5xl font-extrabold text-white mb-4 md:mb-6 tracking-tight leading-[1.2] md:leading-[1.1]">
                            <span>{headline}</span>
                        </h2>
                        <p className="text-white/80 text-sm md:text-lg font-medium leading-relaxed max-w-xl">
                            <span>{subtext}</span>
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch justify-center lg:justify-start gap-4 md:gap-6 w-full lg:w-auto">
                        <a
                            href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                            className="flex items-center gap-4 px-5 h-14 md:h-20 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group/call shadow-lg w-full md:w-auto overflow-hidden shrink-0"
                        >
                            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/15 border border-white/10 flex items-center justify-center text-white group-hover/call:scale-110 transition-transform shrink-0">
                                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-white/60 text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-0.5">
                                    <span>Consult with us</span>
                                </p>
                                <p className="text-white font-bold text-[15px] md:text-lg tracking-tight leading-none whitespace-nowrap" translate="no">
                                    <span>{phoneNumber}</span>
                                </p>
                            </div>
                        </a>

                        <a
                            href={settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi,%20I%20need%20a%20callback%20for%20travel%20planning` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto bg-white text-brand font-extrabold px-8 h-14 md:h-20 rounded-xl md:rounded-2xl shadow-xl hover:shadow-brand/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 group shrink-0"
                        >
                            <span className="whitespace-nowrap text-sm md:text-base">Get professional callback</span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
