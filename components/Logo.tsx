import React from 'react';

export const Logo = ({
  className = "flex flex-col items-stretch px-1 lg:px-2",
  forceDesktop = false
}: {
  className?: string,
  forceDesktop?: boolean
}) => (
  <div className={`relative flex items-center ${className} select-none flex-shrink-0 group`}>
    {!forceDesktop && (
      <div className="md:hidden w-10 h-10 bg-brand flex items-center justify-center rounded-lg shadow-sm active:scale-95 transition-all overflow-hidden relative">
        {/* Decorative Bubble Art Outlines */}
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border border-white/30 rounded-full" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border border-white/10 rounded-full" />
        <div className="absolute top-1 left-1 w-1 h-1 bg-white/15 rounded-full" />
        <span className="relative z-10 font-alt text-[20px] font-bold text-white leading-none mt-[-2px]">
          Y
        </span>
      </div>
    )}

    <div className={`${forceDesktop ? 'flex' : 'hidden md:flex'} flex-col items-stretch leading-none px-1 lg:px-2 lg:translate-y-[1px]`}>
      <div className="flex items-center justify-center">
        <span className="font-alt text-[19px] font-bold text-gray-900 lg:text-white transition-colors duration-500 uppercase tracking-[0.14em] whitespace-nowrap">
          Yatravi
        </span>
      </div>
      <div className="flex justify-between items-center w-full mt-1.5 opacity-90">
        {"WE CARE YOUR TRIP".split("").map((char, i) => (
          <span key={i} className="font-sans text-[7px] font-bold text-gray-500 lg:text-white/95 uppercase leading-none select-none">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  </div>
);
