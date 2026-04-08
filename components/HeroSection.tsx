"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Loader2,
    X,
    ChevronLeft,
    Clock,
    Filter,
    Wallet,
    Star,
    ArrowRight,
    MapPin,
    ChevronRight,
    Search,
    Gift,
    SlidersHorizontal,
    Phone,
    Play,
    Volume2,
    VolumeX,
    Menu
} from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import { useSettings } from '@/context/SettingsContext';
import { Logo } from './Logo';

// Hero destination data structure
interface HeroDestination {
    name: string;
    slug: string;
    heroImage: string;
    mobileImage?: string;
    tagline: string;
    startingPrice: number;
}

// Fallback destinations in case API is empty
// Fallback destinations with local placeholders
const FALLBACK_DESTINATIONS: HeroDestination[] = [
    { name: "NORWAY", slug: "norway", heroImage: "/images/placeholder.svg", tagline: "Land of the Midnight Sun", startingPrice: 195000 },
    { name: "BALI", slug: "bali", heroImage: "/images/placeholder.svg", tagline: "Island of the Gods", startingPrice: 85000 },
    { name: "JAPAN", slug: "japan", heroImage: "/images/placeholder.svg", tagline: "Where Tradition Meets Tomorrow", startingPrice: 165000 },
    { name: "MALDIVES", slug: "maldives", heroImage: "/images/placeholder.svg", tagline: "Paradise on Earth", startingPrice: 125000 }
];

