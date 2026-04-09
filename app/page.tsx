import React from 'react';
import { API_BASE_URL } from '../constants';
import { getGlobalSettings } from '@/lib/api';
import { HomeClient } from './HomeClient';

// Enable Force Dynamic for truly real-time updates and bypass Next.js server-side caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHomepageData() {
    try {
        const timestamp = new Date().getTime();

        // Server-side fetch with 'no-store' to bypass cache completely
        const fetchPackages = fetch(`${API_BASE_URL}/api/packages?t=${timestamp}`, { cache: 'no-store' }).then(res => res.json()).catch(err => {
            console.error('Packages fetch failed', err);
            return [];
        });
        const fetchConfig = fetch(`${API_BASE_URL}/api/homepage?t=${timestamp}`, { cache: 'no-store' }).then(res => res.json()).catch(err => {
            console.error('Config fetch failed', err);
            return null;
        });

        const fetchDestinations = fetch(`${API_BASE_URL}/api/destinations?t=${timestamp}`, { cache: 'no-store' }).then(res => res.json()).catch(err => {
            console.error('Destinations fetch failed', err);
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
        // Parallel fetch for page-specific data and global settings
        const [pageRes, settings] = await Promise.all([
            fetch(`${API_BASE_URL}/api/pages/home`, { next: { revalidate: 60 } }).catch(() => null),
            getGlobalSettings()
        ]);
        
        const pageData = pageRes ? await pageRes.json() : null;
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
