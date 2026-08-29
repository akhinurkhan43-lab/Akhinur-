import React, { useState } from 'react';
import { Film, Calendar, Clock, Sparkles, MapPin, Tag, ArrowRight, ShieldCheck, Thermometer } from 'lucide-react';
import { Screening, Movie } from '../../types';

interface MovieCatalogProps {
  screenings: Screening[];
  movies: Movie[];
  onSelectScreening: (screening: Screening) => void;
}

export const MovieCatalog: React.FC<MovieCatalogProps> = ({
  screenings,
  movies,
  onSelectScreening
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const genres = ['All', 'Sci-Fi', 'Romance', 'Comedy', 'Animation', 'Action'];
  const dayOptions = ['All', 'Tonight', 'Tomorrow', 'This Week'];

  const filteredScreenings = screenings.filter((s) => {
    const movie = movies.find((m) => m.id === s.movieId);
    const matchesGenre =
      selectedGenre === 'All' || (movie && movie.genre.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase())));
    
    let matchesDay = true;
    if (selectedDay === 'Tonight') matchesDay = s.date.toLowerCase().includes('tonight');
    if (selectedDay === 'Tomorrow') matchesDay = s.date.toLowerCase().includes('tomorrow');
    if (selectedDay === 'This Week') matchesDay = !s.date.toLowerCase().includes('tonight');

    return matchesGenre && matchesDay;
  });

  return (
    <section id="movie-catalog" className="mb-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>Open-Sky Screenings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Now Showing Under The Stars
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Crystal-clear 4K laser projection and high-fidelity open-air sound stages.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedGenre === g
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Screenings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScreenings.map((screening) => {
          const movie = movies.find((m) => m.id === screening.movieId);
          const availableSeats = screening.totalSeats - screening.bookedSeatsCount;
          const isFillingFast = availableSeats <= 12 && availableSeats > 0;
          const isSoldOut = availableSeats === 0;

          return (
            <div
              key={screening.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800/90 hover:border-amber-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Active Promotion Ribbon */}
              {screening.activeDiscountPercent && (
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-lg flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-slate-950" />
                  <span>{screening.activeDiscountPercent}% OFF ACTIVE</span>
                </div>
              )}

              {/* Poster & Backdrop Banner */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={screening.movieBackdrop || screening.moviePoster}
                  alt={screening.movieTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                {/* Badges on poster */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-950/80 backdrop-blur-sm text-slate-200 border border-slate-700/50">
                    {screening.format}
                  </span>
                  
                  <div className="flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs font-medium bg-slate-950/80 backdrop-blur-sm text-emerald-300 border border-slate-700/50">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Sky: {screening.weatherForecast.stargazingIndex}%</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div>
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{screening.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{screening.time}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-['Outfit']">
                    {screening.movieTitle}
                  </h3>

                  {movie && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {movie.genre.map((genre) => (
                        <span key={genre} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                          {genre}
                        </span>
                      ))}
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400 bg-slate-950">
                        {movie.duration}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {movie?.synopsis || 'An evocative outdoor cinematic screening under the stars.'}
                  </p>
                </div>

                {/* Venue Zone & Weather Note */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center text-slate-400">
                      <MapPin className="w-3 h-3 text-amber-400 mr-1" /> Zone:
                    </span>
                    <span className="font-medium text-slate-200">{screening.venueZone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Forecast: {screening.weatherForecast.temp}</span>
                    <span className="text-emerald-400 font-medium">{screening.weatherForecast.condition}</span>
                  </div>
                </div>

                {/* Pricing & Booking Footer */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Tickets from</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-lg font-black text-amber-400">
                        ${screening.activeDiscountPercent
                          ? (screening.basePrice * (1 - screening.activeDiscountPercent / 100)).toFixed(2)
                          : screening.basePrice.toFixed(2)}
                      </span>
                      {screening.activeDiscountPercent && (
                        <span className="text-xs text-slate-500 line-through">
                          ${screening.basePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    id={`book-screening-${screening.id}`}
                    disabled={isSoldOut}
                    onClick={() => onSelectScreening(screening)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md ${
                      isSoldOut
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : isFillingFast
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-pulse'
                        : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white border border-slate-700'
                    }`}
                  >
                    <span>{isSoldOut ? 'Sold Out' : isFillingFast ? 'Only Few Left' : 'Select Seats'}</span>
                    {!isSoldOut && <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
