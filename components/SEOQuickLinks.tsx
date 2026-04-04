'use client';

import React from 'react';
import Link from 'next/link';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';

interface QuickLink {
    label: string;
    url: string;
}

interface SEOQuickLinksProps {
    links: QuickLink[];
    title?: string;
}

const SEOQuickLinks: React.FC<SEOQuickLinksProps> = ({ links, title = "Important Travel Links" }) => {
    if (!links || links.length === 0) return null;

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Natural Centered Heading like Homepage */}
                <div className="text-center mb-10">
                    <h3 className="text-sm font-bold tracking-wider text-gray-900 inline-block relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-brand after:rounded-full uppercase">
                        {title}
                    </h3>
                </div>

                {/* Boxy Grid Layout - Typography Matched */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {links.map((link, idx) => (
                        <Link 
                            key={idx} 
                            href={link.url}
                            className="h-full flex items-center justify-center p-3 text-center text-[11px] md:text-xs font-medium text-gray-600 border border-gray-100 rounded-xl hover:border-brand/30 hover:bg-brand/5 hover:text-brand hover:shadow-sm transition-all duration-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <p className="mt-12 text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em] text-center border-t border-gray-50 pt-8 opacity-50">
                    Explore Popular Travel Options • Yatravi Travel Solutions
                </p>
            </div>
        </section>
    );
};

export default SEOQuickLinks;
