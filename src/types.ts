export type WeatherCondition = 'Clear Sky' | 'Stargazing Ideal' | 'Mild Evening Breeze' | 'Passing Clouds' | 'Clear & Starlit';

export interface WeatherForecast {
  condition: WeatherCondition;
  temp: string;
  stargazingIndex: number; // 1-100
  rainChance?: string;
  rainProbability?: number;
  note?: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string[];
  duration: string; // e.g. "2h 49m"
  rating: string; // e.g. "PG-13", "R"
  director?: string;
  releaseYear?: number;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  imdbRating?: number;
  imdbScore?: number;
  tags?: string[];
  language?: string;
  highlightQuote?: string;
}

export interface Screening {
  id: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieBackdrop: string;
  date: string; // e.g. "2026-08-30"
  time: string; // e.g. "8:30 PM"
  format: '4K Laser Open-Air' | 'Dolby Atmos Stargazer' | 'Acoustic Silent-Disco Headsets' | 'Silent Disco Headsets' | string;
  venueZone: 'Main Amphitheater Lawn' | 'Moonlight Horizon Deck' | 'Starlight VIP Terrace' | string;
  basePrice: number;
  status?: 'Scheduled' | 'Filling Fast' | 'Sold Out' | 'Completed';
  totalSeats: number;
  bookedSeatsCount: number;
  weatherForecast: WeatherForecast;
  isSpecialEvent?: boolean;
  eventTitle?: string;
  activeDiscountPercent?: number;
  activePromotionId?: string;
}

export type SeatCategory = 'Standard Deckchair' | 'Luxury Beanbag Pair' | 'Starlight Cabana Bed' | 'VIP Lounger';

export interface Seat {
  id: string;
  row: string; // 'A', 'B', 'C', 'D', 'E'
  number: number;
  category: SeatCategory;
  priceMultiplier: number;
  status: 'available' | 'selected' | 'reserved' | 'blocked';
  amenities: string[];
  capacity: number; // 1 or 2 persons
}

export interface Package {
  id: string;
  name: string;
  badge: string;
  description: string;
  price: number;
  includes: string[];
  popular?: boolean;
  glowColor?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  isVegetarian?: boolean;
  isHot?: boolean;
  prepTime: string;
  isPopular?: boolean;
  available?: boolean;
}

export interface OrderFoodItem {
  item: FoodItem;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  screeningId: string;
  movieTitle: string;
  moviePoster?: string;
  screeningDate: string;
  screeningTime: string;
  venueZone?: string;
  seatIds: string[];
  seatDetails?: { id: string; row: string; number: number; category: SeatCategory }[];
  packageSelected?: { id: string; name: string; price: number };
  foodOrders?: OrderFoodItem[];
  subtotal: number;
  discountAmount?: number;
  totalAmount: number;
  promotionCodeApplied?: string;
  qrCodeData?: string;
  status: 'Confirmed' | 'Checked-In' | 'checked_in' | 'confirmed' | 'Cancelled';
  bookedAt?: string;
  checkedInAt?: string;
  paymentMethod?: string;
}

export type FeedbackCategory = 'Comfort' | 'Price' | 'Food' | 'Safety' | 'Weather' | 'Movie selection';

export interface CustomerReview {
  id: string;
  customerName: string;
  customerEmail?: string;
  screeningId?: string;
  movieTitle: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sentimentScore: number; // 0-100
  categories?: FeedbackCategory[];
  aiAnalysis?: string;
  verifiedBooking?: boolean;
  status?: 'published' | 'hidden';
}

export interface AiDemandForecast {
  screeningId: string;
  movieTitle: string;
  date: string;
  time: string;
  genre?: string[];
  predictedOccupancyRate: number; // 0 - 100
  demandLevel: 'Low' | 'Moderate' | 'High' | 'Extremely High';
  confidenceScore: number;
  keyDrivers: string[];
  managerRecommendation: string;
  weatherImpact?: string;
}

export interface AiPromotionSuggestion {
  id: string;
  screeningId?: string;
  targetScreeningId?: string;
  movieTitle?: string;
  targetMovieTitle?: string;
  screeningDate?: string;
  screeningTime?: string;
  promoCode?: string;
  currentOccupancyRate?: number;
  suggestedDiscountPercent?: number;
  discountPercent?: number;
  promoTitle?: string;
  campaignTitle?: string;
  targetAudience?: string;
  suggestedPackageBundle?: string;
  recommendedPackagePairing?: string;
  aiRationale?: string;
  projectedRevenueLift?: number;
  projectedOccupancyIncrease?: string;
  status: 'pending_approval' | 'approved_active' | 'approved' | 'rejected' | 'expired';
  createdAt?: string;
  approvedAt?: string;
}

export interface SentimentAnalysisSummary {
  overallSentiment?: string;
  positivePercentage?: number;
  neutralPercentage?: number;
  negativePercentage?: number;
  positivePercent?: number;
  neutralPercent?: number;
  negativePercent?: number;
  totalPositive?: number;
  totalNeutral?: number;
  totalNegative?: number;
  totalReviewsAnalyzed?: number;
  averageRating?: number;
  primaryIssueIdentified?: string;
  criticalAlert?: string;
  categoryBreakdown?: any[];
  categoriesBreakdown?: {
    category: string;
    positiveMentions: number;
    negativeMentions: number;
    sentimentScore: number;
    summary: string;
  }[];
  topStrengths?: string[];
  recommendedActionItems?: string[];
  actionableRecommendations?: string[];
}

export interface AiRecommendationResult {
  headline: string;
  userAnalysis: string;
  recommendedScreenings: {
    screeningId: string;
    movieTitle: string;
    date: string;
    time: string;
    matchReason: string;
    recommendedSeatType: SeatCategory;
    recommendedPackage: string;
  }[];
  tipForTonight?: string;
}
