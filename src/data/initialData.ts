import { Movie, Screening, Seat, Package, FoodItem, Booking, CustomerReview, AiPromotionSuggestion, AiDemandForecast } from '../types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Interstellar: Starfield Experience',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: '2h 49m',
    rating: 'PG-13',
    director: 'Christopher Nolan',
    releaseYear: 2014,
    synopsis: 'When Earth becomes uninhabitable, a team of ex-NASA pilots travels through a wormhole in search of a new home for humanity under the vast cosmos.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    imdbRating: 8.7,
    tags: ['Cosmic Stargazing Special', 'Dolby Atmos', 'Visual Masterpiece'],
    language: 'English with English Subtitles',
    highlightQuote: '“Mankind was born on Earth. It was never meant to die here.”'
  },
  {
    id: 'mov-2',
    title: 'La La Land: Moonlight Romance',
    genre: ['Comedy', 'Drama', 'Music', 'Romance'],
    duration: '2h 08m',
    rating: 'PG-13',
    director: 'Damien Chazelle',
    releaseYear: 2016,
    synopsis: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future under night skies.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    imdbRating: 8.0,
    tags: ['Date Night Favorite', 'Acoustic Headsets', 'Live Pre-show Jazz'],
    language: 'English',
    highlightQuote: '“Here’s to the fools who dream, crazy as they may seem.”'
  },
  {
    id: 'mov-3',
    title: 'Dune: Part Two (Open-Air 4K)',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    duration: '2h 46m',
    rating: 'PG-13',
    director: 'Denis Villeneuve',
    releaseYear: 2024,
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    imdbRating: 8.6,
    tags: ['Epic Scale', '4K Laser Projection', 'Dual Subwoofers'],
    language: 'English',
    highlightQuote: '“Power over spice is power over all.”'
  },
  {
    id: 'mov-4',
    title: 'Spirited Away: Open Sky Anime Night',
    genre: ['Animation', 'Adventure', 'Family', 'Fantasy'],
    duration: '2h 05m',
    rating: 'PG',
    director: 'Hayao Miyazaki',
    releaseYear: 2001,
    synopsis: 'During her family’s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    imdbRating: 8.6,
    tags: ['Studio Ghibli', 'Family Friendly', 'Lantern Ambient Lighting'],
    language: 'Japanese with English Subtitles',
    highlightQuote: '“Once you’ve met someone you never really forget them.”'
  },
  {
    id: 'mov-5',
    title: 'Top Gun: Maverick (Sky-High Action)',
    genre: ['Action', 'Drama'],
    duration: '2h 10m',
    rating: 'PG-13',
    director: 'Joseph Kosinski',
    releaseYear: 2022,
    synopsis: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN’s elite graduates.',
    posterUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6f9?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    imdbRating: 8.3,
    tags: ['Crowd Pleaser', 'Full Surround Lawn Audio'],
    language: 'English',
    highlightQuote: '“Don’t think, just do.”'
  },
  {
    id: 'mov-6',
    title: 'The Grand Budapest Hotel',
    genre: ['Comedy', 'Adventure', 'Crime'],
    duration: '1h 39m',
    rating: 'R',
    director: 'Wes Anderson',
    releaseYear: 2014,
    synopsis: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel’s glorious years under an eccentric concierge.',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    imdbRating: 8.1,
    tags: ['Art House & Laughs', 'Curated Wine & Cheese Special'],
    language: 'English',
    highlightQuote: '“There are still faint glimmers of civilization left in this barbaric slaughterhouse.”'
  }
];

