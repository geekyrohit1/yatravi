import React from 'react';
import Link from 'next/link';
import { Headphones, ArrowRight, Search, Loader2, Menu, X } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  pathname: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  setIsQuotePopupOpen: (open: boolean) => void;
  headerPlaceholder: string;
  searchQuery: string;
  handleSearchChange: (e: any) => void;
  showDropdown: boolean;
  isSearching: boolean;
  searchResults: any;
  router: any;
  clearSearch: () => void;
  handleBlur: () => void;
  placeholder: string;
}

export const Header: React.FC<HeaderProps> = ({
  pathname,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  setIsQuotePopupOpen,
  headerPlaceholder,
  searchQuery,
  handleSearchChange,
  showDropdown,
  isSearching,
  searchResults,
  router,
  clearSearch,
  handleBlur,
  placeholder
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Performance Optimization: Prevent mounting the global header on mobile homepage
  // since HeroSection provides its own integrated header.
  if (mounted && isMobile && pathname === '/') {
    return null;
  }

  return (
    <nav className={`${pathname === '/'
      ? 'hidden lg:flex md:absolute md:top-10 md:bg-transparent md:border-0 md:shadow-none md:lg:bg-brand-dark lg:border-white/10 md:bg-white/80 md:backdrop-blur-md'
      : 'sticky top-0 lg:bg-brand-dark lg:border-white/10 bg-white/80 backdrop-blur-md border-b border-white/50 flex'
      } w-full ${isMobileMenuOpen ? 'z-[9999]' : 'z-[100]'} px-4 sm:px-6 lg:px-8 py-1.5 md:py-3 lg:py-6 transition-all duration-300 [backface-visibility:hidden] [transform:translateZ(0)]`}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between gap-2 lg:gap-0">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center group flex-shrink-0 select-none">
            <Logo />
          </Link>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center flex-1 mx-4">
            <div className="flex items-center justify-evenly w-full">
              <Link href="/" className="text-gray-700 lg:text-white/90 lg:hover:text-brand transition-colors text-[13px] font-medium tracking-[0.02em] relative group">
                <span>Home</span>
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>

              <Link href="/web-check-in" className="text-gray-700 lg:text-white/90 lg:hover:text-brand transition-colors text-[13px] font-medium tracking-[0.02em] relative group">
                <span>Web Check-in</span>
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
              <Link href="/contact" className="text-gray-700 lg:text-white/90 lg:hover:text-brand transition-colors text-[13px] font-medium tracking-[0.02em] relative group">
                <span>Contact</span>
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
              <Link href="/about" className="text-gray-700 lg:text-white/90 lg:hover:text-brand transition-colors text-[13px] font-medium tracking-[0.02em] relative group">
                <span>About Us</span>
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
              <Link href="/join" className="text-gray-700 lg:text-white/90 lg:hover:text-brand transition-colors text-[13px] font-medium tracking-[0.02em] relative group">
                <span>Join Us</span>
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
              <Link href="/support-center" className="text-gray-700 lg:text-white/90 lg:hover:text-brand transition-colors text-[13px] font-medium tracking-[0.02em] relative group flex items-center gap-1.5">
                <Headphones className="w-4 h-4" />
                <span>Support</span>
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
              <button
                onClick={() => setIsQuotePopupOpen(true)}
                className="ml-2 px-5 py-2.5 bg-brand text-white text-[13px] font-medium tracking-wide rounded-full hover:shadow-[0_4px_14px_0_rgba(251,80,18,0.3)] transition-all duration-300 border border-brand/20 relative overflow-hidden group flex items-center gap-2"
              >
                <span className="relative z-10">Get Free Quote</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 w-[200%] h-full bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out z-0"></div>
              </button>
            </div>
          </div>

          {/* Mobile Header Search Bar - Hidden on Home Page since it moves to Hero Bottom */}
          <div className={`lg:hidden flex-1 ${pathname === '/' ? 'opacity-0 pointer-events-none hidden' : ''}`}>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-search'))}
              className="w-full h-[38px] md:h-[44px] flex items-center justify-between px-4 bg-gray-50 border border-gray-200/60 rounded-lg shadow-inner active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-gray-400" />
                <div className="text-[12px] font-semibold font-sans flex items-center gap-1">
                  <span className="text-gray-600">Search</span>
                  <span className="text-brand" translate="no">{headerPlaceholder}</span>
                  <span className="inline-block w-[1.5px] h-3.5 bg-brand/60 animate-pulse" />
                </div>
              </div>
            </button>
          </div>

          {/* Right Side - Search Bar Desktop */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => { if (searchQuery.length >= 2) handleSearchChange(searchQuery); }}
                onBlur={handleBlur}
                placeholder={placeholder || "Search..."}
                className="w-44 pl-4 pr-10 py-2.5 rounded-full bg-gray-50/80 border border-gray-200 
                         text-gray-800 placeholder-gray-400 text-[13px] font-medium
                         shadow-inner focus:outline-none focus:bg-white focus:border-brand-light/50 focus:ring-2 focus:ring-brand-light/20 focus:w-64 focus:shadow-md
                         transition-all duration-300 backdrop-blur-sm lg:bg-white lg:border-white/20 lg:text-gray-900 lg:placeholder-gray-500"
              />
              <button 
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 lg:text-gray-400 hover:text-gray-600 lg:hover:text-brand transition-colors"
              >
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </button>

              {/* Search Dropdown */}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                  ) : searchResults ? (
                    (searchResults.destinations.length === 0 && searchResults.packages.length === 0) ? (
                      <div className="p-4 text-center text-gray-400 text-sm">No results found for "{searchQuery}"</div>
                    ) : (
                      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {/* Destinations */}
                        {searchResults.destinations.length > 0 && (
                          <div className="p-2">
                            <h3 className="text-[10px] font-bold text-gray-400 tracking-[0.1em] px-3 py-2">Destinations</h3>
                            {searchResults.destinations.map((dest: any) => (
                              <button
                                key={dest._id}
                                onClick={() => {
                                  router.push(`/destination/${dest.slug}`);
                                  clearSearch();
                                }}
                                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                              >
                                <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 relative">
                                  {dest.heroImage ? (
                                    <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <Search className="w-5 h-5 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 text-sm">{dest.name}</p>
                                  <p className="text-[10px] text-gray-400">Explore Destination</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Separator if both exist */}
                        {searchResults.destinations.length > 0 && searchResults.packages.length > 0 && (
                          <div className="h-px bg-gray-100 mx-2" />
                        )}

                        {/* Packages */}
                        {searchResults.packages.length > 0 && (
                          <div className="p-2">
                            <h3 className="text-[10px] font-bold text-gray-400 tracking-[0.1em] px-3 py-2">Packages</h3>
                            {searchResults.packages.map((pkg: any) => (
                              <button
                                key={pkg._id}
                                onClick={() => {
                                  router.push(`/packages/${pkg.slug}`);
                                  clearSearch();
                                }}
                                className="w-full flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                              >
                                <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 relative">
                                  {pkg.image ? (
                                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <Search className="w-4 h-4 text-gray-300" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800 text-xs line-clamp-2 leading-tight mb-0.5" translate="no">
                                    <span>{pkg.title}</span>
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <p className="text-[10px] text-gray-400 truncate max-w-[60%]">
                                      <span>{pkg.location}</span>
                                    </p>
                                    <p className="text-[10px] font-bold tracking-wide text-brand" translate="no">
                                      <span className="mr-0.5">₹</span>
                                      <span>{pkg.price?.toLocaleString()}</span>
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className={`${isMobileMenuOpen
                ? 'text-gray-900'
                : 'text-gray-900'
                } h-[38px] w-10 md:h-[44px] md:w-11 flex items-center justify-center relative z-[210] transition-all duration-300 active:scale-95`}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
