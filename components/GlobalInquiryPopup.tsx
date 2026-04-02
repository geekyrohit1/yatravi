"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { InquiryWidget } from './InquiryWidget';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { useTracking } from '@/context/useTracking';
import { useConsent } from '@/context/ConsentContext';

export const GlobalInquiryPopup = () => {
    const pathname = usePathname();
    const { settings, loading } = useSettings();
    const { trackEvent } = useTracking();
    const { hasResponded, preferences } = useConsent();
    const [isVisible, setIsVisible] = useState(false);

    // Don't show on admin pages
    if (pathname?.startsWith('/admin')) return null;

    useEffect(() => {
        // 1. Basic Safety Checks
        if (!settings.enableInquiryPopup || loading) return;

        // 2. Cookie Consent Check (Privacy First)
        // Wait for user to at least respond to cookies, and only show if they didn't deny all (optional but professional)
        // 2. Persistent Dismissal Check (Smart Frequency)
        // If dismissed, don't show again for 3 days
        const lastDismissed = localStorage.getItem('globalInquiryDismissedAt');
        if (lastDismissed) {
            const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(lastDismissed) < threeDaysInMs) return;
        }

        let isTriggered = false;

        const triggerPopup = () => {
            if (isTriggered || isVisible) return;
            
            // 3. Collision Prevention Logic
            // Check if Cookie Banner is currently visible on screen (active DOM check)
            const cookieBanner = document.querySelector('[data-cookie-banner="true"]') || 
                                 !!document.querySelector('.fixed.bottom-0.left-0.right-0.z-\\[9999\\]');
            
            if (cookieBanner && !hasResponded) {
                // If cookie banner is showing, wait and try again in 5 seconds
                setTimeout(triggerPopup, 5000);
                return;
            }

            isTriggered = true;
            setIsVisible(true);
            trackEvent('lead_intent', { target: 'global_inquiry_popup_view' });
        };

        // 4. Interaction Triggers (Scroll 50% or 30s Delay)
        const handleScroll = () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            // Higher interest threshold (50%)
            if (scrollPercent > 0.5) {
                triggerPopup();
                window.removeEventListener('scroll', handleScroll);
            }
        };

        // Add 10s absolute delay before even allowing scroll/timer triggers
        // This ensures the website feels "calm" for the first 10 seconds
        const graceTimer = setTimeout(() => {
            window.addEventListener('scroll', handleScroll);
        }, 10000);

        const timer = setTimeout(triggerPopup, 45000); // 45s safety trigger (increased from 30s)

        return () => {
            clearTimeout(graceTimer);
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [settings.enableInquiryPopup, loading, trackEvent, hasResponded]);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('globalInquiryDismissedAt', Date.now().toString());
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md animate-in zoom-in-95 duration-300">
                <InquiryWidget roundedBottom={true} />

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