export const INITIAL_SCREENINGS: Screening[] = [
  {
    id: 'scr-101',
    movieId: 'mov-1',
    movieTitle: 'Interstellar: Starfield Experience',
    moviePoster: INITIAL_MOVIES[0].posterUrl,
    movieBackdrop: INITIAL_MOVIES[0].backdropUrl,
    date: 'Tonight (Sat, Aug 29)',
    time: '8:30 PM',
    format: 'Dolby Atmos Stargazer',
    venueZone: 'Main Amphitheater Lawn',
    basePrice: 18.5,
    status: 'Filling Fast',
    totalSeats: 48,
    bookedSeatsCount: 39,
    weatherForecast: {
      condition: 'Stargazing Ideal',
      temp: '20°C (68°F)',
      stargazingIndex: 96,
      rainChance: '0%',
      note: 'Crystal-clear sky, warm gentle breeze. Moon rises at 11:15 PM.'
    },
    isSpecialEvent: true,
    eventTitle: '🔭 Astronomy Club Pre-Show Constellation Guide'
  },
  {
    id: 'scr-102',
    movieId: 'mov-2',
    movieTitle: 'La La Land: Moonlight Romance',
    moviePoster: INITIAL_MOVIES[1].posterUrl,
    movieBackdrop: INITIAL_MOVIES[1].backdropUrl,
    date: 'Tomorrow (Sun, Aug 30)',
    time: '8:00 PM',
    format: 'Acoustic Silent-Disco Headsets',
    venueZone: 'Moonlight Horizon Deck',
    basePrice: 16.0,
    status: 'Scheduled',
    totalSeats: 48,
    bookedSeatsCount: 22,
    weatherForecast: {
      condition: 'Clear Sky',
      temp: '22°C (72°F)',
      stargazingIndex: 88,
      rainChance: '5%',
      note: 'Ideal open-air conditions with panoramic skyline backdrop.'
    }
  },
  {
    id: 'scr-103',
    movieId: 'mov-3',
    movieTitle: 'Dune: Part Two (Open-Air 4K)',
    moviePoster: INITIAL_MOVIES[2].posterUrl,
    movieBackdrop: INITIAL_MOVIES[2].backdropUrl,
    date: 'Mon, Aug 31',
    time: '8:30 PM',
    format: '4K Laser Open-Air',
    venueZone: 'Main Amphitheater Lawn',
    basePrice: 19.0,
    status: 'Scheduled',
    totalSeats: 48,
    bookedSeatsCount: 14,
    weatherForecast: {
      condition: 'Mild Evening Breeze',
      temp: '19°C (66°F)',
      stargazingIndex: 82,
      rainChance: '0%',
      note: 'Dry evening. Heated fleece blankets available complimentary at counter.'
    },
    activeDiscountPercent: 15,
    activePromotionId: 'promo-1'
  },
  {
    id: 'scr-104',
    movieId: 'mov-4',
    movieTitle: 'Spirited Away: Open Sky Anime Night',
    moviePoster: INITIAL_MOVIES[3].posterUrl,
    movieBackdrop: INITIAL_MOVIES[3].backdropUrl,
    date: 'Tue, Sep 1',
    time: '7:30 PM',
    format: '4K Laser Open-Air',
    venueZone: 'Starlight VIP Terrace',
    basePrice: 15.0,
    status: 'Scheduled',
    totalSeats: 48,
    bookedSeatsCount: 28,
    weatherForecast: {
      condition: 'Clear Sky',
      temp: '23°C (73°F)',
      stargazingIndex: 90,
      rainChance: '0%',
      note: 'Sunset at 7:42 PM followed by illuminated lanterns around terrace.'
    },
    isSpecialEvent: true,
    eventTitle: '🏮 Lantern & Japanese Tea Twilight Special'
  },
  {
    id: 'scr-105',
    movieId: 'mov-6',
    movieTitle: 'The Grand Budapest Hotel',
    moviePoster: INITIAL_MOVIES[5].posterUrl,
    movieBackdrop: INITIAL_MOVIES[5].backdropUrl,
    date: 'Wed, Sep 2',
    time: '8:15 PM',
    format: 'Acoustic Silent-Disco Headsets',
    venueZone: 'Moonlight Horizon Deck',
    basePrice: 16.5,
    status: 'Scheduled',
    totalSeats: 48,
    bookedSeatsCount: 11,
    weatherForecast: {
      condition: 'Passing Clouds',
      temp: '18°C (64°F)',
      stargazingIndex: 70,
      rainChance: '10%',
      note: 'Patio heaters active on the Moonlight Deck.'
    }
  },
  {
    id: 'scr-106',
    movieId: 'mov-5',
    movieTitle: 'Top Gun: Maverick (Sky-High Action)',
    moviePoster: INITIAL_MOVIES[4].posterUrl,
    movieBackdrop: INITIAL_MOVIES[4].backdropUrl,
    date: 'Thu, Sep 3',
    time: '8:45 PM',
    format: 'Dolby Atmos Stargazer',
    venueZone: 'Main Amphitheater Lawn',
    basePrice: 17.5,
    status: 'Scheduled',
    totalSeats: 48,
    bookedSeatsCount: 34,
    weatherForecast: {
      condition: 'Stargazing Ideal',
      temp: '21°C (70°F)',
      stargazingIndex: 94,
      rainChance: '0%',
      note: 'Crystal clear visibility with dusk flyover audio immersion.'
    }
  }
];

