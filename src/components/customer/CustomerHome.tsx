import React, { useState } from 'react';
import { Movie, Screening, Package, FoodItem, Booking, CustomerReview } from '../../types';
import { HeroBanner } from './HeroBanner';
import { MovieCatalog } from './MovieCatalog';
import { AiMovieRecommender } from './AiMovieRecommender';
import { BookingModal } from './BookingModal';
import { DigitalTicketModal } from './DigitalTicketModal';
import { CustomerReviewsSection } from './CustomerReviewsSection';
import {
  Sparkles,
  Moon,
  Shield,
  Volume2,
  Coffee,
  Flame,
  Ticket,
  ChevronRight,
  Eye,
  Telescope,
  Clock,
  HeartHandshake
} from 'lucide-react';

interface CustomerHomeProps {
  movies: Movie[];
  screenings: Screening[];
  packages: Package[];
  foodMenu: FoodItem[];
  reviews: CustomerReview[];
  userBookings: Booking[];
  onBookingCreated: (booking: Booking) => void;
  onReviewAdded: (review: CustomerReview) => void;
  isAiRecommenderOpen: boolean;
  onCloseAiRecommender: () => void;
  onOpenAiRecommender: () => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({
  movies,
  screenings,
  packages,
  foodMenu,
  reviews,
  userBookings,
  onBookingCreated,
  onReviewAdded,
  isAiRecommenderOpen,
  onCloseAiRecommender,
  onOpenAiRecommender
}) => {
  const [selectedScreeningForBooking, setSelectedScreeningForBooking] = useState<Screening | null>(null);
  const [activeTicketBooking, setActiveTicketBooking] = useState<Booking | null>(null);
  const [preselectedPackageId, setPreselectedPackageId] = useState<string | undefined>(undefined);

  // Find tonight's top featured screening
  const featuredScreening = screenings.find((s) => s.date.toLowerCase().includes('tonight')) || screenings[0];

  const handleStartBooking = (screening: Screening, packageId?: string) => {
    setSelectedScreeningForBooking(screening);
    setPreselectedPackageId(packageId);
  };

  const handleRecommendationMatch = (screeningId: string, packageId?: string) => {
    const target = screenings.find((s) => s.id === screeningId) || screenings[0];
    if (target) {
      handleStartBooking(target, packageId);
    }
  };

  const handleBookingCompleted = (newBooking: Booking) => {
    onBookingCreated(newBooking);
    setSelectedScreeningForBooking(null);
    setActiveTicketBooking(newBooking);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Banner */}
      <HeroBanner
        featuredScreening={featuredScreening}
        onBookFeatured={(s) => handleStartBooking(s)}
        onOpenAiRecommender={onOpenAiRecommender}
        onBrowseMovies={() => {
          const el = document.getElementById('movie-catalog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* User's Active Tickets Banner if any */}
      {userBookings.length > 0 && (
        <div className="mb-12 p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-500/15 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Active Star Pass</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                  {userBookings[0].status}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white">
                {userBookings[0].movieTitle} • {userBookings[0].screeningTime}
              </h3>
              <p className="text-xs text-slate-300">
                Seats: {userBookings[0].seatIds.join(', ')} • Code: <span className="font-mono text-amber-300">{userBookings[0].bookingCode}</span>
              </p>
            </div>
          </div>

          <button
            id="view-active-qr-pass-btn"
            onClick={() => setActiveTicketBooking(userBookings[0])}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <span>View Digital QR Pass</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Movie Catalog Grid */}
      <MovieCatalog
        screenings={screenings}
        movies={movies}
        onSelectScreening={(s) => handleStartBooking(s)}
      />

      {/* Experience & Venue Pillars */}
      <section className="mb-16 p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Why OpenSpace Cinema?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-1">
            Reimagining The Magic of Cinema
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every detail crafted for an atmospheric night under the cosmos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Starlight Cabanas & Loungers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated double daybeds with canopies, twin plush lawn beanbags, and zero-gravity recliners.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Acoustic Silent Disco Headsets</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crystal-clear private audio channels with zero city ambient noise, plus Dolby Atmos outdoor surround.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Campfire S’mores & At-Seat Food</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gourmet truffle popcorn, hot spiced mulled apple cider, and artisan flatbreads delivered to your seat.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">100% Weather Safety Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complimentary heated fleece blankets on cool nights, and automatic 1-click reschedules if heavy rain strikes.
            </p>
          </div>

        </div>
      </section>

      {/* Customer Reviews & AI Sentiment */}
      <CustomerReviewsSection
        reviews={reviews}
        onReviewAdded={onReviewAdded}
      />

      {/* Booking Modal Wizard */}
      {selectedScreeningForBooking && (
        <BookingModal
          screening={selectedScreeningForBooking}
          packages={packages}
          foodMenu={foodMenu}
          preselectedPackageId={preselectedPackageId}
          onBookingComplete={handleBookingCompleted}
          onClose={() => setSelectedScreeningForBooking(null)}
        />
      )}

      {/* Digital QR Ticket Modal */}
      {activeTicketBooking && (
        <DigitalTicketModal
          booking={activeTicketBooking}
          onClose={() => setActiveTicketBooking(null)}
        />
      )}

      {/* AI Recommendation Modal */}
      {isAiRecommenderOpen && (
        <AiMovieRecommender
          screenings={screenings}
          packages={packages}
          onSelectRecommendation={handleRecommendationMatch}
          onClose={onCloseAiRecommender}
        />
      )}

    </div>
  );
};
