import React from 'react';
import Image from 'next/image';

const PARTNERS = [
  { name: 'Emirates', logo: '/partners/emirates.svg' },
  { name: 'Qatar Airways', logo: '/partners/qatar.svg' },
  { name: 'Indigo', logo: '/partners/indigo.svg' },
  { name: 'Singapore Airlines', logo: '/partners/singapore.svg' },
  { name: 'Air India', logo: '/partners/airindia.svg' },
  { name: 'Taj Hotels', logo: '/partners/taj.svg' },
  { name: 'Marriott', logo: '/partners/marriott.svg' },
  { name: 'Hilton', logo: '/partners/hilton.svg' },
  { name: 'Hyatt', logo: '/partners/hyatt.svg' },
  { name: 'Radisson', logo: '/partners/radisson.svg' },
];

export const PartnersMarquee: React.FC = () => {
  return (
    <section className="py-6 md:py-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-8 text-center">
        <h2 className="text-[10px] font-bold tracking-wider text-gray-400 mb-2">Our global partners</h2>
        <p className="text-gray-600 font-heading tracking-tight font-medium text-lg italic opacity-80">Seamless connections with the world's finest</p>
      </div>

      <div className="relative">
        {/* Gradient Mask for smooth edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-scroll hover:[animation-play-state:paused] py-4 items-center [transform:translateZ(0)]">
          {/* First set of logos */}
          {PARTNERS.map((partner, idx) => (
            <div key={`${partner.name}-${idx}`} className="mx-8 md:mx-12 group flex items-center justify-center min-w-[100px]">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={64}
                className="h-10 md:h-16 w-auto max-w-[160px] object-contain transition-all duration-500 transform hover:scale-110"
              />
            </div>
          ))}
          {/* Duplicate set for infinite loop */}
          {PARTNERS.map((partner, idx) => (
            <div key={`${partner.name}-dup-${idx}`} className="mx-8 md:mx-12 group flex items-center justify-center min-w-[100px]">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={64}
                className="h-10 md:h-16 w-auto max-w-[160px] object-contain transition-all duration-500 transform hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