export const INITIAL_PACKAGES: Package[] = [
  {
    id: 'pkg-standard',
    name: 'Stargazer Solo Pass',
    badge: 'Essential',
    description: 'Perfect for solo movie lovers seeking comfortable open-air cinema immersion.',
    price: 0,
    includes: [
      'Standard Reserved Deckchair or Beanbag',
      'High-Fidelity Wireless Headset',
      'Complimentary Starlight Fleece Blanket (rental)',
      'Access to Lawn Bar & Telescope Stations'
    ],
    glowColor: 'border-slate-700 hover:border-slate-500'
  },
  {
    id: 'pkg-cozy-couple',
    name: 'Cozy Couple Under The Stars',
    badge: 'Most Popular',
    description: 'Curated romance package with luxury twin beanbag, artisan treats, and wine.',
    price: 24,
    popular: true,
    includes: [
      'Double Luxury Beanbag or Starlight Cabana priority',
      '2x Giant Truffle Parmesan Popcorn tubs',
      '2x Artisan Cocktails / Mocktails or Hot Spiced Cider',
      'Double-ply Ultra Warm Wool Blanket (keep or return)',
      'Campfire S\'mores Skillet dessert for two'
    ],
    glowColor: 'border-amber-500/50 bg-amber-500/5 hover:border-amber-400'
  },
  {
    id: 'pkg-vip-cabana',
    name: 'Celestial VIP Lounger & Dine',
    badge: 'Premium Luxury',
    description: 'Private elevated daybed lounge with full at-seat butler service and gourmet dining.',
    price: 45,
    includes: [
      'Private Canopy Starlight Daybed with Memory Foam Cushions',
      'Dedicated In-Seat Waitstaff & Instant Butler Call Button',
      'Chef\'s Gourmet Tapas Platter & Artisan Sliders',
      'Chilled Prosecco / Craft Beer Bucket or Premium Beverages',
      'Personal Heated Cushion & High-Power Stargazing Binoculars'
    ],
    glowColor: 'border-indigo-500/50 bg-indigo-500/5 hover:border-indigo-400'
  },
  {
    id: 'pkg-family-picnic',
    name: 'Open-Air Family Lawn Picnic',
    badge: 'Family & Group',
    description: 'Spacious picnic mat zone + deckchairs with family snack bundle for up to 4 guests.',
    price: 32,
    includes: [
      'Spacious Grass Pitch with 4x Cushioned Low-Rider Chairs',
      'Family Snack Crate (4x Popcorns, Candy, 4x Warm/Cold Drinks)',
      'Kids Glow Sticks & Constellation Map Activity Booklet',
      'Hot Wood-Fired Artisan Pizza to share'
    ],
    glowColor: 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-400'
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Truffle & Rosemary Sea Salt Popcorn',
    category: 'Gourmet Popcorn',
    description: 'Freshly popped artisanal corn tossed in white truffle oil, sea salt crystals, and freshly chopped rosemary.',
    price: 8.5,
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=600&auto=format&fit=crop',
    isVegetarian: true,
    prepTime: 'Instant',
    isPopular: true
  },
  {
    id: 'food-2',
    name: 'Smoked Cheddar & Caramel Crunch Mix',
    category: 'Gourmet Popcorn',
    description: 'The iconic sweet-and-savory Chicago blend of sharp cheddar and buttery molasses caramel corn.',
    price: 7.5,
    imageUrl: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?q=80&w=600&auto=format&fit=crop',
    isVegetarian: true,
    prepTime: 'Instant'
  },
  {
    id: 'food-3',
    name: 'Campfire S\'mores Cast-Iron Skillet',
    category: 'Campfire S\'mores & Sweets',
    description: 'Gooey melted Hershey milk chocolate topped with toasted jumbo marshmallows, served with graham crackers for dipping.',
    price: 12.0,
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600&auto=format&fit=crop',
    isVegetarian: true,
    isHot: true,
    prepTime: '6 mins',
    isPopular: true
  },
  {
    id: 'food-4',
    name: 'Wagyu Beef & Brioche Sliders (2pcs)',
    category: 'Warm Bites',
    description: 'Grilled wagyu beef patties, caramelized balsamic onions, aged gruyere cheese, and garlic aioli on toasted brioche.',
    price: 15.5,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop',
    isHot: true,
    prepTime: '8 mins',
    isPopular: true
  },
  {
    id: 'food-5',
    name: 'Wood-Fired Margherita Flatbread Pizza',
    category: 'Warm Bites',
    description: 'San Marzano tomato base, fresh buffalo mozzarella, fresh basil, and extra virgin olive oil baked crispy.',
    price: 14.0,
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop',
    isVegetarian: true,
    isHot: true,
    prepTime: '7 mins'
  },
  {
    id: 'food-6',
    name: 'Hot Spiced Mulled Apple Cider (with Cinnamon Stick)',
    category: 'Artisan Drinks',
    description: 'Simmered local apple cider infused with star anise, cloves, orange zest, and a fragrant cinnamon stirring stick.',
    price: 6.5,
    imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop',
    isVegetarian: true,
    isHot: true,
    prepTime: '2 mins',
    isPopular: true
  },
  {
    id: 'food-7',
    name: 'Midnight Starlight Mocktail (Glitter Infused)',
    category: 'Artisan Drinks',
    description: 'Blueberry lavender syrup, sparkling lemon tonic, edible silver luster dust, and crushed mint under ice.',
    price: 8.0,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600&auto=format&fit=crop',
    isVegetarian: true,
    prepTime: '3 mins'
  },
  {
    id: 'food-8',
    name: 'Craft IPA / Pinot Noir Nightcap (Can / Glass)',
    category: 'Artisan Drinks',
    description: 'Local microbrewery citrus IPA or Chilean Pinot Noir selected specifically for evening open-air sipping.',
    price: 9.5,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
    isVegetarian: true,
    prepTime: 'Instant'
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Elena Rostova',
    movieTitle: 'Interstellar: Starfield Experience',
    rating: 5,
    date: '2026-08-27',
    comment: 'Watching Interstellar under the actual stars was a bucket-list memory. The sound was incredible, the wireless headsets meant zero city noise, and the truffle popcorn was piping hot!',
    sentiment: 'Positive',
    sentimentScore: 98,
    categories: ['Movie selection', 'Food', 'Comfort'],
    aiAnalysis: 'High praise for atmospheric ambiance, audio quality, and food delivery speed.',
    verifiedBooking: true,
    status: 'published'
  },
  {
    id: 'rev-2',
    customerName: 'Marcus Sterling',
    movieTitle: 'La La Land: Moonlight Romance',
    rating: 5,
    date: '2026-08-25',
    comment: 'Took my fiancé for our anniversary in the Starlight Cabana Bed. The heated blanket and s’mores skillet were unreal. Worth every penny for date night.',
    sentiment: 'Positive',
    sentimentScore: 95,
    categories: ['Comfort', 'Food', 'Price'],
    aiAnalysis: 'Exceptional appreciation for premium cabana packages and romantic couple experience.',
    verifiedBooking: true,
    status: 'published'
  },
  {
    id: 'rev-3',
    customerName: 'Samantha Lee',
    movieTitle: 'Dune: Part Two',
    rating: 3,
    date: '2026-08-24',
    comment: 'The movie and screen quality were 10/10, but the standard deckchairs felt a bit stiff by hour two. Highly recommend adding extra back cushions for long 3-hour epics.',
    sentiment: 'Neutral',
    sentimentScore: 50,
    categories: ['Comfort', 'Movie selection'],
    aiAnalysis: 'Constructive feedback on ergonomic lumbar support for standard deckchairs during long movies.',
    verifiedBooking: true,
    status: 'published'
  },
  {
    id: 'rev-4',
    customerName: 'David Chen',
    movieTitle: 'Spirited Away',
    rating: 4,
    date: '2026-08-22',
    comment: 'Kids loved the fairy lights and open sky! Safety was top notch with security and well-lit walkways. Only complaint is food line took 12 mins at 7:30pm rush.',
    sentiment: 'Positive',
    sentimentScore: 82,
    categories: ['Safety', 'Food', 'Comfort'],
    aiAnalysis: 'Positive on safety and family atmosphere, suggested queue optimization during peak 7:30pm entry.',
    verifiedBooking: true,
    status: 'published'
  },
  {
    id: 'rev-5',
    customerName: 'Jessica Walsh',
    movieTitle: 'Top Gun: Maverick',
    rating: 2,
    date: '2026-08-20',
    comment: 'Evening got very chilly around 9:30pm and all the loaner blankets were already handed out! Please stock at least 50 more blankets for windy nights.',
    sentiment: 'Negative',
    sentimentScore: 25,
    categories: ['Weather', 'Comfort'],
    aiAnalysis: 'Critical operational bottleneck: blanket shortage during sudden temperature drop.',
    verifiedBooking: true,
    status: 'published'
  },
  {
    id: 'rev-6',
    customerName: 'Liam O’Connor',
    movieTitle: 'The Grand Budapest Hotel',
    rating: 4,
    date: '2026-08-18',
    comment: 'Great comedy night! Beer prices are a little steep ($9.50), but the vibe and lawn games make up for it.',
    sentiment: 'Neutral',
    sentimentScore: 62,
    categories: ['Price', 'Food'],
    aiAnalysis: 'Price sensitivity noted on alcoholic beverages; overall satisfaction remained strong due to ambiance.',
    verifiedBooking: true,
    status: 'published'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-9001',
    bookingCode: 'OSC-7749-X',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 234-8901',
    screeningId: 'scr-101',
    movieTitle: 'Interstellar: Starfield Experience',
    moviePoster: INITIAL_MOVIES[0].posterUrl,
    screeningDate: 'Tonight (Sat, Aug 29)',
    screeningTime: '8:30 PM',
    venueZone: 'Main Amphitheater Lawn',
    seatIds: ['B-4', 'B-5'],
    seatDetails: [
      { id: 'B-4', row: 'B', number: 4, category: 'Luxury Beanbag Pair' },
      { id: 'B-5', row: 'B', number: 5, category: 'Luxury Beanbag Pair' }
    ],
    packageSelected: { id: 'pkg-cozy-couple', name: 'Cozy Couple Under The Stars', price: 24 },
    foodOrders: [
      { item: INITIAL_FOOD_ITEMS[0], quantity: 1 },
      { item: INITIAL_FOOD_ITEMS[2], quantity: 1 }
    ],
    subtotal: 78.5,
    discountAmount: 0,
    totalAmount: 78.5,
    qrCodeData: 'OPESPACE-TICKET-OSC-7749-X-SCR101-B4B5',
    status: 'Confirmed',
    bookedAt: '2026-08-29 14:15',
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'bk-9002',
    bookingCode: 'OSC-3821-K',
    customerName: 'Michael Chang',
    customerEmail: 'm.chang@example.com',
    customerPhone: '+1 (555) 872-1194',
    screeningId: 'scr-101',
    movieTitle: 'Interstellar: Starfield Experience',
    moviePoster: INITIAL_MOVIES[0].posterUrl,
    screeningDate: 'Tonight (Sat, Aug 29)',
    screeningTime: '8:30 PM',
    venueZone: 'Main Amphitheater Lawn',
    seatIds: ['A-1', 'A-2'],
    seatDetails: [
      { id: 'A-1', row: 'A', number: 1, category: 'Starlight Cabana Bed' },
      { id: 'A-2', row: 'A', number: 2, category: 'Starlight Cabana Bed' }
    ],
    packageSelected: { id: 'pkg-vip-cabana', name: 'Celestial VIP Lounger & Dine', price: 45 },
    foodOrders: [
      { item: INITIAL_FOOD_ITEMS[3], quantity: 2 },
      { item: INITIAL_FOOD_ITEMS[6], quantity: 2 }
    ],
    subtotal: 134.0,
    discountAmount: 0,
    totalAmount: 134.0,
    qrCodeData: 'OPESPACE-TICKET-OSC-3821-K-SCR101-A1A2',
    status: 'Checked-In',
    bookedAt: '2026-08-28 19:30',
    checkedInAt: '2026-08-29 20:05',
    paymentMethod: 'Credit Card (Visa)'
  },
  {
    id: 'bk-9003',
    bookingCode: 'OSC-5510-R',
    customerName: 'Lucas Vance',
    customerEmail: 'lucas.v@example.com',
    customerPhone: '+1 (555) 441-9032',
    screeningId: 'scr-102',
    movieTitle: 'La La Land: Moonlight Romance',
    moviePoster: INITIAL_MOVIES[1].posterUrl,
    screeningDate: 'Tomorrow (Sun, Aug 30)',
    screeningTime: '8:00 PM',
    venueZone: 'Moonlight Horizon Deck',
    seatIds: ['C-7'],
    seatDetails: [
      { id: 'C-7', row: 'C', number: 7, category: 'Standard Deckchair' }
    ],
    packageSelected: { id: 'pkg-standard', name: 'Stargazer Solo Pass', price: 0 },
    foodOrders: [
      { item: INITIAL_FOOD_ITEMS[0], quantity: 1 }
    ],
    subtotal: 24.5,
    discountAmount: 0,
    totalAmount: 24.5,
    qrCodeData: 'OPESPACE-TICKET-OSC-5510-R-SCR102-C7',
    status: 'Confirmed',
    bookedAt: '2026-08-29 10:45',
    paymentMethod: 'Google Pay'
  }
];

