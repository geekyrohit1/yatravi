"use client";

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import Link from 'next/link';

function getTimeLeft(endDate: string | undefined) {
    if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, expired: false };
}

export const SaleStrip: React.FC = () => {
    const { settings, loading } = useSettings();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });

    useEffect(() => {
        setTimeLeft(getTimeLeft(settings.saleBannerTimerEndDate));
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(settings.saleBannerTimerEndDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [settings.saleBannerTimerEndDate]);

    if (!settings.enableSaleBanner || loading) return null;

    const showTimer = settings.enableSaleBannerTimer && !timeLeft.expired;
    const bgStart = settings.saleBannerBgColor || '#7c3aed';
    const bgEnd = settings.saleBannerTextColor || '#db2777';

    const pad = (n: number) => String(n).padStart(2, '0');

    const cleanText = (settings.saleBannerText || 'Special Offer').replace(/^[^\s\w]+/, '').trim();

    return (
        <div
            style={{
                '--sale-bg-start': bgStart,
                '--sale-bg-end': bgEnd,
            } as React.CSSProperties}
            className="w-full py-2 min-h-[32px] md:min-h-[40px] flex items-center justify-center text-white z-[100] relative shadow-sm border-b border-white/5 animate-gradient-xy bg-[linear-gradient(135deg,var(--sale-bg-start)_0%,var(--sale-bg-end)_50%,var(--sale-bg-start)_100%)] bg-[length:200%_auto] font-sans"
        >
            <div className="max-w-7xl mx-auto w-full px-4 flex flex-col sm:flex-row items-center justify-center relative z-10 gap-2 md:gap-8">
                <div className="flex items-center gap-3 w-full justify-center">
                    {settings.saleBannerLink ? (
                        <Link href={settings.saleBannerLink} className="flex items-center justify-center hover:opacity-80 transition-all active:scale-95 w-full overflow-hidden">
                            <div className="flex items-center justify-center font-sans w-full text-center">
                                <span className="font-semibold tracking-[0.05em] uppercase text-[clamp(6px,2.5vw,11px)] md:text-[11px] whitespace-nowrap truncate w-full">
                                    {cleanText}
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <div className="flex items-center justify-center font-sans w-full text-center overflow-hidden">
                            <span className="font-semibold tracking-[0.05em] uppercase text-[clamp(6px,2.5vw,11px)] md:text-[11px] whitespace-nowrap truncate w-full">
                                {cleanText}
                            </span>
                        </div>
                    )}
                </div>

                {showTimer && (
                    <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-light tracking-[0.1em] border-l border-white/20 pl-4 md:pl-8">
                        <span className="opacity-60 uppercase text-[8px] md:text-[9px] hidden sm:block">Ends in</span>
                        <div className="flex items-center gap-2 tabular-nums font-medium">
                            {timeLeft.days > 0 && <span>{pad(timeLeft.days)}d <span className="opacity-40 font-light">:</span></span>}
                            <span>{pad(timeLeft.hours)}h <span className="opacity-40 font-light">:</span></span>
                            <span>{pad(timeLeft.minutes)}m <span className="opacity-40 font-light">:</span></span>
                            <span className="text-yellow-300">{pad(timeLeft.seconds)}s</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
