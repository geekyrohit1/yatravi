"use client";

import { useConsent } from './ConsentContext';
import { API_BASE_URL } from '@/constants';
import { usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';

export const useTracking = () => {
    const { preferences } = useConsent();
    const pathname = usePathname();

    const trackEvent = useCallback(async (
        type: 'page_view' | 'click' | 'search' | 'lead_intent',
        data: {
            target?: string;
            metadata?: any;
            isPersonalized?: boolean;
        } = {}
    ) => {
        if (!preferences.analytics && type !== 'lead_intent') {
            return; // Only track if consented, except for lead intent which is business critical (but we'll still respect privacy settings in the data)
        }

        // Prepare session ID (safe localStorage)
        let sessionId = null;
        try {
            if (typeof window !== 'undefined') {
                sessionId = localStorage.getItem('yatravi_session_id');
                if (!sessionId) {
                    sessionId = Math.random().toString(36).substring(2, 15);
                    localStorage.setItem('yatravi_session_id', sessionId);
                }
            }
        } catch (e) {
            console.error("Session ID storage failed", e);
            sessionId = 'fallback-' + Math.random().toString(36).substring(2, 7);
        }

        const payload = {
            type,
            path: pathname,
            target: data.target,
            metadata: {
                ...data.metadata,
                device: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'Mobile' : 'Desktop') : 'Unknown',
                browser: typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Unknown'
            },
            sessionId,
            isPersonalized: preferences.personalization && data.isPersonalized
        };

        try {
            await fetch(`${API_BASE_URL}/api/analytics/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error("Tracking failed", e);
        }
    }, [preferences, pathname]);

    // Track page views automatically on path change
    useEffect(() => {
        if (preferences.analytics && pathname) {
            trackEvent('page_view');
        }
    }, [pathname, preferences.analytics, trackEvent]);

    return { trackEvent };
};
