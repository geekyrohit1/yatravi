import React from 'react';
import { API_BASE_URL } from '../constants';
import { HomeClient } from './HomeClient';

// Enable ISR (Incremental Static Regeneration) for high-performance homepage
export const revalidate = 3600; // Revalidate every hour

async function getHomepageData() {
    try {
        const timestamp = new Date().getTime();
        const cacheTime = process.env.NODE_ENV === 'development' ? 0 : 3600;
        
        // Server-side fetch (no 'window' check needed here as it's a Server Component)
        const fetchPackages = fetch(`${API_BASE_URL}/api/packages?t=${timestamp}`, { next: { revalidate: cacheTime } }).then(res => res.json()).catch(err => {
            console.error('Packages fetch failed', err);
            return [];
        });
        const fetchConfig = fetch(`${API_BASE_URL}/api/homepage?t=${timestamp}`, { next: { revalidate: cacheTime } }).then(res => res.json()).catch(err => {
            console.error('Config fetch failed', err);
            return null;
        });

        const [pkgData, configData] = await Promise.all([fetchPackages, fetchConfig]);
        
        const packagesArray = Array.isArray(pkgData) ? pkgData : (pkgData?.packages || []);
        
        return {
            packages: packagesArray,
            config: configData
        };
    } catch (error) {
        console.error('SSR Data Fetch Error:', error);
        return { packages: [], config: null };
    }
}

export default async function HomePage() {
    const { packages, config } = await getHomepageData();

    return (
        <HomeClient 
            initialPackages={packages} 
            initialConfig={config} 
        />
    );
}