export const INITIAL_PROMOTIONS: AiPromotionSuggestion[] = [
  {
    id: 'promo-1',
    screeningId: 'scr-103',
    movieTitle: 'Dune: Part Two (Open-Air 4K)',
    screeningDate: 'Mon, Aug 31',
    screeningTime: '8:30 PM',
    currentOccupancyRate: 29,
    suggestedDiscountPercent: 15,
    promoTitle: 'Desert Night 15% Off Special',
    targetAudience: 'Sci-Fi fans & Weekday Stargazers',
    suggestedPackageBundle: 'Bundle with Truffle Popcorn & Warm Cider for $26 total',
    aiRationale: 'Monday night historical occupancy averages 32%. A 15% discount on early booking lifts fill rate to 74% and doubles F&B per-head spend.',
    projectedRevenueLift: 480,
    status: 'approved_active',
    createdAt: '2026-08-28 18:00',
    approvedAt: '2026-08-28 19:15'
  },
  {
    id: 'promo-2',
    screeningId: 'scr-105',
    movieTitle: 'The Grand Budapest Hotel',
    screeningDate: 'Wed, Sep 2',
    screeningTime: '8:15 PM',
    currentOccupancyRate: 23,
    suggestedDiscountPercent: 20,
    promoTitle: 'Wes Anderson Wednesday 2-for-1 Cozy Pass',
    targetAudience: 'Comedy lovers & Date night couples',
    suggestedPackageBundle: 'Pair with 2x Mulled Wine & Charcuterie Box',
    aiRationale: 'Mid-week indie comedies have strong couple demand when bundled with warm comfort drinks. 20% discount projected to boost attendance from 23% to 81%.',
    projectedRevenueLift: 620,
    status: 'pending_approval',
    createdAt: '2026-08-29 08:30'
  }
];