interface HeroSectionProps {
    heroData?: any[];
    isLoading?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
    heroData = [],
    isLoading = false
}) => {
    const router = useRouter();
    const { settings, loading: settingsLoading } = useSettings();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [heroDestinationsState, setHeroDestinationsState] = useState<HeroDestination[]>(() => {
        if (heroData && heroData.length > 0) {
            return heroData
                .filter((s: any) => s.enabled !== false)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((s: any) => ({
                    name: (s.customTitle || s.name || 'Destination'),
                    slug: s.slug || 'explore',
                    heroImage: s.customImage || s.heroImage || FALLBACK_DESTINATIONS[0].heroImage,
                    mobileImage: s.customMobileImage || s.mobileMediaUrl || s.mobileImage,
                    tagline: s.customTagline || s.tagline || 'Explore Now',
                    startingPrice: s.startingPrice || 99000
                }));
        }
        return [];
    });
    const [dynamicPlaceholder, setDynamicPlaceholder] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isDeletingPlaceholder, setIsDeletingPlaceholder] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [imageReady, setImageReady] = useState(false);

    useEffect(() => {
        setMounted(true);
        // If data is already present, reveal immediately
        if (heroData && heroData.length > 0) {
            setImageReady(true);
        } else {
            // Still show skeleton if data is missing, but with a shorter failsafe
            const failsafe = setTimeout(() => setImageReady(true), 800);
            return () => clearTimeout(failsafe);
        }
    }, [heroData]);

    // Update state if props change after initial load
    useEffect(() => {
        if (heroData && heroData.length > 0) {
            const slides = heroData
                .filter((s: any) => s.enabled !== false)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((s: any) => ({
                    name: (s.customTitle || s.name || 'Destination'),
                    slug: s.slug || 'explore',
                    heroImage: s.customImage || s.heroImage || FALLBACK_DESTINATIONS[0].heroImage,
                    mobileImage: s.customMobileImage || s.mobileMediaUrl || s.mobileImage,
                    tagline: s.customTagline || s.tagline || 'Explore Now',
                    startingPrice: s.startingPrice || 99000
                }));

            if (slides.length > 0) {
                setHeroDestinationsState(slides);
            }
        }
    }, [heroData]);

    // Typewriter effect for mobile search placeholder
    useEffect(() => {
        if (heroDestinationsState.length === 0) return;

        const currentFullText = heroDestinationsState[placeholderIndex].name;
        const typingSpeed = isDeletingPlaceholder ? 40 : 100;

        const timeout = setTimeout(() => {
            if (!isDeletingPlaceholder) {
                // Typing
                setDynamicPlaceholder(currentFullText.substring(0, dynamicPlaceholder.length + 1));

                if (dynamicPlaceholder === currentFullText) {
                    // Start deleting after a pause
                    setTimeout(() => setIsDeletingPlaceholder(true), 2000);
                }
            } else {
                // Deleting
                setDynamicPlaceholder(currentFullText.substring(0, dynamicPlaceholder.length - 1));

                if (dynamicPlaceholder === '') {
                    setIsDeletingPlaceholder(false);
                    setPlaceholderIndex((prev) => (prev + 1) % heroDestinationsState.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [dynamicPlaceholder, isDeletingPlaceholder, placeholderIndex, heroDestinationsState]);

    const heroDestinations: HeroDestination[] = heroDestinationsState.length > 0 ? heroDestinationsState : FALLBACK_DESTINATIONS;
    const activeDestination = heroDestinations[activeIndex] || FALLBACK_DESTINATIONS[0];

    // Typewriter effect
    useEffect(() => {
        if (!mounted) return;
        const targetText = activeDestination.name;
        let currentIndex = 0;
        let isDeleting = false;
        let timeoutId: ReturnType<typeof setTimeout>;

        const tick = () => {
            if (!isDeleting) {
                if (currentIndex <= targetText.length) {
                    setDisplayedText(targetText.substring(0, currentIndex));
                    currentIndex++;
                    setIsTyping(true);
                    timeoutId = setTimeout(tick, 80);
                } else {
                    setIsTyping(false);
                    timeoutId = setTimeout(() => {
                        isDeleting = true;
                        currentIndex = targetText.length;
                        tick();
                    }, 2500);
                }
            } else {
                if (currentIndex >= 0) {
                    setDisplayedText(targetText.substring(0, currentIndex));
                    currentIndex--;
                    setIsTyping(true);
                    timeoutId = setTimeout(tick, 40);
                } else {
                    setIsTyping(false);
                    setIsTransitioning(true);
                    setActiveIndex((prev) => (prev + 1) % heroDestinations.length);
                    setTimeout(() => setIsTransitioning(false), 600);
                }
            }
        };

        timeoutId = setTimeout(tick, 300);
        return () => clearTimeout(timeoutId);
    }, [activeIndex, activeDestination.name, heroDestinations.length, mounted]);

    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev === 0 ? heroDestinations.length - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => (prev + 1) % heroDestinations.length);
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const handleExplore = () => {
        router.push(`/destination/${activeDestination.slug}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN').format(price);
    };

    // Stabilized height calculation to prevent Cumulative Layout Shift (CLS)
    // Aggressively reduced mobile height to 240px for an ultra-compact wide-screen panoramic look.
    const baseHeight = "h-[500px] md:h-[calc(100vh-70px)] lg:h-[600px]";
    let containerClasses = `relative w-full transition-all duration-500 ${baseHeight} bg-white overflow-hidden px-0`;

    // Only adjust if sale banner is explicitly enabled (which is rare/specific)
    if (!settingsLoading && settings?.enableSaleBanner === true) {
        containerClasses = `relative w-full transition-all duration-500 h-[500px] md:h-[calc(100vh-110px)] lg:h-[600px] bg-white overflow-hidden px-0`;
    }

    if (isLoading || heroDestinations.length === 0) {
        return (
            <section className={containerClasses}>
                <div className="relative w-full h-full bg-white flex flex-col items-center justify-center pt-24 md:pt-0 pb-0 md:pb-16 lg:pb-20 overflow-hidden">
                    {/* Background Glow Skeleton (Dark Light Theme) */}
                    <div className="absolute inset-0 bg-slate-50 animate-pulse" />

                    {/* Content Skeleton */}
                    <div className="relative z-10 text-center space-y-4 md:space-y-6 px-4 w-full max-w-2xl mx-auto">
                        <div className="h-3 w-32 bg-slate-200/60 rounded-full mx-auto animate-pulse" />
                        <div className="h-12 md:h-20 w-3/4 bg-slate-200/40 rounded-2xl mx-auto animate-pulse" />
                        <div className="h-4 w-48 bg-slate-100/60 rounded-full mx-auto animate-pulse" />

                        {/* Search Bar Skeleton */}
                        <div className="h-10 md:h-12 w-full max-w-sm bg-slate-50/50 rounded-xl mx-auto animate-pulse mt-8 border border-slate-100/40" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`${containerClasses} animate-in fade-in duration-1000`}>
            {/* Cinematic Blurred Background Glow (Desktop Only) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block z-0">
                {heroDestinations.map((dest, index) => (
                    <div
                        key={`bg-glow-${index}-${dest.slug}`}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-20' : 'opacity-0'}`}
                    >
                        <Image
                            src={dest.heroImage || '/images/placeholder.svg'}
                            alt=""
                            fill
                            quality={50}
                            priority={false}
                            sizes="100vw"
                            className="object-cover blur-[80px] saturate-[2.5] brightness-[1.05] transform-gpu scale-110"
                        />
                    </div>
                ))}
            </div>
            <div className="relative w-full h-full rounded-none overflow-hidden">
                {/* NEW DESKTOP SPLIT LAYOUT (replaces lines 319-404 on large screens) */}
                <div className="hidden lg:flex relative w-full h-full max-w-7xl mx-auto items-center px-4 sm:px-6 lg:px-8 gap-16 z-20">
                    {/* Left Column: Content */}
                    <div className={`flex-1 flex flex-col items-start transition-all duration-700 ${isTransitioning ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}`}>
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-8 h-[2px] bg-brand"></div>
                            <span className="text-brand font-bold lowercase capitalize-first tracking-[0.25em] text-[10px]">
                                {activeDestination.tagline}
                            </span>
                        </div>

                        <h1 className="text-5xl lg:text-[56px] font-semibold text-gray-900 leading-[1.1] mb-8 lowercase capitalize-first tracking-wide max-w-xl">
                            {activeDestination.name}
                        </h1>

                        <div className="flex flex-col mb-10 border-l-2 border-brand/30 pl-5">
                            <span className="text-[10px] font-bold text-brand lowercase tracking-[0.25em] mb-1.5 capitalize-first">
                                <span>starting from</span>
                            </span>
                            <div className="flex items-baseline gap-1" translate="no">
                                <span className="text-4xl font-bold text-gray-900 tracking-tight">
                                    <span className="mr-1">₹</span>
                                    <span>{formatPrice(activeDestination.startingPrice)}</span>
                                </span>
                                <span className="text-[10px] font-medium text-gray-500 lowercase tracking-widest ml-1 capitalize-first" translate="yes">
                                    <span>per person</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleExplore}
                                className="px-10 py-4 bg-gray-900 text-white rounded-xl font-medium tracking-wider text-[11px] hover:bg-brand transition-all duration-300 shadow-lg shadow-gray-900/10 group flex items-center gap-3 whitespace-nowrap"
                            >
                                Visit Destination
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => {
                                    const waNumber = (settings?.whatsappNumber || '9587505726').replace(/[^0-9]/g, '');
                                    const message = `Hi, I am interested in ${activeDestination.name} package. Please share details.`;
                                    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
                                }}
                                className="px-8 py-4 bg-white/40 hover:bg-brand/10 text-gray-700 hover:text-brand font-medium lowercase capitalize-first tracking-widest text-[11px] rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/20 whitespace-nowrap"
                            >
                                <Phone className="w-4 h-4" />
                                <span className="capitalize-first">chat expert</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Image Slider - Balanced Landscape */}
                    <div className="flex-[1.8] relative aspect-[1.8/1] select-none">
                        <div className="relative w-full h-full">
                            {heroDestinations.map((dest, index) => (
                                <div
                                    key={`desktop-${dest.slug}-${index}`}
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-12'}`}
                                >
                                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] border border-white/20 group">
                                        <Image
                                            src={dest.heroImage || '/images/placeholder.svg'}
                                            alt={dest.name}
                                            fill
                                            quality={85}
                                            priority={index === 0}
                                            loading={index === 0 ? "eager" : "lazy"}
                                            sizes="(max-width: 1024px) 100vw, 1200px"
                                            className="object-cover transform-gpu"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                                    </div>
                                </div>
                            ))}

                            {/* Navigation inside image area bottom right */}
                            <div className="absolute bottom-6 right-6 flex gap-2 z-30">
                                <button
                                    onClick={handlePrev}
                                    className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-brand hover:border-brand transition-all duration-300 shadow-lg"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-brand hover:border-brand transition-all duration-300 shadow-lg"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REDESIGNED MOBILE/TABLET LAYOUT - Dynamic Image Background with Minimalist UI overlay */}
                <div className="lg:hidden relative w-full h-full overflow-hidden shadow-sm">
                    {/* Background Image Slider Layer */}
                    <div className="absolute inset-0 z-0">
                        {heroDestinationsState.map((dest, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <Image
                                    src={dest.mobileImage || dest.heroImage}
                                    alt={dest.name}
                                    fill
                                    quality={80}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                    priority={index === 0}
                                />
                                {/* Refined Overlay: Clear on top, dark at bottom for text legibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent" />
                            </div>
                        ))}
                    </div>

                    {/* Mobile Content Layer - Positioned over the background slider */}
                    <div className="relative z-10 h-full flex flex-col justify-between pt-5 pb-6 px-5">
                        {/* Integrated Header Row */}
                        <div className="flex items-center justify-between w-full mb-8">
                            {/* Logo - No Background */}
                            <div className="flex items-center">
                                <Logo className="origin-left" forceDesktop={false} />
                            </div>

                            {/* Action Icons - White Background with proper radius and subtle shadow */}
                            <div className="flex items-center gap-3">
                                {/* Call Icon */}
                                <a
                                    href={`tel:${(settings?.contactPhone || '9587505726').replace(/[^0-9+]/g, '')}`}
                                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1A2326] shadow-md active:scale-95 transition-all outline-none"
                                    aria-label="Call Us"
                                >
                                    <Phone className="w-5 h-5" />
                                </a>

                                {/* Menu Icon */}
                                <button
                                    onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-menu'))}
                                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#1A2326] shadow-md active:scale-95 transition-all outline-none"
                                    aria-label="Open Menu"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content Block pushed towards bottom with a subtle gap */}
                        <div className="flex-1 flex flex-col justify-end pb-10">
                            {/* Personalized Greeting matches user mockup */}
                            <div className="mb-3 transform transition-all duration-700 delay-100 translate-y-0 opacity-100">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h2 className="text-white text-3xl font-bold tracking-tight leading-tight drop-shadow-md max-w-[90%]">
                                        <span>Where Do You Want to Go?</span>
                                    </h2>
                                </div>
                                <p className="text-white/90 text-[13px] font-medium tracking-tight drop-shadow-sm">
                                    <span>Thoughtfully planned trips from<span className="text-[#ffea00] font-semibold">" ₹7,999/- Per Person"</span></span>
                                </p>
                            </div>

                            {/* Repositioned Pill-Style Search Bar - Icon on Right side with subtle shadow */}
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-search'))}
                                className="group w-full h-11 bg-white rounded-lg shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] flex items-center justify-between px-5 active:scale-[0.98] transition-all border border-white/40"
                            >
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    <span className="text-gray-900 text-[13px] font-medium tracking-tight">Search your destination</span>
                                    <span className="text-brand text-[13px] font-semibold truncate text-left">
                                        <span translate="no">"{dynamicPlaceholder}"</span>
                                    </span>
                                </div>
                                <Search className="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" />
                            </button>

                            {/* Pagination Dots - Rounded & Solid White for active, moved further down */}
                            <div className="flex justify-center gap-2 mt-8">
                                {heroDestinationsState.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`transition-all duration-300 rounded-full ${i === activeIndex
                                            ? 'w-1.5 h-1.5 bg-white'
                                            : 'w-1.5 h-1.5 bg-white/30'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


