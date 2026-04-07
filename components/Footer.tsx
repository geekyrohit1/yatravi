import React from 'react';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { CommunityOffersFooter } from './CommunityOffersFooter';

interface FooterProps {
  onOpenQuote: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuote }) => {
  return (
    <footer id="footer" className="bg-brand-dark text-white pt-10 md:pt-16 pb-6 border-t-0 relative overflow-hidden z-10 selection:bg-brand-light selection:text-white">
      {/* Top Wave Shape */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none -translate-y-[99%] pointer-events-none z-20">
        <svg viewBox="0 0 2880 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[50px] md:h-[70px] block">
          <path d="M0,80 C480,10 960,70 1440,30 C1920,0 2400,60 2880,20 L2880,80 L0,80 Z" fill="#253034" />
        </svg>
      </div>

      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-8 mb-8 px-4 sm:px-8 lg:px-12">
          {/* Branding */}
          <div className="md:col-span-1 lg:col-span-3 flex flex-col items-start lg:pr-4 text-white">
            <div className="mb-6 brightness-0 invert opacity-100 flex items-center">
              <Logo forceDesktop />
            </div>
            <p className="text-white/50 text-[12.5px] leading-relaxed mb-4 font-normal tracking-wide">
              Curating the world's most beautiful destinations for your premium journeys.
            </p>
            <div className="space-y-2 mb-5 w-full">
              <a href="tel:+919587505726" className="group flex items-center text-[12.5px] font-normal tracking-wide text-white/70 lg:hover:text-brand transition-all duration-300 gap-3">
                <div className="bg-white/5 p-2 rounded-full border border-white/10 group-hover:bg-brand/10 group-hover:border-brand/20 transition-all">
                  <Phone className="w-3.5 h-3.5 text-white/50 group-hover:text-brand" />
                </div>
                +91 95875 05726
              </a>
              <a href="tel:+919982132143" className="group flex items-center text-[12.5px] font-normal tracking-wide text-white/60 lg:hover:text-brand transition-all duration-300 gap-3">
                <div className="bg-white/5 p-2 rounded-full border border-white/10 group-hover:bg-brand/10 group-hover:border-brand/20 transition-all">
                  <Phone className="w-3.5 h-3.5 text-white/50 group-hover:text-brand" />
                </div>
                {['+91', '99821', '32143'].join(' ')}
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div className="md:col-span-1 lg:col-span-2 md:pt-2 text-white">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-5 text-white flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white block"></span>
              Navigate
            </h3>
            <ul className="space-y-2.5 text-[12.5px] text-white/60 font-normal font-sans tracking-wide">
              {['About Us', 'Destinations', 'Support Center'].map((item, idx) => (
                <li key={idx}>
                  <Link href={item === 'About Us' ? '/about' : `/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-white hover:translate-x-1.5 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-[2px] bg-white/20 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1 lg:col-span-2 md:pt-2 text-white">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-5 text-white flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white block"></span>
              Legal
            </h3>
            <ul className="space-y-2.5 text-[12.5px] text-white/60 font-normal font-sans tracking-wide">
              {['Privacy Policy', 'Terms & Conditions', 'Contact Us'].map((item, idx) => (
                <li key={idx}>
                  <Link href={`/${item.split(' ')[0].toLowerCase()}`} className="hover:text-white hover:translate-x-1.5 transition-all duration-300 flex items-center group">
                    <span className="w-0 h-[2px] bg-white/20 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1 lg:col-span-2 md:pt-2 text-white">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-5 text-white flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white block"></span>
              Contact
            </h3>
            <ul className="space-y-3">
              {[
                { email: 'yatraviholidays@gmail.com', label: 'Partners' },
                { email: 'heslpdeskyatravi@gmail.com', label: 'Support' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a href={`mailto:${item.email}`} className="group flex flex-col transition-all duration-300">
                    <span className="text-[12.5px] font-normal text-white/60 group-hover:text-white transition-colors flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-white/40 shrink-0 transition-colors group-hover:text-white" />
                      {/* Bot-protected email rendering */}
                      {[item.email.split('@')[0], item.email.split('@')[1]].join('@')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="md:col-span-1 lg:col-span-3 md:pt-2 lg:pl-4 text-gray-900">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] mb-5 text-white flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white block"></span>
              Join Community
            </h3>
            <div className="bg-white/20 p-3 rounded-xl border border-white/40 backdrop-blur-sm">
              <CommunityOffersFooter />
            </div>
          </div>
        </div>

        <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 text-[12px] font-normal text-white/30 px-4 sm:px-8 lg:px-12">
          <p className="tracking-[0.1em] mb-2 sm:mb-0 uppercase">&copy; 2026 Yatravi.com. All rights reserved.</p>
          <p className="tracking-wide">Designed with <span className="text-white/20">♥</span> for premium travelers</p>
        </div>
      </div>
    </footer>
  );
}
