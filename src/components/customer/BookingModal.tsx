import React, { useState, useEffect } from 'react';
import { Screening, Seat, Package, FoodItem, Booking, OrderFoodItem } from '../../types';
import { api } from '../../services/api';
import { SeatSelector } from './SeatSelector';
import {
  X,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Coffee,
  Plus,
  Minus,
  CreditCard,
  Lock,
  Tag,
  Loader2,
  ShieldCheck
} from 'lucide-react';

interface BookingModalProps {
  screening: Screening;
  packages: Package[];
  foodMenu: FoodItem[];
  preselectedPackageId?: string;
  onBookingComplete: (booking: Booking) => void;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  screening,
  packages,
  foodMenu,
  preselectedPackageId,
  onBookingComplete,
  onClose
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Seats, 2: Packages, 3: Food, 4: Checkout
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(preselectedPackageId || 'pkg-standard');
  const [foodQuantities, setFoodQuantities] = useState<Record<string, number>>({});
  
  // Customer info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Apple Pay');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingSeats, setIsLoadingSeats] = useState<boolean>(true);

  // Load seats
  useEffect(() => {
    setIsLoadingSeats(true);
    api.getSeats(screening.id)
      .then((data) => setSeats(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingSeats(false));
  }, [screening.id]);

  const handleToggleSeat = (seat: Seat) => {
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(selectedSeatIds.filter((id) => id !== seat.id));
    } else {
      setSelectedSeatIds([...selectedSeatIds, seat.id]);
    }
  };

  const handleFoodQtyChange = (foodId: string, delta: number) => {
    const current = foodQuantities[foodId] || 0;
    const next = Math.max(0, current + delta);
    setFoodQuantities({
      ...foodQuantities,
      [foodId]: next
    });
  };

  // Calculations
  const discountPercent = screening.activeDiscountPercent || 0;