export const INITIAL_DEMAND_FORECASTS: AiDemandForecast[] = [
  {
    screeningId: 'scr-101',
    movieTitle: 'Interstellar: Starfield Experience',
    date: 'Tonight (Sat, Aug 29)',
    time: '8:30 PM',
    genre: ['Sci-Fi', 'Adventure'],
    predictedOccupancyRate: 98,
    demandLevel: 'Extremely High',
    confidenceScore: 96,
    keyDrivers: [
      'Prime Saturday night stargazing slot',
      'Flawless weather (0% rain, 20°C, high star visibility)',
      'Cosmic film genre pairs naturally with open-air night skies',
      'Pre-show astronomy club activation'
    ],
    managerRecommendation: 'Prep extra lawn blankets and double kitchen prep for S’mores and Hot Cider.',
    weatherImpact: 'Positive (+18% lift due to clear constellations forecast)'
  },
  {
    screeningId: 'scr-102',
    movieTitle: 'La La Land: Moonlight Romance',
    date: 'Tomorrow (Sun, Aug 30)',
    time: '8:00 PM',
    genre: ['Comedy', 'Romance'],
    predictedOccupancyRate: 84,
    demandLevel: 'High',
    confidenceScore: 91,
    keyDrivers: [
      'Sunday date night prime demand',
      'Romance genre excels on open-air horizon decks',
      'Silent disco headset format trending on social'
    ],
    managerRecommendation: 'Keep double beanbag inventory prioritized; expect high wine & cheese platter orders.',
    weatherImpact: 'Optimal (+12% lift from mild 22°C evening)'
  },
  {
    screeningId: 'scr-103',
    movieTitle: 'Dune: Part Two (Open-Air 4K)',
    date: 'Mon, Aug 31',
    time: '8:30 PM',
    genre: ['Sci-Fi', 'Action'],
    predictedOccupancyRate: 75,
    demandLevel: 'Moderate',
    confidenceScore: 88,
    keyDrivers: [
      'Weekday show offset by 15% active promotion',
      'Strong male & sci-fi enthusiast demographic',
      'Cooler evening (19°C)'
    ],
    managerRecommendation: 'Promote warm burger sliders & hot drinks bundle at ticket checkout.',
    weatherImpact: 'Neutral (mild drop in late walk-ins)'
  },
  {
    screeningId: 'scr-104',
    movieTitle: 'Spirited Away: Open Sky Anime Night',
    date: 'Tue, Sep 1',
    time: '7:30 PM',
    genre: ['Animation', 'Family'],
    predictedOccupancyRate: 88,
    demandLevel: 'High',
    confidenceScore: 93,
    keyDrivers: [
      'Family & Ghibli cult following',
      'Earlier 7:30 PM start time captures family bedtime schedule',
      'Lantern twilight aesthetic event'
    ],
    managerRecommendation: 'Stock extra family picnic bundles and non-alcoholic starlight mocktails.',
    weatherImpact: 'Ideal warm weather (+15% family turnout)'
  },
  {
    screeningId: 'scr-105',
    movieTitle: 'The Grand Budapest Hotel',
    date: 'Wed, Sep 2',
    time: '8:15 PM',
    genre: ['Comedy', 'Adventure'],
    predictedOccupancyRate: 42,
    demandLevel: 'Low',
    confidenceScore: 85,
    keyDrivers: [
      'Midweek slump',
      'Passing clouds forecast may dampen impulse bookings',
      'Need active promotional boost'
    ],
    managerRecommendation: 'Approve pending 20% discount promotion and push email blast to comedy lovers.',
    weatherImpact: 'Slight negative (-8% due to cloud cover uncertainty)'
  },
  {
    screeningId: 'scr-106',
    movieTitle: 'Top Gun: Maverick (Sky-High Action)',
    date: 'Thu, Sep 3',
    time: '8:45 PM',
    genre: ['Action', 'Drama'],
    predictedOccupancyRate: 82,
    demandLevel: 'High',
    confidenceScore: 89,
    keyDrivers: [
      'Pre-weekend thirst & high octane crowd pleaser',
      'Stargazing index 94 with great night acoustics'
    ],
    managerRecommendation: 'Ensure craft beer inventory is fully stocked.',
    weatherImpact: 'Positive (+10% lift)'
  }
];

