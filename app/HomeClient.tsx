"use client";

import React from 'react';
import { Package } from '../types';
import { DOMESTIC_LOCATIONS } from '../constants';
import dynamic from 'next/dynamic';
import { HeroSection } from '../components/HeroSection';
import { FadeIn } from '../components/FadeIn';

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
}

export const HomeClient: React.FC<HomeClientProps> = ({ initialPackages, initialConfig }) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Memoized section data calculation
    const calculatedSectionsData = React.useMemo(() => {
        if (!initialPackages.length || !initialConfig) return { dynamicSections: {}, cityDepartures: [], featuredCollections: [] };

        const tempRenderedIds = new Set<string>();
        const dynamicSections: Record<string, Package[]> = {};

        // Calculate dynamic sections
        (initialConfig.sections || []).forEach((section: any) => {
            if (!section.enabled) return;

            const explicitlyAssigned = initialPackages.filter(p => p.homepageSections?.includes(section.key));
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
                filtered = initialPackages.filter(p => p.isTrending || p.isBestSeller);
            } else if (effectiveFilter === 'honeymoon') {
                filtered = initialPackages.filter(p => p.category?.toLowerCase() === 'honeymoon' || p.title?.toLowerCase().includes('honeymoon'));
            } else if (effectiveFilter === 'weekend') {
                filtered = initialPackages.filter(p => p.duration <= 3 || p.title?.toLowerCase().includes('weekend'));
            } else if (effectiveFilter === 'international') {
                filtered = initialPackages.filter(p => p.category?.toLowerCase() === 'international');
            } else if (effectiveFilter === 'domestic') {
                filtered = initialPackages.filter(p => p.category?.toLowerCase() === 'domestic');
            } else if (section.type === 'packages') {
                filtered = initialPackages;
            }

            const freshAuto = filtered.filter(p => 
                !tempRenderedIds.has(String(p._id || p.id)) && 
                !explicitlyAssigned.some(e => String(e._id || e.id) === String(p._id || p.id))
            );

            const limit = section.queryConfig?.limit || 8;
            const combined = [...explicitlyAssigned, ...freshAuto].slice(0, limit);
            combined.forEach(p => tempRenderedIds.add(String(p._id || p.id)));
            dynamicSections[section.key] = combined;
        });

        // Calculate City Departures
        const cityExplicit = initialPackages.filter(p => p.homepageSections?.includes('cityDepartures'));
        const cityAuto = initialPackages.filter(p => p.title?.toLowerCase().includes('from') || p.groupSize === 'Fixed Departure');
        const cityFreshAuto = cityAuto.filter(p => 
            !tempRenderedIds.has(String(p._id || p.id)) && 
            !cityExplicit.some(e => String(e._id || e.id) === String(p._id || p.id))
        );
        const cityDepartures = [...cityExplicit, ...cityFreshAuto].slice(0, 8);
        cityDepartures.forEach(p => tempRenderedIds.add(String(p._id || p.id)));

        // Featured Collections
        const featuredCollections = initialPackages.filter(p => !tempRenderedIds.has(String(p._id || p.id))).slice(0, 12);

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
            'trendingPackages': <PackageSlider title={section.title || "Trending Packages"} subtitle={section.subtitle || "Most popular choices among travelers"} packages={sectionPackages.length > 0 ? sectionPackages : initialPackages.slice(0, 8)} />,
            'media': <MediaBanner data={section} />,
            'slider': <PromoSlider data={section} />,
            'consultation': <ConsultationBanner />,
            'quicklinks': <FooterQuickLinks quickLinks={initialConfig?.quickLinks || []} importantLinks={initialConfig?.importantLinks || []} />,
            'citydepartures': (
                <section className="py-12 md:py-20 overflow-hidden relative">
                    <PackageSlider
                        title={section.title || "Packages From Your City"}
                        subtitle={section.subtitle || "Curated for travelers from your region"}
                        packages={calculatedSectionsData.cityDepartures.length > 0 ? calculatedSectionsData.cityDepartures : initialPackages.slice(0, 8)}
                    />
                    <div className="mt-12 relative overflow-hidden group">
                        <div className="flex w-max animate-scroll hover:[animation-play-state:paused] py-2">
                            {[...METRO_CITIES, ...METRO_CITIES].map((city, idx) => (
                                <div key={`city-${city}-${idx}`} className="mx-2 md:mx-3 bg-white border border-gray-100 px-4 py-3 md:px-6 md:py-4 rounded-xl min-w-[140px] md:min-w-[180px] text-center hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer shadow-sm flex items-center justify-center">
                                    <span className="text-gray-600 font-medium tracking-wider text-[9px] md:text-[10px] group-hover:text-black">{city}</span>
                                </div>
                            ))}
                        </div>
                        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none" />
                    </div>
                </section>
            )
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

    return (
        <div className={`flex flex-col gap-0 text-gray-800 bg-white ${isMounted ? 'animate-in fade-in duration-500' : 'opacity-0'}`}>
            <HeroSection 
                heroData={initialConfig?.heroSlider} 
                isLoading={!isMounted} 
                mobileVideo={initialConfig?.mobileHeroVideo}
                showMobileVideo={initialConfig?.showMobileHeroVideo}
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
                        <FadeIn delay={20}><ConsultationBanner /></FadeIn>
                    )}

                    {!renderedDynamicKeys.has('citydepartures') && (
                        <FadeIn delay={30}>
                            <section className="py-12 md:py-20 overflow-hidden relative">
                                <PackageSlider
                                    title="Packages From Your City"
                                    subtitle="Curated for travelers from your region"
                                    packages={calculatedSectionsData.cityDepartures.length > 0 ? calculatedSectionsData.cityDepartures : initialPackages.slice(0, 8)}
                                />
                                <div className="mt-12 relative overflow-hidden group">
                                    <div className="flex w-max animate-scroll hover:[animation-play-state:paused] py-2">
                                        {[...METRO_CITIES, ...METRO_CITIES].map((city, idx) => (
                                            <div key={`city-${city}-${idx}`} className="mx-2 md:mx-3 bg-white border border-gray-100 px-4 py-3 md:px-6 md:py-4 rounded-xl min-w-[140px] md:min-w-[180px] text-center hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer shadow-sm flex items-center justify-center">
                                                <span className="text-gray-600 font-medium tracking-wider text-[9px] md:text-[10px] group-hover:text-black">{city}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
                                    <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none" />
                                </div>
                            </section>
                        </FadeIn>
                    )}

                    <div className="py-8 space-y-0">
                        <FadeIn delay={80}>
                            <FooterQuickLinks
                                quickLinks={initialPackages.map(p => ({ label: p.title, url: `/package/${p.slug}` }))}
                                importantLinks={Array.from(new Set(initialPackages.map(p => p.location))).map(loc => ({ label: loc, url: `/destination/${loc.toLowerCase().replace(/\\s+/g, '-')}` }))}
                            />
                        </FadeIn>
                        
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
