import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_MOVIES,
  INITIAL_SCREENINGS,
  INITIAL_PACKAGES,
  INITIAL_FOOD_ITEMS,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_PROMOTIONS,
  INITIAL_DEMAND_FORECASTS,
  generateCinemaSeats
} from './src/data/initialData';
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
  FeedbackCategory
} from './src/types';

dotenv.config();

const PORT = 3000;

// Lazy GenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-Memory Database Store
interface CinemaStore {
  movies: Movie[];
  screenings: Screening[];
  packages: Package[];
  foodItems: FoodItem[];
  bookings: Booking[];
  reviews: CustomerReview[];
  promotions: AiPromotionSuggestion[];
  demandForecasts: AiDemandForecast[];
  seatsByScreening: Record<string, Seat[]>;
}

const store: CinemaStore = {
  movies: [...INITIAL_MOVIES],
  screenings: [...INITIAL_SCREENINGS],
  packages: [...INITIAL_PACKAGES],
  foodItems: [...INITIAL_FOOD_ITEMS],
  bookings: [...INITIAL_BOOKINGS],
  reviews: [...INITIAL_REVIEWS],
  promotions: [...INITIAL_PROMOTIONS],
  demandForecasts: [...INITIAL_DEMAND_FORECASTS],
  seatsByScreening: {}
};

