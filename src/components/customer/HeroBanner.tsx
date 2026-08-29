import React from 'react';
import { Sparkles, Compass, Moon, Shield, Volume2, Coffee, Flame, Film } from 'lucide-react';
import { Screening } from '../../types';

interface HeroBannerProps {
  featuredScreening?: Screening;
  onBookFeatured: (screening: Screening) => void;
  onOpenAiRecommender: () => void;
  onBrowseMovies: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredScreening,
  onBookFeatured,
  onOpenAiRecommender,
  onBrowseMovies
}) => {
  return (
    <div id="hero-banner" className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-10 lg:p-12 shadow-2xl mb-12">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Brand Statement & CTA */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Pine Ridge Amphitheater • Open-Sky</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.15]">
            Cinema feels <span className="font-serif italic text-amber-500 font-normal">different</span> under the open sky.
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-xl font-light leading-relaxed">
            Relax on plush starlight cabanas and twin lawn beanbags. Enjoy gourmet truffle popcorn, campfire s’mores, and silent-disco wireless audio beneath millions of stars.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
            {featuredScreening && (
              <button
                id="hero-book-tonight-btn"
                onClick={() => onBookFeatured(featuredScreening)}
                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center space-x-2"
              >
                <Film className="w-4 h-4 text-black" />
                <span>Book Tonight’s Feature</span>
              </button>
            )}

            <button
              id="hero-ai-recommender-btn"
              onClick={onOpenAiRecommender}
              className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 text-amber-200 border border-amber-500/20 hover:border-amber-500/40 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center space-x-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Experience Matcher</span>
            </button>

            <button
              id="hero-browse-schedule-btn"
              onClick={onBrowseMovies}
              className="px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            >
              Schedule
            </button>
          </div>

          {/* Venue Highlights Pills */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Rain Free Reschedule</span>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Dolby & Wireless Audio</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Complimentary Fleece</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
              <span>At-Seat Delivery</span>
            </div>
          </div>

        </div>

        {/* Right Column: Tonight's Spotlight Card */}
        {featuredScreening && (
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-4 transition-all duration-300 hover:border-amber-500/30">
              
              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden">
                <img
                  src={featuredScreening.movieBackdrop || featuredScreening.moviePoster}
                  alt={featuredScreening.movieTitle}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/50 to-transparent" />

                {/* Event or Status Badge */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1.5">
                  <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow-md">
                    Tonight’s Feature
                  </span>
                  {featuredScreening.isSpecialEvent && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white backdrop-blur-sm border border-white/20">
                      {featuredScreening.eventTitle || 'Special Event'}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xl sm:text-2xl font-serif italic text-white drop-shadow">
                    {featuredScreening.movieTitle}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-300 mt-1">
                    <span className="text-amber-400 font-semibold">{featuredScreening.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-white">{featuredScreening.time}</span>
                    <span>•</span>
                    <span className="text-gray-400">{featuredScreening.venueZone}</span>
                  </div>
                </div>
              </div>

              {/* Weather and Booking footer inside card */}
              <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-[10px] uppercase text-gray-500 tracking-wider block">Sky Forecast:</span>
                  <div className="text-emerald-400 font-medium flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{featuredScreening.weatherForecast.condition} ({featuredScreening.weatherForecast.temp})</span>
                  </div>
                </div>

                <button
                  id="spotlight-card-book-btn"
                  onClick={() => onBookFeatured(featuredScreening)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer"
                >
                  Reserve (${featuredScreening.basePrice})
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
