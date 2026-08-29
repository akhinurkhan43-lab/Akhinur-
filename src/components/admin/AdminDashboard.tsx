import React, { useState } from 'react';
import {
  Movie,
  Screening,
  Package,
  FoodItem,
  Booking,
  CustomerReview,
  AiPromotionSuggestion,
  AiDemandForecast
} from '../../types';
import { AiDemandForecastView } from './AiDemandForecastView';
import { AiPromotionPricingView } from './AiPromotionPricingView';
import { AiSentimentDashboard } from './AiSentimentDashboard';
import { ScreeningsManager } from './ScreeningsManager';
import { BookingsManager } from './BookingsManager';
import { FoodPackageManager } from './FoodPackageManager';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Sparkles,
  Tag,
  Smile,
  Film,
  ScanLine,
  Coffee,
  ShieldCheck,
  Percent,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  movies: Movie[];
  screenings: Screening[];
  packages: Package[];
  foodMenu: FoodItem[];
  bookings: Booking[];
  reviews: CustomerReview[];
  promotions: AiPromotionSuggestion[];
  demandForecasts: AiDemandForecast[];
  onMovieAdded: (movie: Movie) => void;
  onScreeningAdded: (screening: Screening) => void;
  onFoodAdded: (food: FoodItem) => void;
  onBookingCheckedIn: (booking: Booking) => void;
  onPromotionsUpdated: (promos: AiPromotionSuggestion[]) => void;
  onDemandForecastsUpdated: (forecasts: AiDemandForecast[]) => void;
  onScreeningDiscountUpdated: (screeningId: string, discount: number | null) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  movies,
  screenings,
  packages,
  foodMenu,
  bookings,
  reviews,
  promotions,
  demandForecasts,
  onMovieAdded,
  onScreeningAdded,
  onFoodAdded,
  onBookingCheckedIn,
  onPromotionsUpdated,
  onDemandForecastsUpdated,
  onScreeningDiscountUpdated
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'forecast' | 'promotions' | 'sentiment' | 'screenings' | 'bookings' | 'food'
  >('overview');

  // Compute metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalTickets = bookings.reduce((sum, b) => sum + b.seatIds.length, 0);
  const checkedInCount = bookings.filter((b) => b.status === 'checked_in').length;
  
  const totalSeats = screenings.reduce((sum, s) => sum + s.totalSeats, 0);
  const totalBooked = screenings.reduce((sum, s) => sum + s.bookedSeatsCount, 0);
  const averageOccupancy = totalSeats > 0 ? Math.round((totalBooked / totalSeats) * 100) : 0;

  const foodRevenue = bookings.reduce((sum, b) => {
    if (!b.foodOrders) return sum;
    return sum + b.foodOrders.reduce((fSum, fo) => fSum + fo.item.price * fo.quantity, 0);
  }, 0);

  const pendingPromosCount = promotions.filter((p) => p.status === 'pending_approval').length;

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title & System Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OpenSpace Operations Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
            Venue Management & <span className="font-serif italic text-amber-500 font-normal">AI Hub</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-light">
            Live amphitheater telemetry, predictive demand modeling, and automated pricing controls.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-xs">
            <span className="text-gray-400 block text-[9px] uppercase tracking-wider">AI Engine Status</span>
            <span className="text-white font-medium">Gemini 2.5 Active • Grounded</span>
          </div>
        </div>
      </div>

      {/* Top 5 KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-light text-white font-mono">
            ${totalRevenue.toFixed(0)}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">+18.4% vs last week</span>
        </div>

        {/* Lawn Occupancy */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400">
            <span>Amphitheater Fill</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-light text-amber-400 font-mono">
            {averageOccupancy}%
          </div>
          <span className="text-[10px] text-gray-400">{totalBooked} of {totalSeats} seats filled</span>
        </div>

        {/* Tickets Sold */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400">
            <span>Passes Issued</span>
            <Ticket className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-light text-white font-mono">
            {totalTickets}
          </div>
          <span className="text-[10px] text-gray-400">{bookings.length} reservations</span>
        </div>

        {/* Food & Beverage Sales */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400">
            <span>F&B In-Seat Sales</span>
            <Coffee className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-light text-white font-mono">
            ${foodRevenue.toFixed(0)}
          </div>
          <span className="text-[10px] text-amber-300 font-semibold">Truffle popcorn & S'mores top</span>
        </div>

        {/* Gate Checked-In */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400">
            <span>Gate Checked In</span>
            <ScanLine className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-light text-white font-mono">
            {checkedInCount} / {bookings.length}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">Live gate turnstile</span>
        </div>

      </div>

      {/* Admin Tab Navigation */}
      <div className="flex overflow-x-auto pb-2 border-b border-white/10 space-x-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview Analytics', icon: BarChart3 },
          { id: 'forecast', label: 'AI Demand Forecast', icon: Sparkles, badge: 'Core AI' },
          {
            id: 'promotions',
            label: 'AI Promotions & Pricing',
            icon: Tag,
            badge: pendingPromosCount > 0 ? `${pendingPromosCount} Pending` : undefined
          },
          { id: 'sentiment', label: 'AI Sentiment Analysis', icon: Smile, badge: 'Voice of Guest' },
          { id: 'screenings', label: 'Movies & Showtimes', icon: Film },
          { id: 'bookings', label: 'Bookings & QR Check-in', icon: Ticket },
          { id: 'food', label: 'Packages & Food Menu', icon: Coffee }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-black ${
                    isActive
                      ? 'bg-black text-amber-400'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Render */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Action Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* AI Forecast Summary Card */}
              <div
                onClick={() => setActiveTab('forecast')}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all cursor-pointer space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">AI Forecast Snapshot</span>
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-lg font-light text-white">Peak Saturday Anticipated</h4>
                <p className="text-xs text-gray-300 font-light">
                  Interstellar 8:30 PM projected at <strong className="text-amber-400 font-semibold">87% occupancy</strong> due to clear skies & 20°C weather.
                </p>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block pt-2">
                  View full matrix →
                </span>
              </div>

              {/* Dynamic Pricing Alerts Card */}
              <div
                onClick={() => setActiveTab('promotions')}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all cursor-pointer space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">AI Dynamic Pricing</span>
                  <Tag className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-lg font-light text-white">
                  {pendingPromosCount > 0 ? `${pendingPromosCount} Discount Suggestions` : 'Schedule Optimized'}
                </h4>
                <p className="text-xs text-gray-300 font-light">
                  Targeted discount proposed for low-demand Friday comedy screening to boost attendance by +28%.
                </p>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block pt-2">
                  Manage promotions →
                </span>
              </div>

              {/* Sentiment Card */}
              <div
                onClick={() => setActiveTab('sentiment')}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 backdrop-blur-xl transition-all cursor-pointer space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Guest Sentiment</span>
                  <Smile className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-lg font-light text-white">83% Positive Guest Index</h4>
                <p className="text-xs text-gray-300 font-light">
                  Top feedback: S'mores skillets and starry cabanas. Manager action: Deploy extra fleece blankets.
                </p>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block pt-2">
                  Inspect feedback intelligence →
                </span>
              </div>

            </div>

            {/* Upcoming Screenings Quick Table */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-light text-white">
                Current Scheduled <span className="font-serif italic text-amber-500">Screenings</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {screenings.map((sc) => (
                  <div key={sc.id} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm text-white">{sc.movieTitle}</h4>
                      <span className="text-xs font-mono text-amber-400">${sc.basePrice}</span>
                    </div>
                    <p className="text-xs text-gray-400">{sc.date} • {sc.time}</p>
                    <div className="flex justify-between text-xs text-gray-300 pt-2 border-t border-white/10">
                      <span className="text-gray-400">Occupancy:</span>
                      <span className="font-medium text-amber-300">
                        {sc.bookedSeatsCount} / {sc.totalSeats} seats
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'forecast' && (
          <AiDemandForecastView
            forecasts={demandForecasts}
            screenings={screenings}
            onForecastsUpdated={onDemandForecastsUpdated}
          />
        )}

        {activeTab === 'promotions' && (
          <AiPromotionPricingView
            promotions={promotions}
            screenings={screenings}
            onPromotionsUpdated={onPromotionsUpdated}
            onScreeningDiscountUpdated={onScreeningDiscountUpdated}
          />
        )}

        {activeTab === 'sentiment' && (
          <AiSentimentDashboard reviews={reviews} />
        )}

        {activeTab === 'screenings' && (
          <ScreeningsManager
            movies={movies}
            screenings={screenings}
            onMovieAdded={onMovieAdded}
            onScreeningAdded={onScreeningAdded}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsManager
            bookings={bookings}
            onBookingCheckedIn={onBookingCheckedIn}
          />
        )}

        {activeTab === 'food' && (
          <FoodPackageManager
            foodMenu={foodMenu}
            packages={packages}
            onFoodAdded={onFoodAdded}
          />
        )}
      </div>

    </div>
  );
};
