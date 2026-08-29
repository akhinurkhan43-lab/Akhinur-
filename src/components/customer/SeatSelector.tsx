import React from 'react';
import { Seat, SeatCategory } from '../../types';
import { Sparkles, Bed, Armchair, Sofa, CheckCircle2, User, Users } from 'lucide-react';

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  basePrice: number;
  discountPercent?: number;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  basePrice,
  discountPercent = 0
}) => {
  const getSeatPrice = (seat: Seat) => {
    const raw = basePrice * seat.priceMultiplier;
    return discountPercent > 0 ? raw * (1 - discountPercent / 100) : raw;
  };

  const getCategoryIcon = (category: SeatCategory) => {
    switch (category) {
      case 'Starlight Cabana Bed':
        return Bed;
      case 'Luxury Beanbag Pair':
        return Sofa;
      case 'VIP Lounger':
        return Armchair;
      default:
        return Armchair;
    }
  };

  // Group seats by row
  const rowA = seats.filter((s) => s.row === 'A');
  const rowB = seats.filter((s) => s.row === 'B');
  const rowC = seats.filter((s) => s.row === 'C');
  const rowD = seats.filter((s) => s.row === 'D');
  const rowE = seats.filter((s) => s.row === 'E');

  const renderSeatButton = (seat: Seat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    const isReserved = seat.status === 'reserved' || seat.status === 'blocked';
    const price = getSeatPrice(seat);

    let colorClasses = 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-amber-400 hover:bg-slate-700';

    if (isReserved) {
      colorClasses = 'border-slate-800 bg-slate-900/60 text-slate-600 cursor-not-allowed opacity-40';
    } else if (isSelected) {
      colorClasses = 'border-amber-400 bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105';
    } else {
      if (seat.category === 'Starlight Cabana Bed') {
        colorClasses = 'border-indigo-500/40 bg-indigo-950/40 text-indigo-200 hover:border-indigo-400';
      } else if (seat.category === 'Luxury Beanbag Pair') {
        colorClasses = 'border-amber-500/40 bg-amber-950/30 text-amber-200 hover:border-amber-400';
      } else if (seat.category === 'VIP Lounger') {
        colorClasses = 'border-purple-500/40 bg-purple-950/40 text-purple-200 hover:border-purple-400';
      }
    }

    const isDouble = seat.capacity === 2;

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isReserved}
        onClick={() => onToggleSeat(seat)}
        title={`${seat.category} (${seat.id}) - $${price.toFixed(2)} [${isDouble ? '2 Guests' : '1 Guest'}]`}
        className={`group relative flex flex-col items-center justify-center rounded-xl border p-2 transition-all cursor-pointer ${
          isDouble ? 'w-16 sm:w-20 h-14' : 'w-10 sm:w-12 h-12'
        } ${colorClasses}`}
      >
        <span className="text-[11px] font-extrabold">{seat.id}</span>
        <span className="text-[9px] opacity-80 mt-0.5">
          ${price.toFixed(0)}
        </span>
        {isDouble && (
          <span className="text-[8px] tracking-tight opacity-75 flex items-center">
            <Users className="w-2.5 h-2.5 mr-0.5" /> 2P
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Curved Amphitheater Screen Visual */}
      <div className="relative flex flex-col items-center justify-center pt-2 pb-6">
        <div className="w-4/5 h-2.5 bg-gradient-to-r from-amber-500/20 via-amber-400 to-amber-500/20 rounded-full shadow-lg shadow-amber-400/40" />
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-2 flex items-center space-x-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>4K Laser Curved Projection Screen (Lawn Stage)</span>
        </div>
      </div>

      {/* Seating Grid */}
      <div className="space-y-5 max-w-2xl mx-auto overflow-x-auto py-2">
        
        {/* Row A: Starlight Cabanas */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
            Row A • Starlight Cabana Beds (Double Daybeds with Canopy)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {rowA.map(renderSeatButton)}
          </div>
        </div>

        {/* Row B: Luxury Twin Beanbags */}
        <div className="flex flex-col items-center space-y-1 pt-2">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
            Row B • Luxury Twin Beanbags (Plush Pair Seating)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {rowB.map(renderSeatButton)}
          </div>
        </div>

        {/* Row C: Standard Deckchairs */}
        <div className="flex flex-col items-center space-y-1 pt-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Row C • Cushioned Timber Deckchairs
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {rowC.map(renderSeatButton)}
          </div>
        </div>

        {/* Row D: Standard Deckchairs */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Row D • Cushioned Timber Deckchairs
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {rowD.map(renderSeatButton)}
          </div>
        </div>

        {/* Row E: VIP Loungers */}
        <div className="flex flex-col items-center space-y-1 pt-2">
          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
            Row E • VIP Horizon Terrace Loungers (Elevated Deck)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {rowE.map(renderSeatButton)}
          </div>
        </div>

      </div>

      {/* Legend */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-around gap-3 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md border border-indigo-500/40 bg-indigo-950/60" />
          <span>Cabana Bed (2P)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md border border-amber-500/40 bg-amber-950/40" />
          <span>Twin Beanbag (2P)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md border border-slate-700 bg-slate-800" />
          <span>Deckchair (1P)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md border border-purple-500/40 bg-purple-950/40" />
          <span>VIP Lounger (1P)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md border border-amber-400 bg-amber-500" />
          <span className="text-amber-300 font-bold">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-md border border-slate-800 bg-slate-900/60 opacity-40" />
          <span className="text-slate-500">Reserved</span>
        </div>
      </div>

    </div>
  );
};
