import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaBannerProps {
    data: {
        title?: string;
        subtitle?: string;
        mediaUrl?: string;
        mobileMediaUrl?: string;
        mediaSlides?: { desktop: string; mobile: string }[];
        isVideo?: boolean;
        cards?: { linkValue: string }[];
    };
}

export const MediaBanner: React.FC<MediaBannerProps> = ({ data }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    const handleImageLoad = (key: string) => {
        setLoadedImages(prev => ({ ...prev, [key]: true }));
    };
    const slides = data.mediaSlides && data.mediaSlides.length > 0
        ? data.mediaSlides
        : data.mediaUrl
            ? [{ desktop: data.mediaUrl, mobile: data.mobileMediaUrl || data.mediaUrl }]
            : [];

    const totalSlides = slides.length;

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }, [totalSlides]);

    useEffect(() => {
        if (totalSlides <= 1) return;
        const interval = setInterval(nextSlide, 5000); // Auto-play every 5s
        return () => clearInterval(interval);
    }, [totalSlides, nextSlide]);

    if (totalSlides === 0) return null;

    const linkValue = data.cards?.[0]?.linkValue;

    return (
        <section className="w-full pt-2 md:pt-4 pb-0 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-xl shadow-xl relative bg-white group">
                    {data.isVideo && totalSlides === 1 ? (
                        <div className="relative w-full">
                            <video
                                src={slides[0].desktop}
                                className="w-full h-auto min-h-[140px] md:min-h-[200px] object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                            {linkValue && (
                                <a
                                    href={linkValue}
                                    className="absolute inset-0 z-10"
                                    aria-label="Visit offer"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="relative w-full overflow-hidden bg-gray-50 aspect-[800/266] md:aspect-[1920/450]">
                            {/* Slides Container */}
                            <div 
                                className="flex transition-transform duration-700 ease-in-out h-full"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {slides.map((slide, idx) => (
                                    <div key={idx} className="w-full h-full flex-shrink-0 relative">
                                        {/* Desktop Image */}
                                        <Image
                                            src={slide.desktop}
                                            alt={`Banner Slide ${idx + 1}`}
                                            fill
                                            quality={100}
                                            sizes="100vw"
                                            onLoadingComplete={() => handleImageLoad(`desktop-${idx}`)}
                                            className={`object-cover transition-all duration-700 img-blur-reveal ${loadedImages[`desktop-${idx}`] ? 'img-reveal-complete' : ''} ${slide.mobile ? 'hidden md:block' : 'block'}`}
                                            priority={idx === 0}
                                        />
                                        {/* Mobile Image */}
                                        {slide.mobile && (
                                            <Image
                                                src={slide.mobile}
                                                alt={`Banner Slide ${idx + 1} Mobile`}
                                                fill
                                                quality={100}
                                                sizes="100vw"
                                                onLoadingComplete={() => handleImageLoad(`mobile-${idx}`)}
                                                className={`object-cover md:hidden block transition-all duration-700 img-blur-reveal ${loadedImages[`mobile-${idx}`] ? 'img-reveal-complete' : ''}`}
                                                priority={idx === 0}
                                            />
                                        )}
                                        {/* Link Overlay */}
                                        {linkValue && (
                                            <a
                                                href={linkValue}
                                                className="absolute inset-0 z-10"
                                                aria-label={`Visit offer slide ${idx + 1}`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Arrows (only if multi-slide) */}
                            {totalSlides > 1 && (
                                <>
                                    <button 
                                        onClick={prevSlide}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={nextSlide}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:block"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {/* Indicators/Dots */}
                            {totalSlides > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                                                currentSlide === idx 
                                                    ? 'bg-white shadow-md w-6 md:w-8' 
                                                    : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
