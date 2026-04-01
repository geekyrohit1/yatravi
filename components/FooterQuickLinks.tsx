"use client";

import React from 'react';
import Link from 'next/link';

interface LinkItem {
    label: string;
    url: string;
}

interface FooterQuickLinksProps {
    quickLinks: LinkItem[];
    importantLinks: LinkItem[];
}

export const FooterQuickLinks: React.FC<FooterQuickLinksProps> = ({ quickLinks, importantLinks }) => {
    if ((!quickLinks || quickLinks.length === 0) && (!importantLinks || importantLinks.length === 0)) {
        return null;
    }

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-16">
                    {/* Quick Links Section */}
                    {quickLinks && quickLinks.length > 0 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h3 className="text-sm font-bold tracking-wider text-gray-900 inline-block relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-brand after:rounded-full">
                                    Packages From Your City
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {quickLinks.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className="h-full flex items-center justify-center p-3 text-center text-[11px] md:text-xs font-medium text-gray-600 border border-gray-100 rounded-xl hover:border-brand/30 hover:bg-brand/5 hover:text-brand hover:shadow-sm transition-all duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Important Links Section */}
                    {importantLinks && importantLinks.length > 0 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h3 className="text-sm font-bold tracking-wider text-gray-900 inline-block relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-gray-300 after:rounded-full">
                                    Destinations From Packages
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {importantLinks.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        className="h-full flex items-center justify-center p-3 text-center text-[11px] md:text-xs font-medium text-gray-600 border border-gray-100 rounded-xl hover:border-black/20 hover:bg-gray-50 hover:text-black hover:shadow-sm transition-all duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
