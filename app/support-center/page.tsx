import React from 'react';
import { API_BASE_URL } from '@/constants';
import SupportCenterClient from './SupportCenterClient';
import { Metadata } from 'next';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

async function getSupportData() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pages/support-center`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getSupportData();
    if (!data || !data.seo) return {};

    const { seo } = data;
    return {
        title: seo.title || 'Support Center',
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        }
    };
}

export default async function SupportCenterPage() {
    const data = await getSupportData();
    return <SupportCenterClient initialData={data} />;
}
