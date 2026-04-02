"use client";

import React, { useState, useEffect } from 'react';
import { useConsent } from '@/context/ConsentContext';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const CookieBanner: React.FC = () => {
    const { hasResponded, acceptAll, denyAll } = useConsent();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!hasResponded) {
            const checkAndShow = () => {
                const isInquiryPopupShowing = !!document.querySelector('.fixed.inset-0.z-50');
                if (isInquiryPopupShowing) {
                    setTimeout(checkAndShow, 10000);
                    return;
                }
                setIsVisible(true);
            };
            const timer = setTimeout(checkAndShow, 20000);
            return () => clearTimeout(timer);
        }
    }, [hasResponded]);

    if (!isVisible || hasResponded) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-28 md:w-[320px] z-[9999] animate-in slide-in-from-bottom-full md:slide-in-from-right-full duration-700 pointer-events-none">
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.08)] md:shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-6 md:p-8 border-t md:border border-gray-100 flex flex-col items-center text-center relative pointer-events-auto overflow-hidden">
                {/* Minimal Close */}
                <button 
                    onClick={denyAll}
                    className="absolute top-4 right-4 p-1 text-gray-300 hover:text-gray-900 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Smaller Cookie Icon */}
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                    <Cookie className="w-6 h-6 text-orange-600 animate-pulse" />
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">We use cookies</h2>
                
                <p className="text-gray-500 text-[11px] leading-relaxed mb-6 max-w-[240px]">
                    Accept cookies to continue enjoying our site, we promise they're delicious
                </p>

                <div className="w-full space-y-3">
                    <Button
                        onClick={acceptAll}
                        className="w-full h-11 bg-[#1a1a1a] hover:bg-black text-white text-[11px] font-bold rounded-xl transition-all active:scale-[0.98]"
                    >
                        Accept
                    </Button>
                    
                    <button
                        onClick={denyAll}
                        className="text-[9px] font-bold text-gray-400 hover:text-gray-900 transition-colors py-1 uppercase tracking-[0.2em]"
                    >
                        Decline
                    </button>
                </div>

                {/* Privacy Policy Link - More Subtle */}
                <div className="mt-5 pt-4 border-t border-gray-50 w-full">
                    <Link 
                        href="/privacy-policy" 
                        className="text-[9px] font-black text-gray-300 hover:text-brand uppercase tracking-[0.2em] transition-colors"
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    );
};
