"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package } from '../../../types';
import { API_BASE_URL } from '../../../constants';
import { Star, MapPin, Clock, CheckCircle, XCircle, X, Shield, ArrowRight, User, Mail, Phone, Calendar, Users, Plane, Car, BedDouble, Coffee, Camera, Info, Map, ShieldCheck, Utensils, Share2, MessageCircle, AlertCircle, RotateCcw, CreditCard, Plus, Minus, TrendingUp, ChevronDown } from 'lucide-react';
import ShareButton from '../../../components/ShareButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { FAQSection } from '@/components/FAQSection';
import { InquiryWidget } from '@/components/InquiryWidget';

interface PackageClientProps {
    initialPkg: Package | null;
}

export default function PackageClient({ initialPkg }: PackageClientProps) {
    const router = useRouter();

    // Initialize state with passed prop. If null, we might show not found or loading (though server handles 404 usually)
    const [pkg, setPkg] = useState<Package | null>(initialPkg);
    const loading = false; // No longer loading initial data

    const [expandedDays, setExpandedDays] = useState<number[]>([0]); // Day 1 expanded by default
    const [activeSection, setActiveSection] = useState('overview');
    const [isSticky, setIsSticky] = useState(false);
    const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
    const stickyRef = useRef<HTMLDivElement>(null);
    const [showGallery, setShowGallery] = useState(false);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(1);
    const heroScrollRef = useRef<HTMLDivElement>(null);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const handleImageLoad = (key: string) => {
        setLoadedImages(prev => ({ ...prev, [key]: true }));
    };

    // Manual Sticky Trigger & Sticky Bar Visibility
    const [showStickyBar, setShowStickyBar] = useState(true);
    useEffect(() => {
        const handleScroll = () => {
            if (stickyRef.current) {
                // Threshold is the original top position of the placeholder minus the header height
                const threshold = stickyRef.current.offsetTop - 70;
                setIsSticky(window.scrollY > threshold);
            }

            // Footer-awareness for bottom sticky bar
            const scrollPos = window.scrollY;
            const windowHeight = window.innerHeight;
            const totalHeight = document.documentElement.scrollHeight;
            const isNearFooter = (scrollPos + windowHeight) > (totalHeight - 600);
            setShowStickyBar(!isNearFooter);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle mobile hero scroll for indicator
    const handleHeroScroll = () => {
        if (heroScrollRef.current) {
            const scrollLeft = heroScrollRef.current.scrollLeft;
            const width = heroScrollRef.current.offsetWidth;
            const index = Math.round(scrollLeft / width) + 1;
            setCurrentHeroIndex(index);
        }
    };
    const [travelDate, setTravelDate] = useState<Dayjs | null>(null);
    const [selectedTour, setSelectedTour] = useState<any | null>(null);
    const [paxCount, setPaxCount] = useState<number>(2);
    const [showMobileForm, setShowMobileForm] = useState(false);
    const isNavigating = useRef(false);

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

    // Back button trackers
    useEffect(() => {
        if (showMobileForm) {
            const handlePopState = () => {
                setShowMobileForm(false);
                if (typeof document !== 'undefined') (document.activeElement as HTMLElement)?.blur();
            };
            window.history.pushState({ popup: 'MobileFormPkg' }, '');
            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (window.history.state && window.history.state.popup === 'MobileFormPkg') {
                    window.history.back();
                }
                if (typeof document !== 'undefined') (document.activeElement as HTMLElement)?.blur();
            };
        }
    }, [showMobileForm]);

    useEffect(() => {
        if (showGallery) {
            const handlePopState = () => {
                setShowGallery(false);
                if (typeof document !== 'undefined') (document.activeElement as HTMLElement)?.blur();
            };
            window.history.pushState({ popup: 'GalleryPkg' }, '');
            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (window.history.state && window.history.state.popup === 'GalleryPkg') {
                    window.history.back();
                }
                if (typeof document !== 'undefined') (document.activeElement as HTMLElement)?.blur();
            };
        }
    }, [showGallery]);

    useEffect(() => {
        if (selectedTour) {
            const handlePopState = () => {
                setSelectedTour(null);
                if (typeof document !== 'undefined') (document.activeElement as HTMLElement)?.blur();
            };
            window.history.pushState({ popup: 'TourDetailsPkg' }, '');
            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (window.history.state && window.history.state.popup === 'TourDetailsPkg') {
                    window.history.back();
                }
                if (typeof document !== 'undefined') (document.activeElement as HTMLElement)?.blur();
            };
        }
    }, [selectedTour]);

    // Countdown timer logic (unchanged)
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
    const [showOverviewButton, setShowOverviewButton] = useState(false);
    const overviewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (overviewRef.current && !isOverviewExpanded) {
            // Check if scrollHeight > clientHeight (means text is clamped)
            // Height for 3 lines at 1.8 leading is approx 72-76px
            const isClamped = overviewRef.current.scrollHeight > overviewRef.current.clientHeight;
            setShowOverviewButton(isClamped);
        }
    }, [pkg?.overview, isOverviewExpanded]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['overview', 'itinerary', 'policies', 'faq'];
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [enquirySuccess, setEnquirySuccess] = useState(false);

    // handleInquirySubmit is now handled by InquiryWidget component

    // Dummy fallback data
    const fallbackData = {
        overview: `Experience the ultimate adventure with this carefully curated travel package. From breathtaking landscapes to vibrant local culture, every moment is designed to create lasting memories.`,
        highlights: ['Visit iconic landmarks', 'Comfortable accommodation', 'Professional guide', 'Authentic cuisine'],
        itinerary: [],
        inclusions: ['Accommodation', 'Breakfast', 'Transfers', 'Sightseeing'],
        exclusions: ['Flights', 'Visa', 'Personal expenses'],
        gallery: [],
        thingsToPack: ['Sunscreen', 'Comfortable Shoes', 'Camera', 'ID'],
        policies: {
            cancellation: 'Cancellation 30 days before departure: Full refund minus fee.',
            refund: 'Refunds processed within 7-10 business days.',
            payment: '50% advance payment required.'
        },
        faqs: []
    };

    if (!pkg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Package Not Found</h2>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark shadow-lg shadow-brand/20 transition-all font-bold"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const packageData = {
        ...pkg,
        overview: pkg.overview || fallbackData.overview,
        highlights: pkg.highlights?.length ? pkg.highlights : fallbackData.highlights,
        itinerary: pkg.itinerary?.length ? pkg.itinerary : fallbackData.itinerary,
        inclusions: pkg.inclusions?.length ? pkg.inclusions : fallbackData.inclusions,
        exclusions: pkg.exclusions?.length ? pkg.exclusions : fallbackData.exclusions,
        gallery: pkg.gallery?.length ? pkg.gallery : [pkg.image || '/images/placeholder.svg'],
        thingsToPack: (pkg as any).thingsToPack?.length ? (pkg as any).thingsToPack : fallbackData.thingsToPack,
        policies: (pkg as any).policies?.cancellation ? (pkg as any).policies : fallbackData.policies,
        faqs: (pkg as any).faqs?.length ? (pkg as any).faqs : fallbackData.faqs,
        duration: pkg.duration || 6,
        groupSize: pkg.groupSize || '2-15 People',
        rating: pkg.rating || 4.8,
        reviewsCount: pkg.reviewsCount || 128,
        price: pkg.price || 29999,
        originalPrice: pkg.originalPrice || 39999,
        title: pkg.title || 'Amazing Travel Package',
        location: pkg.location || 'Multiple Destinations',
        image: pkg.image || '/images/placeholder.svg'
    };

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800 selection:bg-brand/10">
            {/* 1. Thrillophilia-Style Minimalist Hero (Full Width) */}
            <section className="relative w-full h-[40vh] md:h-[45vh] lg:h-[60vh] min-h-[300px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden bg-gray-50">
                <div className="flex lg:grid lg:grid-cols-12 gap-0.5 h-full w-full">
                    {/* Swipable Mobile Hero / Main Desktop View */}
                    <div
                        ref={heroScrollRef}
                        onScroll={handleHeroScroll}
                        className="w-full lg:col-span-9 flex overflow-x-auto snap-x snap-mandatory no-scrollbar lg:overflow-hidden lg:block h-full relative"
                    >
                        {packageData.gallery.map((img: string, idx: number) => (
                            <div key={idx} className="min-w-full h-full relative snap-start snap-stop-always shrink-0 lg:absolute lg:inset-0 lg:hidden first:lg:block">
                                <Image
                                    src={img || packageData.image}
                                    alt={`Gallery View ${idx + 1}`}
                                    fill
                                    quality={80}
                                    className="object-cover"
                                    priority={idx === 0}
                                    sizes="(max-width: 1024px) 100vw, 840px"
                                />
                                {/* Mobile Image Overlay */}
                                <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Side Stack */}
                    <div className="hidden lg:flex lg:col-span-3 flex-col gap-0.5 h-full">
                        <div className="relative flex-1 overflow-hidden">
                            <Image 
                                src={packageData.gallery[1] || packageData.image} 
                                alt="Detail" 
                                fill 
                                quality={80} 
                                sizes="33vw" 
                                onLoadingComplete={() => handleImageLoad('side-1')}
                                className={`object-cover transition-all duration-500 img-blur-reveal ${loadedImages['side-1'] ? 'img-reveal-complete' : ''}`} 
                            />
                        </div>
                        <div className="relative flex-1 overflow-hidden">
                            <Image 
                                src={packageData.gallery[2] || packageData.image} 
                                alt="Detail" 
                                fill 
                                quality={80} 
                                sizes="33vw" 
                                onLoadingComplete={() => handleImageLoad('side-2')}
                                className={`object-cover transition-all duration-500 img-blur-reveal ${loadedImages['side-2'] ? 'img-reveal-complete' : ''}`} 
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile/Tablet Scroll Indicator */}
                <div className="lg:hidden absolute bottom-5 left-5 z-10">
                    <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-2">
                        <span>{currentHeroIndex} / {packageData.gallery.length}</span>
                    </div>
                </div>

                {/* Desktop Content Overlay (Immersive on Desktop, Hidden on Mobile) */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute inset-x-0 bottom-0 pb-12 lg:pb-16">
                        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full group">
                            {/* Breadcrumbs */}
                            <nav className="text-[10px] md:text-[11px] text-white/80 flex items-center gap-1.5 font-medium tracking-wide mb-4 font-sans">
                                <span className="hover:text-white transition-opacity cursor-pointer" onClick={() => router.push('/')}>Home</span>
                                <span className="text-white/30">/</span>
                                <span className="hover:text-white transition-opacity cursor-pointer">Packages</span>
                                <span className="text-white/30">/</span>
                                <span className="text-white relative top-px">{packageData.title}</span>
                            </nav>

                            <div className="flex flex-col gap-4 lg:gap-5">
                                <div className="flex items-center gap-4">
                                    <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] lg:text-[11px] font-medium px-4 py-1.5 rounded-full tracking-wider font-sans">
                                        {packageData.duration} Days
                                    </span>
                                    <div className="flex items-center gap-1.5 text-white/90 font-sans">
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                        <span className="font-medium text-sm tracking-tight">{packageData.rating}</span>
                                        <span className="text-white/60 text-[10px] font-medium tracking-wider ml-1">({packageData.reviewsCount || 128} Reviews)</span>
                                    </div>
                                </div>
                                {/* Status Badges - Desktop (Refinement) */}
                                <div className="flex flex-wrap gap-2.5 animate-fade-up [animation-delay:150ms]">
                                    {packageData.groupSize && packageData.groupSize.toLowerCase().includes('fixed') && (
                                        <span className="bg-white/15 backdrop-blur-md text-white text-[9px] lg:text-[10px] font-bold px-4 py-2 rounded-md shadow-xl flex items-center gap-2 tracking-[0.08em] border border-white/30 transition-all hover:bg-white/20 font-sans">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Fixed Departure {packageData.validityDate && <span className="opacity-60 ml-1.5 font-medium lowercase tracking-normal">· {packageData.validityDate}</span>}</span>
                                        </span>
                                    )}
                                    {packageData.isBestSeller && (
                                        <span className="bg-[#fb5012] text-white text-[9px] lg:text-[10px] font-bold px-4 py-2 rounded-md shadow-[0_8px_25px_rgba(251,80,18,0.2)] flex items-center gap-2 tracking-[0.08em] border border-white/20 transition-all hover:scale-105 font-sans">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            Best Seller
                                        </span>
                                    )}
                                    {packageData.isTrending && (
                                        <span className="bg-blue-600 text-white text-[9px] lg:text-[10px] font-bold px-4 py-2 rounded-md shadow-[0_8px_25px_rgba(37,99,235,0.2)] flex items-center gap-2 tracking-[0.08em] border border-white/20 transition-all hover:scale-105 font-sans">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            Trending Now
                                        </span>
                                    )}
                                    {packageData.isAlmostFull && (
                                        <span className="bg-red-600 text-white text-[9px] lg:text-[10px] font-bold px-4 py-2 rounded-md shadow-[0_8px_25px_rgba(220,38,38,0.2)] flex items-center gap-2 tracking-[0.08em] border border-white/20 transition-all hover:scale-105 font-sans">
                                            <Users className="w-3.5 h-3.5" />
                                            Almost Full
                                        </span>
                                    )}
                                    {packageData.tags && packageData.tags.map((tag: string, idx: number) => (
                                        <span key={idx} className="bg-white/10 backdrop-blur-md text-white/90 text-[9px] lg:text-[10px] font-bold px-4 py-2 rounded-md shadow-lg border border-white/20 tracking-[0.08em] font-sans hover:bg-white/15 transition-all">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-6xl font-sans font-semibold text-white tracking-tight leading-[1.15] drop-shadow-xl max-w-3xl animate-fade-up [animation-delay:200ms]">
                                    {packageData.title}
                                </h1>

                                {/* Brand-Refined Stats Bar (Desktop) */}
                                <div className="flex flex-wrap items-center gap-4 animate-fade-up [animation-delay:300ms]">
                                    {/* Pickup & Drop Info Card */}
                                    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-2.5 pr-6 shadow-xl group transition-all duration-300">
                                        <div className="bg-gray-50 p-2.5 rounded-xl text-gray-900 transition-all shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-medium text-[#64748b] uppercase tracking-widest leading-none mb-1.5">Pickup & Drop</p>
                                            <p className="text-sm font-semibold text-[#0f172a] leading-none">
                                                {packageData.pickupPoint || packageData.location.split(',')[0]} - {packageData.dropPoint || packageData.location.split(',')[0]}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Duration Info Card */}
                                    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-2.5 pr-6 shadow-xl group transition-all duration-300">
                                        <div className="bg-gray-50 p-2.5 rounded-xl text-gray-900 transition-all shrink-0">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest leading-none mb-1.5">Duration</p>
                                            <p className="text-sm font-semibold text-[#0f172a] leading-none">
                                                {packageData.duration - 1}N - {packageData.duration}D
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Region Breakdown Highlight Bar (Desktop) */}
                                {packageData.regionBreakdown && packageData.regionBreakdown.trim() !== '' && (
                                    <div className="flex items-center gap-2 py-1.5 px-5 bg-white/[0.03] backdrop-blur-sm border border-white/20 rounded-full mt-1 w-fit animate-fade-up [animation-delay:400ms]">
                                        <p className="text-[11px] lg:text-[12px] text-white/90 font-medium tracking-wide">
                                            {packageData.regionBreakdown.split(/[•|·]| - /).map((part, i) => (
                                                <React.Fragment key={i}>
                                                    {part.trim().split(/(\d+[Nn])/).map((subPart, j) =>
                                                        /^\d+[Nn]$/.test(subPart) ? <span key={j} className="font-bold text-white text-[13px]">{subPart}</span> : <span key={j} className="opacity-80">{subPart}</span>
                                                    )}
                                                    {i < (packageData.regionBreakdown?.split(/[•|·]| - /).length || 0) - 1 && <span className="mx-3 opacity-30">•</span>}
                                                </React.Fragment>
                                            ))}
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-center gap-8 pt-2">
                                    <div className="flex items-center gap-2 text-white/90 font-sans">
                                        <MapPin className="w-4 h-4 text-white" />
                                        <span className="text-[10px] md:text-[11px] font-medium tracking-wider">{packageData.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 font-sans">
                                        <Clock className="w-4 h-4 text-white" />
                                        <span className="text-[10px] md:text-[11px] font-medium tracking-wider whitespace-nowrap">Bespoke Local Experience</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Gallery Toggle (All Views) */}
                <div className="absolute bottom-6 right-6 z-10">
                    <button
                        onClick={() => setShowGallery(true)}
                        className="bg-black/80 backdrop-blur-md text-white px-5 py-2.5 rounded-xl text-[10px] md:text-[11px] font-bold tracking-wider flex items-center gap-2.5 shadow-2xl hover:bg-black transition-all duration-300 border border-white/10 group"
                    >
                        <Camera className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
                        <span>{packageData.gallery.length}+ Photos</span>
                    </button>
                </div>
            </section>

            <div className="md:hidden bg-white border-b border-gray-100 py-5 font-sans">
                <div className="px-5">
                    <nav className="text-[10px] text-slate-500 flex items-center gap-2 font-medium tracking-wide mb-3">
                        <span onClick={() => router.push('/')}>Home</span>
                        <span className="opacity-30">/</span>
                        <span>Packages</span>
                    </nav>
                    <div className="flex flex-col gap-2 mb-3">
                        {/* Status Badges - Mobile (Refinement) */}
                        <div className="flex flex-wrap gap-2 w-full mb-1">
                            {packageData.groupSize && packageData.groupSize.toLowerCase().includes('fixed') && (
                                <div className="bg-orange-50 text-[#fb5012] text-[9px] font-bold px-2 py-1 rounded-md shadow-sm border border-orange-100/50 flex items-center gap-1 tracking-[0.08em] font-sans">
                                    <Calendar className="w-2.5 h-2.5" />
                                    <span>Fixed Departure {packageData.validityDate && <span className="opacity-60 ml-1 font-medium lowercase tracking-tight">· {packageData.validityDate}</span>}</span>
                                </div>
                            )}
                            {packageData.isBestSeller && (
                                <div className="bg-[#fb5012] text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 tracking-[0.08em] font-sans">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    Best Seller
                                </div>
                            )}
                            {packageData.isTrending && (
                                <div className="bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 tracking-[0.08em] font-sans">
                                    <TrendingUp className="w-2.5 h-2.5" />
                                    Trending
                                </div>
                            )}
                            {packageData.isAlmostFull && (
                                <div className="bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 tracking-[0.08em] font-sans">
                                    <Users className="w-2.5 h-2.5" />
                                    Almost Full
                                </div>
                            )}
                            {packageData.tags && packageData.tags.map((tag: string, idx: number) => (
                                <div key={idx} className="bg-gray-50 text-gray-600 text-[9px] font-bold px-2 py-1 rounded-md border border-gray-100 tracking-[0.08em] font-sans">
                                    {tag}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <div className="text-[22px] md:text-2xl font-semibold text-gray-900 leading-tight tracking-tight pr-4">{packageData.title}</div>

                            {/* Rating (Compact - Top Right for Mobile) */}
                            <div className="flex items-center gap-1.5 bg-yellow-50/50 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-100 text-[10px] font-bold shrink-0 mt-1 shadow-sm">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{packageData.rating}</span>
                            </div>
                        </div>
                    </div>

                    {/* Region Breakdown Highlight Bar (Mobile) */}
                    {packageData.regionBreakdown && packageData.regionBreakdown.trim() !== '' && (
                        <div className="flex items-center gap-1.5 py-1.5 px-3 bg-orange-50/80 border border-orange-100/50 rounded-xl mb-4 w-fit">
                            <p className="text-[10px] md:text-[11px] text-gray-600 font-medium flex-wrap">
                                {packageData.regionBreakdown.split(/[•|·]| - /).map((part, i) => (
                                    <React.Fragment key={i}>
                                        {part.trim().split(/(\d+[Nn])/).map((subPart, j) =>
                                            /^\d+[Nn]$/.test(subPart) ? <span key={j} className="font-bold text-gray-900">{subPart}</span> : subPart
                                        )}
                                        {i < (packageData.regionBreakdown?.split(/[•|·]| - /).length || 0) - 1 && <span className="mx-2 text-gray-300">•</span>}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                    )}
                    {/* High-End Stats Bar (Yatravi Signature Style) */}
                    <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:items-center">
                        {/* Pickup & Drop Info Card */}
                        <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl p-2.5 pr-4 shadow-sm group transition-all duration-300">
                            <div className="bg-gray-50 p-2 rounded-xl text-gray-900 shrink-0">
                                <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[8px] font-medium text-slate-500 uppercase tracking-widest leading-none mb-1">Pickup & Drop</p>
                                <p className="text-[11px] font-semibold text-[#0f172a] leading-none truncate pr-1">
                                    {packageData.pickupPoint || packageData.location.split(',')[0]} - {packageData.dropPoint || packageData.location.split(',')[0]}
                                </p>
                            </div>
                        </div>

                        {/* Duration Info Card */}
                        <div className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl p-2.5 pr-4 shadow-sm group transition-all duration-300">
                            <div className="bg-gray-50 p-2 rounded-xl text-gray-900 shrink-0">
                                <Clock className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <p className="text-[8px] font-medium text-slate-500 uppercase tracking-widest leading-none mb-1">Duration</p>
                                <p className="text-[11px] font-semibold text-[#0f172a] leading-none whitespace-nowrap">
                                    {packageData.duration - 1}N - {packageData.duration}D
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>



            {/* Tab Bar Placeholder (Prevents Layout Jumps) */}
            <div ref={stickyRef} className="h-14">
                <div className={`${isSticky
                    ? 'fixed top-0 left-0 right-0 z-40 shadow-md border-b border-gray-100 lg:border-white/10'
                    : 'relative border-b border-gray-100 lg:border-white/10'} 
                    bg-white/95 lg:bg-brand-dark backdrop-blur-md`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-8 md:gap-10 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'itinerary', label: 'Itinerary' },
                                { id: 'inclusions', label: 'Inclusions' },
                                { id: 'exclusions', label: 'Exclusions' },
                                { id: 'faq', label: 'FAQ' },
                                { id: 'policies', label: 'Policies' },
                                { id: 'things-to-pack', label: 'Packing List' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        const element = document.getElementById(tab.id);
                                        if (element) {
                                            const finalOffset = -140; // 70 header + 50 tabs + 20 buffer
                                            if (window.ytvLenis) {
                                                window.ytvLenis.scrollTo(element, { 
                                                    offset: finalOffset, 
                                                    duration: 1.2,
                                                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                                                });
                                            } else {
                                                const bodyRect = document.body.getBoundingClientRect().top;
                                                const elementRect = element.getBoundingClientRect().top;
                                                const elementPosition = elementRect - bodyRect;
                                                const offsetPosition = elementPosition + finalOffset;
                                                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                                            }
                                        }
                                        setActiveSection(tab.id);
                                    }}
                                    className={`py-4 text-[13px] md:text-[14px] font-semibold tracking-tight whitespace-nowrap border-b-2 transition-all duration-300 ${activeSection === tab.id
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

            {/* 4. Main Content 2-Column Grid */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Column (Content) */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-10">
                        <div id="overview" className="scroll-mt-32 space-y-10 md:space-y-12">
                            {/* Highlights Section */}
                            {packageData.inclusionHighlights && packageData.inclusionHighlights.length > 0 && (
                                <div>
                                    <div className="border-l-4 border-brand pl-4 mb-6">
                                        <p className="text-[10px] font-bold text-brand tracking-wider mb-1.5">Key features</p>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Package highlights</h2>
                                    </div>
                                    {/* Highlights Grid - Minimalist B&W Cards */}
                                    <div className="pb-2">
                                        {/* Mobile: 4-Column Grid of Individual Cards */}
                                        <div className="grid grid-cols-4 lg:hidden gap-2">
                                            {packageData.inclusionHighlights.map((highlight: string, idx: number) => {
                                                const iconMap: Record<string, { icon: any, label: string }> = {
                                                    'flight': { icon: Plane, label: 'Flights' },
                                                    'stay': { icon: BedDouble, label: 'Stay' },
                                                    'transfer': { icon: Car, label: 'Transfers' },
                                                    'breakfast': { icon: Coffee, label: 'Meals' },
                                                    'sightseeing': { icon: Camera, label: 'Sightseeing' },
                                                    'visa': { icon: Map, label: 'Visa' },
                                                    'insurance': { icon: ShieldCheck, label: 'Insurance' }
                                                };
                                                const mapped = iconMap[highlight];
                                                if (!mapped) return null;

                                                const Icon = mapped.icon;
                                                return (
                                                    <div key={idx} className="flex flex-col items-center justify-center gap-1 bg-white border border-gray-100 rounded-xl p-1.5 px-0.5 shadow-sm transition-all group">
                                                        <div className="bg-slate-800 p-1 rounded-lg text-white transition-all">
                                                            <Icon className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="text-[8px] font-semibold text-[#0f172a] tracking-tight text-center">{mapped.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Desktop: Single Unified Landscape Bar - Max 6 per line, wrapped */}
                                        <div className="hidden lg:grid lg:grid-cols-6 gap-x-10 gap-y-6 w-fit max-w-full py-2 cursor-default">
                                            {packageData.inclusionHighlights.map((highlight: string, idx: number) => {
                                                const iconMap: Record<string, { icon: any, label: string }> = {
                                                    'flight': { icon: Plane, label: 'Flights' },
                                                    'stay': { icon: BedDouble, label: 'Stay' },
                                                    'transfer': { icon: Car, label: 'Transfers' },
                                                    'breakfast': { icon: Coffee, label: 'Meals' },
                                                    'sightseeing': { icon: Camera, label: 'Sightseeing' },
                                                    'visa': { icon: Map, label: 'Visa' },
                                                    'insurance': { icon: ShieldCheck, label: 'Insurance' }
                                                };
                                                const mapped = iconMap[highlight];
                                                if (!mapped) return null;

                                                const Icon = mapped.icon;
                                                return (
                                                    <div key={idx} className="flex items-center gap-3 group/item shrink-0">
                                                        <div className="bg-slate-800 p-2 rounded-xl text-white shadow-sm group-hover/item:bg-brand transition-colors duration-300">
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-bold text-[#0f172a] tracking-tight leading-none group-hover/item:text-brand transition-colors">{mapped.label}</span>
                                                            <span className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Included</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* About This Tour */}
                            <div className="space-y-4">
                                <div className="border-l-4 border-brand pl-4">
                                    <p className="text-[10px] font-bold text-brand tracking-wider mb-1.5">The experience</p>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-tight">About this Journey</h2>
                                </div>
                                <div className="relative">
                                    <div 
                                        ref={overviewRef}
                                        className={`text-[13px] md:text-[14.5px] font-medium text-gray-600 leading-[1.8] mt-6 transition-all duration-500 overflow-hidden ${isOverviewExpanded ? 'max-h-[2000px]' : 'line-clamp-3 md:line-clamp-3'}`}
                                    >
                                        {packageData.overview}
                                        {!isOverviewExpanded && showOverviewButton && <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent pointer-events-none transition-opacity duration-300" />}
                                    </div>
                                    {showOverviewButton && (
                                        <div className="flex justify-end mt-2">
                                            <button
                                                onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                                                className="text-[10px] font-bold text-slate-400 hover:text-brand uppercase tracking-[0.15em] flex items-center gap-1.5 transition-all group"
                                            >
                                                {isOverviewExpanded ? 'Show Less' : 'Read Full Overview'}
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOverviewExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div id="itinerary" className="scroll-mt-32 pt-2">
                            <div className="border-l-4 border-brand pl-4 mb-6">
                                <p className="text-[10px] font-bold text-brand tracking-wider mb-1.5">Your schedule</p>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Daily Itinerary</h2>
                            </div>

                            {packageData.itinerary && packageData.itinerary.length > 0 ? (
                                <div className="relative">
                                    {/* Vertical connecting line */}
                                    <div className="absolute left-[19px] top-8 bottom-8 w-0 border-l-2 border-dashed border-brand/60 z-0"></div>

                                    <div className="space-y-3">
                                        {packageData.itinerary.map((day, i) => (
                                            <div key={i} className="relative flex items-start gap-4">
                                                {/* Numbered Circle */}
                                                <div className="shrink-0 w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm z-10 shadow-sm shadow-brand/30 mt-0.5">
                                                    {day.day}
                                                </div>

                                                {/* Day Card */}
                                                <div className={`flex-1 bg-white border rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${expandedDays.includes(i) ? 'ring-1 ring-brand/20 border-brand/10 shadow-md translate-x-1' : 'border-gray-100 hover:border-gray-200'}`}>
                                                    <div
                                                        className="flex justify-between items-center px-5 py-4 cursor-pointer group select-none"
                                                        onClick={() => {
                                                            if (expandedDays.includes(i)) {
                                                                setExpandedDays(expandedDays.filter(d => d !== i));
                                                            } else {
                                                                setExpandedDays([...expandedDays, i]);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex-1 flex flex-col items-start gap-1 min-w-0">
                                                            <span className="text-[10px] font-extrabold tracking-widest text-[#9b1313] shrink-0 uppercase py-0.5 px-2 bg-orange-50/80 rounded-md border border-orange-100/50">Day {day.day}</span>
                                                            <h3 className="text-[14px] md:text-[15px] font-bold text-gray-900 leading-snug">{day.title}</h3>
                                                        </div>
                                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ml-3 ${expandedDays.includes(i) ? 'bg-brand text-white rotate-180 shadow-lg shadow-brand/20' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                                            <svg className={`w-4 h-4 transition-transform duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Expandable Content - Smooth Grid Grow Transition */}
                                                    <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedDays.includes(i) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                        <div className="overflow-hidden">
                                                            <div className="px-5 pb-5 border-t border-gray-50">
                                                                {day.description && (
                                                                    <p className="text-[13px] md:text-sm font-medium text-gray-600 leading-[1.85] mt-4">{day.description}</p>
                                                                )}

                                                                {/* Highlights */}
                                                                {day.highlights && day.highlights.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                                        {day.highlights.map((h: string, idx: number) => (
                                                                            <span key={idx} className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-700 bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                                                <CheckCircle className="w-3 h-3 text-emerald-600" /> {h}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Meals */}
                                                                {((Array.isArray(day.meals) && day.meals.length > 0) || (!Array.isArray(day.meals) && day.meals && (day.meals.breakfastIncluded || day.meals.lunchIncluded || day.meals.dinnerIncluded))) && (
                                                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50 items-center flex-wrap">
                                                                        <span className="text-[10px] font-bold text-slate-500 tracking-wider">Meals:</span>
                                                                        {Array.isArray(day.meals) ? (
                                                                            day.meals.map((meal: string, idx: number) => (
                                                                                <span key={idx} className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                                                                                    <Utensils className="w-3 h-3 text-brand" /> {meal}
                                                                                </span>
                                                                            ))
                                                                        ) : (
                                                                            <>
                                                                                {day.meals?.breakfastIncluded && <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg"><Utensils className="w-3 h-3 text-brand" /> Breakfast</span>}
                                                                                {day.meals?.lunchIncluded && <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg"><Utensils className="w-3 h-3 text-brand" /> Lunch</span>}
                                                                                {day.meals?.dinnerIncluded && <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg"><Utensils className="w-3 h-3 text-brand" /> Dinner</span>}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Tours/Activities with Images */}
                                                                {day.detailedActivities && day.detailedActivities.length > 0 && (
                                                                    <div className="mt-5 space-y-4 pt-4 border-t border-gray-50">
                                                                        <span className="text-[10px] font-bold text-slate-500 tracking-wider block mb-3">Tours & experiences:</span>
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                            {day.detailedActivities.map((activity: any, actIdx: number) => (
                                                                                <div
                                                                                    key={actIdx}
                                                                                    className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300 cursor-pointer"
                                                                                    onClick={() => setSelectedTour(activity)}
                                                                                >
                                                                                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                                                                                        {activity.image ? (
                                                                                            <img src={activity.image} alt={activity.title || 'Tour Activity'} className="w-full h-full object-cover transition-transform duration-500 ease-out" />
                                                                                        ) : (
                                                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                                                <Camera className="w-8 h-8 opacity-20" />
                                                                                            </div>
                                                                                        )}
                                                                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 flex items-end justify-between">
                                                                                            {activity.title && (
                                                                                                <h4 className="text-white font-semibold text-sm leading-snug drop-shadow-md pr-2">{activity.title}</h4>
                                                                                            )}
                                                                                            <div className="flex flex-row items-center gap-1.5">
                                                                                                <span className="shrink-0 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-brand transition-colors text-[9px] font-bold px-2 py-0.5 rounded-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">View</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center shadow-inner">
                                    <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">Detailed Itinerary Customization</h3>
                                    <p className="text-gray-500 text-sm max-w-md mx-auto">The day-by-day plan will be specially curated for your travel dates. Contact us to get the complete schedule.</p>
                                </div>
                            )}
                        </div>

                        {/* 5. Inclusions Section */}
                        <div id="inclusions" className="scroll-mt-32 pt-10">
                            <div className="border-l-4 border-brand pl-4 mb-6">
                                <p className="text-[10px] font-bold text-brand tracking-wider mb-1">Package benefits</p>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">What's Included</h2>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                <div className="flex items-center gap-2.5 px-6 py-4 bg-emerald-50/50 border-b border-emerald-100">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-bold text-emerald-700 tracking-wide">Inclusions</span>
                                </div>
                                <div className="p-2 md:p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                        {packageData.inclusions.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 md:last:border-b md:even:border-l md:even:border-gray-50 group">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                                <span className="text-[13px] font-medium text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6. Exclusions Section */}
                        <div id="exclusions" className="scroll-mt-32 pt-10">
                            <div className="border-l-4 border-brand pl-4 mb-6">
                                <p className="text-[10px] font-bold text-brand tracking-wider mb-1">Important note</p>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Not Included</h2>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                <div className="flex items-center gap-2.5 px-6 py-4 bg-rose-50/50 border-b border-rose-100">
                                    <XCircle className="w-5 h-5 text-rose-500" />
                                    <span className="text-sm font-bold text-rose-600 tracking-wide">Exclusions</span>
                                </div>
                                <div className="p-2 md:p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                        {packageData.exclusions.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 md:last:border-b md:even:border-l md:even:border-gray-50 group">
                                                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                                <span className="text-[13px] font-medium text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 7. FAQs Section - Standardized */}
                        <div id="faq" className="scroll-mt-32 pt-10">
                            <FAQSection faqData={packageData.faqs} noContainer />
                        </div>

                        {/* 8. Policies Section - Redesigned (Vertical Stack) */}
                        <div id="policies" className="scroll-mt-32 pt-10">
                            <div className="border-l-4 border-brand pl-4 mb-8">
                                <p className="text-[10px] font-bold text-brand tracking-wider mb-1">Yatravi standards</p>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Booking Policies</h2>
                            </div>
                            <div className="flex flex-col gap-5">
                                {[
                                    { id: 'cancellation', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50/50', border: 'border-orange-100', title: 'Cancellation' },
                                    { id: 'refund', icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', title: 'Refund' },
                                    { id: 'payment', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', title: 'Payment' }
                                ].map((policy) => (
                                    <div key={policy.id} className={`${policy.bg} ${policy.border} border rounded-[2rem] p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40 group relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="p-3 rounded-2xl bg-white shadow-sm border border-gray-50 group-hover:scale-110 transition-transform duration-300">
                                                    <policy.icon className={`w-6 h-6 ${policy.color}`} />
                                                </div>
                                                <span className="text-[10px] font-bold text-brand tracking-wider md:hidden">{policy.title} policy</span>
                                            </div>
                                            <div className="flex-1">
                                                <span className="hidden md:block text-[10px] font-bold text-brand tracking-wider mb-2">{policy.title} policy</span>
                                                <p className="text-[13px] md:text-sm font-medium text-gray-600 leading-[1.85] whitespace-pre-line">
                                                    {packageData.policies[policy.id as keyof typeof packageData.policies]}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 9. Things to Pack - Redesigned */}
                        {packageData.thingsToPack && packageData.thingsToPack.length > 0 && (
                            <div id="things-to-pack" className="scroll-mt-32 pt-10 pb-10">
                                <div className="border-l-4 border-brand pl-4 mb-8">
                                    <p className="text-[10px] font-bold text-brand tracking-wider mb-1">Travel checklist</p>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Things to Pack</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {packageData.thingsToPack.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 px-5 py-4 bg-white border border-gray-100 rounded-2xl group hover:border-brand/20 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-brand/0 group-hover:bg-brand transition-all duration-300" />
                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-brand/10 transition-colors">
                                                <CheckCircle className="w-4 h-4 text-brand" />
                                            </div>
                                            <span className="text-[13px] text-gray-600 font-bold group-hover:text-gray-900 tracking-tight transition-colors">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sidebar) - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-[150px] space-y-8">
                            {/* Booking Card - Compact Brand Design */}
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-brand/10">
                                {/* Tangelo Header Section */}
                                <div className="bg-brand px-6 py-10 relative overflow-hidden">
                                    {/* Decorative Art */}
                                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 border border-white/10"></div>
                                    <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 border border-white/10"></div>
                                    <div className="absolute top-4 right-10 w-10 h-10 rounded-full bg-white/10"></div>
                                    <div className="absolute bottom-4 right-4 w-5 h-5 rounded-full bg-white/10"></div>
                                    {/* Content */}
                                    <p className="relative text-white/60 text-[10px] font-bold tracking-wider mb-3">Starting from</p>
                                    <div className="relative flex items-baseline gap-2.5 mb-1">
                                        <span className="text-white text-3xl font-extrabold tracking-tight leading-none">₹{packageData.price.toLocaleString()}</span>
                                        <span className="text-white/60 text-sm font-semibold">/ Adult</span>
                                    </div>
                                    {packageData.originalPrice && (
                                        <p className="relative text-white/40 text-sm line-through font-normal mt-1">₹{packageData.originalPrice.toLocaleString()}</p>
                                    )}
                                    <p className="relative text-white/40 text-[9px] font-bold tracking-wider mt-3">+ Taxes & surcharges</p>
                                </div>
                                {/* White CTA Section */}
                                <div className="bg-white px-6 py-4">
                                    <button
                                        onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="w-full bg-brand text-white py-3.5 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-md hover:shadow-brand/30 active:scale-[0.98]"
                                    >
                                        Send Enquiry
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center justify-center gap-2 mt-3 text-[9px] text-gray-400 font-bold tracking-wide">
                                        <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse shadow-[0_0_6px_rgba(251,80,18,0.4)]"></div>
                                        Best price guaranteed
                                    </div>
                                </div>
                            </div>
                            {/* Inquiry Widget Sidebar */}
                            <div id="inquiry-form" className="animate-in fade-in duration-700">
                                <InquiryWidget
                                    title={`Inquiry for ${packageData.title}`}
                                    showPaxCount={true}
                                    packageId={pkg._id}
                                    packageTitle={pkg.title}
                                    source="Package Detail Page"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Mobile Sticky Bottom Bar (Footer Aware) */}
            <div className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex items-center justify-between transition-all duration-500 ${
                showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}>
                <div>
                    <p className="text-xs text-gray-600 font-semibold tracking-widest leading-none mb-1">Starting from</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold tracking-tight text-brand">₹{packageData.price.toLocaleString()}</span>
                    </div>
                </div>
                <button
                    onClick={() => setShowMobileForm(true)}
                    className="bg-brand text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md hover:bg-brand-dark transition-colors"
                >
                    Inquire Now
                </button>
            </div>

            {/* Standardized Mobile Inquiry Drawer */}
            {showMobileForm && (
                <div className="lg:hidden fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
                    <div className="relative w-full max-h-[92vh] animate-in slide-in-from-bottom-full duration-500">
                        <div className="rounded-t-xl overflow-hidden shadow-2xl-up">
                            <InquiryWidget
                                title={`Inquiry for ${packageData.title}`}
                                onClose={() => setShowMobileForm(false)}
                                showPaxCount={true}
                                packageId={pkg._id}
                                packageTitle={pkg.title}
                                source="Package Detail Page"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Lightbox Modal */}
            {showGallery && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between text-white z-10">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold tracking-tight">{packageData.title}</h3>
                            <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-1">Gallery view • {packageData.gallery.length} Images</p>
                        </div>
                        <button
                            onClick={() => setShowGallery(false)}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all transform hover:rotate-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Main Image View */}
                    <div 
                        className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center px-4 md:px-20 group touch-pan-y"
                        onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
                        onTouchMove={(e) => setTouchEndX(e.targetTouches[0].clientX)}
                        onTouchEnd={() => {
                            if (!touchStartX || !touchEndX) return;
                            const distance = touchStartX - touchEndX;
                            const minSwipeDistance = 100;
                            if (Math.abs(distance) > minSwipeDistance) {
                                if (distance > 0) {
                                    setCurrentHeroIndex(prev => prev < packageData.gallery.length ? prev + 1 : 1);
                                } else {
                                    setCurrentHeroIndex(prev => prev > 1 ? prev - 1 : packageData.gallery.length);
                                }
                            }
                            setTouchStartX(null);
                            setTouchEndX(null);
                        }}
                    >
                        {/* Navigation Buttons */}
                        <button
                            onClick={() => setCurrentHeroIndex(prev => prev > 1 ? prev - 1 : packageData.gallery.length)}
                            className="absolute left-4 md:left-8 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                        >
                            <ArrowRight className="w-6 h-6 rotate-180" />
                        </button>

                        <div className="relative w-full h-full max-w-5xl">
                            <Image
                                src={packageData.gallery[currentHeroIndex - 1] || packageData.image}
                                alt={`Gallery Image ${currentHeroIndex}`}
                                fill
                                className="object-contain"
                                quality={100}
                                priority
                            />
                        </div>

                        <button
                            onClick={() => setCurrentHeroIndex(prev => prev < packageData.gallery.length ? prev + 1 : 1)}
                            className="absolute right-4 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Thumbnails Container */}
                    <div className="mt-8 w-full max-w-4xl px-6">
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 justify-center">
                            {packageData.gallery.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentHeroIndex(idx + 1)}
                                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 transition-all duration-300 ${currentHeroIndex === idx + 1
                                            ? 'ring-2 ring-brand ring-offset-4 ring-offset-black scale-110 translate-y-[-4px]'
                                            : 'opacity-40 hover:opacity-100'
                                        }`}
                                >
                                    <Image src={img} alt="Thumb" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tour Details Sidebar/Modal */}
            {selectedTour && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedTour(null)}
                    ></div>
                    <div className="relative w-full md:w-[450px] lg:w-[480px] h-[100dvh] bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom md:slide-in-from-right duration-300 ease-out">
                        {/* Drawer Header/Image */}
                        <div className="relative h-64 sm:h-72 shrink-0 bg-gray-100">
                            {selectedTour.image ? (
                                <img src={selectedTour.image} alt={selectedTour.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <MapPin className="w-12 h-12 text-gray-300" />
                                </div>
                            )}
                            <button
                                onClick={() => setSelectedTour(null)}
                                className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-20">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-md">{selectedTour.title || 'Tour Details'}</h3>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
                            <div className="flex flex-wrap gap-3 mb-8">
                                {selectedTour.transferType && selectedTour.transferType !== '' && (
                                    <div className="flex items-center gap-2 text-xs text-brand bg-brand/5 px-3.5 py-2 rounded-xl border border-brand/10 shadow-sm">
                                        {selectedTour.transferType === 'Private' ? <Car className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                        <span className="font-semibold tracking-wider">{selectedTour.transferType === 'Private' ? 'Private (PVT)' : 'Shared (SIC)'}</span>
                                    </div>
                                )}
                                {selectedTour.time && (
                                    <div className="flex items-center gap-2 text-xs text-gray-700 bg-blue-50/50 px-3.5 py-2 rounded-xl border border-blue-100 shadow-sm">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span className="font-semibold">{selectedTour.time}</span>
                                    </div>
                                )}
                                {selectedTour.duration && (
                                    <div className="flex items-center gap-2 text-xs text-gray-700 bg-orange-50/50 px-3.5 py-2 rounded-xl border border-orange-100 shadow-sm">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <span className="font-semibold">{selectedTour.duration}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[11px] font-bold text-brand tracking-wider mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4" /> Activity description
                                </h4>
                                {selectedTour.description ? (
                                    <p className="text-gray-600 leading-[1.85] text-[15px] whitespace-pre-line">
                                        {selectedTour.description}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic text-sm">No additional description provided for this specific activity.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
