import React, { useState } from 'react';
import { CustomerReview, SentimentAnalysisSummary } from '../../types';
import { api } from '../../services/api';
import {
  Sparkles,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Flame,
  Shield,
  Coffee,
  Bed,
  Film,
  DollarSign,
  Loader2
} from 'lucide-react';

interface AiSentimentDashboardProps {
  reviews: CustomerReview[];
}

export const AiSentimentDashboard: React.FC<AiSentimentDashboardProps> = ({ reviews }) => {
  const [summary, setSummary] = useState<SentimentAnalysisSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRunAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await api.runAiSentimentAnalysis();
      setSummary(res);
    } catch (err) {
      console.error(err);
      alert('Failed to run sentiment analysis');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial calculation from existing reviews if summary not yet fetched
  const positiveCount = reviews.filter((r) => r.sentiment === 'Positive').length;
  const neutralCount = reviews.filter((r) => r.sentiment === 'Neutral').length;
  const negativeCount = reviews.filter((r) => r.sentiment === 'Negative').length;
  const total = reviews.length || 1;

  const posPct = Math.round((positiveCount / total) * 100);
  const neuPct = Math.round((neutralCount / total) * 100);
  const negPct = Math.round((negativeCount / total) * 100);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'comfort':
        return Bed;
      case 'food':
        return Coffee;
      case 'weather':
        return Flame;
      case 'safety':
        return Shield;
      case 'price':
        return DollarSign;
      default:
        return Film;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Core Capability 5</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
            AI Customer Sentiment & Feedback Intelligence
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Semantic breakdown of open-air customer reviews across Comfort, Price, Food & Drinks, Safety, Weather, and Movie Selection.
          </p>
        </div>

        <button
          id="run-ai-sentiment-analysis-btn"
          disabled={isLoading}
          onClick={handleRunAnalysis}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Analyzing Guest Semantics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Run Deep AI Sentiment Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Top Sentiment Distribution Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Positive Sentiment</span>
            <Smile className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono">{summary ? summary.positivePercentage : posPct}%</span>
            <span className="text-xs text-slate-400">({summary ? summary.totalPositive : positiveCount} reviews)</span>
          </div>
          <p className="text-[11px] text-slate-400">Atmosphere, s'mores, starry ambiance & acoustics</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Neutral Sentiment</span>
            <Meh className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono">{summary ? summary.neutralPercentage : neuPct}%</span>
            <span className="text-xs text-slate-400">({summary ? summary.totalNeutral : neutralCount} reviews)</span>
          </div>
          <p className="text-[11px] text-slate-400">Pricing vs standard cinemas & deckchair comfort</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Negative / Needs Action</span>
            <Frown className="w-5 h-5 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono">{summary ? summary.negativePercentage : negPct}%</span>
            <span className="text-xs text-slate-400">({summary ? summary.totalNegative : negativeCount} reviews)</span>
          </div>
          <p className="text-[11px] text-slate-400">Night chill, fleece blanket availability</p>
        </div>

      </div>

      {/* Critical Executive Alert from AI */}
      {summary && (
        <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h4 className="font-extrabold text-sm font-['Outfit']">
              AI Priority Alert: {summary.primaryIssueIdentified}
            </h4>
          </div>
          <p className="text-xs text-slate-200 pl-7">
            {summary.actionableRecommendations[0] || 'Ensure extra heated blankets and patio warmers are deployed for 10:00 PM late screenings.'}
          </p>
        </div>
      )}

      {/* 6 Category Breakdown Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(summary?.categoriesBreakdown || [
          { category: 'Comfort', positiveMentions: 14, negativeMentions: 3, sentimentScore: 82, summary: 'High praise for Cabana beds; deckchairs need extra cushions' },
          { category: 'Food & Drinks', positiveMentions: 18, negativeMentions: 1, sentimentScore: 94, summary: 'Truffle popcorn & hot s’mores skillets rated stellar' },
          { category: 'Weather & Warmth', positiveMentions: 11, negativeMentions: 4, sentimentScore: 73, summary: 'Chilly night air requires more free heated fleece throws' },
          { category: 'Price & Value', positiveMentions: 9, negativeMentions: 3, sentimentScore: 75, summary: 'Packages perceived as great value; single tickets on higher end' },
          { category: 'Safety & Venue', positiveMentions: 16, negativeMentions: 0, sentimentScore: 100, summary: 'Gentle lighting and spacious lawn grass rated very safe' },
          { category: 'Movie Selection', positiveMentions: 19, negativeMentions: 1, sentimentScore: 95, summary: 'Visual classics like Interstellar and La La Land highly celebrated' }
        ]).map((cat, idx) => {
          const Icon = getCategoryIcon(cat.category);
          return (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{cat.category}</h4>
                </div>
                <span className="font-mono text-xs font-black text-amber-400">
                  {cat.sentimentScore}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                  style={{ width: `${cat.sentimentScore}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {cat.summary}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                <span className="text-emerald-400 font-semibold">+{cat.positiveMentions} positive</span>
                <span className="text-rose-400 font-semibold">-{cat.negativeMentions} critical</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths & Action Plan */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Core Operational Strengths</span>
            </h4>
            <div className="space-y-2">
              {summary.topStrengths.map((str, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Manager Action Checklist</span>
            </h4>
            <div className="space-y-2">
              {summary.actionableRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
