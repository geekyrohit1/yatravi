import React from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenQuote }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[99998] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div 
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-[80%] z-[99999] bg-white flex flex-col overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Advanced Background Art */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Rotating Blobs for "Alive" feel */}
          <div className="absolute -top-[10%] -right-[10%] w-[100%] h-[60%] bg-gradient-to-br from-brand/10 to-transparent blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-[20%] -left-[20%] w-[90%] h-[50%] bg-gradient-to-tr from-blue-500/5 to-transparent blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />

          {/* Subtle Dots Pattern - Layered */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_0.5px,_transparent_0.5px)] bg-[length:24px_24px]" />
        </div>

        {/* Header Greetings - Glass Effect */}
        <div className="h-[80px] flex items-center justify-between px-4 border-b border-gray-100 bg-white/80 backdrop-blur-xl relative z-10">
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-gray-900 tracking-tight">Hello Traveller</span>
            <span className="text-[11px] font-medium text-gray-400 mt-0.5 tracking-[0.01em]">Welcome to Yatravi</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-900 bg-gray-50/50 rounded-full border border-gray-100/50 active:scale-90 transition-all"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 custom-scrollbar flex flex-col relative z-10">
          <div className="flex flex-col space-y-2 w-full">
            {[
              { name: 'Home', href: '/' },
              { name: 'Web Check-in', href: '/web-check-in' },
              { name: 'Contact Us', href: '/contact' },
              { name: 'About Us', href: '/about' },
              { name: 'Join Us', href: '/join' },
              { name: 'Support', href: '/support-center' }
            ].map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                style={{ animationDelay: `${i * 60}ms` }}
                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100/50 rounded-xl text-[13px] font-medium text-gray-700 tracking-[0.02em] active:bg-brand/5 active:text-brand transition-all flex items-center justify-between group animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both"
              >
                <span>{link.name}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-active:opacity-100 group-active:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        <div className="p-4 pb-16 bg-white/50 backdrop-blur-xl border-t border-gray-100/50 flex flex-col items-center relative z-10">
          <button
            onClick={() => { onClose(); onOpenQuote(); }}
            className="w-full px-8 py-4 text-[12px] font-bold tracking-wider text-white bg-brand shadow-[0_10px_30px_rgba(58,123,213,0.15)] rounded-full flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <span>Get Free Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-8 text-center">
            <p className="text-gray-300 text-[9px] font-bold tracking-wider leading-none">Yatravi • Journey • Care</p>
          </div>
        </div>
      </div>
    </>
  );
};
