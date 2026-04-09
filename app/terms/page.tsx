import React from 'react';
import { API_BASE_URL } from '@/constants';
import TermsClient from './TermsClient';
import { Metadata } from 'next';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

async function getTermsData() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pages/terms`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getTermsData();
    if (!data || !data.seo) return {};

    const { seo } = data;
    return {
        title: seo.title || 'Terms & Conditions',
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        }
    };
}

export default async function TermsPage() {
    const data = await getTermsData();
    return <TermsClient initialData={data} />;
}
