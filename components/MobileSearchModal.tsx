import React from 'react';
import { ArrowRight, Loader2, X, SlidersHorizontal, MapPin, Calendar, Star, Search } from 'lucide-react';

interface MobileSearchModalProps {
  showSearchModal: boolean;
  setShowSearchModal: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchChange: (e: any) => void;
  settings: any;
  isSearching: boolean;
  searchResults: any;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  recentSearches: string[];
  clearRecentSearches: () => void;
  heroDestinations: any[];
  trendingPackages: any[];
  router: any;
}

export const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  showSearchModal,
  setShowSearchModal,
  searchQuery,
  setSearchQuery,
  handleSearchChange,
  settings,
  isSearching,
  searchResults,
  activeFilter,
  setActiveFilter,
  sortBy,
  setSortBy,
  recentSearches,
  clearRecentSearches,
  heroDestinations,
  trendingPackages,
  router
}) => {
  if (!showSearchModal) return null;

  return (
    <div className="fixed inset-0 z-[10000] lg:hidden">
      {/* Backdrop with heavy blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setShowSearchModal(false)} />

      {/* Modal Content - Full Height Slide Up */}
      <div className="absolute inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-3xl md:h-[85vh] md:rounded-3xl bg-white flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-500 overflow-hidden font-sans md:shadow-2xl">
        {/* Header with Depth */}
        <div className="px-4 pt-6 pb-6 border-b border-gray-100 flex flex-col gap-6 bg-white sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowSearchModal(false)} className="p-2 -ml-2 rounded-xl bg-gray-50/50 border border-gray-100 shadow-sm active:scale-90 transition-all">
              <ArrowRight className="w-6 h-6 text-gray-900 rotate-180" />
            </button>
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gray-50/50 rounded-xl border border-gray-100 shadow-inner group-focus-within:border-brand/20 transition-all duration-300" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={settings?.heroSearchPlaceholder || "Where to next?"}
                className="relative w-full px-5 py-3 bg-transparent border-0 focus:ring-0 text-[18px] font-semibold text-gray-900 placeholder-gray-500 font-sans"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                  <Loader2 className="w-5 h-5 animate-spin text-brand" />
                </div>
              )}
              {searchQuery && !isSearching && (
                <button onClick={() => { setSearchQuery(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-200/50 hover:bg-gray-200 z-10 transition-all">
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters with Depth */}
          <div className="space-y-6">
            <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar -mx-1 px-1">
              {['All', 'International', 'Domestic', 'Honeymoon', 'Family', 'Adventure'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveFilter(cat);
                    if (searchQuery) handleSearchChange(searchQuery);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-semibold tracking-wide whitespace-nowrap transition-all border font-sans ${activeFilter === cat
                    ? 'bg-brand text-white border-brand shadow-[0_6px_20px_rgba(58,123,213,0.25)]'
                    : 'bg-white border-gray-100 text-gray-700 shadow-sm hover:border-gray-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/50 border border-gray-100 shadow-inner">
              <div className="flex items-center gap-2 px-2 shrink-0 border-r border-gray-200">
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
                <span className="text-[9px] font-medium text-gray-600 tracking-wider font-sans">Sort by:</span>
              </div>
              <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      if (searchQuery) handleSearchChange(searchQuery);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-wide whitespace-nowrap transition-all font-sans ${sortBy === opt
                      ? 'bg-white text-brand shadow-sm border border-gray-100'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
          {!searchQuery ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[11px] font-medium text-gray-600 tracking-wider font-sans">Recent searches</h3>
                    <button onClick={clearRecentSearches} className="text-[10px] font-semibold text-brand tracking-wide hover:opacity-70 transition-opacity">Clear all</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, i) => (
                      <button
                        key={`recent-${i}`}
                        onClick={() => handleSearchChange(s)}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[12px] font-semibold text-gray-800 shadow-sm hover:border-brand/20 active:scale-95 transition-all flex items-center gap-2 font-sans"
                      >
                        <MapPin className="w-3 h-3 text-brand" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {heroDestinations.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[11px] font-medium text-gray-600 tracking-wider font-sans">Trending now</h3>
                  </div>

                  <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 no-scrollbar">
                    {heroDestinations.slice(0, 5).map(dest => (
                      <button
                        key={dest.slug}
                        onClick={() => { router.push(`/destination/${dest.slug}`); setShowSearchModal(false); }}
                        className="flex-shrink-0 w-36 group"
                      >
                        <div className="relative w-36 h-48 rounded-xl overflow-hidden mb-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20 group-active:scale-95 transition-all duration-300">
                          <img
                            src={dest.heroImage || '/images/placeholder.svg'}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 inset-x-3">
                            <p className="text-white font-semibold text-[14px] truncate leading-tight tracking-normal drop-shadow-md font-sans mb-0.5">{dest.name}</p>
                            <p className="text-white text-[8px] font-medium tracking-wide font-sans">View details</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-medium text-gray-600 tracking-wider font-sans">Trending packages</h3>
                  <button onClick={() => { router.push('/packages'); setShowSearchModal(false); }} className="text-[10px] font-semibold text-brand tracking-wide hover:opacity-70 transition-opacity">View all</button>
                </div>
                <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 no-scrollbar">
                  {trendingPackages.length > 0 ? (
                    trendingPackages.map((pkg) => (
                      <button
                        key={pkg._id}
                        onClick={() => { router.push(`/packages/${pkg.slug}`); setShowSearchModal(false); }}
                        className="flex-shrink-0 w-64 group text-left"
                      >
                        <div className="relative w-64 aspect-[4/3] rounded-2xl overflow-hidden mb-3 shadow-[0_12px_45px_rgba(0,0,0,0.08)] border-2 border-gray-100 group-active:scale-[0.98] transition-all duration-300 hover:border-brand/30">
                          <img
                            src={pkg.image || '/images/placeholder.svg'}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
                            {pkg.groupSize && pkg.groupSize.toLowerCase().includes('fixed') && (
                              <div className="px-2 py-1 rounded-md bg-white/95 backdrop-blur-md text-brand text-[8px] font-bold tracking-tight shadow-sm flex items-center gap-1 font-sans border border-brand/10">
                                <Calendar className="w-2.5 h-2.5" />
                                <span>Fixed Departure</span>
                              </div>
                            )}
                            <div className="flex gap-1.5">
                              {pkg.isBestSeller && (
                                <div className="px-2 py-1 rounded-md bg-brand text-white text-[8px] font-bold tracking-tight shadow-md font-sans">Best Seller</div>
                              )}
                              <div className="px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm text-[9px] font-bold text-gray-900 shadow-md flex items-center gap-1 font-sans border border-gray-100">
                                <Star className="w-2.5 h-2.5 fill-brand text-brand" />
                                {pkg.rating || '4.8'}
                              </div>
                            </div>
                            {/* Consistency: Add Days Badge over Trending Image */}
                            <div className="px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm text-[9px] font-bold text-gray-900 shadow-md flex items-center gap-1 font-sans border border-gray-100">
                              <Calendar className="w-2.5 h-2.5 text-brand" />
                              <span>{pkg.duration || 5} Days</span>
                            </div>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white font-semibold text-[14px] line-clamp-2 drop-shadow-md tracking-tight leading-tight font-sans mb-0">{pkg.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-2">
                          <div className="flex flex-col">
                            <span className="text-[11px] text-gray-900 font-bold tracking-tight mb-1 font-sans">{pkg.duration || 5} Days</span>
                            <span className="text-brand font-bold text-[19px] tracking-tight font-sans leading-none">₹{pkg.price?.toLocaleString()}</span>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-brand group-hover:text-white transition-all border border-gray-200 shadow-sm">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    [1, 2].map(i => (
                      <div key={`trending-skeleton-${i}`} className="flex-shrink-0 w-64 h-56 bg-gray-100/50 rounded-3xl animate-pulse" />
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : searchResults ? (
            (searchResults.destinations.length === 0 && searchResults.packages.length === 0) ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-10 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 rounded-xl bg-gray-50 flex items-center justify-center text-gray-200 mb-6 border border-gray-100 shadow-inner">
                  <Search className="w-10 h-10" />
                </div>
                <p className="text-gray-900 font-semibold text-[17px] mb-2 tracking-tight font-sans">No results found</p>
                <p className="text-gray-600 text-[14px] leading-relaxed max-w-[240px]">We couldn't find matches for <span className="text-brand font-semibold capitalize font-sans">"{searchQuery}"</span></p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                {searchResults.destinations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-medium text-gray-600 tracking-wider font-sans">Destinations ({searchResults.destinations.length})</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {searchResults.destinations.map((dest: any) => (
                        <button
                          key={dest._id}
                          onClick={() => { router.push(`/destination/${dest.slug}`); setShowSearchModal(false); }}
                          className="w-full flex items-center gap-4 p-3 bg-white hover:bg-brand/[0.02] rounded-xl border border-gray-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:border-brand/20 transition-all text-left group"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative shadow-md group-hover:shadow-lg transition-all duration-300">
                            {dest.heroImage ? (
                              <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
                            ) : (
                              <MapPin className="w-7 h-7 text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-800 text-[17px] tracking-tight truncate leading-none font-sans">{dest.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-brand font-semibold tracking-wide px-2 py-1 bg-brand/5 rounded-md font-sans">Explore tours</span>
                              <ArrowRight className="w-3.5 h-3.5 text-brand group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.packages.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-medium text-gray-600 tracking-wider font-sans">Packages found ({searchResults.packages.length})</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {searchResults.packages.map((pkg: any) => (
                        <button
                          key={pkg._id}
                          onClick={() => { router.push(`/packages/${pkg.slug}`); setShowSearchModal(false); }}
                          className="w-full flex flex-col bg-white rounded-2xl border-2 border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-brand/40 transition-all text-left group overflow-hidden h-full"
                        >
                          <div className="relative w-full aspect-square overflow-hidden shrink-0">
                            {pkg.image ? (
                              <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50"><Search className="w-6 h-6 text-gray-200" /></div>
                            )}
                            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                                <div className="px-1.5 py-0.5 rounded-md bg-white/95 backdrop-blur-sm text-[9px] font-bold text-gray-900 border border-gray-100 shadow-sm flex items-center gap-1 font-sans">
                                  <Star className="w-2.5 h-2.5 fill-brand text-brand" />
                                  {pkg.rating || '4.8'}
                                </div>
                                {/* Days Badge over Search Result Image for Visibility */}
                                <div className="px-1.5 py-0.5 rounded-md bg-white/95 backdrop-blur-sm text-[9px] font-bold text-gray-900 border border-gray-100 shadow-sm flex items-center gap-1 font-sans">
                                  <Calendar className="w-2.5 h-2.5 text-brand" />
                                  <span>{pkg.duration || 6} Days</span>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden">
                            <p className="font-semibold text-gray-800 text-[13px] line-clamp-2 mb-2 tracking-tight leading-tight font-sans h-8 shrink-0">{pkg.title}</p>
                            <div className="flex flex-col gap-2 mt-auto">
                              <div className="flex items-center justify-between">
                                <span className="text-brand text-[16px] font-bold leading-none font-sans tracking-tight">₹{pkg.price?.toLocaleString()}</span>
                                <div className="px-2 py-1 rounded-md bg-gray-50 border border-gray-100">
                                  <span className="text-[10px] text-gray-900 font-bold tracking-wide font-sans">{pkg.duration || 6} Days</span>
                                </div>
                              </div>
                              <div className="h-px w-full bg-gray-50" />
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] text-gray-900 font-bold tracking-wide font-sans">View details</span>
                                <ArrowRight className="w-3.5 h-3.5 text-brand transition-all" />
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="space-y-6 py-4 animate-pulse px-2">
              <div className="w-24 h-3 bg-gray-100 rounded-full" />
              <div className="flex gap-4 overflow-hidden mb-8">
                {[1, 2, 3].map(i => <div key={`search-skel-h-${i}`} className="w-36 h-48 bg-gray-50 rounded-2xl flex-shrink-0" />)}
              </div>
              <div className="w-32 h-3 bg-gray-100 rounded-full" />
              {[1, 2, 3].map(i => <div key={`search-skel-v-${i}`} className="w-full h-24 bg-gray-50 rounded-2xl mb-3" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
