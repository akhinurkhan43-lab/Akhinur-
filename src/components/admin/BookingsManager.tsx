import React, { useState } from 'react';
import { Booking } from '../../types';
import { api } from '../../services/api';
import {
  Ticket,
  Search,
  CheckCircle2,
  QrCode,
  User,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  ScanLine,
  Loader2
} from 'lucide-react';

interface BookingsManagerProps {
  bookings: Booking[];
  onBookingCheckedIn: (updatedBooking: Booking) => void;
}

export const BookingsManager: React.FC<BookingsManagerProps> = ({
  bookings,
  onBookingCheckedIn
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [scanCodeInput, setScanCodeInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; booking?: Booking } | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.customerName.toLowerCase().includes(term) ||
      b.bookingCode.toLowerCase().includes(term) ||
      b.movieTitle.toLowerCase().includes(term) ||
      b.seatIds.some((s) => s.toLowerCase().includes(term))
    );
  });

  const handleVerifyScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCodeInput.trim()) return;

    setIsVerifying(true);
    try {
      const res = await api.verifyQrTicket({ bookingCode: scanCodeInput.trim() });
      setScanResult(res);
      if (res.success && res.booking) {
        onBookingCheckedIn(res.booking);
      }
    } catch (err) {
      console.error(err);
      setScanResult({ success: false, message: 'Gate verification error' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Gate Check-in Bar with QR Scanner Simulator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-amber-500/30 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <ScanLine className="w-4 h-4" />
          <span>Amphitheater Gate Turnstile • Live QR Scanner</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleVerifyScan} className="flex-1 flex items-center space-x-2 w-full">
            <div className="relative flex-1">
              <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={scanCodeInput}
                onChange={(e) => setScanCodeInput(e.target.value.toUpperCase())}
                placeholder="Scan or enter Booking Code (e.g. OSC-882194)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:outline-none text-xs text-white uppercase font-mono tracking-wider"
              />
            </div>
            <button
              id="verify-qr-code-gate-btn"
              type="submit"
              disabled={isVerifying || !scanCodeInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Verify & Check In</span>
            </button>
          </form>
        </div>

        {/* Scan Verification Result Feedback */}
        {scanResult && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
              scanResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {scanResult.success ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <div>
                <p className="font-bold">{scanResult.message}</p>
                {scanResult.booking && (
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Guest: <strong>{scanResult.booking.customerName}</strong> • Movie: {scanResult.booking.movieTitle} • Seats: {scanResult.booking.seatIds.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setScanResult(null);
                setScanCodeInput('');
              }}
              className="text-xs underline hover:text-white"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Bookings Search & Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-white font-['Outfit']">
              All Customer Reservations ({bookings.length})
            </h3>
            <p className="text-xs text-slate-400">
              Real-time gate check-in status, seat reservations, and food deliveries.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guest, code, seat..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 focus:outline-none text-xs text-white"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Pass Code</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Movie & Showtime</th>
                <th className="py-3 px-4">Seats & Pkg</th>
                <th className="py-3 px-4">F&B Orders</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredBookings.map((b) => {
                const isCheckedIn = b.status === 'checked_in';
                return (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {b.bookingCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{b.customerName}</div>
                      <div className="text-[10px] text-slate-400">{b.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{b.movieTitle}</div>
                      <div className="text-[10px] text-slate-400">
                        {b.screeningDate} • {b.screeningTime}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-amber-300">
                        {b.seatIds.join(', ')}
                      </div>
                      {b.packageSelected && (
                        <div className="text-[10px] text-indigo-300">{b.packageSelected.name}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {b.foodOrders && b.foodOrders.length > 0 ? (
                        <div className="text-[11px] text-slate-300">
                          {b.foodOrders.map((f, i) => (
                            <span key={i} className="block">
                              {f.quantity}x {f.item.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-white">
                      ${b.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isCheckedIn
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {isCheckedIn ? 'Checked In' : 'Confirmed'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isCheckedIn ? (
                        <button
                          onClick={() => {
                            setScanCodeInput(b.bookingCode);
                            api.verifyQrTicket({ bookingCode: b.bookingCode }).then((res) => {
                              if (res.success && res.booking) {
                                onBookingCheckedIn(res.booking);
                              }
                            });
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] cursor-pointer"
                        >
                          Check In
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500">At Seat</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
