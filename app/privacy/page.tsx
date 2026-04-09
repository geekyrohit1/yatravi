import React from 'react';
import { API_BASE_URL } from '@/constants';
import PrivacyClient from './PrivacyClient';
import { Metadata } from 'next';

async function getPrivacyData() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pages/privacy`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getPrivacyData();
    if (!data || !data.seo) return {};

    const { seo } = data;
    return {
        title: seo.title || 'Privacy Policy',
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        }
    };
}

export default async function PrivacyPage() {
    const data = await getPrivacyData();
    return <PrivacyClient initialData={data} />;
}
