import React from 'react';
import { Film, Sparkles, Moon, Sun, ShieldCheck, Ticket, Bot, Calendar, Wind } from 'lucide-react';
import { Booking } from '../types';

interface NavbarProps {
  currentView: 'customer' | 'admin';
  onViewChange: (view: 'customer' | 'admin') => void;
  onOpenMyTickets: () => void;
  onOpenAiAssistant: () => void;
  userBookings: Booking[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenMyTickets,
  onOpenAiAssistant,
  userBookings
}) => {
  return (
    <header id="main-header" className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#05070A]/85 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange('customer')}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-500/5">
            <Moon className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-serif italic text-amber-500 tracking-tight">
                OpenSpace Cinema
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Sparkles className="w-2.5 h-2.5 mr-1" /> Open-Air
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 hidden md:block">
              AI-Driven Experience Platform
            </p>
          </div>
        </div>

        {/* Center Live Weather Pill & AI Engine Status */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase text-gray-400 tracking-wider">Pine Ridge:</span>
            <span className="text-amber-300 font-medium">20°C</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-300 flex items-center">
              <Sparkles className="w-3 h-3 text-amber-400 mr-1" /> Stargazing 96%
            </span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-amber-200">AI Engine: Active</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Customer: Ask AI Concierge */}
          <button
            id="nav-ai-chat-btn"
            onClick={onOpenAiAssistant}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="hidden sm:inline">AI Concierge</span>
          </button>

          {/* Customer: My Tickets Button */}
          {currentView === 'customer' && (
            <button
              id="nav-my-tickets-btn"
              onClick={onOpenMyTickets}
              className="relative flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-gray-400" />
              <span>My Passes</span>
              {userBookings.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500 text-black">
                  {userBookings.length}
                </span>
              )}
            </button>
          )}

          {/* Mode Switcher: Customer vs Admin */}
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              id="view-customer-btn"
              onClick={() => onViewChange('customer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
                currentView === 'customer'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Guest
            </button>
            <button
              id="view-admin-btn"
              onClick={() => onViewChange('admin')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase tracking-wider ${
                currentView === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin AI</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
