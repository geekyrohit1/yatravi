"use client";

import React, { useState, useEffect, useRef } from 'react';

const TABS = [
    { id: 'packages', label: 'Packages' },
    { id: 'overview', label: 'Overview' },
    { id: 'places', label: 'Places to Visit' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' }
];

export const DestinationTabs = () => {
    const [activeTab, setActiveTab] = useState('packages');
    const [isSticky, setIsSticky] = useState(false);
    const stickyRef = useRef<HTMLDivElement>(null);

    // Manual Sticky Trigger (Matches PackageClient.tsx)
    useEffect(() => {
        const handleScroll = () => {
            if (stickyRef.current) {
                // Threshold is the original top position of the placeholder minus a small buffer
                const threshold = stickyRef.current.offsetTop - 70;
                setIsSticky(window.scrollY > threshold);
            }

            // Scroll Spy Logic
            const sections = TABS.map(tab => document.getElementById(tab.id));
            const scrollPosition = window.scrollY + 200; // Aligned with PackageClient.tsx

            for (const section of sections) {
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        setActiveTab(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            // Adjust offset for the sticky header height (matches PackageClient.tsx smooth scroll)
            const offset = 100; // Adjusted for top-0 sticky
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div ref={stickyRef} className="h-14">
            <div className={`${isSticky 
                ? 'fixed top-0 left-0 right-0 z-[60] shadow-md border-b border-gray-100 lg:border-white/10' 
                : 'relative border-b border-gray-100 lg:border-white/10'} 
                bg-white/95 lg:bg-brand-dark backdrop-blur-md transition-all duration-300 shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8 md:gap-10 overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={`py-4 text-[13px] md:text-[14px] font-semibold tracking-tight whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === tab.id
                                    ? 'border-brand text-brand lg:border-white lg:text-white'
                                    : 'border-transparent text-gray-500 lg:text-white/70 hover:text-gray-900 lg:hover:text-white hover:border-gray-200 lg:hover:border-white/40'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