// Initialize seating maps for initial screenings
INITIAL_SCREENINGS.forEach((s) => {
  store.seatsByScreening[s.id] = generateCinemaSeats();
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Movies
  app.get('/api/movies', (req: Request, res: Response) => {
    res.json(store.movies);
  });

  app.post('/api/movies', (req: Request, res: Response) => {
    const newMovie: Movie = {
      id: `mov-${Date.now()}`,
      title: req.body.title || 'Untitled Feature',
      genre: req.body.genre || ['Drama'],
      duration: req.body.duration || '2h 00m',
      rating: req.body.rating || 'PG-13',
      director: req.body.director || 'Various',
      releaseYear: req.body.releaseYear || 2024,
      synopsis: req.body.synopsis || 'An open-air cinematic journey.',
      posterUrl: req.body.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
      backdropUrl: req.body.backdropUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
      imdbRating: req.body.imdbRating || 8.0,
      tags: req.body.tags || ['Open-Air Special'],
      language: req.body.language || 'English'
    };
    store.movies.push(newMovie);
    res.status(201).json(newMovie);
  });

  // Screenings
  app.get('/api/screenings', (req: Request, res: Response) => {
    res.json(store.screenings);
  });

  app.post('/api/screenings', (req: Request, res: Response) => {
    const movie = store.movies.find((m) => m.id === req.body.movieId);
    const newScreening: Screening = {
      id: `scr-${Date.now()}`,
      movieId: req.body.movieId,
      movieTitle: movie ? movie.title : req.body.movieTitle || 'Special Feature',
      moviePoster: movie ? movie.posterUrl : '',
      movieBackdrop: movie ? movie.backdropUrl : '',
      date: req.body.date || 'Next Weekend',
      time: req.body.time || '8:30 PM',
      format: req.body.format || '4K Laser Open-Air',
      venueZone: req.body.venueZone || 'Main Amphitheater Lawn',
      basePrice: Number(req.body.basePrice) || 18,
      status: 'Scheduled',
      totalSeats: 48,
      bookedSeatsCount: 0,
      weatherForecast: {
        condition: 'Clear Sky',
        temp: '21°C (70°F)',
        stargazingIndex: 90,
        rainChance: '0%',
        note: 'Favorable night sky conditions forecast.'
      }
    };
    store.screenings.push(newScreening);
    store.seatsByScreening[newScreening.id] = generateCinemaSeats();
    res.status(201).json(newScreening);
  });

  // Seats by Screening
  app.get('/api/screenings/:id/seats', (req: Request, res: Response) => {
    const screeningId = req.params.id;
    if (!store.seatsByScreening[screeningId]) {
      store.seatsByScreening[screeningId] = generateCinemaSeats();
    }
    res.json(store.seatsByScreening[screeningId]);
  });

  // Packages & Food
  app.get('/api/packages', (req: Request, res: Response) => {
    res.json(store.packages);
  });

  app.get('/api/food', (req: Request, res: Response) => {
    res.json(store.foodItems);
  });

  app.post('/api/food', (req: Request, res: Response) => {
    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      name: req.body.name,
      category: req.body.category || 'Warm Bites',
      description: req.body.description || '',
      price: Number(req.body.price) || 9.5,
      imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=600&auto=format&fit=crop',
      isVegetarian: req.body.isVegetarian || false,
      isHot: req.body.isHot || false,
      prepTime: req.body.prepTime || '5 mins',
      isPopular: req.body.isPopular || false
    };
    store.foodItems.push(newItem);
    res.status(201).json(newItem);
  });

  // Bookings
  app.get('/api/bookings', (req: Request, res: Response) => {
    res.json(store.bookings);
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const {
      screeningId,
      customerName,
      customerEmail,
      customerPhone,
      seatIds,
      packageId,
      foodOrders,
      subtotal,
      discountAmount,
      totalAmount,
      paymentMethod
    } = req.body;

    const screening = store.screenings.find((s) => s.id === screeningId);
    if (!screening) {
      return res.status(404).json({ error: 'Screening not found' });
    }

    // Mark seats as reserved
    const seats = store.seatsByScreening[screeningId] || generateCinemaSeats();
    const selectedSeatDetails = seats
      .filter((seat) => seatIds.includes(seat.id))
      .map((s) => {
        s.status = 'reserved';
        return {
          id: s.id,
          row: s.row,
          number: s.number,
          category: s.category
        };
      });

    // Update screening booked count
    screening.bookedSeatsCount = seats.filter((s) => s.status === 'reserved').length;
    if (screening.bookedSeatsCount >= screening.totalSeats) {
      screening.status = 'Sold Out';
    } else if (screening.bookedSeatsCount >= screening.totalSeats * 0.7) {
      screening.status = 'Filling Fast';
    }

    const selectedPkg = store.packages.find((p) => p.id === packageId);
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `OSC-${codeNumber}-${screening.movieTitle.substring(0, 2).toUpperCase()}`;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingCode,
      customerName: customerName || 'Guest Stargazer',
      customerEmail: customerEmail || 'guest@example.com',
      customerPhone: customerPhone || '+1 (555) 000-0000',
      screeningId,
      movieTitle: screening.movieTitle,
      moviePoster: screening.moviePoster,
      screeningDate: screening.date,
      screeningTime: screening.time,
      venueZone: screening.venueZone,
      seatIds,
      seatDetails: selectedSeatDetails,
      packageSelected: selectedPkg ? { id: selectedPkg.id, name: selectedPkg.name, price: selectedPkg.price } : undefined,
      foodOrders: foodOrders || [],
      subtotal: subtotal || totalAmount,
      discountAmount: discountAmount || 0,
      totalAmount: totalAmount || subtotal,
      qrCodeData: `OPENSPACE-PASS|${bookingCode}|${screeningId}|${seatIds.join(',')}|${Date.now()}`,
      status: 'Confirmed',
      bookedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod: paymentMethod || 'Credit Card'
    };

    store.bookings.unshift(newBooking);
    res.status(201).json(newBooking);
  });

  // QR Code Verification / Check-in
  app.post('/api/bookings/verify-qr', (req: Request, res: Response) => {
    const { qrData, bookingCode } = req.body;
    let booking: Booking | undefined;

    if (qrData) {
      booking = store.bookings.find((b) => b.qrCodeData === qrData || qrData.includes(b.bookingCode));
    }
    if (!booking && bookingCode) {
      booking = store.bookings.find((b) => b.bookingCode.toLowerCase() === bookingCode.toLowerCase());
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Ticket pass not found or invalid QR code.' });
    }

    if (booking.status === 'Checked-In') {
      return res.json({
        success: true,
        alreadyCheckedIn: true,
        message: `Guest ${booking.customerName} already checked in at ${booking.checkedInAt || 'earlier tonight'}.`,
        booking
      });
    }

    booking.status = 'Checked-In';
    booking.checkedInAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    res.json({
      success: true,
      alreadyCheckedIn: false,
      message: `Welcome ${booking.customerName}! Checked in for ${booking.movieTitle} (${booking.seatDetails.map(s => s.id).join(', ')}).`,
      booking
    });
  });

  // Reviews
  app.get('/api/reviews', (req: Request, res: Response) => {
    res.json(store.reviews);
  });

  app.post('/api/reviews', async (req: Request, res: Response) => {
    const { customerName, movieTitle, rating, comment } = req.body;

    let sentiment: 'Positive' | 'Neutral' | 'Negative' = rating >= 4 ? 'Positive' : rating === 3 ? 'Neutral' : 'Negative';
    let sentimentScore = rating * 20;
    let categories: FeedbackCategory[] = ['Comfort', 'Movie selection'];
    let aiAnalysis = 'Customer review recorded.';

    // Run quick AI sentiment evaluation if Gemini API is configured
    try {
      if (process.env.GEMINI_API_KEY && comment) {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Analyze this customer review for an open-air cinema:
Review text: "${comment}"
Customer Star Rating: ${rating}/5
Classify sentiment as "Positive", "Neutral", or "Negative".
Provide a sentimentScore (0-100).
Identify which of these categories it mentions: Comfort, Price, Food, Safety, Weather, Movie selection.
Write a 1-sentence AI executive highlight.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                sentiment: { type: Type.STRING },
                sentimentScore: { type: Type.NUMBER },
                categories: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                aiAnalysis: { type: Type.STRING }
              },
              required: ['sentiment', 'sentimentScore', 'categories', 'aiAnalysis']
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (['Positive', 'Neutral', 'Negative'].includes(parsed.sentiment)) {
            sentiment = parsed.sentiment;
          }
          if (typeof parsed.sentimentScore === 'number') {
            sentimentScore = parsed.sentimentScore;
          }
          if (Array.isArray(parsed.categories)) {
            categories = parsed.categories as FeedbackCategory[];
          }
          if (parsed.aiAnalysis) {
            aiAnalysis = parsed.aiAnalysis;
          }
        }
      }
    } catch (err) {
      console.warn('Gemini review analysis fallback:', err);
    }

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      customerName: customerName || 'Cinema Guest',
      movieTitle: movieTitle || 'OpenSpace Screening',
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment: comment || '',
      sentiment,
      sentimentScore,
      categories,
      aiAnalysis,
      verifiedBooking: true,
      status: 'published'
    };

    store.reviews.unshift(newReview);
    res.status(201).json(newReview);
  });

  // Promotions
  app.get('/api/promotions', (req: Request, res: Response) => {
    res.json(store.promotions);
  });

  app.post('/api/promotions/:id/action', (req: Request, res: Response) => {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const promo = store.promotions.find((p) => p.id === id);

    if (!promo) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    if (action === 'approve') {
      promo.status = 'approved_active';
      promo.approvedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Apply discount to the matching screening
      const screening = store.screenings.find((s) => s.id === promo.screeningId);
      if (screening) {
        screening.activeDiscountPercent = promo.suggestedDiscountPercent;
        screening.activePromotionId = promo.id;
      }
    } else if (action === 'reject') {
      promo.status = 'rejected';
      const screening = store.screenings.find((s) => s.id === promo.screeningId);
      if (screening && screening.activePromotionId === promo.id) {
        screening.activeDiscountPercent = undefined;
        screening.activePromotionId = undefined;
      }
    }

    res.json(promo);
  });

  // Demand Forecasts
  app.get('/api/demand-forecasts', (req: Request, res: Response) => {
    res.json(store.demandForecasts);
  });

  // Aggregated Analytics Summary
  app.get('/api/analytics/summary', (req: Request, res: Response) => {
    const totalTicketSales = store.bookings.reduce((sum, b) => sum + (b.seatIds ? b.seatIds.length : 0), 0);
    const totalRevenue = store.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const foodSalesRevenue = store.bookings.reduce((sum, b) => {
      const fSum = (b.foodOrders || []).reduce((acc, fo) => acc + (fo.item.price * fo.quantity), 0);
      return sum + fSum;
    }, 0);

    const totalCapacity = store.screenings.reduce((sum, s) => sum + s.totalSeats, 0);
    const totalBooked = store.screenings.reduce((sum, s) => sum + s.bookedSeatsCount, 0);
    const overallOccupancy = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

    const checkedInCount = store.bookings.filter((b) => b.status === 'Checked-In').length;

    res.json({
      totalTicketSales,
      totalRevenue,
      foodSalesRevenue,
      overallOccupancy,
      checkedInCount,
      totalScreenings: store.screenings.length,
      activePromotionsCount: store.promotions.filter((p) => p.status === 'approved_active').length
    });
  });

  // ==========================================
  // CORE AI CAPABILITY 1: AI CUSTOMER ASSISTANT
  // ==========================================
  app.post('/api/ai/assistant', async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Build rich cinema grounded knowledge context
      const screeningsContext = store.screenings
        .map((s) => {
          const avail = s.totalSeats - s.bookedSeatsCount;
          const discount = s.activeDiscountPercent ? ` [Special Deal: ${s.activeDiscountPercent}% OFF!]` : '';
          return `• "${s.movieTitle}" on ${s.date} at ${s.time} in ${s.venueZone}. Format: ${s.format}. Base ticket: $${s.basePrice}${discount}. Seats available: ${avail}/${s.totalSeats}. Weather: ${s.weatherForecast.temp}, ${s.weatherForecast.condition} (${s.weatherForecast.note}).`;
        })
        .join('\n');

      const packagesContext = store.packages
        .map((p) => `• ${p.name} ($${p.price}): ${p.description}. Includes: ${p.includes.join(', ')}`)
        .join('\n');

      const foodContext = store.foodItems
        .map((f) => `• ${f.name} ($${f.price}) [${f.category}]: ${f.description}`)
        .join('\n');

      const venuePolicyContext = `
OPENSPACE CINEMA VENUE & POLICY KNOWLEDGE BASE:
- Location: OpenSpace Sky Amphitheater, Pine Ridge Lawn (under the stars).
- Weather Policy: Screenings proceed in clear weather, gentle breezes, and light overcast skies. In case of heavy rain or thunderstorms, tickets are 100% automatically rescheduled or refunded with 1-click, and automated SMS alerts are sent 2 hours before showtime.
- Comfort & Warmth: Free fleece blankets and patio heaters throughout the lawn. Personal heated cushions and memory foam loungers are available in Cabana and VIP packages.
- Food & Delivery: Hot food, pizza, burgers, popcorn, hot spiced cider, and mocktails are prepared fresh and delivered directly to your seat/cabana without interrupting the movie.
- Audio: Pristine Dolby Atmos surround system and optional ultra-clear wireless silent-disco headsets (no background city noise).
- Astronomy / Stargazing: High-powered telescope stations and constellation map guides available before and after screenings.
- Seating: Starlight Cabana Beds (for 2), Luxury Twin Beanbags (for 2), Standard Ergonomic Deckchairs (for 1), and VIP Loungers (for 1).
- Dog Policy: Well-behaved leashed dogs are warmly welcomed on the outer lawn perimeter!
- Outside Food: Small personal water bottles permitted; no commercial outside hot food.
- Booking & Cancellation: Free cancellation up to 4 hours before screening.
`;

      const systemPrompt = `You are the official OpenSpace Cinema AI Concierge.
You represent a cinema theatre where customers watch films under the open starry sky.
Your tone is warm, cinematic, hospitable, and knowledgeable.

CRITICAL INSTRUCTIONS:
1. Ground every answer STRICTLY on the cinema database and policies provided below.
2. NEVER invent movie showtimes, fake discounts, or non-existent policies.
3. If asked for recommendations, suggest actual screenings from the database and highlight packages or warm food pairings.
4. Keep answers concise, clear, beautifully formatted with bullet points, and welcoming.

CURRENT SCREENINGS & AVAILABILITY:
${screeningsContext}

CURRENT EXPERIENCE PACKAGES:
${packagesContext}

CURRENT FOOD & DRINKS MENU:
${foodContext}

${venuePolicyContext}
`;

      const ai = getAiClient();
      const chatMessages = [
        ...(Array.isArray(history)
          ? history.map((h: { sender: string; text: string }) => ({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }]
            }))
          : []),
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: chatMessages,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7
        }
      });

      const reply = response.text || 'I would be delighted to assist you with movies, seating, food, or weather for OpenSpace Cinema.';
      res.json({ reply });
    } catch (err: any) {
      console.error('AI Assistant Error:', err);
      res.status(500).json({
        error: 'AI Assistant temporarily unavailable',
        reply: 'OpenSpace Cinema concierge is currently processing high starfield traffic. For tonight, Interstellar is showing at 8:30 PM with hot cider and luxury beanbags available!'
      });
    }
  });

  // ==========================================
  // CORE AI CAPABILITY 2: AI MOVIE & EXPERIENCE RECOMMENDATIONS
  // ==========================================
  app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
    try {
      const { mood, companion, favoriteGenre, pastBookings, budgetPreference } = req.body;

      const moviesList = store.movies.map((m) => `${m.id}: "${m.title}" (${m.genre.join(', ')} - ${m.synopsis})`).join('\n');
      const screeningsList = store.screenings.map((s) => `${s.id}: "${s.movieTitle}" on ${s.date} at ${s.time} in ${s.venueZone} ($${s.basePrice})`).join('\n');
      const packagesList = store.packages.map((p) => `${p.id}: ${p.name} ($${p.price}) - ${p.description}`).join('\n');

      const prompt = `You are the OpenSpace Cinema Recommendation Engine.
Analyze the customer's profile:
- Mood: ${mood || 'Excited for open-air cinema'}
- Companion: ${companion || 'Date / Partner'}
- Favorite Genres: ${favoriteGenre || 'Sci-Fi, Romance, Comedy'}
- Past booking history: ${pastBookings || 'Enjoyed sci-fi and romantic evening screenings'}
- Budget preference: ${budgetPreference || 'Premium cozy'}

AVAILABLE MOVIES:
${moviesList}

AVAILABLE SCREENINGS:
${screeningsList}

AVAILABLE PACKAGES:
${packagesList}

Generate a tailored recommendation. Return pure JSON matching the schema.`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING, description: 'Catchy tailored recommendation header, e.g. "Because you love immersive spectacles under the night sky..."' },
              userAnalysis: { type: Type.STRING, description: '1-2 sentence analysis of their tastes and why this fits tonight' },
              recommendedScreenings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    screeningId: { type: Type.STRING },
                    movieTitle: { type: Type.STRING },
                    date: { type: Type.STRING },
                    time: { type: Type.STRING },
                    matchReason: { type: Type.STRING },
                    recommendedSeatType: { type: Type.STRING },
                    recommendedPackage: { type: Type.STRING }
                  },
                  required: ['screeningId', 'movieTitle', 'date', 'time', 'matchReason', 'recommendedSeatType', 'recommendedPackage']
                }
              },
              tipForTonight: { type: Type.STRING, description: 'Special tip e.g. pairing with Hot Spiced Mulled Apple Cider or arriving 20 mins early for stargazing' }
            },
            required: ['headline', 'userAnalysis', 'recommendedScreenings', 'tipForTonight']
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        res.json(result);
      } else {
        throw new Error('Empty response');
      }
    } catch (err) {
      console.error('AI Recommendation Error:', err);
      // Fallback response based on store
      const topScreening = store.screenings[0];
      res.json({
        headline: 'Curated Open-Air Feature Recommendation',
        userAnalysis: 'Based on your desire for unforgettable atmosphere and stargazing, we recommend our top cosmic feature.',
        recommendedScreenings: [
          {
            screeningId: topScreening.id,
            movieTitle: topScreening.movieTitle,
            date: topScreening.date,
            time: topScreening.time,
            matchReason: 'Stunning visual clarity under the real constellations with high stargazing index.',
            recommendedSeatType: 'Luxury Beanbag Pair',
            recommendedPackage: 'Cozy Couple Under The Stars'
          }
        ],
        tipForTonight: 'Pair your screening with freshly baked Campfire S’mores and arrive 20 minutes before showtime for constellation viewing.'
      });
    }
  });

  // ==========================================
  // CORE AI CAPABILITY 3: AI DEMAND FORECASTING
  // ==========================================
  app.post('/api/ai/demand-forecast/refresh', async (req: Request, res: Response) => {
    try {
      const screeningsSummary = store.screenings.map((s) => {
        return {
          id: s.id,
          title: s.movieTitle,
          date: s.date,
          time: s.time,
          format: s.format,
          currentBooked: s.bookedSeatsCount,
          totalSeats: s.totalSeats,
          weather: s.weatherForecast
        };
      });

      const prompt = `You are OpenSpace Cinema AI Demand Forecaster.
Analyze these open-air screenings and historical trends (movie genre, weekday vs weekend, weather condition, temperature, time slot 7:30pm vs 8:30pm).

Current Screenings to Forecast:
${JSON.stringify(screeningsSummary, null, 2)}

For each screening, predict:
- predictedOccupancyRate (integer 0 to 100)
- demandLevel: "Low" | "Moderate" | "High" | "Extremely High"
- confidenceScore (0 to 100)
- keyDrivers: list of 3-4 bullet strings explaining why
- managerRecommendation: 1 actionable sentence for cinema manager (e.g. increase F&B staff, open overflow seating, bundle promotions)
- weatherImpact: impact of temperature and stargazing visibility on attendance

Return a JSON array of forecasts.`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                screeningId: { type: Type.STRING },
                movieTitle: { type: Type.STRING },
                date: { type: Type.STRING },
                time: { type: Type.STRING },
                genre: { type: Type.ARRAY, items: { type: Type.STRING } },
                predictedOccupancyRate: { type: Type.NUMBER },
                demandLevel: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                keyDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
                managerRecommendation: { type: Type.STRING },
                weatherImpact: { type: Type.STRING }
              },
              required: ['screeningId', 'movieTitle', 'date', 'time', 'predictedOccupancyRate', 'demandLevel', 'confidenceScore', 'keyDrivers', 'managerRecommendation', 'weatherImpact']
            }
          }
        }
      });

      if (response.text) {
        const forecasts: AiDemandForecast[] = JSON.parse(response.text);
        store.demandForecasts = forecasts;
        res.json(forecasts);
      } else {
        res.json(store.demandForecasts);
      }
    } catch (err) {
      console.error('AI Demand Forecast Error:', err);
      res.json(store.demandForecasts);
    }
  });

  // ==========================================
  // CORE AI CAPABILITY 4: AI PROMOTION & PRICING INSIGHTS
  // ==========================================
  app.post('/api/ai/promotions/generate', async (req: Request, res: Response) => {
    try {
      const lowDemandScreenings = store.screenings.filter((s) => {
        const occ = (s.bookedSeatsCount / s.totalSeats) * 100;
        return occ < 60;
      });

      const prompt = `You are OpenSpace Cinema AI Dynamic Pricing & Promotions Strategist.
We have identified low-demand or weekday screenings:
${JSON.stringify(
  lowDemandScreenings.map((s) => ({
    id: s.id,
    title: s.movieTitle,
    date: s.date,
    time: s.time,
    occupancy: Math.round((s.bookedSeatsCount / s.totalSeats) * 100),
    basePrice: s.basePrice,
    weather: s.weatherForecast
  })),
  null,
  2
)}

Recommend targeted promotional packages, discounts (10% to 25%), and audience bundles to fill empty seats and boost F&B spend.
Management must approve all promotions before publishing.

Return a JSON array matching the schema.`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                screeningId: { type: Type.STRING },
                movieTitle: { type: Type.STRING },
                screeningDate: { type: Type.STRING },
                screeningTime: { type: Type.STRING },
                currentOccupancyRate: { type: Type.NUMBER },
                suggestedDiscountPercent: { type: Type.NUMBER },
                promoTitle: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                suggestedPackageBundle: { type: Type.STRING },
                aiRationale: { type: Type.STRING },
                projectedRevenueLift: { type: Type.NUMBER }
              },
              required: [
                'id',
                'screeningId',
                'movieTitle',
                'screeningDate',
                'screeningTime',
                'currentOccupancyRate',
                'suggestedDiscountPercent',
                'promoTitle',
                'targetAudience',
                'suggestedPackageBundle',
                'aiRationale',
                'projectedRevenueLift'
              ]
            }
          }
        }
      });

      if (response.text) {
        const rawPromos = JSON.parse(response.text);
        const newPromotions: AiPromotionSuggestion[] = rawPromos.map((p: any) => ({
          ...p,
          id: `promo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: 'pending_approval',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }));

        // Merge without duplicating existing pending ones for same screening
        newPromotions.forEach((np) => {
          if (!store.promotions.some((ep) => ep.screeningId === np.screeningId && ep.status === 'pending_approval')) {
            store.promotions.unshift(np);
          }
        });

        res.json(store.promotions);
      } else {
        res.json(store.promotions);
      }
    } catch (err) {
      console.error('AI Promotion Generation Error:', err);
      res.json(store.promotions);
    }
  });

  // ==========================================
  // CORE AI CAPABILITY 5: AI CUSTOMER SENTIMENT ANALYSIS
  // ==========================================
  app.post('/api/ai/sentiment-analysis/run', async (req: Request, res: Response) => {
    try {
      const reviewsData = store.reviews.map((r) => ({
        id: r.id,
        author: r.customerName,
        movie: r.movieTitle,
        rating: r.rating,
        text: r.comment
      }));

      const prompt = `You are the Lead Experience & Sentiment Analyst for OpenSpace Cinema.
Analyze the following customer reviews:
${JSON.stringify(reviewsData, null, 2)}

Perform a deep semantic classification across:
1. Overall sentiment breakdown (% Positive, % Neutral, % Negative)
2. Evaluation of the 6 core pillars:
   - Comfort (Deckchairs, Beanbags, Blankets, Heating)
   - Price (Ticket pricing, Food/Drinks value)
   - Food (Popcorn, S'mores, Sliders, Warm Drinks)
   - Safety (Lighting, Walkways, Staff assistance)
   - Weather (Wind, Night chill, Rain policy, Stargazing clarity)
   - Movie selection (Film choices, Audio synchronization, Subtitles)
3. Identify the "#1 Most Negative Issue this month" (e.g. "Seating comfort" or "Blanket shortage in cool weather")
4. Identify Top Praises
5. Actionable concrete manager recommendations

Return pure JSON matching the schema.`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallSentiment: { type: Type.STRING },
              positivePercent: { type: Type.NUMBER },
              neutralPercent: { type: Type.NUMBER },
              negativePercent: { type: Type.NUMBER },
              totalReviewsAnalyzed: { type: Type.NUMBER },
              averageRating: { type: Type.NUMBER },
              categoryBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    positiveCount: { type: Type.NUMBER },
                    negativeCount: { type: Type.NUMBER },
                    neutralCount: { type: Type.NUMBER },
                    satisfactionScore: { type: Type.NUMBER },
                    commonThemes: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['category', 'positiveCount', 'negativeCount', 'neutralCount', 'satisfactionScore', 'commonThemes']
                }
              },
              criticalAlert: { type: Type.STRING, description: 'e.g. "Most negative feedback this month: Blanket shortages during windy 9pm drops & lumbar support on deckchairs."' },
              topStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedActionItems: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              'overallSentiment',
              'positivePercent',
              'neutralPercent',
              'negativePercent',
              'totalReviewsAnalyzed',
              'averageRating',
              'categoryBreakdown',
              'criticalAlert',
              'topStrengths',
              'recommendedActionItems'
            ]
          }
        }
      });

      if (response.text) {
        const summary: SentimentAnalysisSummary = JSON.parse(response.text);
        res.json(summary);
      } else {
        throw new Error('Empty sentiment response');
      }
    } catch (err) {
      console.error('AI Sentiment Analysis Error:', err);
      // Fallback robust calculations
      const total = store.reviews.length || 1;
      const pos = store.reviews.filter((r) => r.sentiment === 'Positive').length;
      const neu = store.reviews.filter((r) => r.sentiment === 'Neutral').length;
      const neg = store.reviews.filter((r) => r.sentiment === 'Negative').length;
      const avg = store.reviews.reduce((s, r) => s + r.rating, 0) / total;

      const fallbackSummary: SentimentAnalysisSummary = {
        overallSentiment: 'Mostly Positive',
        positivePercent: Math.round((pos / total) * 100),
        neutralPercent: Math.round((neu / total) * 100),
        negativePercent: Math.round((neg / total) * 100),
        totalReviewsAnalyzed: total,
        averageRating: Number(avg.toFixed(1)),
        categoryBreakdown: [
          {
            category: 'Comfort',
            positiveCount: 4,
            negativeCount: 2,
            neutralCount: 1,
            satisfactionScore: 78,
            commonThemes: ['Luxury Cabana beds loved', 'Standard deckchair lumbar support needed for 2.5h+ films', 'Fleece blankets popular']
          },
          {
            category: 'Food',
            positiveCount: 5,
            negativeCount: 0,
            neutralCount: 1,
            satisfactionScore: 92,
            commonThemes: ['Truffle popcorn praised', 'Campfire S\'mores skillet is a crowd favorite', 'Hot mulled cider perfect for night chill']
          },
          {
            category: 'Movie selection',
            positiveCount: 5,
            negativeCount: 0,
            neutralCount: 1,
            satisfactionScore: 95,
            commonThemes: ['Cosmic Sci-Fi fits stargazing atmosphere', 'Interstellar and Dune 4K stunning visuals']
          },
          {
            category: 'Weather',
            positiveCount: 3,
            negativeCount: 2,
            neutralCount: 1,
            satisfactionScore: 72,
            commonThemes: ['Stargazing index accurate', 'Wind chill past 9:30pm requires more blanket stock']
          },
          {
            category: 'Price',
            positiveCount: 3,
            negativeCount: 1,
            neutralCount: 2,
            satisfactionScore: 76,
            commonThemes: ['VIP package high perceived value', 'Beer pricing slightly elevated']
          },
          {
            category: 'Safety',
            positiveCount: 4,
            negativeCount: 0,
            neutralCount: 0,
            satisfactionScore: 98,
            commonThemes: ['Well-lit lawn fairy lights', 'Helpful cinema ushers with illuminated wands']
          }
        ],
        criticalAlert: 'Most critical feedback this month: Blanket shortages during late evening chill & deckchair stiffness during 2.5h+ movies.',
        topStrengths: [
          'Under-the-stars atmosphere and audio clarity with wireless headsets',
          'Campfire S’mores skillet and truffle popcorn seat delivery',
          'Exceptional couple date night satisfaction in Starlight Cabanas'
        ],
        recommendedActionItems: [
          'Procure 50 additional thermal fleece blankets for inventory buffer',
          'Introduce ergonomic lumbar cushion add-on for standard deckchairs',
          'Add a fast-track F&B mobile ordering lane during 7:30pm-8:00pm arrival rush'
        ]
      };
      res.json(fallbackSummary);
    }
  });

  // ==========================================
  // VITE & STATIC FILE MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OpenSpace Cinema server running on http://localhost:${PORT}`);
  });
}

startServer();
