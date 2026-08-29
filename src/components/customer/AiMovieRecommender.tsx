import React, { useState } from 'react';
import { Sparkles, Heart, Users, Compass, Clapperboard, Coffee, Check, X, ArrowRight, Loader2, Star } from 'lucide-react';
import { api } from '../../services/api';
import { Screening, Package, AiRecommendationResult, SeatCategory } from '../../types';

interface AiMovieRecommenderProps {
  screenings: Screening[];
  packages: Package[];
  onSelectRecommendation: (screeningId: string, packageId?: string) => void;
  onClose: () => void;
}

export const AiMovieRecommender: React.FC<AiMovieRecommenderProps> = ({
  screenings,
  packages,
  onSelectRecommendation,
  onClose
}) => {
  const [mood, setMood] = useState<string>('Romantic & Cozy');
  const [companion, setCompanion] = useState<string>('Date / Partner');
  const [favoriteGenre, setFavoriteGenre] = useState<string>('Sci-Fi, Romance, Comedy');
  const [pastExperience, setPastExperience] = useState<string>('Enjoyed outdoor films and cozy ambiance');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AiRecommendationResult | null>(null);

  const moodOptions = [
    { label: 'Romantic & Cozy', icon: Heart, desc: 'Soft lighting, starry date night, wine & s\'mores' },
    { label: 'Cosmic & Mind-Bending', icon: Sparkles, desc: 'Sci-fi epics, stargazing awe, visual grandeur' },
    { label: 'Laughs & Uplifting', icon: Star, desc: 'Feel-good comedies, lighthearted fun with friends' },
    { label: 'Family Magic', icon: Users, desc: 'All ages animated adventures, cozy lawn picnics' },
    { label: 'Action & High Adrenaline', icon: Clapperboard, desc: 'Blockbusters, booming Dolby Atmos audio' }
  ];

  const companionOptions = [
    'Date / Partner',
    'Friends Group (3-6)',
    'Family with Kids',
    'Solo Movie Lover'
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAiRecommendations({
        mood,
        companion,
        favoriteGenre,
        pastBookings: pastExperience,
        budgetPreference: 'Quality open-air experience'
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              AI Movie & Experience Matcher
            </h2>
            <p className="text-sm text-slate-300">
              Personalized open-air screening and seating recommendations tailored to your vibe.
            </p>
          </div>
        </div>

        {!result ? (
          /* Questionnaire View */
          <div className="space-y-6">
            
            {/* Step 1: Mood */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                1. What is your mood tonight?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {moodOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = mood === opt.label;
                  return (
                    <div
                      key={opt.label}
                      onClick={() => setMood(opt.label)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white flex items-center">
                          <Icon className={`w-4 h-4 mr-1.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                          {opt.label}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <p className="text-xs text-slate-400">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Companions */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                2. Who are you coming with?
              </label>
              <div className="flex flex-wrap gap-2.5">
                {companionOptions.map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => setCompanion(comp)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      companion === comp
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Genre preferences */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                3. Preferred genres or movie vibe (optional):
              </label>
              <input
                type="text"
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
                placeholder="e.g. Sci-Fi, Nolan, Romance, Studio Ghibli, Comedy"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:outline-none text-sm text-slate-100 placeholder-slate-500"
              />
            </div>

            {/* Action Trigger */}
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                id="generate-ai-recommendation-btn"
                type="button"
                disabled={isLoading}
                onClick={handleGenerate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing Cinema Schedules...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Find My Match</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <h3 className="text-lg font-bold text-amber-300 mb-1">
                {result.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200">
                {result.userAnalysis}
              </p>
            </div>

            {/* Recommended Screenings */}
            <div className="space-y-4">
              {result.recommendedScreenings.map((rec, idx) => {
                const screening = screenings.find((s) => s.id === rec.screeningId) || screenings[0];
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={screening?.moviePoster}
                        alt={rec.movieTitle}
                        className="w-16 h-22 object-cover rounded-xl shrink-0 shadow"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-extrabold text-white">
                            {rec.movieTitle}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                            Best Match
                          </span>
                        </div>
                        <p className="text-xs text-amber-400 font-semibold mt-0.5">
                          {rec.date} • {rec.time} ({screening?.venueZone})
                        </p>
                        <p className="text-xs text-slate-300 mt-1 max-w-md">
                          {rec.matchReason}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-slate-400">
                          <span className="bg-slate-800 px-2.5 py-0.5 rounded-md text-slate-200">
                            Seat: <strong className="text-amber-300">{rec.recommendedSeatType}</strong>
                          </span>
                          <span className="bg-slate-800 px-2.5 py-0.5 rounded-md text-slate-200">
                            Package: <strong className="text-indigo-300">{rec.recommendedPackage}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectRecommendation(rec.screeningId);
                        onClose();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Book This Match</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Tonight's tip */}
            {result.tipForTonight && (
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center space-x-2.5">
                <Coffee className="w-4 h-4 text-indigo-400 shrink-0" />
                <span><strong>Stargazer Tip:</strong> {result.tipForTonight}</span>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                ← Change Preferences
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
