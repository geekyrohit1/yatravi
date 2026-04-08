"use client";

import React from 'react';
import { Package } from '../types';
import dynamic from 'next/dynamic';
import { HeroSection } from '../components/HeroSection';
import { cleanSlug } from '../lib/utils';

// Reusable Skeleton Components
const SectionHeaderSkeleton = () => (
    <div className="flex flex-col gap-1 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
            <div className="w-1 h-5 md:h-6 bg-brand rounded-full"></div>
            <div className="h-8 w-48 bg-slate-200/60 rounded-lg animate-pulse py-1"></div>
        </div>
        <div className="ml-4 pl-3 border-l-2 border-gray-100 h-3 w-64 bg-slate-100/40 rounded animate-pulse mt-0.5"></div>
    </div>
);

// 1. Package Slider Skeleton (Standard width)
const PackageSliderSkeleton = ({ cardCount = 4 }) => (
    <div className="pt-4 md:pt-10 pb-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        <SectionHeaderSkeleton />
        <div className="flex gap-4 md:gap-6 overflow-hidden">
            {[...Array(cardCount)].map((_, j) => (
                <div key={j} className="w-[calc((100vw-40px)/1.3)] md:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/4)] flex-shrink-0 flex flex-col gap-4">
                    <div className="aspect-[1.1/1] sm:aspect-[1.15/1] bg-slate-200/40 rounded-xl animate-pulse"></div>
                    <div className="space-y-3 px-1">
                        <div className="h-4 w-3/4 bg-slate-100/60 rounded-lg animate-pulse"></div>
                        <div className="h-8 w-full bg-slate-50/40 rounded-lg animate-pulse"></div>
                        <div className="flex justify-between items-center pt-2">
                            <div className="h-6 w-24 bg-slate-100/60 rounded-lg animate-pulse"></div>
                            <div className="h-10 w-10 bg-slate-100/40 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// 2. Destination Slider Skeleton (Taller, distinct width)
const DestinationSliderSkeleton = ({ cardCount = 4 }) => (
    <div className="pt-4 md:pt-10 pb-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden bg-brand/[0.04]">
        <SectionHeaderSkeleton />
        <div className="flex gap-3 overflow-hidden">
            {[...Array(cardCount)].map((_, j) => (
                <div key={j} className="w-[calc((100vw-40px)/1.3)] md:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/4)] h-[290px] md:h-[360px] flex-shrink-0 bg-slate-200/40 rounded-xl animate-pulse"></div>
            ))}
        </div>
    </div>
);

// 3. Collection Grid Skeleton (Trending Collections)
const CollectionGridSkeleton = () => (
    <div className="pt-4 md:pt-10 pb-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        <SectionHeaderSkeleton />
        <div className="flex md:grid md:grid-cols-4 gap-4 h-[300px] md:h-[500px]">
            <div className="min-w-[85vw] md:min-w-0 md:col-span-2 md:row-span-2 bg-slate-200/40 rounded-xl animate-pulse"></div>
            <div className="hidden md:block md:col-span-1 md:row-span-1 bg-slate-200/40 rounded-xl animate-pulse"></div>
            <div className="hidden md:block md:col-span-1 md:row-span-1 bg-slate-200/40 rounded-xl animate-pulse"></div>
            <div className="hidden md:block md:col-span-2 md:row-span-1 bg-slate-200/40 rounded-xl animate-pulse"></div>
        </div>
    </div>
);

const BannerSkeleton = ({ aspectRatio = "aspect-[800/266] md:aspect-[1920/450]" }) => (
    <div className="pt-2 md:pt-4 pb-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className={`${aspectRatio} w-full bg-slate-200/40 rounded-xl animate-pulse shadow-sm`}></div>
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
const PackageSlider = dynamic(() => import('../components/PackageSlider').then(m => m.PackageSlider), { loading: () => <PackageSliderSkeleton /> });
const PartnersMarquee = dynamic(() => import('../components/PartnersMarquee').then(m => m.PartnersMarquee), { loading: () => <MarqueeSkeleton /> });
// const TrendingCollections = dynamic(() => import('../components/TrendingCollections').then(m => m.TrendingCollections), { loading: () => <CollectionGridSkeleton /> });
const WhyChooseUs = dynamic(() => import('../components/WhyChooseUs').then(m => m.WhyChooseUs), { loading: () => <GridSkeleton /> });
const ConsultationBanner = dynamic(() => import('../components/ConsultationBanner').then(m => m.ConsultationBanner), { loading: () => <BannerSkeleton aspectRatio="aspect-[2/1] md:aspect-[5/1]" /> });
const FAQSection = dynamic(() => import('../components/FAQSection').then(m => m.FAQSection), { loading: () => <div className="py-10 max-w-7xl mx-auto px-4"><SectionHeaderSkeleton /><div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div></div> });
const Newsletter = dynamic(() => import('../components/Newsletter').then(m => m.Newsletter), { loading: () => <BannerSkeleton aspectRatio="aspect-[3/1] md:aspect-[6/1]" /> });
const WeekendTrips = dynamic(() => import('../components/WeekendTrips').then(m => m.WeekendTrips), { loading: () => <PackageSliderSkeleton /> });
const VisaFreeDestinations = dynamic(() => import('../components/VisaFreeDestinations').then(m => m.VisaFreeDestinations), { loading: () => <DestinationSliderSkeleton /> });
const SuperSaverDeals = dynamic(() => import('../components/SuperSaverDeals').then(m => m.SuperSaverDeals), { loading: () => <PackageSliderSkeleton /> });
const HoneymoonSpecials = dynamic(() => import('../components/HoneymoonSpecials').then(m => m.HoneymoonSpecials), { loading: () => <PackageSliderSkeleton /> });
const OfferSlider = dynamic(() => import('../components/OfferSlider').then(m => m.OfferSlider), { loading: () => <PackageSliderSkeleton /> });
const MediaBanner = dynamic(() => import('../components/MediaBanner').then(m => m.MediaBanner), { loading: () => <BannerSkeleton aspectRatio="aspect-[3/1] md:aspect-[6/1]" /> });
const PromoSlider = dynamic(() => import('../components/PromoSlider').then(m => m.PromoSlider), { loading: () => <PackageSliderSkeleton /> });
const FooterQuickLinks = dynamic(() => import('../components/FooterQuickLinks').then(m => m.FooterQuickLinks), { loading: () => <div className="py-10 bg-gray-50"><div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">{[1,2,3,4].map(i => <div key={i} className="space-y-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /><div className="space-y-2">{[1,2,3].map(j => <div key={j} className="h-3 w-32 bg-gray-100 rounded animate-pulse" />)}</div></div>)}</div></div> });

interface HomeClientProps {
    initialPackages: Package[];
    initialConfig: any;
    initialDestinations: any[];
}

export const HomeClient: React.FC<HomeClientProps> = ({ initialPackages, initialConfig, initialDestinations }) => {
    // Memoized section data calculation
    const calculatedSectionsData = React.useMemo(() => {
        if (!initialPackages.length || !initialConfig) return { dynamicSections: {}, cityDepartures: [], featuredCollections: [] };

        const activePackages = initialPackages.filter(p => p.status === 'published' && p.showOnHomepage !== false);
        const tempRenderedIds = new Set<string>();
        const dynamicSections: Record<string, Package[]> = {};

        (initialConfig.sections || []).forEach((section: any) => {
            if (!section.enabled) return;

            const sectionKey = section.key.toLowerCase();
            const explicitlyAssigned = activePackages.filter(p => {
                const sectArr = p.homepageSections || [];
                if (sectArr.includes(section.key)) return true;
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
            const combined = (section.type === 'packages' && !effectiveFilter) 
                ? explicitlyAssigned.slice(0, limit)
                : [...explicitlyAssigned, ...freshAuto].slice(0, limit);

            combined.forEach(p => tempRenderedIds.add(String(p._id || p.id)));
            dynamicSections[section.key] = combined;
        });

        const cityDepartures = activePackages.filter(p => p.homepageSections?.includes('cityDepartures')).slice(0, 8);
        cityDepartures.forEach(p => tempRenderedIds.add(String(p._id || p.id)));

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
            'partnersmarquee': <PartnersMarquee />,
            'faq': <FAQSection faqData={initialConfig?.faq} />,
            'newsletter': <Newsletter />,
            'whychooseus': <WhyChooseUs />,
            'quicklinks': <FooterQuickLinks quickLinks={initialConfig?.quickLinks || []} importantLinks={initialConfig?.importantLinks || []} />,
            'citydepartures': calculatedSectionsData.cityDepartures.length > 0 ? (
                <PackageSlider
                    title={section.title || "Packages From Your City"}
                    subtitle={section.subtitle || "Curated for travelers from your region"}
                    packages={calculatedSectionsData.cityDepartures}
                />
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

        return (
            <div key={section.key || `section-${index}`} className={`${index === 0 ? "pt-0" : ""} performance-section`}>
                {content}
            </div>
        );
    };

    const allPublishedPackages = React.useMemo(() => 
        initialPackages.filter(p => p.status === 'published'),
    [initialPackages]);

    const allPublishedDestinations = React.useMemo(() => 
        initialDestinations.filter(d => d.status !== 'draft'),
    [initialDestinations]);

    return (
        <div className="flex flex-col gap-0 text-gray-800 bg-white">
            <HeroSection 
                heroData={initialConfig?.heroSlider} 
                isLoading={!initialConfig?.heroSlider} 
            />

            <div className="relative z-20 -mt-10 lg:mt-0 bg-white rounded-none overflow-hidden flex flex-col gap-0">
                {initialConfig && Array.isArray(initialConfig.sections) && (
                    <div className="flex flex-col gap-0">
                        {[...initialConfig.sections, 
                          ...(!initialConfig.sections.some((s: any) => s.key?.toLowerCase() === 'consultation') ? [{ key: 'consultation', enabled: true, order: 16 }] : []),
                          ...(!initialConfig.sections.some((s: any) => s.key?.toLowerCase() === 'partnersmarquee') ? [{ key: 'partnersmarquee', enabled: true, order: 17 }] : []),
                          ...(!initialConfig.sections.some((s: any) => s.key?.toLowerCase() === 'faq') ? [{ key: 'faq', enabled: true, order: 18 }] : []),
                          ...(!initialConfig.sections.some((s: any) => s.key?.toLowerCase() === 'newsletter') ? [{ key: 'newsletter', enabled: true, order: 19 }] : []),
                          ...(!initialConfig.sections.some((s: any) => s.key?.toLowerCase() === 'whychooseus') ? [{ key: 'whychooseus', enabled: true, order: 21 }] : []),
                          ...(!initialConfig.sections.some((s: any) => s.key?.toLowerCase() === 'citydepartures') ? [{ key: 'citydepartures', enabled: true, order: 15 }] : [])
                        ]
                            .filter((s: any) => s && s.enabled && s.key !== 'quicklinks')
                            .sort((a: any, b: any) => (parseFloat(a.order) || 999) - (parseFloat(b.order) || 999))
                            .map((section: any, index: number) => renderSection(section, index))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};
