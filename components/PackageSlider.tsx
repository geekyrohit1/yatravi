import React, { useRef, useState, useEffect } from 'react';
import { Package } from '../types';
import { PackageCard } from './PackageCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PackageSliderProps {
  title: string;
  subtitle?: string;
  packages: Package[];
}

export const PackageSlider: React.FC<PackageSliderProps> = ({ title, subtitle, packages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1); 
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      checkScrollPosition();
      currentRef.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        currentRef.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [packages]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="pt-4 md:pt-10 pb-0 bg-white performance-section gpu-accelerated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-5 md:h-6 bg-brand rounded-full"></div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 py-1">
                {title}
              </h2>
            </div>
            {subtitle && <p className="text-gray-500 text-[10px] md:text-xs ml-4 pl-3 border-l-2 border-gray-200 tracking-wide font-medium">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-brand/30 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-brand/30 flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-all duration-300"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-3 md:space-x-6 overflow-x-auto pb-2 no-scrollbar px-1 snap-x snap-mandatory md:snap-none transform-gpu"
          >
            {packages.map((pkg, index) => (
              <div key={pkg._id || pkg.id || index} className="w-[calc((100vw-40px)/1.3)] md:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/4)] flex-shrink-0 snap-start rounded-lg overflow-hidden">
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
