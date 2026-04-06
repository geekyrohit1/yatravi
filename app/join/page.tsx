import React from 'react';
import { API_BASE_URL } from '@/constants';
import JoinClient from './JoinClient';
import { Metadata } from 'next';

async function getJoinData() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pages/join`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getJoinData();
    if (!data || !data.seo) return {};

    const { seo } = data;
    return {
        title: seo.title || 'Join Our Network',
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        }
    };
}

export default async function JoinPage() {
    const data = await getJoinData();
    return <JoinClient initialData={data} />;
}
