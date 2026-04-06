"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Destination, Package } from '../../../types';
import { DESTINATIONS, API_BASE_URL } from '../../../constants';
import { PackageCard } from '@/components/PackageCard';
import { FAQSection } from '@/components/FAQSection';
import { DestinationHero } from '../../../components/DestinationHero';
import { DestinationTabs } from '../../../components/DestinationTabs';
import { InquiryWidget } from '../../../components/InquiryWidget';
import {
    MapPin, Clock, Globe, Shield, Sun, BadgeCheck, Plane, Calendar,
    Zap, Sparkles, ArrowRight, ChevronDown, CheckCircle, Search, Star,
    Wallet, Utensils, Phone, Train, X
} from 'lucide-react';
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '../../../components/ui/sheet';
import { DESTINATION_DETAILS, DEFAULT_DESTINATION_DETAIL } from '../../../data/destinationData';

interface DestinationClientProps {
    initialDestination?: any;
    initialPackages?: Package[];
}

export default function DestinationClient({ initialDestination, initialPackages }: DestinationClientProps) {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;
    const [destination, setDestination] = useState<any>(initialDestination || null);
    const [packages, setPackages] = useState<Package[]>(initialPackages || []);
    const [loading, setLoading] = useState(!initialDestination);
    const [error, setError] = useState<string | null>(null);
    const [showMobileForm, setShowMobileForm] = useState(false);
    const [selectedAttraction, setSelectedAttraction] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isNavigating = useRef(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Shift floating buttons up if mobile bar is present
        window.dispatchEvent(new CustomEvent('toggleFloatingButtons', { detail: true }));
        return () => {
            window.dispatchEvent(new CustomEvent('toggleFloatingButtons', { detail: false }));
        };
    }, []);

    // Hide floating icons when mobile inquiry form is open
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('hideFloatingIcons', { detail: showMobileForm }));
    }, [showMobileForm]);

    // Back button trap for mobile form
    useEffect(() => {
        if (showMobileForm) {
            const handlePopState = () => setShowMobileForm(false);
            window.history.pushState({ popup: 'MobileFormDest' }, '');
            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (!isNavigating.current && window.history.state && window.history.state.popup === 'MobileFormDest') {
                    window.history.back();
                }
            };
        }
    }, [showMobileForm]);

    // Filter packages based on the slug/name
    const filterPackages = (allPackages: Package[], destName: string, searchSlug: string) => {
        const normalize = (str: string) => str?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
        const normName = destName.split(',')[0].toLowerCase(); // Use lowercase for comparison
        const normSlug = normalize(searchSlug);

        return allPackages.filter((pkg: Package) => {
            const loc = normalize(pkg.location);
            const title = normalize(pkg.title);

            if (normSlug === 'europe') {
                return ['switzerland', 'france', 'italy', 'spain', 'netherlands', 'germany', 'austria', 'uk', 'greece'].some(country => loc.includes(country));
            }
            return loc.includes(normSlug) || title.includes(normSlug) || loc.includes(normName) || (normSlug.includes(loc) && loc.length > 3);
        });
    };

    useEffect(() => {
        const normalize = (s: string) => s?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
        const searchSlug = normalize(slug);

        // If we already have data from props, ensure it matches the current slug (normalized)
        if (initialDestination && normalize(initialDestination.slug) === searchSlug) {
            setDestination(initialDestination);
            setPackages(initialPackages || []);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch all Destinations to find the current one by slug
                const destRes = await fetch(`${API_BASE_URL}/api/destinations`);
                const allDestinations = await destRes.json();

                // Find matching destination from API
                const searchSlug = normalize(slug);

                // 1. Exact slug match
                let match = allDestinations.find((d: any) => normalize(d.slug) === searchSlug);

                // 2. Exact name match
                if (!match) {
                    match = allDestinations.find((d: any) => normalize(d.name) === searchSlug);
                }

                // 3. Fuzzy match fallback
                if (!match) {
                    match = allDestinations.find((d: any) =>
                        normalize(d.name).includes(searchSlug) ||
                        searchSlug.includes(normalize(d.name))
                    );
                }

                // 2. Fetch Packages
                const timestamp = new Date().getTime();
                const pkgRes = await fetch(`${API_BASE_URL}/api/packages?t=${timestamp}`);
                const allPackages = await pkgRes.json();

                if (match) {
                    setDestination(match);
                    setPackages(filterPackages(allPackages, match.name, slug));
                } else {
                    // Fallback to hardcoded lookup if not found in DB
                    const hardcodedDest = DESTINATIONS.find((d: Destination) =>
                        d.name.toLowerCase().includes(slug?.toLowerCase().replace('-', ' ')) || d.id === slug
                    ) || {
                        id: slug,
                        name: slug?.charAt(0).toUpperCase() + slug?.slice(1).replace('-', ' ') || 'Destination',
                        image: '/images/placeholder.svg',
                        packageCount: 0,
                        startPrice: 25000,
                        startingPrice: 25000
                    };

                    const destKey = Object.keys(DESTINATION_DETAILS).find(k => k === slug || k.includes(slug) || slug.includes(k)) || 'bali-indonesia';
                    const detail = DESTINATION_DETAILS[destKey] || DESTINATION_DETAILS['bali-indonesia'];

                    setDestination({
                        ...hardcodedDest,
                        facts: {
                            currency: detail.currency,
                            language: detail.language,
                            timezone: detail.timezone,
                            bestTime: detail.bestTime,
                            budget: detail.budget,
                            visaInfo: detail.visaInfo,
                            gettingAround: detail.gettingAround,
                            localDish: detail.localDish,
                        },
                        attractions: detail.mustVisitPlaces || [],
                        faqs: detail.faqs || []
                    });
                    setPackages(filterPackages(allPackages, hardcodedDest.name, slug));
                }
            } catch (err: any) {
                console.error("Failed to load destination data", err);
                setError("Unable to load destination details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, initialDestination, initialPackages]);

    if (loading && !destination) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
                    <p className="text-gray-400 text-xs font-medium animate-pulse">Designing your {slug} journey...</p>
                </div>
            </div>
        );
    }

    if (!destination) return null; // Or Not Found component

    const { facts = {}, attractions = [], faqs = [] } = destination;


    return (
        <div className="bg-white min-h-screen font-sans">
            <DestinationHero destination={destination} />

            <DestinationTabs />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-12 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left/Main Column */}
                    <div className="lg:col-span-8 space-y-12">

                        <div id="packages" className="scroll-mt-32">
                            <div className="mb-8 border-l-4 border-brand pl-4">
                                <p className="text-[10px] font-bold text-brand tracking-wider mb-1.5">
                                    Curated itineraries
                                </p>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                                    {destination.name} Tour packages <span className="text-gray-400 font-normal ml-2 text-base md:text-lg">({packages.length})</span>
                                </h2>
                            </div>
                            <div className="flex lg:flex-col gap-3 md:gap-6 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 snap-x snap-mandatory no-scrollbar px-1 relative z-10 transition-opacity duration-500">
                                {loading ? (
                                    <>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-[calc((100vw-40px)/1.92)] lg:w-full aspect-[4/5] lg:aspect-[21/9] bg-gray-50 animate-pulse rounded-lg shrink-0 snap-start" />
                                        ))}
                                    </>
                                ) : error ? (
                                    <div className="w-full p-10 text-center bg-brand-light/5 rounded-[32px] border border-brand-light/10 flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand mb-4">
                                            <Zap className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Connection Issue</h3>
                                        <p className="text-gray-600 mb-8 max-w-sm text-sm font-medium">{error}</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="px-8 py-3 bg-white border-2 border-brand-light/10 rounded-xl text-sm font-bold text-brand hover:bg-brand-light/5 transition-all active:scale-95"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : packages.length > 0 ? (
                                    packages.map((pkg: Package) => (
                                        <div key={pkg._id || pkg.id} className="w-[calc((100vw-40px)/1.3)] lg:w-full shrink-0 snap-start transition-all duration-300">
                                            <PackageCard pkg={pkg} variant={(!mounted || isMobile) ? "vertical" : "horizontal"} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full p-16 text-center bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-100">
                                        <p className="text-gray-600 mb-6 text-sm font-semibold">No packages available for {destination.name} right now.</p>
                                        <button
                                            onClick={() => router.push('/')}
                                            className="bg-brand text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-brand/10 hover:bg-brand-dark transition-all"
                                        >
                                            View All Collections
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Places to Visit */}
                        <div id="places" className="scroll-mt-32">
                            <div className="mb-8 border-l-4 border-brand pl-4">
                                <p className="text-[10px] font-bold text-brand tracking-wider mb-1.5">
                                    Explore top local gems
                                </p>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
                                    Must visit places
                                </h2>
                            </div>
                            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar gap-6 pb-6 md:pb-0 px-1">
                                {attractions.map((place: any, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedAttraction(place)}
                                        className="group relative rounded-xl md:rounded-2xl overflow-hidden aspect-[16/11] md:aspect-[16/10] shadow-sm hover:shadow-2xl hover:shadow-brand/20 transition-all duration-500 cursor-pointer shrink-0 snap-start w-[85%] md:w-full border border-gray-100/10 md:border-none"
                                    >
                                        <Image
                                            src={place.image}
                                            alt={place.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-0 left-0 p-5 md:p-8 w-full translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="w-5 h-0.5 bg-brand rounded-full" />
                                                <span className="text-white/60 text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] leading-none">Must visit</span>
                                            </div>
                                            <h4 className="text-white font-bold text-lg md:text-2xl leading-tight tracking-tight">{place.name}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Attraction Detail Sheet */}
                            <Sheet open={!!selectedAttraction} onOpenChange={(open) => !open && setSelectedAttraction(null)}>
                                <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden border-l-0 sm:border-l sm:border-gray-100 shadow-2xl">
                                    <SheetHeader className="sr-only">
                                        <SheetTitle>{selectedAttraction?.name || 'Attraction Details'}</SheetTitle>
                                        <SheetDescription>
                                            Detailed information about {selectedAttraction?.name}
                                        </SheetDescription>
                                    </SheetHeader>
                                    {selectedAttraction && (
                                        <div className="h-full flex flex-col bg-white">
                                            {/* Header Image Section */}
                                            <div className="relative h-[220px] md:h-[300px] shrink-0 overflow-hidden group">
                                                <Image
                                                    src={selectedAttraction.image}
                                                    alt={selectedAttraction.name}
                                                    fill
                                                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                {/* Close button */}
                                                <div className="absolute top-4 right-4 z-[100]">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedAttraction(null);
                                                        }}
                                                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-black/60 transition-all duration-300 shadow-xl"
                                                        aria-label="Close attraction details"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="absolute bottom-8 left-8 right-8">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/20 tracking-wider">
                                                            Must visit
                                                        </span>
                                                    </div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
                                                        {selectedAttraction.name}
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                                                <div className="space-y-10">
                                                    {/* Description */}
                                                    <section>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                                                            <h3 className="text-[10px] font-bold text-brand tracking-wider">The experience</h3>
                                                        </div>
                                                        <p className="text-gray-600 leading-[1.85] text-[13px] md:text-sm whitespace-pre-line">
                                                            {selectedAttraction.description || selectedAttraction.desc}
                                                        </p>
                                                    </section>

                                                    {/* Highlights/Must Try */}
                                                    {selectedAttraction.mustTry && selectedAttraction.mustTry.length > 0 && (
                                                        <section>
                                                            <h3 className="text-[11px] md:text-xs font-semibold text-gray-400">Highlights & activities</h3>
                                                            <div className="grid grid-cols-1 gap-3">
                                                                {selectedAttraction.mustTry.map((activity: string, idx: number) => (
                                                                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-sm transition-all duration-300">
                                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand shadow-sm shrink-0">
                                                                            <Star className="w-4 h-4 fill-current" />
                                                                        </div>
                                                                        <span className="text-sm font-semibold text-gray-700">
                                                                            {activity}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </section>
                                                    )}

                                                    {/* Location/Quick Info (Optional addition for depth) */}
                                                    <section className="p-6 bg-brand-light/5 rounded-3xl border border-brand-light/10">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-brand shadow-sm shrink-0">
                                                                <MapPin className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-semibold text-gray-900">Plan with Yatravi</h4>
                                                                <p className="text-[11px] text-gray-600 font-medium">Expert guidance to {selectedAttraction.name}</p>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="p-8 bg-white border-t border-gray-50">
                                                <button
                                                     onClick={() => {
                                                        setSelectedAttraction(null);
                                                        window.dispatchEvent(new CustomEvent('toggleInquiryPopup', { 
                                                            detail: { 
                                                                source: 'Destination: Attraction', 
                                                                packageTitle: destination?.name,
                                                                title: `Inquiry for ${selectedAttraction?.name} (${destination?.name})`
                                                            } 
                                                        }));
                                                    }}
                                                    className="w-full group relative overflow-hidden py-4 bg-brand text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-brand/20 active:scale-95"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        Inquire About This Place
                                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Overview / Essentials */}
                        <div id="overview" className="scroll-mt-32 pt-4">
                            <div className="space-y-8">
                                <div className="mb-8 border-l-4 border-brand pl-4">
                                    <p className="text-[10px] font-bold text-brand tracking-wider mb-1.5">
                                        Useful details
                                    </p>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                        Essential information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-7 py-4 px-1">
                                    {[
                                        { icon: Calendar, label: 'When to Visit', value: facts.bestTime || 'Year Round' },
                                        { icon: Sun, label: 'Weather', value: facts.weather || 'Tropical' },
                                        { icon: Plane, label: 'How to Reach', value: facts.howToReach || 'Direct Flight' },
                                        { icon: Wallet, label: 'Avg. Cost', value: facts.budget || 'Variable' },
                                        { icon: Sparkles, label: 'Currency', value: facts.currency || 'USD' },
                                        { icon: BadgeCheck, label: 'Visa Entry', value: facts.visaInfo || 'Check Requirements' },
                                        { icon: Train, label: 'Getting Around', value: facts.gettingAround || 'Local Transport' },
                                        { icon: Globe, label: 'Language', value: facts.language || 'English' },
                                        { icon: Utensils, label: 'Must Try Dish', value: facts.localDish || 'Local Cuisine' },
                                        { icon: Clock, label: 'Timezone', value: facts.timezone || 'GMT +5:30' },
                                        { icon: Shield, label: 'Emergency', value: facts.emergencyNumber || '112/100' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="group flex flex-col border-l border-gray-100 pl-4 py-1.5 transition-all">
                                            <div className="flex items-center gap-1.5 mb-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <item.icon className="w-3 h-3 text-gray-500" />
                                                <span className="text-[9px] font-medium text-gray-500 uppercase tracking-widest leading-none">{item.label}</span>
                                            </div>
                                            <div className="text-[13.5px] md:text-[14px] font-medium text-gray-700 lowercase capitalize-first leading-snug">
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div id="reviews" className="scroll-mt-32">
                            <div className="mb-8 border-l-4 border-brand pl-4">
                                <p className="text-[10px] font-bold text-brand tracking-wider mb-1.5">
                                    What explorers say
                                </p>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                                    Traveler reviews
                                </h2>
                            </div>

                            <div className="flex md:grid md:grid-cols-2 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar gap-4 pb-4 md:pb-0">
                                <div className="group p-6 rounded-lg bg-gray-50/30 border border-gray-100/50 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shrink-0 snap-start w-[85%] md:w-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex text-brand scale-90 -ml-1 opacity-80">
                                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-500 tracking-widest">Amazing experience</span>
                                    </div>
                                    <p className="text-gray-600 text-[14px] leading-relaxed italic font-medium group-hover:text-gray-900 transition-colors">
                                        "The trip was perfectly organized. Every detail was taken care of. Highly recommend!"
                                    </p>
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                        <div className="w-6 h-0.5 bg-brand rounded-full opacity-30" />
                                        <p className="text-[11px] font-semibold text-gray-600">Sarah J., London</p>
                                    </div>
                                </div>

                                <div className="group p-6 rounded-lg bg-gray-50/30 border border-gray-100/50 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 shrink-0 snap-start w-[85%] md:w-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex text-brand scale-90 -ml-1 opacity-80">
                                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-600 tracking-widest">Unforgettable</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed italic font-sans mb-4 group-hover:text-gray-900 transition-colors">
                                        "Review placeholder for {destination.name}."
                                    </p>
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                        <div className="w-6 h-0.5 bg-brand rounded-full opacity-30" />
                                        <p className="text-[11px] font-semibold text-gray-600">Michael R., New York</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div id="faq" className="scroll-mt-32 pt-10">
                            <FAQSection faqData={faqs} noContainer />
                        </div>


                    </div>

                    {/* Right/Sidebar Column - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-4 relative">
                        <div className="sticky top-24 space-y-6 pb-10">
                            <InquiryWidget 
                                packageTitle={destination?.name} 
                                source="Destination Page" 
                                title={`Inquiry for ${destination?.name}`}
                            />

                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                                <h3 className="font-semibold text-gray-800 mb-4">Why Book With Us?</h3>
                                <ul className="space-y-5">
                                    <li className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-brand-light/10 flex items-center justify-center shrink-0 text-brand">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-800">Verified Agents</h4>
                                            <p className="text-xs text-gray-500 tracking-tight">All our partners are strictly verified.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-brand-light/10 flex items-center justify-center shrink-0 text-brand">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-800">Top Rated Packages</h4>
                                            <p className="text-xs text-gray-500 tracking-tight">4.8+ Star Rating on 5000+ reviews.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-brand-light/10 flex items-center justify-center shrink-0 text-brand">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-800">24/7 Support</h4>
                                            <p className="text-xs text-gray-600">Dedicated support on trip.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-600 font-semibold tracking-widest leading-none mb-1">Plan your trip</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold tracking-tight text-brand">To {destination.name}</span>
                    </div>
                </div>
                <button
                    onClick={() => setShowMobileForm(true)}
                    className="bg-brand text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md hover:bg-brand-dark transition-colors"
                >
                    Inquire Now
                </button>
            </div>

            {/* Refined Mobile Form - Bottom Drawer (Integrated Design) */}
            {showMobileForm && (
                <div className="lg:hidden fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
                    <div className="relative w-full max-h-[85vh] animate-in slide-in-from-bottom-full duration-500">
                        <div className="rounded-t-xl overflow-hidden shadow-2xl-up">
                            <InquiryWidget
                                title={`Planning a ${destination.name} Trip?`}
                                onClose={() => setShowMobileForm(false)}
                                packageTitle={destination.name}
                                source="Destination Page"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
