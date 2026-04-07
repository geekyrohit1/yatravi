"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Menu, X, Search, Instagram, Facebook, Twitter, MapPin, Headphones, ArrowRight, Loader2, Youtube, Linkedin, MessageCircle, Phone, Mail, SlidersHorizontal, Star, Calendar } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import { Button } from './Button';
import { SaleStrip } from './SaleStrip';
import { CommunityOffersFooter } from './CommunityOffersFooter';
import { useSettings } from '@/context/SettingsContext';
import ViChatAssistant from './ViChatAssistant';
import { Logo } from './Logo';
import { Header } from './Header';
import { Footer } from './Footer';
const MobileDrawer = dynamic(() => import('./MobileDrawer').then(m => m.MobileDrawer), { ssr: false });
const QuoteFormPopup = dynamic(() => import('./QuoteFormPopup').then(m => m.QuoteFormPopup), { ssr: false });
const MobileSearchModal = dynamic(() => import('./MobileSearchModal').then(m => m.MobileSearchModal), { ssr: false });



export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, loading } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuotePopupOpen, setIsQuotePopupOpen] = useState(false);
  const [isExternalPopupOpen, setIsExternalPopupOpen] = useState(false);
  const [isExternalFormOpen, setIsExternalFormOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isHideIconsPage = pathname?.startsWith('/packages/') || pathname?.startsWith('/destination/');
  const [mounted, setMounted] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const router = useRouter();

  // Search Implementation
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ packages: any[], destinations: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [trendingPackages, setTrendingPackages] = useState<any[]>([]);
  const [heroDestinations, setHeroDestinations] = useState<any[]>([]);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [hasStickyMobileBar, setHasStickyMobileBar] = useState(false);

  // Typewriter effect for Header Search Bar
  const [headerPlaceholder, setHeaderPlaceholder] = useState('');
  const [headerPlaceholderIndex, setHeaderPlaceholderIndex] = useState(0);
  const [headerIsDeleting, setHeaderIsDeleting] = useState(false);
  const phrases = ["Dubai", "Thailand", "Maldives", "Bali", "Japan"];

  useEffect(() => {
    const currentFullText = phrases[headerPlaceholderIndex];
    const typingSpeed = headerIsDeleting ? 60 : 180;

    const timeout = setTimeout(() => {
      if (!headerIsDeleting) {
        setHeaderPlaceholder(currentFullText.substring(0, headerPlaceholder.length + 1));
        if (headerPlaceholder === currentFullText) {
          setTimeout(() => setHeaderIsDeleting(true), 2000);
        }
      } else {
        setHeaderPlaceholder(currentFullText.substring(0, headerPlaceholder.length - 1));
        if (headerPlaceholder === '') {
          setHeaderIsDeleting(false);
          setHeaderPlaceholderIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [headerPlaceholder, headerIsDeleting, headerPlaceholderIndex]);

  useEffect(() => {
    setMounted(true);

    // 1. Fetch Global Search Data (Consolidated)
    const fetchGlobalSearchData = async () => {
      try {
        const timestamp = new Date().getTime();
        const [pkgRes, configRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/packages?t=${timestamp}`, { cache: 'no-store' }),
          fetch(`${API_BASE_URL}/api/homepage?t=${timestamp}`, { cache: 'no-store' })
        ]);

        if (pkgRes.ok) {
          const pkgData = await pkgRes.json();
          if (Array.isArray(pkgData)) {
            const trending = pkgData.filter((p: any) => p.isTrending || p.isBestSeller).slice(0, 6);
            setTrendingPackages(trending.length > 0 ? trending : pkgData.slice(0, 6));
          }
        }

        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData && configData.heroSlider) {
            const slides = configData.heroSlider
              .filter((s: any) => s.enabled !== false)
              .sort((a: any, b: any) => a.order - b.order)
              .map((s: any) => ({
                name: s.customTitle || s.name || 'Destination',
                slug: s.slug || 'explore',
                heroImage: s.customImage || s.heroImage || '/images/placeholder.svg'
              }));
            setHeroDestinations(slides.length > 0 ? slides : configData.heroSlider.slice(0, 5).map((s: any) => ({
              name: s.customTitle || s.name || 'Destination',
              slug: s.slug || 'explore',
              heroImage: s.customImage || s.heroImage || '/images/placeholder.svg'
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch search data", err);
      }
    };

    fetchGlobalSearchData();

    // 2. Load recent searches
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }

    // 3. Register Global Event Listeners
    const handleToggle = (e: any) => setHasStickyMobileBar(!!e.detail);
    const handleHideIcons = (e: any) => setIsExternalFormOpen(!!e.detail);
    const handleOpenSearch = () => setShowSearchModal(true);

    window.addEventListener('toggleFloatingButtons', handleToggle);
    window.addEventListener('hideFloatingIcons', handleHideIcons);
    window.addEventListener('open-mobile-search', handleOpenSearch);

    return () => {
      window.removeEventListener('toggleFloatingButtons', handleToggle);
      window.removeEventListener('hideFloatingIcons', handleHideIcons);
      window.removeEventListener('open-mobile-search', handleOpenSearch);
    };
  }, []);

  // Handle body scroll locking when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const saveRecentSearch = (query: string) => {
    if (!query.trim() || query.length < 2) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    const query = typeof e === 'string' ? e : e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.length < 1) {
      setSearchResults(null);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    if (typeof e !== 'string' && !showSearchModal) setShowDropdown(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        let url = `${API_BASE_URL}/api/packages/search/all?q=${encodeURIComponent(query)}`;
        if (showSearchModal && activeFilter !== 'All') url += `&category=${activeFilter}`;

        const res = await fetch(url);
        const data = await res.json();

        // Sort results if packages exist and we are in modal
        if (showSearchModal && data.packages && data.packages.length > 0) {
          const sorted = [...data.packages].sort((a: any, b: any) => {
            if (sortBy === 'Price: Low to High') return a.price - b.price;
            if (sortBy === 'Price: High to Low') return b.price - a.price;
            if (sortBy === 'Top Rated') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'Newest') return new Date(b.createdAt || b._id).getTime() - new Date(a.createdAt || a._id).getTime();
            return 0;
          });
          data.packages = sorted;
        }

        setSearchResults(data);
        if (query.length >= 3) saveRecentSearch(query);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleBlur = () => {
    // Delay hiding to allow click event to process
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setShowDropdown(false);
  };

  useEffect(() => {
    const textArray = ['Search "Dubai"', 'Search "Thailand"', 'Search "Bali"'];
    let loopNum = 0;
    let isDeleting = false;
    let txt = '';
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const i = loopNum % textArray.length;
      const fullTxt = textArray[i];
      if (isDeleting) {
        txt = fullTxt.substring(0, txt.length - 1);
      } else {
        txt = fullTxt.substring(0, txt.length + 1);
      }
      setPlaceholder(txt);
      let delta = 100 - Math.random() * 50;
      if (isDeleting) { delta /= 2; }
      if (!isDeleting && txt === fullTxt) {
        delta = 2000;
        isDeleting = true;
      } else if (isDeleting && txt === '') {
        isDeleting = false;
        loopNum++;
        delta = 500;
      }
      timeoutId = setTimeout(tick, delta);
    };
    timeoutId = setTimeout(tick, 100);
    return () => clearTimeout(timeoutId);
  }, []);


  if (isAdmin) {
    return <div className="min-h-screen bg-gray-950 text-white">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white opacity-100">
      {/* Reserving space for SaleStrip to prevent hydration jump */}
      <div className="relative z-[100] bg-white h-auto border-b border-gray-100">
        <SaleStrip />
      </div>
      <Header
        pathname={pathname}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsQuotePopupOpen={setIsQuotePopupOpen}
        headerPlaceholder={headerPlaceholder}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        showDropdown={showDropdown}
        isSearching={isSearching}
        searchResults={searchResults}
        router={router}
        clearSearch={clearSearch}
        handleBlur={handleBlur}
        placeholder={placeholder}
      />
      {/* Mobile Menu - Side-Drawer Popup */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenQuote={() => setIsQuotePopupOpen(true)}
      />

      <QuoteFormPopup isOpen={isQuotePopupOpen} onClose={() => setIsQuotePopupOpen(false)} />

      <main className="flex-grow">
        {children}
      </main>

      <Footer onOpenQuote={() => setIsQuotePopupOpen(true)} />

      {/* AI Assistant Chat Widget */}
      {mounted && !loading && settings?.enableAIChat === true && !isHideIconsPage && (
        <ViChatAssistant isHidden={isQuotePopupOpen || isExternalPopupOpen || isExternalFormOpen} />
      )}

      {/* Floating WhatsApp Button */}
      {mounted && !loading && settings?.enableWhatsappChat === true && !isHideIconsPage && !isQuotePopupOpen && !isExternalPopupOpen && !isExternalFormOpen && (
        <a
          href={`https://wa.me/${(settings?.whatsappNumber || '9587505726').replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed right-5 z-50 bg-[#25D366] text-white p-2.5 md:p-4 rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] transition-all duration-300 flex items-center justify-center lg:bottom-6 ${hasStickyMobileBar
            ? 'bottom-[85px]'
            : 'bottom-5'
            }`}
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-7 h-7 md:w-9 md:h-9" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </a>
      )}

      {/* Mobile Search Modal Overlay */}
      <MobileSearchModal
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchChange={handleSearchChange}
        settings={settings}
        isSearching={isSearching}
        searchResults={searchResults}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        recentSearches={recentSearches}
        clearRecentSearches={clearRecentSearches}
        heroDestinations={heroDestinations}
        trendingPackages={trendingPackages}
        router={router}
      />
    </div>
  );
};