// Helper to generate a realistic seating grid
export function generateCinemaSeats(): Seat[] {
  const seats: Seat[] = [];
  
  // Row A: Starlight Cabana Beds (Front center luxury VIP beds for couples)
  for (let i = 1; i <= 6; i++) {
    seats.push({
      id: `A-${i}`,
      row: 'A',
      number: i,
      category: 'Starlight Cabana Bed',
      priceMultiplier: 1.8,
      status: (i === 1 || i === 2) ? 'reserved' : 'available',
      amenities: ['Memory Foam Bed', 'Canopy Drapery', 'Personal Heated Blanket', 'Butler Call Button'],
      capacity: 2
    });
  }

  // Row B: Luxury Twin Beanbags (Front-Mid cozy lawn section)
  for (let i = 1; i <= 10; i++) {
    seats.push({
      id: `B-${i}`,
      row: 'B',
      number: i,
      category: 'Luxury Beanbag Pair',
      priceMultiplier: 1.4,
      status: (i === 4 || i === 5 || i === 8) ? 'reserved' : 'available',
      amenities: ['Oversized Weatherproof Beanbag', 'Cup Holders', 'Footrest Pillows'],
      capacity: 2
    });
  }

  // Row C & D: Standard Cushioned Deckchairs (Middle tier with optimal sightlines)
  ['C', 'D'].forEach((row) => {
    for (let i = 1; i <= 12; i++) {
      seats.push({
        id: `${row}-${i}`,
        row,
        number: i,
        category: 'Standard Deckchair',
        priceMultiplier: 1.0,
        status: (row === 'C' && (i === 3 || i === 7)) ? 'reserved' : 'available',
        amenities: ['Ergonomic Timber Deckchair', 'Fleece Throw Blanket', 'Side Table Access'],
        capacity: 1
      });
    }
  });

  // Row E: VIP Loungers with elevated platform view
  for (let i = 1; i <= 8; i++) {
    seats.push({
      id: `E-${i}`,
      row: 'E',
      number: i,
      category: 'VIP Lounger',
      priceMultiplier: 1.6,
      status: (i === 3 || i === 4) ? 'reserved' : 'available',
      amenities: ['High-Back Zero Gravity Recliner', 'Elevated Horizon Sightline', 'Direct Charging Port'],
      capacity: 1
    });
  }

  return seats;
}
