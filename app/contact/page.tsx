import React from 'react';
import { API_BASE_URL } from '@/constants';
import ContactClient from './ContactClient';
import { Metadata } from 'next';

// Enable ISR with 60-second revalidation
export const revalidate = 60;

async function getContactData() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/pages/contact`, { next: { revalidate: 30 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const data = await getContactData();
    if (!data || !data.seo) return {};

    const { seo } = data;
    return {
        title: seo.title || 'Contact Us',
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.ogTitle || seo.title,
            description: seo.ogDescription || seo.description,
            images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        }
    };
}

export default async function ContactPage() {
    const data = await getContactData();
    return <ContactClient initialData={data} />;
}
