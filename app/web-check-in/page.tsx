import React from 'react';
import { API_BASE_URL } from '@/constants';
import WebCheckInClient from './WebCheckInClient';
import { Metadata } from 'next';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

async function getCheckInData() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pages/web-check-in`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getCheckInData();
    if (!data || !data.seo) return {};

    const { seo } = data;
    return {
        title: seo.title || 'Web Check-in',
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        }
    };
}

export default async function WebCheckInPage() {
    const data = await getCheckInData();
    return <WebCheckInClient initialData={data} />;
}
