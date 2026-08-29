import React, { useState, useEffect } from 'react';
import { StarryBackground } from './components/StarryBackground';
import { Navbar } from './components/Navbar';
import { CustomerHome } from './components/customer/CustomerHome';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AiChatAssistant } from './components/customer/AiChatAssistant';
import { DigitalTicketModal } from './components/customer/DigitalTicketModal';
import { api } from './services/api';
import {
  Movie,
  Screening,
  Package,
  FoodItem,
  Booking,
  CustomerReview,
  AiPromotionSuggestion,
  AiDemandForecast
} from './types';
import { Loader2, Moon, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core domain state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [foodMenu, setFoodMenu] = useState<FoodItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [promotions, setPromotions] = useState<AiPromotionSuggestion[]>([]);
  const [demandForecasts, setDemandForecasts] = useState<AiDemandForecast[]>([]);

  // Customer local booking pass
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [viewingPass, setViewingPass] = useState<Booking | null>(null);

  // Modals & Panels
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [isAiRecommenderOpen, setIsAiRecommenderOpen] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [
          moviesData,
          screeningsData,
          packagesData,
          foodData,
          bookingsData,
          reviewsData,
          promosData,
          forecastsData
        ] = await Promise.all([
          api.getMovies(),
          api.getScreenings(),
          api.getPackages(),
          api.getFoodMenu(),
          api.getBookings(),
          api.getReviews(),
          api.getPromotions(),
          api.getDemandForecasts()
        ]);

        setMovies(moviesData);
        setScreenings(screeningsData);
        setPackages(packagesData);
        setFoodMenu(foodData);
        setBookings(bookingsData);
        setReviews(reviewsData);
        setPromotions(promosData);
        setDemandForecasts(forecastsData);

        // Preload any initial bookings into user passes for immediate demonstration
        if (bookingsData.length > 0) {
          setUserBookings([bookingsData[0]]);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Handlers
  const handleBookingCreated = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setUserBookings((prev) => [newBooking, ...prev]);
    
    // Update local screening booked count
    setScreenings((prev) =>
      prev.map((s) =>
        s.id === newBooking.screeningId
          ? { ...s, bookedSeatsCount: s.bookedSeatsCount + newBooking.seatIds.length }
          : s
      )
    );
  };

  const handleReviewAdded = (newReview: CustomerReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const handleMovieAdded = (movie: Movie) => {
    setMovies((prev) => [movie, ...prev]);
  };

  const handleScreeningAdded = (screening: Screening) => {
    setScreenings((prev) => [...prev, screening]);
  };

  const handleFoodAdded = (food: FoodItem) => {
    setFoodMenu((prev) => [...prev, food]);
  };

  const handleBookingCheckedIn = (updatedBooking: Booking) => {
    setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
    setUserBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
  };

  const handleScreeningDiscountUpdated = (screeningId: string, discount: number | null) => {
    setScreenings((prev) =>
      prev.map((s) => (s.id === screeningId ? { ...s, activeDiscountPercent: discount } : s))
    );
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-gray-100 selection:bg-amber-500/30 selection:text-amber-200 font-['Plus_Jakarta_Sans'] relative overflow-x-hidden">
      
      {/* Sophisticated Dark Ambient Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-amber-900/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[-5%] w-[30%] h-[30%] bg-amber-950/10 rounded-full blur-[120px]" />
      </div>

      {/* Dynamic Starry Night Sky Canvas */}
      <StarryBackground />

      {/* Primary Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v)}
        onOpenMyTickets={() => {
          if (userBookings.length > 0) {
            setViewingPass(userBookings[0]);
          } else {
            alert('No active passes booked yet. Book a seat tonight under the stars!');
          }
        }}
        onOpenAiAssistant={() => setIsAiChatOpen(true)}
        userBookings={userBookings}
      />

      {/* Main View Area */}
      <main className="relative z-10">
        {isLoading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 animate-pulse">
              <Moon className="w-8 h-8" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Preparing OpenSpace Amphitheater
              </h3>
              <p className="text-xs text-slate-400 flex items-center justify-center space-x-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Loading starlight schedules and seating telemetry...</span>
              </p>
            </div>
          </div>
        ) : currentView === 'customer' ? (
          <CustomerHome
            movies={movies}
            screenings={screenings}
            packages={packages}
            foodMenu={foodMenu}
            reviews={reviews}
            userBookings={userBookings}
            onBookingCreated={handleBookingCreated}
            onReviewAdded={handleReviewAdded}
            isAiRecommenderOpen={isAiRecommenderOpen}
            onCloseAiRecommender={() => setIsAiRecommenderOpen(false)}
            onOpenAiRecommender={() => setIsAiRecommenderOpen(true)}
          />
        ) : (
          <AdminDashboard
            movies={movies}
            screenings={screenings}
            packages={packages}
            foodMenu={foodMenu}
            bookings={bookings}
            reviews={reviews}
            promotions={promotions}
            demandForecasts={demandForecasts}
            onMovieAdded={handleMovieAdded}
            onScreeningAdded={handleScreeningAdded}
            onFoodAdded={handleFoodAdded}
            onBookingCheckedIn={handleBookingCheckedIn}
            onPromotionsUpdated={(promos) => setPromotions(promos)}
            onDemandForecastsUpdated={(forecasts) => setDemandForecasts(forecasts)}
            onScreeningDiscountUpdated={handleScreeningDiscountUpdated}
          />
        )}
      </main>

      {/* Floating AI Concierge Chatbot */}
      <AiChatAssistant
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onOpen={() => setIsAiChatOpen(true)}
      />

      {/* Viewing Specific Digital Pass from Navbar */}
      {viewingPass && (
        <DigitalTicketModal
          booking={viewingPass}
          onClose={() => setViewingPass(null)}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl py-10 mt-20 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif italic text-base text-amber-500 tracking-tight">
                OpenSpace Cinema
              </span>
              <span className="text-gray-500 ml-2">|</span>
              <span className="text-gray-400 text-xs ml-2 uppercase tracking-wider font-sans">AI-Driven Experience</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-gray-400">
            <p className="italic font-serif text-gray-300 text-sm">“The stars are just part of the show.”</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
