import React, { useState } from 'react';
import { Movie, Screening } from '../../types';
import { api } from '../../services/api';
import { Film, Calendar, Clock, Plus, Sparkles, MapPin, Tag, Check, X, Loader2 } from 'lucide-react';

interface ScreeningsManagerProps {
  movies: Movie[];
  screenings: Screening[];
  onMovieAdded: (movie: Movie) => void;
  onScreeningAdded: (screening: Screening) => void;
}

export const ScreeningsManager: React.FC<ScreeningsManagerProps> = ({
  movies,
  screenings,
  onMovieAdded,
  onScreeningAdded
}) => {
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState<boolean>(false);
  const [isAddScreeningModalOpen, setIsAddScreeningModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // New Movie Form
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieGenre, setNewMovieGenre] = useState('Sci-Fi, Adventure');
  const [newMovieDuration, setNewMovieDuration] = useState('2h 15m');
  const [newMovieRating, setNewMovieRating] = useState('PG-13');
  const [newMovieSynopsis, setNewMovieSynopsis] = useState('');
  const [newMoviePoster, setNewMoviePoster] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80');

  // New Screening Form
  const [selectedMovieId, setSelectedMovieId] = useState(movies[0]?.id || '');
  const [screeningDate, setScreeningDate] = useState('Friday, Next Week');
  const [screeningTime, setScreeningTime] = useState('8:30 PM');
  const [screeningFormat, setScreeningFormat] = useState('4K Laser Open-Air');
  const [venueZone, setVenueZone] = useState('Pine Ridge Main Lawn');
  const [basePrice, setBasePrice] = useState(18);

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await api.addMovie({
        title: newMovieTitle,
        genre: newMovieGenre.split(',').map((g) => g.trim()),
        duration: newMovieDuration,
        rating: newMovieRating,
        synopsis: newMovieSynopsis,
        posterUrl: newMoviePoster,
        backdropUrl: newMoviePoster,
        imdbScore: 8.5
      });
      onMovieAdded(created);
      setIsAddMovieModalOpen(false);
      setNewMovieTitle('');
      setNewMovieSynopsis('');
    } catch (err) {
      console.error(err);
      alert('Failed to add movie');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddScreening = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const movie = movies.find((m) => m.id === selectedMovieId);
      const created = await api.createScreening({
        movieId: selectedMovieId,
        movieTitle: movie?.title || 'Open-Air Feature',
        moviePoster: movie?.posterUrl || '',
        movieBackdrop: movie?.backdropUrl || '',
        date: screeningDate,
        time: screeningTime,
        venueZone,
        format: screeningFormat,
        basePrice: Number(basePrice),
        weatherForecast: {
          temp: '21°C',
          condition: 'Clear & Starlit',
          rainProbability: 0,
          stargazingIndex: 95
        }
      });
      onScreeningAdded(created);
      setIsAddScreeningModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to schedule screening');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
            Screenings & Film Repertoire
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage scheduled open-sky showtimes, formats, and venue zone assignments.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="admin-add-movie-btn"
            onClick={() => setIsAddMovieModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Movie Title</span>
          </button>

          <button
            id="admin-schedule-screening-btn"
            onClick={() => setIsAddScreeningModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule New Screening</span>
          </button>
        </div>
      </div>

      {/* Screenings Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {screenings.map((sc) => {
          const occPct = Math.round((sc.bookedSeatsCount / sc.totalSeats) * 100);
          return (
            <div
              key={sc.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={sc.moviePoster}
                  alt={sc.movieTitle}
                  className="w-16 h-22 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
                    <Calendar className="w-3 h-3" />
                    <span>{sc.date}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white font-['Outfit'] mt-0.5">
                    {sc.movieTitle}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{sc.time}</span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">${sc.basePrice}</span>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 mt-1.5">
                    {sc.format}
                  </span>
                </div>
              </div>

              {/* Occupancy Bar */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Occupancy:</span>
                  <span className="font-bold text-white">
                    {sc.bookedSeatsCount} / {sc.totalSeats} ({occPct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      occPct >= 80 ? 'bg-amber-400' : occPct >= 40 ? 'bg-indigo-400' : 'bg-slate-600'
                    }`}
                    style={{ width: `${occPct}%` }}
                  />
                </div>
              </div>

              {/* Weather info */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>{sc.venueZone}</span>
                <span className="text-emerald-400 font-medium">{sc.weatherForecast.condition}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Movie Modal */}
      {isAddMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsAddMovieModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold font-['Outfit'] mb-4">Add New Movie Title</h3>
            <form onSubmit={handleAddMovie} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  value={newMovieTitle}
                  onChange={(e) => setNewMovieTitle(e.target.value)}
                  placeholder="e.g. Dune: Part Two"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Genres (comma separated)</label>
                  <input
                    type="text"
                    value={newMovieGenre}
                    onChange={(e) => setNewMovieGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newMovieDuration}
                    onChange={(e) => setNewMovieDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  value={newMovieSynopsis}
                  onChange={(e) => setNewMovieSynopsis(e.target.value)}
                  placeholder="Brief synopsis for customer preview..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddMovieModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Screening Modal */}
      {isAddScreeningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsAddScreeningModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold font-['Outfit'] mb-4">Schedule Open-Sky Screening</h3>
            <form onSubmit={handleAddScreening} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Select Film</label>
                <select
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.rating})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Screening Date</label>
                  <input
                    type="text"
                    value={screeningDate}
                    onChange={(e) => setScreeningDate(e.target.value)}
                    placeholder="e.g. Next Saturday"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Showtime</label>
                  <input
                    type="text"
                    value={screeningTime}
                    onChange={(e) => setScreeningTime(e.target.value)}
                    placeholder="e.g. 8:45 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Projection Format</label>
                  <select
                    value={screeningFormat}
                    onChange={(e) => setScreeningFormat(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="4K Laser Open-Air">4K Laser Open-Air</option>
                    <option value="Dolby Atmos Stargazer">Dolby Atmos Stargazer</option>
                    <option value="Silent Disco Headsets">Silent Disco Headsets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Base Ticket Price ($)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Venue Amphitheater Lawn Zone</label>
                <input
                  type="text"
                  value={venueZone}
                  onChange={(e) => setVenueZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddScreeningModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Publish Screening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
