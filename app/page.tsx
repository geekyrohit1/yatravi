import React from 'react';
import { API_BASE_URL } from '../constants';
import { getGlobalSettings } from '@/lib/api';
import { HomeClient } from './HomeClient';

// Force dynamic rendering to ensure fresh data and resolve build-time conflicts with cache: 'no-store'
export const dynamic = 'force-dynamic';

/**
 * Timeout wrapper for server-side fetches
 */
async function fetchWithTimeout(url: string, options: any = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

async function getHomepageData() {
    try {
        const timestamp = new Date().getTime();

        // Server-side fetch with strict timeout and 'no-store'
        const fetchPackages = fetchWithTimeout(`${API_BASE_URL}/api/packages?t=${timestamp}`, { cache: 'no-store' }).then(res => res.json()).catch(err => {
            console.error('Packages fetch failed or timed out', err);
            return [];
        });
        
        const fetchConfig = fetchWithTimeout(`${API_BASE_URL}/api/homepage?t=${timestamp}`, { cache: 'no-store' }).then(res => res.json()).catch(err => {
            console.error('Config fetch failed or timed out', err);
            return null;
        });

        const fetchDestinations = fetchWithTimeout(`${API_BASE_URL}/api/destinations?t=${timestamp}`, { cache: 'no-store' }).then(res => res.json()).catch(err => {
            console.error('Destinations fetch failed or timed out', err);
            return [];
        });

        const [pkgData, configData, destData] = await Promise.all([fetchPackages, fetchConfig, fetchDestinations]);

        // Server-side filtering to ensure only published packages reach the UI
        let packagesArray = Array.isArray(pkgData) ? pkgData : (pkgData?.packages || []);
        packagesArray = packagesArray.filter((p: any) => p.status === 'published');

        return {
            packages: packagesArray,
            config: configData,
            destinations: destData
        };
    } catch (error) {
        console.error('SSR Data Fetch Error:', error);
        return { packages: [], config: null, destinations: [] };
    }
}

export async function generateMetadata() {
    try {
        // Parallel fetch for page-specific data and global settings with strict timeouts
        const [pageRes, settings] = await Promise.all([
            fetchWithTimeout(`${API_BASE_URL}/api/pages/home`, { next: { revalidate: 60 } }).catch(() => null),
            getGlobalSettings()
        ]);
        
        const pageData = pageRes && pageRes.ok ? await pageRes.json() : null;
        const globalSeo = settings?.globalSeo || {};

        const siteName = globalSeo.siteName || 'Yatravi';
        const defaultOgImage = globalSeo.defaultOgImage || '/og-image.png';

        if (!pageData || !pageData.seo) {
            return {
                title: { absolute: globalSeo.defaultTitle || `${siteName} | We Care Your Trip` },
                description: globalSeo.defaultDescription,
                keywords: globalSeo.defaultKeywords
            };
        }

        const { seo } = pageData;
        const baseTitle = seo.title || globalSeo.defaultTitle || `${siteName} | Lowest Price Holiday Packages`;
        
        // Prevent generic "Home" title from appearing in browser tab
        const finalTitle = baseTitle.toLowerCase() === 'home' 
            ? (globalSeo.defaultTitle || `${siteName} | We Care Your Trip - Lowest Price Holiday Packages`)
            : baseTitle;

        return {
            title: {
                absolute: finalTitle
            },
            description: seo.description || globalSeo.defaultDescription,
            keywords: seo.keywords || globalSeo.defaultKeywords,
            openGraph: {
                title: seo.ogTitle || finalTitle,
                description: seo.ogDescription || seo.description || globalSeo.defaultDescription,
                images: seo.ogImage ? [{ url: seo.ogImage }] : [{ url: defaultOgImage }],
                siteName: siteName
            },
            twitter: {
                card: 'summary_large_image',
                title: seo.twitterTitle || seo.ogTitle || finalTitle,
                description: seo.twitterDescription || seo.ogDescription || seo.description || globalSeo.defaultDescription,
                images: seo.twitterImage || seo.ogImage || defaultOgImage,
                creator: globalSeo.twitterHandle || '@yatravi'
            }
        };
    } catch (error) {
        return {};
    }
}

export default async function HomePage() {
    const { packages, config, destinations } = await getHomepageData();

    return (
        <main>
            <h1 className="sr-only">Yatravi | We Care Your Trip - Lowest Price Holiday Packages</h1>
            <HomeClient
                initialPackages={packages}
                initialConfig={config}
                initialDestinations={destinations}
            />
        </main>
    );
}
