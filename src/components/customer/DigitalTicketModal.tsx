import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Booking } from '../../types';
import { X, Moon, Sparkles, CheckCircle2, Download, Share2, Calendar, MapPin, Ticket, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DigitalTicketModalProps {
  booking: Booking;
  onClose: () => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  booking,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate crisp QR code
    QRCode.toDataURL(booking.qrCodeData || booking.bookingCode, {
      width: 260,
      margin: 2,
      color: {
        dark: '#070913',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR Error:', err));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  }, [booking]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Celebration Tag */}
        <div className="text-center space-y-1 mb-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Booking Confirmed & Verified</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] text-white">
            Your Digital Star Pass
          </h2>
          <p className="text-xs text-slate-400">
            Present this QR at the lawn gate for fast-track entry.
          </p>
        </div>

        {/* Cinematic Ticket Card Visual */}
        <div className="relative bg-[#0b0f1d] border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Moon className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm font-['Outfit'] text-slate-100">
                OpenSpace<span className="text-amber-400 font-normal">Cinema</span>
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {booking.bookingCode}
            </span>
          </div>

          {/* Movie Details */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Open-Sky Feature
            </span>
            <h3 className="text-lg font-black text-white font-['Outfit']">
              {booking.movieTitle}
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div className="flex items-center space-x-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{booking.screeningDate}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{booking.screeningTime}</span>
              </div>
            </div>
          </div>

          {/* Reserved Seats & Package */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Reserved Seats:</span>
              <span className="font-bold text-amber-300">
                {booking.seatDetails && booking.seatDetails.length > 0
                  ? booking.seatDetails.map((s) => `${s.id} (${s.category})`).join(', ')
                  : booking.seatIds.join(', ')}
              </span>
            </div>

            {booking.packageSelected && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Experience Package:</span>
                <span className="font-semibold text-indigo-300">
                  {booking.packageSelected.name}
                </span>
              </div>
            )}

            {booking.foodOrders && booking.foodOrders.length > 0 && (
              <div className="flex justify-between items-start pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">At-Seat Food Orders:</span>
                <div className="text-right text-slate-200">
                  {booking.foodOrders.map((fo, idx) => (
                    <div key={idx}>
                      {fo.quantity}x {fo.item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white text-slate-950">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Entry QR Code" className="w-44 h-44 object-contain" />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-500 font-mono">
                Generating secure pass...
              </div>
            )}
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-600 mt-1">
              GATE-SCAN: {booking.bookingCode}
            </span>
          </div>

          {/* Guest Name & Total Paid */}
          <div className="flex justify-between items-center text-xs text-slate-300 pt-1">
            <div>
              <span className="text-slate-400 text-[10px] block">Guest Name</span>
              <span className="font-semibold text-white">{booking.customerName}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] block">Total Paid</span>
              <span className="font-extrabold text-amber-400">${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={() => {
              alert(`Pass for ${booking.bookingCode} saved to your mobile wallet simulator!`);
            }}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save to Apple Wallet / Google Pass</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
