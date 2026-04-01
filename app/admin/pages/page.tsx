"use client";

import React from 'react';
import Link from 'next/link';
import { FileText, ChevronRight, Info, Phone, ShieldCheck, FileCheck, LifeBuoy } from 'lucide-react';

const PAGES = [
    {
        slug: 'about',
        label: 'About Us',
        desc: 'Company story, stats, team values and hero image',
        icon: Info,
        color: 'bg-blue-50 text-blue-600',
    },
    {
        slug: 'contact',
        label: 'Contact Us',
        desc: 'Expert cards, office addresses and hero section',
        icon: Phone,
        color: 'bg-green-50 text-green-600',
    },
    {
        slug: 'support',
        label: 'Support Center',
        desc: 'Support page headline and subtext',
        icon: LifeBuoy,
        color: 'bg-purple-50 text-purple-600',
    },
    {
        slug: 'privacy',
        label: 'Privacy Policy',
        desc: 'Full HTML body content of Privacy Policy page',
        icon: ShieldCheck,
        color: 'bg-amber-50 text-amber-600',
    },
    {
        slug: 'terms',
        label: 'Terms & Conditions',
        desc: 'Full HTML body content of Terms & Conditions page',
        icon: FileCheck,
        color: 'bg-red-50 text-red-600',
    },
];

export default function AdminPagesListPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">General Pages</h1>
                <p className="text-gray-500 mt-1">Edit content and images for all footer-linked pages.</p>
            </div>

            <div className="space-y-3">
                {PAGES.map((page) => {
                    const Icon = page.icon;
                    return (
                        <Link
                            key={page.slug}
                            href={`/admin/pages/${page.slug}`}
                            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${page.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 group-hover:text-[#CD1C18] transition-colors">{page.label}</h3>
                                <p className="text-sm text-gray-400 truncate">{page.desc}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#CD1C18] transition-colors shrink-0" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
