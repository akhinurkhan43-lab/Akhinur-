import {
  Movie,
  Screening,
  Seat,
  Package,
  FoodItem,
  Booking,
  CustomerReview,
  AiPromotionSuggestion,
  AiDemandForecast,
  SentimentAnalysisSummary,
  AiRecommendationResult
} from '../types';

export const api = {
  // Movies
  async getMovies(): Promise<Movie[]> {
    const res = await fetch('/api/movies');
    if (!res.ok) throw new Error('Failed to load movies');
    return res.json();
  },

  async addMovie(data: Partial<Movie>): Promise<Movie> {
    const res = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create movie');
    return res.json();
  },

  // Screenings
  async getScreenings(): Promise<Screening[]> {
    const res = await fetch('/api/screenings');
    if (!res.ok) throw new Error('Failed to load screenings');
    return res.json();
  },

  async createScreening(data: Partial<Screening>): Promise<Screening> {
    const res = await fetch('/api/screenings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create screening');
    return res.json();
  },

  async getSeats(screeningId: string): Promise<Seat[]> {
    const res = await fetch(`/api/screenings/${screeningId}/seats`);
    if (!res.ok) throw new Error('Failed to load seats');
    return res.json();
  },

  // Packages & Food
  async getPackages(): Promise<Package[]> {
    const res = await fetch('/api/packages');
    if (!res.ok) throw new Error('Failed to load packages');
    return res.json();
  },

  async getFoodMenu(): Promise<FoodItem[]> {
    const res = await fetch('/api/food');
    if (!res.ok) throw new Error('Failed to load food menu');
    return res.json();
  },

  async addFoodItem(data: Partial<FoodItem>): Promise<FoodItem> {
    const res = await fetch('/api/food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add food item');
    return res.json();
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const res = await fetch('/api/bookings');
    if (!res.ok) throw new Error('Failed to load bookings');
    return res.json();
  },

  async createBooking(data: any): Promise<Booking> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to complete booking');
    return res.json();
  },

  async verifyQrTicket(payload: { qrData?: string; bookingCode?: string }): Promise<{ success: boolean; alreadyCheckedIn?: boolean; message: string; booking?: Booking }> {
    const res = await fetch('/api/bookings/verify-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Reviews
  async getReviews(): Promise<CustomerReview[]> {
    const res = await fetch('/api/reviews');
    if (!res.ok) throw new Error('Failed to load reviews');
    return res.json();
  },

  async submitReview(data: { customerName: string; movieTitle: string; rating: number; comment: string }): Promise<CustomerReview> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  // Promotions & Management
  async getPromotions(): Promise<AiPromotionSuggestion[]> {
    const res = await fetch('/api/promotions');
    if (!res.ok) throw new Error('Failed to load promotions');
    return res.json();
  },

  async executePromotionAction(id: string, action: 'approve' | 'reject'): Promise<AiPromotionSuggestion> {
    const res = await fetch(`/api/promotions/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    if (!res.ok) throw new Error('Failed to update promotion');
    return res.json();
  },

  // Demand Forecasts
  async getDemandForecasts(): Promise<AiDemandForecast[]> {
    const res = await fetch('/api/demand-forecasts');
    if (!res.ok) throw new Error('Failed to load forecasts');
    return res.json();
  },

  // Analytics Summary
  async getAnalyticsSummary(): Promise<{
    totalTicketSales: number;
    totalRevenue: number;
    foodSalesRevenue: number;
    overallOccupancy: number;
    checkedInCount: number;
    totalScreenings: number;
    activePromotionsCount: number;
  }> {
    const res = await fetch('/api/analytics/summary');
    if (!res.ok) throw new Error('Failed to load analytics summary');
    return res.json();
  },

  // ==========================================
  // AI SERVICES
  // ==========================================

  async askAiAssistant(message: string, history: { sender: string; text: string }[]): Promise<{ reply: string }> {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    if (!res.ok) throw new Error('Failed to get AI assistant response');
    return res.json();
  },

  async getAiRecommendations(preferences: {
    mood?: string;
    companion?: string;
    favoriteGenre?: string;
    pastBookings?: string;
    budgetPreference?: string;
  }): Promise<AiRecommendationResult> {
    const res = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences)
    });
    if (!res.ok) throw new Error('Failed to generate AI recommendations');
    return res.json();
  },

  async refreshAiDemandForecast(): Promise<AiDemandForecast[]> {
    const res = await fetch('/api/ai/demand-forecast/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to refresh demand forecast');
    return res.json();
  },

  async generateAiPromotions(): Promise<AiPromotionSuggestion[]> {
    const res = await fetch('/api/ai/promotions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to generate promotion suggestions');
    return res.json();
  },

  async runAiSentimentAnalysis(): Promise<SentimentAnalysisSummary> {
    const res = await fetch('/api/ai/sentiment-analysis/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to run AI sentiment analysis');
    return res.json();
  }
};
