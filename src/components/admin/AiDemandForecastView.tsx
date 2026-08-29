import React, { useState } from 'react';
import { AiDemandForecast, Screening } from '../../types';
import { api } from '../../services/api';
import {
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  Clock,
  Thermometer,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Zap,
  Loader2
} from 'lucide-react';

interface AiDemandForecastViewProps {
  forecasts: AiDemandForecast[];
  screenings: Screening[];
  onForecastsUpdated: (forecasts: AiDemandForecast[]) => void;
}

export const AiDemandForecastView: React.FC<AiDemandForecastViewProps> = ({
  forecasts,
  screenings,
  onForecastsUpdated
}) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await api.refreshAiDemandForecast();
      onForecastsUpdated(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to refresh forecast with AI');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getDemandBadgeColor = (level: string) => {
    switch (level) {
      case 'Extremely High':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Moderate':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with AI Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Core Capability 3</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
            AI Screening Demand Forecasting
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Gemini analyzes historical bookings, movie genre, night temperatures, day-of-week, and stargazing conditions to project occupancy.
          </p>
        </div>

        <button
          id="refresh-ai-demand-forecast-btn"
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Simulating Demand Models...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 text-slate-950" />
              <span>Re-run AI Forecast</span>
            </>
          )}
        </button>
      </div>

      {/* Forecast Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {forecasts.map((fc) => {
          const screening = screenings.find((s) => s.id === fc.screeningId);

          return (
            <div
              key={fc.screeningId}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-base font-extrabold text-white leading-snug">
                      {fc.movieTitle}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{fc.date}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{fc.time}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border shrink-0 ${getDemandBadgeColor(
                      fc.demandLevel
                    )}`}
                  >
                    {fc.demandLevel}
                  </span>
                </div>

                {/* Big Metric Box */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Predicted Occupancy:</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        {fc.predictedOccupancyRate}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        fc.predictedOccupancyRate >= 80
                          ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                          : fc.predictedOccupancyRate >= 50
                          ? 'bg-gradient-to-r from-indigo-400 to-amber-400'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${fc.predictedOccupancyRate}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                    <span>AI Confidence: {fc.confidenceScore}%</span>
                    <span>Current: {screening?.bookedSeatsCount || 0}/{screening?.totalSeats || 48} seats</span>
                  </div>
                </div>

                {/* Key Drivers */}
                <div className="space-y-1.5 mt-4">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    Key Drivers:
                  </span>
                  <div className="space-y-1">
                    {fc.keyDrivers.map((driver, idx) => (
                      <div key={idx} className="flex items-start space-x-1.5 text-xs text-slate-300">
                        <span className="text-amber-400 font-bold">•</span>
                        <span className="leading-snug">{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weather Impact */}
                {fc.weatherImpact && (
                  <div className="mt-3 p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                    <strong>Weather Effect:</strong> {fc.weatherImpact}
                  </div>
                )}
              </div>

              {/* Manager Recommendation */}
              <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <span className="text-amber-400 font-bold block text-[11px] mb-1">
                  Manager Action:
                </span>
                <p className="italic text-slate-200">{fc.managerRecommendation}</p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