  const seatsSubtotal = selectedSeatIds.reduce((sum, seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return sum;
    const rawPrice = screening.basePrice * seat.priceMultiplier;
    return sum + (discountPercent > 0 ? rawPrice * (1 - discountPercent / 100) : rawPrice);
  }, 0);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId);
  const packagePrice = selectedPkg ? selectedPkg.price : 0;

  const foodOrders: OrderFoodItem[] = Object.entries(foodQuantities)
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([foodId, qty]) => {
      const item = foodMenu.find((f) => f.id === foodId)!;
      return { item, quantity: Number(qty) };
    });

  const foodSubtotal = foodOrders.reduce((sum, fo) => sum + fo.item.price * fo.quantity, 0);

  const totalAmount = seatsSubtotal + packagePrice + foodSubtotal;

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeatIds.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
    if (!customerName || !customerEmail) {
      alert('Please provide your name and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await api.createBooking({
        screeningId: screening.id,
        customerName,
        customerEmail,
        customerPhone,
        seatIds: selectedSeatIds,
        packageId: selectedPackageId,
        foodOrders,
        subtotal: totalAmount,
        discountAmount: discountPercent > 0 ? (screening.basePrice * selectedSeatIds.length * discountPercent) / 100 : 0,
        totalAmount,
        paymentMethod
      });

      onBookingComplete(newBooking);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl text-white my-6 max-h-[92vh] overflow-y-auto flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Screening Quick Header */}
        <div className="border-b border-slate-800 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step {step} of 4 • {step === 1 ? 'Choose Seats' : step === 2 ? 'Experience Package' : step === 3 ? 'Gourmet F&B' : 'Checkout & Pass'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-0.5">
              {screening.movieTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 mt-1">
              <span>{screening.date}</span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{screening.time}</span>
              <span>•</span>
              <span>{screening.venueZone}</span>
            </div>
          </div>

          {/* Step Breadcrumb Indicators */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : step > s
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* Main Step Content */}
        <div className="flex-1">
          
          {/* STEP 1: SEAT SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Select Your Open-Sky Seats</h3>
                <p className="text-xs text-slate-400">
                  Tap any available Cabana Bed, Twin Beanbag, Deckchair, or VIP Lounger.
                </p>
              </div>

              {isLoadingSeats ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                  <span className="text-xs text-slate-400">Loading live lawn seating chart...</span>
                </div>
              ) : (
                <SeatSelector
                  seats={seats}
                  selectedSeatIds={selectedSeatIds}
                  onToggleSeat={handleToggleSeat}
                  basePrice={screening.basePrice}
                  discountPercent={discountPercent}
                />
              )}
            </div>
          )}

          {/* STEP 2: EXPERIENCE PACKAGES */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Upgrade Your Open-Air Experience</h3>
                <p className="text-xs text-slate-400">
                  Enhance your evening with blanket bundles, gourmet snacks, and VIP comforts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                          : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                          {pkg.badge}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600'}`}>
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <h4 className="font-extrabold text-base text-white">{pkg.name}</h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{pkg.description}</p>

                        <div className="mt-3 space-y-1">
                          {pkg.includes.map((inc, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-400">
                              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Package Add-on:</span>
                        <span className="text-base font-extrabold text-amber-400">
                          {pkg.price === 0 ? 'Included ($0)' : `+$${pkg.price.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FOOD & DRINK SEAT DELIVERY */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Pre-Order Food & Drinks (Delivered To Your Seat)</h3>
                <p className="text-xs text-slate-400">
                  Prepared fresh and delivered right to your beanbag or cabana without missing a scene.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodMenu.map((item) => {
                  const qty = foodQuantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center space-x-1">
                            <h4 className="font-bold text-xs text-white leading-snug">{item.name}</h4>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{item.category}</span>
                          <span className="text-xs font-extrabold text-amber-400 block mt-1">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{item.prepTime} prep</span>
                        <div className="flex items-center space-x-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
                          <button
                            type="button"
                            onClick={() => handleFoodQtyChange(item.id, -1)}
                            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleFoodQtyChange(item.id, 1)}
                            className="p-1 rounded text-amber-400 hover:text-amber-300 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CHECKOUT & PAYMENT */}
          {step === 4 && (
            <form onSubmit={handleCompleteBooking} className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">Review & Complete Reservation</h3>
                <p className="text-xs text-slate-400">
                  Instant confirmation with digital QR ticket and passbook entry.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Guest Contact Form */}
                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Guest Contact Details
                    </h4>
                    
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-500 focus:outline-none text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-500 focus:outline-none text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Mobile (for SMS Pass)</label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-500 focus:outline-none text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Payment Method
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['Apple Pay', 'Google Pay', 'Credit Card'].map((pm) => (
                        <button
                          key={pm}
                          type="button"
                          onClick={() => setPaymentMethod(pm)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                            paymentMethod === pm
                              ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{pm}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 pt-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>256-Bit SSL Encrypted & Instant Digital QR Pass Generation</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary Receipt */}
                <div className="md:col-span-5 p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Order Summary
                  </h4>

                  <div className="space-y-2 text-xs divide-y divide-slate-800/80">
                    
                    <div className="pt-1 flex justify-between">
                      <span className="text-slate-300">
                        Seats ({selectedSeatIds.join(', ')})
                      </span>
                      <span className="font-bold text-white">${seatsSubtotal.toFixed(2)}</span>
                    </div>

                    {selectedPkg && (
                      <div className="pt-2 flex justify-between">
                        <span className="text-slate-300">{selectedPkg.name}</span>
                        <span className="font-bold text-white">${packagePrice.toFixed(2)}</span>
                      </div>
                    )}

                    {foodOrders.length > 0 && (
                      <div className="pt-2 space-y-1">
                        <span className="text-slate-400 font-semibold block">Food & Beverages:</span>
                        {foodOrders.map((fo, i) => (
                          <div key={i} className="flex justify-between text-slate-300 pl-2">
                            <span>{fo.quantity}x {fo.item.name}</span>
                            <span>${(fo.item.price * fo.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {discountPercent > 0 && (
                      <div className="pt-2 flex justify-between text-emerald-400 font-bold">
                        <span>Promotion Discount ({discountPercent}%)</span>
                        <span>-${((screening.basePrice * selectedSeatIds.length * discountPercent) / 100).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-3 flex justify-between items-baseline">
                      <span className="text-sm font-extrabold text-white">Total Amount</span>
                      <span className="text-xl font-black text-amber-400">${totalAmount.toFixed(2)}</span>
                    </div>

                  </div>

                  <button
                    id="submit-booking-pay-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Confirming & Generating QR Pass...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-slate-950" />
                        <span>Pay ${totalAmount.toFixed(2)} & Get QR Ticket</span>
                      </>
                    )}
                  </button>

                </div>

              </div>
            </form>
          )}

        </div>

        {/* Modal Bottom Step Controls */}
        <div className="border-t border-slate-800 pt-4 mt-6 flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400">
                Selected: <strong className="text-amber-300">{selectedSeatIds.length}</strong> seat(s)
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Subtotal</span>
              <span className="text-sm font-extrabold text-amber-400">${totalAmount.toFixed(2)}</span>
            </div>

            {step < 4 && (
              <button
                type="button"
                disabled={selectedSeatIds.length === 0}
                onClick={() => setStep((step + 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-40"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
