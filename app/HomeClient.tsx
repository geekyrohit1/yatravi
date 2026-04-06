"use client";

import React from 'react';
import { Package } from '../types';
import dynamic from 'next/dynamic';
import { HeroSection } from '../components/HeroSection';
import { FadeIn } from '../components/FadeIn';
import { cleanSlug } from '../lib/utils';

// Reusable Skeleton Components
const SectionHeaderSkeleton = () => (
    <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-1 h-6 md:h-8 bg-slate-300/50 rounded-full animate-pulse"></div>
        <div className="h-7 w-48 bg-slate-200/60 rounded-lg animate-pulse"></div>
    </div>
);

const SliderSkeleton = ({ cardCount = 4 }) => (
    <div className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-gray-100 last:border-0 overflow-hidden">
        <SectionHeaderSkeleton />
        <div className="flex gap-4 md:gap-6 overflow-hidden">
            {[...Array(cardCount)].map((_, j) => (
                <div key={j} className="w-[72vw] md:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/4)] flex-shrink-0 flex flex-col gap-4">
                    <div className="aspect-[4/3] bg-slate-200/40 rounded-xl animate-pulse"></div>
                    <div className="space-y-3 px-1">
                        <div className="h-4 w-3/4 bg-slate-100/60 rounded-lg animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-slate-100/40 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const BannerSkeleton = ({ aspectRatio = "aspect-[16/9] md:aspect-[21/9]" }) => (
    <div className="py-4 md:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className={`${aspectRatio} w-full bg-slate-200/40 rounded-xl animate-pulse`}></div>
    </div>
);

const GridSkeleton = () => (
    <div className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-200/40 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-slate-100/60 rounded animate-pulse"></div>
                        <div className="h-2 w-16 bg-slate-100/30 rounded animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MarqueeSkeleton = () => (
    <div className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-center gap-8 md:gap-12 opacity-30">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
        </div>
    </div>
);

// Dynamic imports
const PackageSlider = dynamic(() => import('../components/PackageSlider').then(m => m.PackageSlider), { loading: () => <SliderSkeleton /> });
const PartnersMarquee = dynamic(() => import('../components/PartnersMarquee').then(m => m.PartnersMarquee), { loading: () => <MarqueeSkeleton /> });
const TrendingCollections = dynamic(() => import('../components/TrendingCollections').then(m => m.TrendingCollections), { loading: () => <SliderSkeleton /> });
const WhyChooseUs = dynamic(() => import('../components/WhyChooseUs').then(m => m.WhyChooseUs), { loading: () => <GridSkeleton /> });
const ConsultationBanner = dynamic(() => import('../components/ConsultationBanner').then(m => m.ConsultationBanner), { loading: () => <BannerSkeleton aspectRatio="aspect-[2/1] md:aspect-[5/1]" /> });
const FAQSection = dynamic(() => import('../components/FAQSection').then(m => m.FAQSection), { loading: () => <div className="py-10 max-w-7xl mx-auto px-4"><SectionHeaderSkeleton /><div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div></div> });
const Newsletter = dynamic(() => import('../components/Newsletter').then(m => m.Newsletter), { loading: () => <BannerSkeleton aspectRatio="aspect-[3/1] md:aspect-[6/1]" /> });
const WeekendTrips = dynamic(() => import('../components/WeekendTrips').then(m => m.WeekendTrips), { loading: () => <SliderSkeleton /> });
const VisaFreeDestinations = dynamic(() => import('../components/VisaFreeDestinations').then(m => m.VisaFreeDestinations), { loading: () => <SliderSkeleton /> });
const SuperSaverDeals = dynamic(() => import('../components/SuperSaverDeals').then(m => m.SuperSaverDeals), { loading: () => <SliderSkeleton /> });
const HoneymoonSpecials = dynamic(() => import('../components/HoneymoonSpecials').then(m => m.HoneymoonSpecials), { loading: () => <SliderSkeleton /> });
const OfferSlider = dynamic(() => import('../components/OfferSlider').then(m => m.OfferSlider), { loading: () => <SliderSkeleton /> });
const MediaBanner = dynamic(() => import('../components/MediaBanner').then(m => m.MediaBanner), { loading: () => <BannerSkeleton aspectRatio="aspect-[3/1] md:aspect-[6/1]" /> });
const PromoSlider = dynamic(() => import('../components/PromoSlider').then(m => m.PromoSlider), { loading: () => <SliderSkeleton /> });
const FooterQuickLinks = dynamic(() => import('../components/FooterQuickLinks').then(m => m.FooterQuickLinks), { loading: () => <div className="py-10 bg-gray-50"><div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">{[1,2,3,4].map(i => <div key={i} className="space-y-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /><div className="space-y-2">{[1,2,3].map(j => <div key={j} className="h-3 w-32 bg-gray-100 rounded animate-pulse" />)}</div></div>)}</div></div> });

const METRO_CITIES = ['Mumbai', 'Delhi', 'Jaipur', 'Bangalore', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Hyderabad', 'Lucknow'];

interface HomeClientProps {
    initialPackages: Package[];
    initialConfig: any;
    initialDestinations: any[];
}

export const HomeClient: React.FC<HomeClientProps> = ({ initialPackages, initialConfig, initialDestinations }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Memoized section data calculation
    const calculatedSectionsData = React.useMemo(() => {
        if (!initialPackages.length || !initialConfig) return { dynamicSections: {}, cityDepartures: [], featuredCollections: [] };

        // MASTER SWITCH: Filter out packages that are hidden from homepage or are drafts
        const activePackages = initialPackages.filter(p => p.status === 'published' && p.showOnHomepage !== false);

        const tempRenderedIds = new Set<string>();
        const dynamicSections: Record<string, Package[]> = {};

        // Calculate dynamic sections
        (initialConfig.sections || []).forEach((section: any) => {
            if (!section.enabled) return;

            // ADVANCED SYNC: Map Admin keys to Homepage Section keys
            const sectionKey = section.key.toLowerCase();
            const explicitlyAssigned = activePackages.filter(p => {
                const sectArr = p.homepageSections || [];
                // 1. Direct key match
                if (sectArr.includes(section.key)) return true;
                // 2. Map Admin keys -> Logic types
                if (sectionKey.includes('weekend') && sectArr.includes('weekendGetaways')) return true;
                if ((sectionKey.includes('deals') || sectionKey.includes('saver')) && sectArr.includes('superSaver')) return true;
                if (sectionKey.includes('trending') && sectArr.includes('trending')) return true;
                if (sectionKey.includes('honeymoon') && sectArr.includes('honeymoon')) return true;
                if (sectionKey.includes('international') && sectArr.includes('international')) return true;
                if ((sectionKey.includes('domestic') || sectionKey.includes('india')) && sectArr.includes('domestic')) return true;
                return false;
            });

            let filtered: Package[] = [];
            let effectiveFilter = section.filterType;

            if (!effectiveFilter) {
                const searchStr = `${section.key} ${section.title}`.toLowerCase();
                if (searchStr.includes('international')) effectiveFilter = 'international';
                else if (searchStr.includes('domestic') || searchStr.includes('india')) effectiveFilter = 'domestic';
                else if (searchStr.includes('trending')) effectiveFilter = 'trending';
                else if (searchStr.includes('honeymoon')) effectiveFilter = 'honeymoon';
                else if (searchStr.includes('weekend')) effectiveFilter = 'weekend';
            } else {
                effectiveFilter = effectiveFilter.toLowerCase();
            }

            // FILTER LOGIC: Enhanced to respect both badges, explicit assignments, and multiple aliases
            if (effectiveFilter === 'trending') {
                filtered = activePackages.filter(p => p.isTrending || p.isBestSeller);
            } else if (effectiveFilter === 'honeymoon') {
                filtered = activePackages.filter(p => {
                    const cat = p.category?.toLowerCase();
                    const title = p.title?.toLowerCase();
                    return cat === 'honeymoon' || cat === 'romantic' || cat === 'couple' || title?.includes('honeymoon') || title?.includes('romantic');
                });
            } else if (effectiveFilter === 'weekend') {
                filtered = activePackages.filter(p => {
                    const title = p.title?.toLowerCase();
                    return p.duration <= 3 || title?.includes('weekend') || title?.includes('staycation') || title?.includes('short trip');
                });
            } else if (effectiveFilter === 'international') {
                filtered = activePackages.filter(p => {
                    const cat = p.category?.toLowerCase();
                    return cat === 'international' || cat === 'worldwide' || cat === 'global' || cat === 'outbound';
                });
            } else if (effectiveFilter === 'domestic') {
                filtered = activePackages.filter(p => {
                    const cat = p.category?.toLowerCase();
                    return cat === 'domestic' || cat === 'india' || cat === 'inbound' || cat === 'local';
                });
            } else if (section.type === 'packages') {
                filtered = activePackages;
            }

            const freshAuto = filtered.filter(p => 
                !tempRenderedIds.has(String(p._id || p.id)) && 
                !explicitlyAssigned.some(e => String(e._id || e.id) === String(p._id || p.id))
            );

            const limit = section.queryConfig?.limit || 8;
            // 100% MANUAL OVERRIDE: If it's a specific package section, only show explicitly assigned
            // For general categories (international/domestic), keep auto-fill but remove global fallbacks
            const combined = (section.type === 'packages' && !effectiveFilter) 
                ? explicitlyAssigned.slice(0, limit)
                : [...explicitlyAssigned, ...freshAuto].slice(0, limit);

            combined.forEach(p => tempRenderedIds.add(String(p._id || p.id)));
            dynamicSections[section.key] = combined;
        });

        // 100% MANUAL: Only show packages explicitly checked for City Departures
        const cityDepartures = activePackages.filter(p => p.homepageSections?.includes('cityDepartures')).slice(0, 8);
        cityDepartures.forEach(p => tempRenderedIds.add(String(p._id || p.id)));

        // Featured Collections (Only from active packages)
        const featuredCollections = activePackages.filter(p => !tempRenderedIds.has(String(p._id || p.id))).slice(0, 12);

        return { dynamicSections, cityDepartures, featuredCollections };
    }, [initialPackages, initialConfig]);

    const renderSection = (section: any, index: number) => {
        if (!section || !section.enabled) return null;

        const sectionPackages = calculatedSectionsData.dynamicSections[section.key] || [];

        const components: Record<string, React.ReactNode> = {
            'weekendGetaways': sectionPackages.length > 0 ? <WeekendTrips packages={sectionPackages} data={section} /> : null,
            'offersAndUpdates': <OfferSlider data={section} />,
            'superSaver': sectionPackages.length > 0 ? <SuperSaverDeals packages={sectionPackages} data={section} /> : null,
            'honeymoon': sectionPackages.length > 0 ? <HoneymoonSpecials packages={sectionPackages} data={section} /> : null,
            'topDestinations': <VisaFreeDestinations data={section} />,
            'trendingPackages': sectionPackages.length > 0 ? <PackageSlider title={section.title || "Trending Packages"} subtitle={section.subtitle || "Most popular choices among travelers"} packages={sectionPackages} /> : null,
            'media': <MediaBanner data={section} />,
            'slider': <PromoSlider data={section} />,
            'consultation': <ConsultationBanner />,
            'quicklinks': <FooterQuickLinks quickLinks={initialConfig?.quickLinks || []} importantLinks={initialConfig?.importantLinks || []} />,
            'citydepartures': calculatedSectionsData.cityDepartures.length > 0 ? (
                <section className="py-12 md:py-20 overflow-hidden relative">
                    <PackageSlider
                        title={section.title || "Packages From Your City"}
                        subtitle={section.subtitle || "Curated for travelers from your region"}
                        packages={calculatedSectionsData.cityDepartures}
                    />
                </section>
            ) : null
        };

        let content = components[section.key];

        if (!content && section.type === 'packages' && sectionPackages.length > 0) {
            content = <PackageSlider title={section.title} subtitle={section.subtitle} packages={sectionPackages} />;
        } else if (!content) {
            if (section.type === 'destinations') content = <VisaFreeDestinations data={section} />;
            else if (section.type === 'cards') {
                content = (
                    <div className="flex flex-col gap-0">
                        <TrendingCollections data={section} />
                        {sectionPackages.length > 0 && (
                            <PackageSlider title="Trending Packages" packages={sectionPackages} />
                        )}
                    </div>
                );
            }
            else if (section.type === 'offers') content = <OfferSlider data={section} />;
            else if (section.type === 'media') content = <MediaBanner data={section} />;
            else if (section.type === 'slider') content = <PromoSlider data={section} />;
        }

        if (!content) return null;

        // Above the fold optimization: Disable FadeIn for the first 2 sections to prevent refresh jitter
        if (index < 2) {
            return (
                <div key={section.key || `section-${index}`} className={`${index === 0 ? "pt-0" : ""} performance-section`}>
                    {content}
                </div>
            );
        }

        return (
            <div key={section.key || `section-${index}`} className={`${index === 0 ? "pt-0" : ""} performance-section`}>
                <FadeIn delay={Math.min(index * 20, 100)}>
                    {content}
                </FadeIn>
            </div>
        );
    };

    const renderedDynamicKeys = new Set([
        ...(initialConfig?.sections?.filter((s: any) => s.enabled).map((s: any) => s.key?.toLowerCase()) || []),
        'partnersmarquee',
        'whychooseus'
    ]);

    // Cleanup: Filter packages once for reuse in the footer/auto-links
    const allPublishedPackages = React.useMemo(() => 
        initialPackages.filter(p => p.status === 'published'),
    [initialPackages]);

    const allPublishedDestinations = React.useMemo(() => 
        initialDestinations.filter(d => d.status !== 'draft'),
    [initialDestinations]);

    return (
        <div className={`flex flex-col gap-0 text-gray-800 bg-white ${isMounted ? 'animate-in fade-in duration-500' : 'opacity-0'}`}>
            <HeroSection 
                heroData={initialConfig?.heroSlider} 
                isLoading={!isMounted} 
            />

            <div className="flex flex-col gap-0">
                {!isMounted ? (
                    <div className="flex flex-col gap-0">
                         <SliderSkeleton />
                         <BannerSkeleton />
                    </div>
                ) : (
                    initialConfig && Array.isArray(initialConfig.sections) && (
                        <div className="flex flex-col gap-0">
                            {[...initialConfig.sections]
                                .filter((s: any) => s && s.enabled && s.key !== 'quicklinks')
                                .sort((a: any, b: any) => (parseFloat(a.order) || 999) - (parseFloat(b.order) || 999))
                                .map((section: any, index: number) => renderSection(section, index))
                            }
                        </div>
                    )
                )}

                <div className="flex flex-col gap-0 bg-white">
                    {!renderedDynamicKeys.has('consultation') && (
                        <>
                            <FadeIn delay={15}>
                                <FooterQuickLinks
                                    quickLinks={allPublishedPackages.map((p: any) => ({
                                        label: p.title,
                                        url: `/packages/${p.slug}`
                                    }))}
                                    importantLinks={allPublishedDestinations.map((d: any) => ({
                                        label: d.name,
                                        url: `/destination/${d.slug || cleanSlug(d.name)}`
                                    }))}
                                />
                            </FadeIn>
                            <FadeIn delay={20}>
                                <ConsultationBanner />
                            </FadeIn>
                        </>
                    )}

                    {!renderedDynamicKeys.has('citydepartures') && calculatedSectionsData.cityDepartures.length > 0 && (
                        <FadeIn delay={30}>
                            <section className="py-12 md:py-20 overflow-hidden relative">
                                <PackageSlider
                                    title="Packages From Your City"
                                    subtitle="Curated for travelers from your region"
                                    packages={calculatedSectionsData.cityDepartures}
                                />
                </section>
            </FadeIn>
        )}

        <div className="py-8 space-y-0">
                        
                        {!renderedDynamicKeys.has('partnersmarquee') && (
                            <PartnersMarquee />
                        )}

                        {!renderedDynamicKeys.has('faq') && (
                            <FadeIn delay={100}>
                                <FAQSection faqData={initialConfig?.faq} />
                            </FadeIn>
                        )}

                        {!renderedDynamicKeys.has('newsletter') && (
                            <FadeIn delay={100}>
                                <Newsletter />
                            </FadeIn>
                        )}
                        
                        {!renderedDynamicKeys.has('whychooseus') && (
                            <WhyChooseUs />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
