import React, { useState } from 'react';
import { CustomerReview, FeedbackCategory } from '../../types';
import { api } from '../../services/api';
import { Star, MessageSquarePlus, Sparkles, CheckCircle2, ThumbsUp, Shield, X, Loader2 } from 'lucide-react';

interface CustomerReviewsSectionProps {
  reviews: CustomerReview[];
  onReviewAdded: (review: CustomerReview) => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
  onReviewAdded
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [movieTitle, setMovieTitle] = useState<string>('Interstellar: Starfield Experience');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const newRev = await api.submitReview({
        customerName: name || 'Cinema Visitor',
        movieTitle,
        rating,
        comment
      });
      onReviewAdded(newRev);
      setIsModalOpen(false);
      setName('');
      setComment('');
      setRating(5);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section id="customer-reviews" className="mb-16">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open-Sky Stargazer Community</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Audience Experiences Under The Night Sky
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real guest reviews analyzed in real-time with AI sentiment intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-base font-extrabold text-white">{averageRating}</span>
            <span className="text-xs text-slate-400">({reviews.length} reviews)</span>
          </div>

          <button
            id="open-write-review-btn"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Leave Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => {
          const isPos = rev.sentiment === 'Positive';
          const isNeg = rev.sentiment === 'Negative';

          return (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div>
                {/* Header: Author & Sentiment Tag */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.customerName}</h4>
                    <span className="text-[11px] text-amber-400 font-semibold">{rev.movieTitle}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isPos
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : isNeg
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    AI: {rev.sentiment} ({rev.sentimentScore}%)
                  </span>
                </div>

                {/* Stars */}
                <div className="flex text-amber-400 mb-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* AI Categorization & Date */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {rev.categories && rev.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {rev.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                {rev.aiAnalysis && (
                  <div className="text-[11px] text-slate-400 flex items-start space-x-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>AI Highlight:</strong> {rev.aiAnalysis}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>{rev.date}</span>
                  {rev.verifiedBooking && (
                    <span className="flex items-center text-emerald-400">
                      <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Verified Stargazer Pass
                    </span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <MessageSquarePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-['Outfit']">Share Your Review</h3>
                <p className="text-xs text-slate-400">
                  Your feedback is analyzed to optimize seating warmth, menu items, and showtimes.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Movie Watched</label>
                <input
                  type="text"
                  required
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  placeholder="e.g. Interstellar, La La Land"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Star Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-slate-300 font-bold ml-2">{rating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Your Feedback & Atmosphere Experience</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the open-air seating comfort, night weather, food & drinks, sound quality, or stargazing..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:outline-none text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>AI Analyzing & Publishing...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
