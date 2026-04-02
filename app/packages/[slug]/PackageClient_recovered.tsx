"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package } from '../../../types';
import { API_BASE_URL } from '../../../constants';
import { Star, MapPin, Clock, CheckCircle, X, Shield, ArrowRight, MessageCircle, Phone, Plane, Car, BedDouble, Coffee, Camera, Info, Map, ShieldCheck, Utensils, Share2 } from 'lucide-react';
import ShareButton from '../../../components/ShareButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface PackageClientProps {
    initialPkg: Package | null;
}

export default function PackageClient({ initialPkg }: PackageClientProps) {
    const router = useRouter();

    // Initialize state with passed prop. If null, we might show not found or loading (though server handles 404 usually)
    const [pkg, setPkg] = useState<Package | null>(initialPkg);
    const loading = false; // No longer loading initial data

    const [activePolicyTab, setActivePolicyTab] = useState<'cancellation' | 'refund' | 'payment'>('cancellation');
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [travelDate, setTravelDate] = useState<Dayjs | null>(null);
    const [paxCount, setPaxCount] = useState<number>(2);
    const [showMobileForm, setShowMobileForm] = useState(false);

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('toggleFloatingButtons', { detail: showMobileForm }));
        return () => {
            window.dispatchEvent(new CustomEvent('toggleFloatingButtons', { detail: false }));
        };
    }, [showMobileForm]);

    // Countdown timer logic (unchanged)
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
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

    const [enquiryData, setEnquiryData] = useState({ name: '', email: '', phone: '', message: '' });
    const [enquirySubmitting, setEnquirySubmitting] = useState(false);
    const [enquirySuccess, setEnquirySuccess] = useState(false);

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnquirySubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...enquiryData,
                    packageId: pkg?.id || pkg?.slug,
                    packageTitle: pkg?.title,
                    travelDate: travelDate?.format('YYYY-MM-DD'),
                    travellers: paxCount,
                    source: 'Package Detail Page'
                })
            });
            if (res.ok) {
                setEnquirySuccess(true);
                setEnquiryData({ name: '', email: '', phone: '', message: '' });
                setTimeout(() => setEnquirySuccess(false), 4000);
            } else {
                alert('Failed to send inquiry. Please try again.');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setEnquirySubmitting(false);
        }
    };

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
                    className="px-6 py-2 bg-[#CD1C18] text-white rounded-lg hover:bg-[#9B1313] transition-colors"
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
        <div className="bg-white min-h-screen font-sans text-gray-800">
            {/* 1. Gallery Section (Moved To Top) */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[250px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500">
                    <div className="md:col-span-2 relative h-full group cursor-pointer overflow-hidden">
                        <Image
                            src={packageData.gallery[0] || packageData.image}
                            alt="Main View"
                            fill
                            quality={100}
                            className="object-cover shrink-0 transition-transform duration-1000 group-hover:scale-105"
                            priority
                        />
                    </div>
                    <div className="hidden md:flex flex-col h-full gap-2">
                        {packageData.gallery[1] && (
                            <div className="relative flex-1 group cursor-pointer overflow-hidden">
                                <Image src={packageData.gallery[1]} alt="Gallery 1" fill quality={100} className="object-cover shrink-0 transition-transform duration-700 group-hover:scale-105" />
                            </div>
                        )}
                        {packageData.gallery[2] && (
                            <div className="relative flex-1 group cursor-pointer overflow-hidden">
                                <Image src={packageData.gallery[2]} alt="Gallery 2" fill quality={100} className="object-cover shrink-0 transition-transform duration-700 group-hover:scale-105" />
                            </div>
                        )}
                    </div>
                    <div className="hidden md:flex flex-col h-full gap-2">
                        {packageData.gallery[3] && (
                            <div className="relative flex-1 group cursor-pointer overflow-hidden">
                                <Image src={packageData.gallery[3]} alt="Gallery 3" fill quality={100} className="object-cover shrink-0 transition-transform duration-700 group-hover:scale-105" />
                            </div>
                        )}
                        <div className="relative flex-1 group cursor-pointer overflow-hidden bg-gray-900 flex items-center justify-center">
                            {packageData.gallery[4] ? (
                                <>
                                    <Image src={packageData.gallery[4]} alt="More" fill quality={80} className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
                                    <div className="relative z-10 text-white flex flex-col items-center gap-1">
                                        <Camera className="w-6 h-6" />
                                        <span className="text-xs font-bold font-heading">View All Photos</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-white flex flex-col items-center gap-1">
                                    <Camera className="w-6 h-6 opacity-30" />
                                    <span className="text-xs font-bold font-heading opacity-30">Gallery</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Header & Breadcrumbs (Placed below image) */}
            <div className="bg-white pt-8 pb-4">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-[11px] text-gray-400 flex items-center gap-2 uppercase tracking-wider font-medium">
                            <span className="cursor-pointer hover:text-[#CD1C18] transition-colors" onClick={() => router.push('/')}>Home</span>
                            <span>/</span>
                            <span className="cursor-pointer hover:text-[#CD1C18] transition-colors">Packages</span>
                            <span>/</span>
                            <span className="text-gray-800 truncate max-w-[200px]">{packageData.title}</span>
                        </div>
                        <ShareButton
                            title={`Check out this amazing package: ${packageData.title}`}
                            text={`I found this great travel package on Yatravi: ${packageData.title}`}
                            url={typeof window !== 'undefined' ? window.location.href : ''}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl md:text-5xl font-heading tracking-tight font-semibold text-gray-900 leading-tight">{packageData.title}</h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm py-4 border-t border-b border-gray-100 mt-2">
                            <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span>{packageData.rating}</span>
                                <span className="text-gray-400 font-normal">/5</span>
                            </div>
                            <div className="text-gray-500">
                                <span className="font-semibold text-gray-900 underline decoration-dotted underline-offset-4 cursor-pointer">{packageData.reviewsCount} Reviews</span>
                            </div>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
                                <MapPin className="w-4 h-4 text-[#CD1C18]" />
                                <span>{packageData.location}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <div className="flex items-center gap-1.5 text-gray-600 font-semibold">
                                <Clock className="w-4 h-4 text-[#CD1C18]" />
                                <span>{packageData.duration} Days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-6 md:gap-10 text-sm md:text-base font-semibold tracking-tight overflow-x-auto no-scrollbar">
                        {[
                            { id: 'overview', label: 'Overview', icon: Info },
                            { id: 'itinerary', label: 'Itinerary', icon: Map },
                            { id: 'policies', label: 'Policies', icon: ShieldCheck },
                            { id: 'faq', label: 'FAQ', icon: MessageCircle }
                        ].map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className={`flex items-center gap-2 py-4 md:py-6 transition-all duration-300 whitespace-nowrap group relative shrink-0 ${activeSection === section.id
                                    ? 'text-[#CD1C18]'
                                    : 'text-gray-400 hover:text-gray-900'
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    setActiveSection(section.id);
                                }}
                            >
                                <section.icon className={`w-4 h-4 transition-transform duration-300 ${activeSection === section.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="relative z-10">{section.label}</span>
                                {activeSection === section.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CD1C18] rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Main Content 2-Column Grid */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
                    {/* Left Column (Content) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview Section */}
                        <div id="overview" className="scroll-mt-32 space-y-8">
                            {/* Inclusions Icons */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 px-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 text-gray-600 group p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm hover:-translate-y-0.5">
                                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-red-50 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[#CD1C18] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                        <Car className="w-5 h-5 text-gray-400 group-hover:text-[#CD1C18] transition-colors relative z-10" />
                                    </div>
                                    <span className="text-[13px] md:text-sm font-semibold text-gray-700 group-hover:text-[#CD1C18] transition-colors leading-tight">Transfer Included</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 group p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm hover:-translate-y-0.5">
                                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-red-50 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[#CD1C18] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                        <BedDouble className="w-5 h-5 text-gray-400 group-hover:text-[#CD1C18] transition-colors relative z-10" />
                                    </div>
                                    <span className="text-[13px] md:text-sm font-semibold text-gray-700 group-hover:text-[#CD1C18] transition-colors leading-tight">Stay Included</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 group p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm hover:-translate-y-0.5">
                                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-red-50 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[#CD1C18] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                        <Coffee className="w-5 h-5 text-gray-400 group-hover:text-[#CD1C18] transition-colors relative z-10" />
                                    </div>
                                    <span className="text-[13px] md:text-sm font-semibold text-gray-700 group-hover:text-[#CD1C18] transition-colors leading-tight">Breakfast Included</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 group p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm hover:-translate-y-0.5">
                                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-red-50 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-[#CD1C18] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                        <Camera className="w-5 h-5 text-gray-400 group-hover:text-[#CD1C18] transition-colors relative z-10" />
                                    </div>
                                    <span className="text-[13px] md:text-sm font-bold text-gray-700 group-hover:text-[#CD1C18] transition-colors leading-tight">Sightseeing Included</span>
                                </div>
                            </div>

                            <div className="prose prose-red max-w-none">
                                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 font-heading tracking-tight">About this Tour</h2>
                                <p className="text-gray-600 leading-8 text-[15px] whitespace-pre-line pl-1">{packageData.overview}</p>
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div id="itinerary" className="scroll-mt-32 pt-4">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 pl-4 border-l-4 border-[#CD1C18] font-heading tracking-tight">Itinerary</h2>

                            {packageData.itinerary && packageData.itinerary.length > 0 ? (
                                <div className="relative space-y-6 md:space-y-8 before:absolute before:inset-0 before:left-5 md:before:left-[2.1rem] before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {packageData.itinerary.map((day, i) => (
                                        <div key={i} className="relative flex items-start gap-4 md:gap-8 group">
                                            {/* Glowing Timeline Dot */}
                                            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white bg-[#CD1C18] text-white shadow shadow-red-500/30 shrink-0 z-10 font-bold text-sm md:text-base transition-transform duration-300 group-hover:scale-110">
                                                {day.day}
                                            </div>

                                            {/* Card Content */}
                                            <div className="flex-1 bg-white border border-gray-100 p-5 md:p-7 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                                <div
                                                    className="flex justify-between items-start cursor-pointer group/header"
                                                    onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                                                >
                                                    <div>
                                                        <span className="text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#CD1C18] mb-1 block">Day {day.day}</span>
                                                        <h3 className="font-semibold text-gray-900 text-lg md:text-xl leading-tight group-hover/header:text-[#CD1C18] transition-colors pr-4">{day.title}</h3>
                                                    </div>
                                                    <div className={`shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-300 border border-gray-100 ${expandedDay === i ? 'bg-red-50 border-red-100 rotate-90' : 'group-hover/header:bg-red-50'}`}>
                                                        <ArrowRight className={`w-4 h-4 transition-colors ${expandedDay === i ? 'text-[#CD1C18]' : 'text-gray-400'}`} />
                                                    </div>
                                                </div>

                                                {/* Animated Accordion Content */}
                                                <div className={`grid transition-all duration-500 ease-in-out ${expandedDay === i ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                                    <div className="overflow-hidden">
                                                        {/* Highlights Scrolling Ticker */}
                                                        {day.highlights && day.highlights.length > 0 && (
                                                            <div className="mt-4 relative overflow-hidden bg-gray-50/50 py-3 rounded-xl border border-gray-100">
                                                                <div className="flex animate-scroll whitespace-nowrap gap-10 items-center">
                                                                    {day.highlights.map((h: string, idx: number) => (
                                                                        <span key={idx} className="text-[11px] md:text-xs font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                                                                            <Star className="w-3 h-3 text-amber-400 fill-current" /> {h}
                                                                        </span>
                                                                    ))}
                                                                    {/* Duplicate for seamless loop */}
                                                                    {day.highlights.map((h: string, idx: number) => (
                                                                        <span key={`dup-${idx}`} className="text-[11px] md:text-xs font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                                                                            <Star className="w-3 h-3 text-amber-400 fill-current" /> {h}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <p className="text-gray-600 text-[15px] leading-relaxed pt-3">{day.description}</p>
                                                        
                                                        {day.meals && (
                                                            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-50 items-center">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meals:</span>
                                                                <div className="flex gap-2">
                                                                    {Array.isArray(day.meals) ? (
                                                                        day.meals.map((meal, idx) => (
                                                                            <span key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
                                                                                <Utensils className="w-3 h-3 text-[#CD1C18]" />
                                                                                {meal}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <>
                                                                            {day.meals && day.meals.breakfastIncluded && (
                                                                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
                                                                                    <Utensils className="w-3 h-3 text-[#CD1C18]" />
                                                                                    Breakfast
                                                                                </span>
                                                                            )}
                                                                            {day.meals && day.meals.lunchIncluded && (
                                                                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
                                                                                    <Utensils className="w-3 h-3 text-[#CD1C18]" />
                                                                                    Lunch
                                                                                </span>
                                                                            )}
                                                                            {day.meals?.dinnerIncluded && (
                                                                                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-white border border-gray-100 px-3 py-1.5 rounded-lg shadow-sm">
                                                                                    <Utensils className="w-3 h-3 text-[#CD1C18]" />
                                                                                    Dinner
                                                                                </span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center shadow-inner">
                                    <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">Detailed Itinerary Customization</h3>
                                    <p className="text-gray-500 text-sm max-w-md mx-auto">The day-by-day plan will be specially curated for your travel dates. Contact us to get the complete schedule.</p>
                                </div>
                            )}
                        </div>

                        {/* Policies Section */}
                        <div id="policies" className="scroll-mt-32 pt-10">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 pl-4 border-l-4 border-[#CD1C18] font-heading tracking-tight">Policies</h2>

                            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                {/* Policy Tabs */}
                                <div className="flex flex-wrap gap-2 p-4 md:p-6 bg-gray-50 border-b border-gray-100">
                                    {(['cancellation', 'refund', 'payment'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActivePolicyTab(tab)}
                                            className={`px-6 py-2.5 rounded-full text-[13px] md:text-sm font-bold transition-all duration-300 flex-1 md:flex-none text-center ${activePolicyTab === tab
                                                ? 'bg-[#CD1C18] text-white shadow-md backdrop-blur-sm'
                                                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-[#CD1C18] border border-gray-200'
                                                }`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Policy Content */}
                                <div className="p-6 md:p-8 bg-white min-h-[120px] flex items-center">
                                    <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line transition-opacity duration-300" key={activePolicyTab}>
                                        {packageData.policies[activePolicyTab]}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Inclusions */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 md:p-8 border border-green-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center gap-3 mb-6 bg-white w-max px-4 py-2 rounded-full shadow-sm">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">What's Included</h3>
                                </div>
                                <ul className="space-y-3">
                                    {packageData.inclusions.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[14px] md:text-[15px] font-medium text-gray-700">
                                            <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckCircle className="w-3 h-3 text-green-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Exclusions */}
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 md:p-8 border border-red-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center gap-3 mb-6 bg-white w-max px-4 py-2 rounded-full shadow-sm">
                                    <X className="w-5 h-5 text-red-600" />
                                    <h3 className="font-semibold text-gray-900">What's Not Included</h3>
                                </div>
                                <ul className="space-y-3">
                                    {packageData.exclusions.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[14px] md:text-[15px] font-medium text-gray-700">
                                            <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                                <X className="w-3 h-3 text-red-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* FAQs Section */}
                        <div id="faq" className="scroll-mt-32 pt-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 pl-2 border-l-4 border-[#CD1C18]">Frequently Asked Questions</h2>
                            {packageData.faqs && packageData.faqs.length > 0 ? (
                                <div className="space-y-4">
                                    {packageData.faqs.map((faq: { question: string; answer: string }, i: number) => (
                                        <div key={i} className="group border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                            <button
                                                className="w-full p-4 md:p-5 flex justify-between items-start text-left hover:bg-red-50/50 transition-colors"
                                                onClick={() => setExpandedDay(expandedDay === 100 + i ? null : 100 + i)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${expandedDay === 100 + i ? 'bg-[#CD1C18] text-white shadow-md' : 'bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-[#CD1C18]'}`}>
                                                        <MessageCircle className="w-4 h-4" />
                                                    </div>
                                                    <span className={`font-bold mt-1 max-w-[85%] md:max-w-[90%] transition-colors ${expandedDay === 100 + i ? 'text-[#CD1C18]' : 'text-gray-800 group-hover:text-[#CD1C18]'}`}>{faq.question}</span>
                                                </div>
                                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ml-2 mt-1 ${expandedDay === 100 + i ? 'rotate-90' : 'bg-gray-50 group-hover:bg-red-50'}`}>
                                                    <ArrowRight className={`w-4 h-4 transition-colors ${expandedDay === 100 + i ? 'text-[#CD1C18]' : 'text-gray-400'}`} />
                                                </div>
                                            </button>

                                            {/* Animated Accordion Content */}
                                            <div className={`grid transition-all duration-500 ease-in-out ${expandedDay === 100 + i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                <div className="overflow-hidden">
                                                    <p className="px-5 pb-5 ml-2 md:ml-11 text-[14px] md:text-[15px] text-gray-600 leading-relaxed border-t border-transparent">{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 text-center shadow-inner">
                                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">Have questions?</h3>
                                    <p className="text-gray-500 text-sm max-w-md mx-auto">Contact our support team and we'll be happy to provide all the information you need in detail.</p>
                                </div>
                            )}
                        </div>

                        {/* Things to Pack */}
                        {packageData.thingsToPack && packageData.thingsToPack.length > 0 && (
                            <div className="pt-10 pb-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 pl-2 border-l-4 border-[#CD1C18]">Things to Pack</h2>
                                <div className="flex flex-wrap gap-3">
                                    {packageData.thingsToPack.map((item: string, i: number) => (
                                        <span key={i} className="px-5 md:px-6 py-2.5 md:py-3 bg-white hover:bg-gray-50 rounded-full text-[14px] md:text-[15px] text-gray-800 font-bold border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2.5 hover:-translate-y-0.5 group">
                                            <div className="shrink-0 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-[#CD1C18] transition-colors duration-300">
                                                <CheckCircle className="w-3.5 h-3.5 text-[#CD1C18] group-hover:text-white transition-colors duration-300" />
                                            </div>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sidebar) - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {/* Booking Card */}
                            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8 transition-shadow duration-300 hover:shadow-2xl hover:border-red-100 group">
                                <div className="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-red-50/30 transition-colors">
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-2">Starting Price</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-semibold tracking-tight text-gray-900 group-hover:text-[#CD1C18] transition-colors">₹{packageData.price.toLocaleString()}</span>
                                        <span className="text-sm text-gray-400 line-through font-medium">₹{packageData.originalPrice.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 font-medium">per person + 5% GST</p>
                                </div>
                                <button
                                    onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full bg-[#CD1C18] text-white py-4 rounded-xl font-semibold text-[15px] hover:bg-[#9B1313] hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 mb-4 shadow-lg shadow-red-500/10"
                                >
                                    Customize & Book <ArrowRight className="w-5 h-5" />
                                </button>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-bold bg-white/50 py-2 rounded-full">
                                    <Phone className="w-4 h-4 text-[#CD1C18]" /> Call for the best deals
                                </div>
                            </div>

                            {/* Inquiry Form */}
                            <div id="inquiry-form" className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-2xl flex flex-col min-h-[460px]">
                                {enquirySuccess ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200 transition-all hover:scale-110">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <h4 className="font-black text-2xl text-gray-800 mb-3 tracking-tight">Got It! 🎉</h4>
                                        <p className="text-[15px] text-gray-500 leading-relaxed font-medium px-2">
                                            You're one step closer to your dream trip. Our <span className="text-[#CD1C18] font-bold">Yatravi Expert</span> will contact you shortly!
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 md:px-8 py-6">
                                            <h3 className="font-bold text-white text-xl">Get a Free Quote</h3>
                                            <p className="text-sm text-gray-300 mt-1">Our experts will get back to you within 24hrs</p>
                                        </div>
                                        <form onSubmit={handleInquirySubmit} className="p-6 md:p-8 space-y-5">
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    placeholder="Full Name*"
                                                    className="w-full border-b-2 border-gray-200 bg-transparent px-2 py-3 text-[15px] text-gray-800 focus:outline-none focus:border-[#CD1C18] transition-colors placeholder:text-gray-400 hover:border-gray-300"
                                                    value={enquiryData.name}
                                                    onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    placeholder="Email Address*"
                                                    className="w-full border-b-2 border-gray-200 bg-transparent px-2 py-3 text-[15px] text-gray-800 focus:outline-none focus:border-[#CD1C18] transition-colors placeholder:text-gray-400 hover:border-gray-300"
                                                    value={enquiryData.email}
                                                    onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="tel"
                                                    placeholder="Phone Number*"
                                                    className="w-full border-b-2 border-gray-200 bg-transparent px-2 py-3 text-[15px] text-gray-800 focus:outline-none focus:border-[#CD1C18] transition-colors placeholder:text-gray-400 hover:border-gray-300"
                                                    value={enquiryData.phone}
                                                    onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="relative group pt-2">
                                                <textarea
                                                    rows={2}
                                                    placeholder="Message (Optional)"
                                                    className="w-full border-2 border-gray-200 bg-gray-50 rounded-2xl px-4 py-3 text-[15px] text-gray-800 focus:outline-none focus:border-[#CD1C18] focus:bg-white resize-none transition-all placeholder:text-gray-400 hover:border-gray-300"
                                                    value={enquiryData.message}
                                                    onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={enquirySubmitting}
                                                className="w-full bg-[#CD1C18] text-white py-4 rounded-full font-bold tracking-wide text-[15px] hover:bg-[#9B1313] hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-1 mt-2 flex items-center justify-center"
                                            >
                                                {enquirySubmitting ? 'Sending Request...' : 'Send Inquiry Request'}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-14 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">Starting From</p>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-semibold tracking-tight text-gray-900 line-clamp-1">₹{packageData.price.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400 font-medium">/Person</span>
                    </div>
                </div>
                <button
                    onClick={() => setShowMobileForm(true)}
                    className="bg-[#CD1C18] text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-red-500/10 active:scale-95 transition-all"
                >
                    Inquire Now
                </button>
            </div>

            {/* Mobile Form Popup Overlay */}
            {showMobileForm && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-t-3xl shadow-xl w-full max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-500 relative">
                        <button
                            onClick={() => setShowMobileForm(false)}
                            className="absolute top-4 right-4 z-50 p-2 bg-gray-50 rounded-xl text-gray-500 hover:text-gray-900 transition-colors border border-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="overflow-y-auto px-6 py-2 pb-6 flex-1 mt-2">
                             <div className="mb-2">
                                <h3 className="text-xl font-semibold text-gray-900 font-heading tracking-tight">Get a Free Quote</h3>
                                <p className="text-sm text-gray-500 mt-0.5 font-medium">For {packageData.title}</p>
                            </div>
                            
                            {enquirySuccess ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-10 text-center animate-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h4 className="font-semibold text-2xl text-gray-900 mb-3 tracking-tight">Got It! 🎉</h4>
                                    <p className="text-[15px] text-gray-500 leading-relaxed font-medium px-2">
                                        You're one step closer to your dream trip. Our <span className="text-[#CD1C18] font-bold">Yatravi Expert</span> will contact you shortly!
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleInquirySubmit} className="space-y-2.5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#CD1C18] focus:bg-white transition-all shadow-sm"
                                            value={enquiryData.name}
                                            onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#CD1C18] focus:bg-white transition-all shadow-sm"
                                            value={enquiryData.email}
                                            onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="flex border border-gray-100 bg-gray-50 rounded-xl overflow-hidden focus-within:border-[#CD1C18] focus-within:bg-white transition-all shadow-sm">
                                            <div className="bg-gray-100 px-3 py-3.5 border-r border-gray-100 text-gray-400 text-xs font-bold font-sans">
                                                +91
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="Mobile Number*"
                                                className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-900 font-medium focus:outline-none"
                                                value={enquiryData.phone}
                                                onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest ml-1">Message (Optional)</label>
                                        <textarea
                                            rows={2}
                                            placeholder="Additional requirements..."
                                            className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#CD1C18] focus:bg-white resize-none transition-all shadow-sm"
                                            value={enquiryData.message}
                                            onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={enquirySubmitting}
                                        className="w-full bg-[#CD1C18] text-white py-3 rounded-xl font-semibold tracking-wide text-[14px] hover:bg-[#9B1313] transition-all shadow-lg shadow-red-500/10 active:scale-[0.98] mt-3 flex items-center justify-center"
                                    >
                                        {enquirySubmitting ? 'Sending Request...' : 'Get Free Quote Now'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

