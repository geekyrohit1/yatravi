"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { InquiryWidget } from './InquiryWidget';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { useTracking } from '@/context/useTracking';

export const GlobalInquiryPopup = () => {
    const pathname = usePathname();
    const { settings, loading } = useSettings();
    const { trackEvent } = useTracking();
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

    // Don't show on admin pages
    if (pathname?.startsWith('/admin')) return null;

    useEffect(() => {
        // Don't show if disabled in settings
        if (!settings.enableInquiryPopup || loading) return;

        // Check session storage to see if popup was already shown/dismissed in this session
        const sessionDismissed = sessionStorage.getItem('inquiryPopupDismissed');

        if (!sessionDismissed) {
            const timer = setTimeout(() => {
                setIsVisible(true);
                trackEvent('lead_intent', { target: 'global_inquiry_popup_view' });
            }, 7000); // Show after 7 seconds

            return () => clearTimeout(timer);
        }
    }, [settings.enableInquiryPopup, loading, trackEvent]);

    const handleClose = () => {
        setIsVisible(false);
        setHasBeenDismissed(true);
        sessionStorage.setItem('inquiryPopupDismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
                <InquiryWidget />

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 z-10"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
