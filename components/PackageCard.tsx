"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package } from '../types';
import { Star, Phone, MapPin, X, ArrowRight, Clock, TrendingUp, Users, Calendar, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { API_BASE_URL } from '@/constants';

interface PackageCardProps {
  pkg: Package;
  variant?: 'vertical' | 'horizontal';
}

const ModalPortal = ({ children, mounted }: { children: React.ReactNode, mounted: boolean }) => {
  if (!mounted) return null;
  return createPortal(children, document.body);
};

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, variant = 'vertical' }) => {
  const router = useRouter();
  const [currentImage] = useState(0);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [callbackData, setCallbackData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayImages = [pkg.image, ...(pkg.gallery || [])].filter(img => img && typeof img === 'string' && img.trim() !== '');
  const safeImages = displayImages.length > 0 ? displayImages : ['/images/placeholder.svg'];

  const price = pkg.price || 0;
  const originalPrice = pkg.originalPrice || price;
  const savedAmount = originalPrice - price;

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: callbackData.name,
          phone: callbackData.phone,
          email: 'callback@request.com', // Placeholder email for callback requests
          packageTitle: pkg.title,
          packageId: pkg.id || pkg._id,
          message: `Request for a call back regarding: ${pkg.title}`,
          source: 'Package Card Callback'
        }),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setCallbackData({ name: '', phone: '' });
        setTimeout(() => {
          setIsCallbackOpen(false);
          setFormSubmitted(false);
        }, 2500);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Callback error:', error);
      alert('Connection error. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderCallbackModal = () => (
    isCallbackOpen && (
      <ModalPortal mounted={mounted}>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300" onClick={() => setIsCallbackOpen(false)}>
          <div 
            className="bg-white w-full max-w-[92%] sm:max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 pointer-events-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCallbackOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-50/80 rounded-full text-gray-400 hover:text-gray-900 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-5 animate-bounce">
                  <ArrowRight className="w-8 h-8 rotate-[-90deg]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h3>
                <p className="text-gray-500 font-medium text-sm">Our travel expert will call you back within 15 minutes.</p>
              </div>
            ) : (
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-[20px] font-bold text-gray-900 mb-1.5 leading-tight">Get Expert Guidance</h3>
                  <p className="text-gray-500 text-[13px] font-medium leading-relaxed">Let us help you plan your perfect trip to <span className="text-brand font-semibold">{pkg.title}</span></p>
                </div>

                <form onSubmit={handleCallbackSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand outline-none transition-all placeholder:text-gray-300 font-medium text-sm"
                      placeholder="e.g. John Doe"
                      value={callbackData.name}
                      onChange={(e) => setCallbackData({ ...callbackData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</span>
                      <input
                        required
                        type="tel"
                        pattern="[0-9]{10}"
                        className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-brand/5 focus:border-brand outline-none transition-all placeholder:text-gray-300 font-medium text-sm"
                        placeholder="9876543210"
                        value={callbackData.phone}
                        onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:shadow-xl hover:translate-y-[-1px] transition-all active:scale-[0.98] tracking-wider text-[13px] uppercase flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Request Call Back'
                    )}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 font-medium pt-2">By submitting, you agree to our privacy policy.</p>
                </form>
              </div>
            )}
          </div>
        </div>
      </ModalPortal>
    )
  );

  // 1. Horizontal Layout
  if (variant === 'horizontal') {
    return (
      <div
        className="group flex flex-col md:flex-row bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full max-w-full"
        onClick={() => router.push(`/packages/${pkg.slug || pkg.id}`)}
      >

        {/* Image Section - Fixed Aspect Ratio */}
        <div className="relative w-full max-w-[calc(100vw-32px)] md:w-[260px] lg:w-[300px] aspect-[1.2/1] md:aspect-auto shrink-0 overflow-hidden bg-gray-50">

          <Image
            src={safeImages[0]}
            alt={pkg.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 260px, 300px"
          />

          {/* Overlay Badges removed from image overlay as requested */}
        </div>

        {/* Content Section - Compact Padding */}
        <div className="p-3 md:p-4 flex-1 flex flex-col justify-between relative bg-white min-w-0">

          <div className="flex-1 min-w-0 px-1">
            {/* 1. Title - Maximum Width */}
            <h3 className="text-[17px] md:text-[19px] font-heading font-medium text-gray-900 mb-1.5 leading-tight group-hover:text-brand transition-colors tracking-tight truncate">
              {pkg.title}
            </h3>



            
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex items-center gap-1.5 bg-gray-50/80 px-2.5 py-1 rounded-md border border-gray-100/50">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] text-gray-600 font-bold tracking-tight">{pkg.duration}D / {pkg.duration - 1}N</span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50/50 px-2.5 py-1 rounded-md border border-orange-100/30">
                <Star className="w-3.5 h-3.5 fill-brand text-brand" />
                <span className="text-[11px] text-brand font-bold">{pkg.rating}</span>
                <span className="text-[10px] text-gray-400 font-medium ml-0.5">({pkg.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Stay Summary (Replaces Region Breakdown) */}
          {(() => {
            const summaryText = pkg.regionBreakdown || pkg.itinerarySummary || '';
            const parts = summaryText.split(/[•|·|\-|\||,]/);
            const stays = parts.map(part => {
              const match = part.trim().match(/^(\d+[Nn])\s*(.*)$/);
              if (match) {
                const nights = match[1];
                const location = match[2].trim();
                return { nights, location };
              }
              return null;
            }).filter(Boolean);

            if (stays.length === 0) return null;

            return (
              <div className="flex flex-wrap items-center gap-1.5 py-1.5 px-3 bg-orange-50/20 border border-orange-100/30 rounded-lg mb-4 w-fit">
                {stays.map((stay, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] md:text-[11px] font-bold text-gray-900">{stay?.nights}</span>
                      <span className="text-[9px] font-extrabold text-[#fb5012] uppercase tracking-tighter">Stay</span>
                      {stay?.location && <span className="text-[10px] md:text-[11px] text-gray-700 font-medium ml-0.5">{stay.location}</span>}
                    </div>
                    {idx < stays.length - 1 && <span className="text-gray-300 mx-2 text-[8px]">•</span>}
                  </React.Fragment>
                ))}
              </div>
            );
          })()}


          {/* Footer Area - Compact Footer */}
          <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr,auto] items-end gap-3">
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-400 font-semibold tracking-wider leading-none mb-1.5 uppercase">Starting from</p>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tighter">INR {price.toLocaleString()}</span>
                {originalPrice > price && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 line-through font-medium opacity-60">INR {originalPrice.toLocaleString()}</span>
                    <span className="bg-[#f0fdf4] text-[#0f766e] text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-[#dcfce7] tracking-wide inline-block">
                      SAVE INR {savedAmount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="pt-0.5">
                <p className="text-[8px] md:text-[9px] text-green-600 font-semibold bg-green-50/50 w-fit px-1.5 py-0.5 rounded-md border border-green-100/30 tracking-wide inline-block">Includes Taxes & Fees</p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={(e) => { e.stopPropagation(); setIsCallbackOpen(true); }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:border-brand hover:text-brand hover:bg-brand-light/10 transition-all duration-300 bg-gray-50/20 shrink-0"
                aria-label="Call for details"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => router.push(`/packages/${pkg.slug || pkg.id}`)}
                className="flex-1 sm:flex-none px-6 h-10 md:h-12 bg-brand text-white rounded-lg font-bold text-[10px] md:text-[11px] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand/20 transition-all active:scale-[0.98] whitespace-nowrap"
              >
                View Details <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        </div>
        {renderCallbackModal()}
      </div>
    );
  }

  // 2. Vertical Layout
  return (
    <>
      <div
        className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-200/60 overflow-hidden group flex flex-col h-full cursor-pointer transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transform-gpu"
        onClick={() => router.push(`/packages/${pkg.slug || pkg.id}`)}
      >

        {/* Image Section */}
        <div className="relative aspect-[1.1/1] md:aspect-[1.15/1] overflow-hidden">


          <Image
            src={safeImages[currentImage]}
            alt={pkg.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 300px, 400px"
          />


          {/* Top-Left Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
            {pkg.groupSize && pkg.groupSize.toLowerCase().includes('fixed') && (
              <div className="bg-white/95 backdrop-blur-md border border-white/40 text-[#fb5012] text-[7px] font-bold px-1.5 py-0.5 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center gap-1 tracking-[0.08em]">
                <Calendar className="w-2 h-2" />
                <span>Fixed Departure</span>
              </div>
            )}
            {pkg.isBestSeller && (
              <div className="bg-[#fb5012] text-white text-[7px] font-bold px-1.5 py-0.5 rounded-md shadow-[0_4px_12px_rgba(251,80,18,0.2)] flex items-center gap-1 tracking-[0.08em]">
                <Star className="w-2 h-2 fill-current" />
                Best Seller
              </div>
            )}
            {pkg.isTrending && (
              <div className="bg-blue-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-md shadow-[0_4px_12px_rgba(37,99,235,0.2)] flex items-center gap-1 tracking-[0.08em]">
                <TrendingUp className="w-2 h-2" />
                Trending
              </div>
            )}
          </div>
          
          {/* Bottom Overlay Badges (Reverted Position) */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between items-end z-20">
            <div className="bg-white/95 backdrop-blur-md px-1.5 py-1 rounded-md shadow-sm flex items-center gap-1 border border-white/40 leading-none">
              <Clock className="w-3 h-3 text-gray-900" />
              <span className="text-[9px] md:text-[11px] text-gray-900 font-bold tracking-tight">
                {pkg.duration}D / {pkg.duration - 1}N
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-1.5 py-1 rounded-md shadow-sm font-bold text-[9px] md:text-[11px] border border-white/40 leading-none">
              <Star className="w-3 h-3 fill-brand text-brand" />
              <span className="text-brand">{pkg.rating}</span>
            </div>
          </div>
        </div>



        {/* Content Section */}
        <div className="p-1.5 md:p-2 lg:p-3.5 flex-1 flex flex-col">
          <div className="mb-0.5">
            <h3 className="text-[12.5px] lg:text-[16px] font-heading font-medium text-gray-900 leading-[1.2] tracking-tight group-hover:text-brand transition-colors truncate">
              {pkg.title}
            </h3>
          </div>





          {/* Stay Summary (Replaces Region Breakdown) */}
          {(() => {
            const summaryText = pkg.regionBreakdown || pkg.itinerarySummary || '';
            const parts = summaryText.split(/[•|·|\-|\||,]/);
            const stays = parts.map(part => {
              const match = part.trim().match(/^(\d+[Nn])\s*(.*)$/);
              if (match) {
                const nights = match[1];
                const location = match[2].trim();
                return { nights, location };
              }
              return null;
            }).filter(Boolean);

            if (stays.length === 0) return null;

            return (
              <div className="flex flex-wrap items-center gap-1 py-0.5 px-2 bg-[#fffaf0] border border-orange-100/20 rounded-sm mb-1.5 w-fit transform-gpu">
                {stays.map((stay, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[9px] font-bold text-gray-900">{stay?.nights}</span>
                      <span className="text-[8px] font-extrabold text-[#fb5012] uppercase tracking-tighter">Stay</span>
                      {stay?.location && <span className="text-[9.5px] text-gray-700 font-medium ml-0.5">{stay.location}</span>}
                    </div>
                    {idx < stays.length - 1 && <span className="text-gray-300 mx-0.5 text-[8px]">•</span>}
                  </React.Fragment>
                ))}
              </div>
            );
          })()}


          <div className="mt-auto">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] text-gray-500 line-through font-medium tracking-tight">INR {originalPrice.toLocaleString()}</span>
              <span className="bg-[#f0fdf4] text-[#0f766e] text-[7.5px] font-extrabold px-1.5 py-0.5 rounded-md border border-[#dcfce7]">
                SAVE INR {savedAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1.5 md:mb-3">
              <h3 className="text-[14.5px] md:text-lg lg:text-xl font-bold text-gray-900 tracking-tight">INR {price.toLocaleString()}</h3>
              <span className="text-[8.5px] lg:text-[10px] text-gray-400 font-medium whitespace-nowrap">/ person</span>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={(e) => { e.stopPropagation(); setIsCallbackOpen(true); }}
                className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl border-2 border-brand text-brand flex items-center justify-center hover:bg-brand hover:text-white transition-all shadow-sm shrink-0"
                aria-label="Call for details"
              >
                <Phone className="w-3 h-3 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => router.push(`/packages/${pkg.slug || pkg.id}`)}
                className="flex-1 bg-brand text-white font-semibold h-8 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-brand/20 transition-all text-[8px] md:text-[11px] uppercase tracking-wider px-2 md:px-8 whitespace-nowrap"
              >
                View Details <ArrowRight className="w-2.5 h-2.5 md:w-4 md:h-4" />
              </button>

            </div>


          </div>
        </div>

      </div>
      {renderCallbackModal()}
    </>
  );
};
