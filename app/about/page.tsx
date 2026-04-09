import React from 'react';
import { API_BASE_URL } from '@/constants';
import AboutClient from './AboutClient';
import { Metadata } from 'next';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

async function getAboutData() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pages/about`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getAboutData();
    if (!data || !data.seo) return {};

    const { seo } = data;
    return {
        title: seo.title || 'About Us',
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        }
    };
}

export default async function AboutPage() {
    const data = await getAboutData();
    return <AboutClient initialData={data} />;
}
