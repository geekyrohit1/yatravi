"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_BASE_URL } from '@/constants';

export interface SiteSettings {
    // Contact Information
    contactPhone: string;
    whatsappNumber: string;

    // Social Links
    socialLinks: {
        instagram: string;
        facebook: string;
        twitter: string;
        youtube: string;
        linkedin: string;
    };

    // Feature Toggles
    enableWhatsappChat: boolean;
    enableInquiryPopup: boolean;
    enableNewsletter: boolean;
    enableAIChat: boolean;

    // Sale Banner
    enableSaleBanner: boolean;
    enableSaleBannerAnimation: boolean;
    enableSaleBannerTimer: boolean;
    saleBannerTimerEndDate?: string;
    saleBannerText: string;
    saleBannerLink: string;
    saleBannerBgColor?: string;
    saleBannerTextColor?: string;
    saleBannerBorderColor?: string;

    // Consultation Banner
    consultationBannerHeadline?: string;
    consultationBannerSubtext?: string;

    // Newsletter
    newsletterHeadline?: string;
    newsletterSubtext?: string;
    newsletterDiscount?: string;

    // Why Choose Us
    whyChooseUs?: { title: string; desc: string }[];

    // Join Page Content
    joinPageHeroTitle?: string;
    joinPageHeroSubtitle?: string;
    joinPageHeroBadge?: string;
    joinPageHeroImage?: string;
    heroMobileTagline?: string;
    heroSearchPlaceholder?: string;
    heroPriceLabel?: string;
}

const defaultSettings: SiteSettings = {
    contactPhone: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
    socialLinks: {
        instagram: '',
        facebook: '',
        twitter: '',
        youtube: '',
        linkedin: ''
    },
    enableWhatsappChat: true,
    enableInquiryPopup: true,
    enableNewsletter: true,
    enableAIChat: true,
    enableSaleBanner: false,
    enableSaleBannerAnimation: true,
    enableSaleBannerTimer: true,
    saleBannerText: '',
    saleBannerLink: '',
    saleBannerBgColor: '#0055ff',
    saleBannerTextColor: '#e91e63',
    saleBannerBorderColor: '#ffaa00',
    consultationBannerHeadline: 'Confused about where to go?',
    consultationBannerSubtext: 'Talk to our travel experts and get a personalized itinerary crafted just for you.',
    newsletterHeadline: 'Unlock Exclusive Travel Deals!',
    newsletterSubtext: 'Subscribe to our newsletter and get up to',
    newsletterDiscount: '40% OFF',
    whyChooseUs: [
        { title: '100% Verified Packages', desc: 'Trusted by thousands' },
        { title: '24/7 Expert Support', desc: 'Always here for you' },
        { title: 'Best Price Guarantee', desc: 'Unbeatable value' },
        { title: 'Hassle-free Planning', desc: 'Transparent process' },
    ],
    joinPageHeroTitle: 'Grow with Yatravi',
    joinPageHeroSubtitle: "Join India's fastest-growing travel network. Whether you're a travel agent, hotelier, or corporate partner, let's build success together.",
    joinPageHeroBadge: 'Partner with Excellence',
    joinPageHeroImage: '/images/placeholder.svg',
    heroMobileTagline: 'We care your trip • Yatravi',
    heroSearchPlaceholder: 'Search your destination',
    heroPriceLabel: 'Starting from',
};

interface SettingsContextType {
    settings: SiteSettings;
    loading: boolean;
    refetch: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    loading: true,
    refetch: () => { }
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        try {
            const timestamp = new Date().getTime();
            const res = await fetch(`${API_BASE_URL}/api/settings?t=${timestamp}`, { cache: 'no-store' });
            const contentType = res.headers.get("content-type");
            if (res.ok && contentType && contentType.includes("application/json")) {
                const data = await res.json();
                const updatedSettings = { ...defaultSettings, ...data };
                setSettings(updatedSettings);
                // Cache the fresh settings
                if (typeof window !== 'undefined') {
                    localStorage.setItem('yatravi_settings', JSON.stringify(updatedSettings));
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 1. Instant Load from Cache (Stale-While-Revalidate)
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('yatravi_settings');
            if (cached) {
                try {
                    setSettings(JSON.parse(cached));
                    setLoading(false); // UI can reveal immediately with cached data
                } catch (e) {
                    console.error('Failed to parse cached settings');
                }
            }
        }
        // 2. Background Revalidate
        fetchSettings(true);
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, refetch: () => fetchSettings(false) }}>
            {children}
        </SettingsContext.Provider>
    );
}
