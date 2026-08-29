import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Moon, MessageSquare, Loader2, ArrowRight, ShieldCheck, Thermometer, Coffee, Film } from 'lucide-react';
import { api } from '../../services/api';

interface AiChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSelectMoviePrompt?: (movieTitle: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  isOpen,
  onClose,
  onOpen
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am your OpenSpace Cinema Concierge. Ask me anything about tonight’s movies, live seat availability, heated cabana packages, food menu, or our open-air weather policies under the stars.',
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'What happens if it rains tonight?',
    'What movies are playing tonight?',
    'Are blankets & heaters provided?',
    'What is included in the Cozy Couple Package?',
    'What food & drinks can I order to my seat?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.askAiAssistant(query, historyPayload);

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.reply || 'I am happy to assist with any questions about our open-air screenings and venue policies.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: 'I am temporarily having trouble reaching the starfield network. You can check our schedule directly on the homepage or ask about tonight’s weather!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="floating-ai-concierge-btn"
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-2xl shadow-amber-500/30 flex items-center space-x-2.5 transition-all transform hover:scale-105 cursor-pointer border border-amber-400/40"
        >
          <Bot className="w-6 h-6 text-slate-950" />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black leading-tight">AI Concierge</span>
            <span className="text-[10px] font-semibold text-slate-900 leading-tight">Movies, Weather & Seats</span>
          </div>
        </button>
      )}

      {/* Expandable Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[90vh] bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-sm font-['Outfit'] text-white">
                    OpenSpace AI Assistant
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Grounded in live cinema schedules & venue database
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto whitespace-nowrap flex space-x-2 scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/90 text-amber-200 hover:bg-amber-500 hover:text-slate-950 border border-slate-700/60 transition-all shrink-0 cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      isUser
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none shadow-md'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none leading-relaxed'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center space-x-1 text-[10px] font-bold text-amber-400 mb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>OpenSpace Concierge</span>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    
                    <span
                      className={`block text-[9px] mt-1.5 ${
                        isUser ? 'text-slate-800 text-right' : 'text-slate-500 text-left'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-800/90 text-slate-300 border border-slate-700/80 flex items-center space-x-2 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Checking live cinema database & weather...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about movies, seats, weather, food..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-500 focus:outline-none text-xs text-white placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
