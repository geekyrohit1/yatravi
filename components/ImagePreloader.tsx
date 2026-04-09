"use client";

import { useEffect } from "react";

interface ImagePreloaderProps {
    urls: string[];
}

/**
 * ImagePreloader Component
 * -----------------------
 * Silently pre-fetches images in the background once the main page is idle.
 * This ensures that when the user navigates, images are already in cache.
 */
export default function ImagePreloader({ urls }: ImagePreloaderProps) {
    useEffect(() => {
        if (typeof window === "undefined" || !urls || urls.length === 0) return;

        // Start preloading after a short delay to ensure initial page is fully ready
        const timer = setTimeout(() => {
            // Function to load a single image
            const preloadImage = (url: string) => {
                if (!url || typeof url !== 'string' || url.includes('placeholder.svg')) return;
                
                const img = new Image();
                img.src = url;
            };

            // Process URLs in idle time if available, otherwise just use timeout
            if ("requestIdleCallback" in window) {
                (window as any).requestIdleCallback(() => {
                    urls.slice(0, 20).forEach(preloadImage); // Limit to top 20 assets to save data
                });
            } else {
                urls.slice(0, 20).forEach(preloadImage);
            }
        }, 5000); // 5-second delay after mount to give LCP absolute priority

        return () => clearTimeout(timer);
    }, [urls]);

    return null; // This component is behavior-only
}
