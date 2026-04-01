"use client";

import React, { useEffect, useState } from 'react';
import { PackageSlider } from './PackageSlider';
import { useConsent } from '@/context/ConsentContext';

export const RecentlyViewed: React.FC = () => {
    const [recentPackages, setRecentPackages] = useState<any[]>([]);
    const { preferences } = useConsent();

    useEffect(() => {
        if (preferences.personalization) {
            const saved = localStorage.getItem('yatravi_recently_viewed');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        // Filter out the deleted duplicate package
                        const filtered = parsed.filter(p =>
                            p.slug !== 'pattaya-bangkok-luxury-escape' &&
                            p.title !== 'Best of Pattaya & Bangkok: 6 Days Luxury Escape'
                        );
                        setRecentPackages(filtered);
                    } else {
                        setRecentPackages([]);
                    }
                } catch (e) {
                    console.error("Failed to parse recently viewed", e);
                    setRecentPackages([]);
                }
            }
        }
    }, [preferences.personalization]);

    if (!preferences.personalization || recentPackages.length === 0) return null;

    return (
        <PackageSlider
            title="Continue Your Search"
            subtitle="Packages you were recently interested in"
            packages={recentPackages}
        />
    );
};
