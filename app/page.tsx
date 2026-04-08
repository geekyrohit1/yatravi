import React from 'react';
import { API_BASE_URL } from '../constants';
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
        const res = await fetch(`${API_BASE_URL}/api/pages/home`, { next: { revalidate: 3600 } }).catch(() => null);
        const pageData = res ? await res.json() : null;
        
        if (!pageData || !pageData.seo) return {};
        
        const { seo } = pageData;
        return {
            title: seo.title,
            description: seo.description,
            keywords: seo.keywords,
            openGraph: {
                title: seo.ogTitle || seo.title,
                description: seo.ogDescription || seo.description,
                images: seo.ogImage ? [{ url: seo.ogImage }] : [],
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
