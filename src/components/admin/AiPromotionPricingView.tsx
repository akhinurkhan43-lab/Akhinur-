import React, { useState } from 'react';
import { AiPromotionSuggestion, Screening } from '../../types';
import { api } from '../../services/api';
import {
  Tag,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Percent,
  Layers,
  Loader2
} from 'lucide-react';

interface AiPromotionPricingViewProps {
  promotions: AiPromotionSuggestion[];
  screenings: Screening[];
  onPromotionsUpdated: (promotions: AiPromotionSuggestion[]) => void;
  onScreeningDiscountUpdated: (screeningId: string, discount: number | null) => void;
}

export const AiPromotionPricingView: React.FC<AiPromotionPricingViewProps> = ({
  promotions,
  screenings,
  onPromotionsUpdated,
  onScreeningDiscountUpdated
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await api.generateAiPromotions();
      onPromotionsUpdated(generated);
    } catch (err) {
      console.error(err);
      alert('Failed to generate promotion suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAction = async (promo: AiPromotionSuggestion, action: 'approve' | 'reject') => {
    setProcessingId(promo.id);
    try {
      const updated = await api.executePromotionAction(promo.id, action);
      
      // Update local state
      const nextPromotions = promotions.map((p) => (p.id === promo.id ? updated : p));
      onPromotionsUpdated(nextPromotions);

      if (action === 'approve') {
        const targetId = promo.targetScreeningId || promo.screeningId || '';
        const discountVal = promo.discountPercent ?? promo.suggestedDiscountPercent ?? 15;
        if (targetId) {
          onScreeningDiscountUpdated(targetId, discountVal);
        }
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} promotion`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Core Capability 4</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
            AI Dynamic Pricing & Promotions
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Detects low-demand open-sky screenings and proposes targeted bundles and dynamic ticket discounts. Management approval required before publishing.
          </p>
        </div>

        <button
          id="generate-ai-promotions-btn"
          disabled={isGenerating}
          onClick={handleGenerate}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Scanning Low-Demand Slots...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate AI Promotions</span>
            </>
          )}
        </button>
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {promotions.map((promo) => {
          const screening = screenings.find((s) => s.id === promo.targetScreeningId);
          const isPending = promo.status === 'pending_approval';
          const isApproved = promo.status === 'approved';
          const isRejected = promo.status === 'rejected';

          return (
            <div
              key={promo.id}
              className={`p-6 rounded-2xl border transition-all ${
                isApproved
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-emerald-500/5 shadow-lg'
                  : isRejected
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : 'bg-slate-900/90 border-amber-500/40 shadow-amber-500/5 shadow-lg'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                {/* Left info */}
                <div className="space-y-2 max-w-2xl">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {promo.promoCode}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                      <Percent className="w-3 h-3" />
                      <span>{promo.discountPercent}% Discount</span>
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                        isApproved
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isRejected
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {isApproved ? 'Active on Schedule' : isRejected ? 'Rejected' : 'Needs Approval'}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-white font-['Outfit']">
                    {promo.campaignTitle}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {promo.aiRationale}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span>
                      Target: <strong className="text-white">{promo.targetMovieTitle}</strong> ({screening?.date} • {screening?.time})
                    </span>
                    <span>•</span>
                    <span>
                      Recommended Bundle: <strong className="text-indigo-300">{promo.recommendedPackagePairing}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">
                      Projected Lift: {promo.projectedOccupancyIncrease}
                    </span>
                  </div>

                </div>

                {/* Right Action buttons */}
                <div className="flex items-center space-x-3 shrink-0 self-end lg:self-center">
                  {isPending && (
                    <>
                      <button
                        disabled={processingId === promo.id}
                        onClick={() => handleAction(promo, 'reject')}
                        className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-rose-950/50 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Reject</span>
                      </button>

                      <button
                        disabled={processingId === promo.id}
                        onClick={() => handleAction(promo, 'approve')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {processingId === promo.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                        )}
                        <span>Approve & Publish</span>
                      </button>
                    </>
                  )}

                  {isApproved && (
                    <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold bg-emerald-950/30 px-3.5 py-2 rounded-xl border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Live on Customer Booking Pages</span>
                    </div>
                  )}

                  {isRejected && (
                    <span className="text-xs text-slate-500 italic">
                      Dismissed by manager
                    </span>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
