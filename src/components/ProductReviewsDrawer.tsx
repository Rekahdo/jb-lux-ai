import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  PenTool,
  Check,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { getImageSrc, handleImageError } from '../utils/images';

interface ProductReviewsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddReview: (
    productId: string,
    reviewData: {
      author: string;
      location?: string;
      rating: number;
      title: string;
      comment: string;
      fitFeedback?: 'Runs small' | 'True to size' | 'Runs large';
    }
  ) => void;
  onVoteHelpful: (productId: string, reviewId: string) => void;
  votedReviews: Record<string, boolean>;
  userName?: string;
  userCity?: string;
}

export const ProductReviewsDrawer: React.FC<ProductReviewsDrawerProps> = ({
  isOpen,
  onClose,
  product,
  onAddReview,
  onVoteHelpful,
  votedReviews,
  userName = '',
  userCity = '',
}) => {
  const [starFilter, setStarFilter] = useState<'all' | number>('all');
  const [reviewSort, setReviewSort] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [showDrawerReviewForm, setShowDrawerReviewForm] = useState(false);

  // Form states
  const [formRating, setFormRating] = useState<number>(5);
  const [formAuthor, setFormAuthor] = useState<string>(userName);
  const [formLocation, setFormLocation] = useState<string>(userCity ? `${userCity}, Nigeria` : 'Lagos, Nigeria');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formFit, setFormFit] = useState<'Runs small' | 'True to size' | 'Runs large'>('True to size');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const reviews = product.reviews || [];

  const filteredReviews = reviews
    .filter(r => (starFilter === 'all' ? true : r.rating === starFilter))
    .sort((a, b) => {
      if (reviewSort === 'highest') return b.rating - a.rating;
      if (reviewSort === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formComment.trim()) return;

    onAddReview(product.id, {
      author: formAuthor.trim() || 'Verified Client',
      location: formLocation.trim() || 'Lagos, Nigeria',
      rating: formRating,
      title: formTitle.trim(),
      comment: formComment.trim(),
      fitFeedback: formFit,
    });

    setSubmitSuccess(true);
    setShowDrawerReviewForm(false);
    setFormTitle('');
    setFormComment('');
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel Drawer */}
      <div className="relative z-10 w-full max-w-lg sm:max-w-xl h-full bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out text-foreground">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-border bg-card flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={getImageSrc(product.images[0])}
              alt={product.name}
              onError={handleImageError}
              className="w-12 h-14 object-cover rounded-lg border border-border shrink-0 bg-secondary"
            />
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Atelier Client Ledger</span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-foreground line-clamp-1">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-0.5">
                <span className="text-foreground font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                  <span>{(product.rating || 4.9).toFixed(1)}</span>
                </span>
                <span>·</span>
                <span>{reviews.length} Verified Reviews</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title="Close Panel (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Top Action & Summary Banner */}
          <div className="p-4 bg-secondary/50 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Share Your Atelier Experience
              </span>
              <span className="text-[11px] text-muted-foreground">
                Drop your rating on fabric texture, silhouette drape, and bespoke fit.
              </span>
            </div>
            <button
              onClick={() => setShowDrawerReviewForm(prev => !prev)}
              className="px-3.5 py-2 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-sm"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{showDrawerReviewForm ? 'Close Form' : 'Drop a Review'}</span>
            </button>
          </div>

          {/* Success Notification */}
          {submitSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Your review has been successfully published to the client ledger!</span>
            </div>
          )}

          {/* In-Drawer Review Form */}
          {showDrawerReviewForm && (
            <div className="bg-card border border-primary/40 rounded-xl p-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
              <div className="border-b border-border/70 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Drop Your Review
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Direct feedback for {product.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDrawerReviewForm(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {/* Star Rating Selection */}
                <div>
                  <label className="block font-medium text-foreground mb-1 text-[11px]">
                    Your Rating <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFormRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= formRating ? 'fill-current text-[#D4AF37]' : 'text-border'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground ml-1">
                      {formRating === 5 && '5★ Exceptional'}
                      {formRating === 4 && '4★ Very High Quality'}
                      {formRating === 3 && '3★ Meets Standard'}
                      {formRating === 2 && '2★ Fair'}
                      {formRating === 1 && '1★ Poor'}
                    </span>
                  </div>
                </div>

                {/* Author & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-foreground mb-1 text-[11px]">
                      Your Name / Title
                    </label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={e => setFormAuthor(e.target.value)}
                      placeholder="e.g. Richard Okafor"
                      className="w-full px-3 py-1.5 bg-secondary border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-foreground mb-1 text-[11px]">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={e => setFormLocation(e.target.value)}
                      placeholder="e.g. Lekki Phase 1, Lagos"
                      className="w-full px-3 py-1.5 bg-secondary border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Fit Feedback */}
                <div>
                  <label className="block font-medium text-foreground mb-1 text-[11px]">
                    Fit Consensus
                  </label>
                  <div className="flex gap-2">
                    {(['Runs small', 'True to size', 'Runs large'] as const).map(fit => (
                      <button
                        type="button"
                        key={fit}
                        onClick={() => setFormFit(fit)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors border ${
                          formFit === fit
                            ? 'bg-primary text-black font-semibold border-primary'
                            : 'bg-secondary text-foreground border-border hover:border-foreground/40'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <label className="block font-medium text-foreground mb-1 text-[11px]">
                    Review Headline <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Incredible fabric drape and gilded button details"
                    className="w-full px-3 py-1.5 bg-secondary border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Detailed Comment */}
                <div>
                  <label className="block font-medium text-foreground mb-1 text-[11px]">
                    Detailed Review <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formComment}
                    onChange={e => setFormComment(e.target.value)}
                    placeholder="Describe how the garment wore, fabric texture, stitching precision..."
                    className="w-full px-3 py-1.5 bg-secondary border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary resize-y"
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowDrawerReviewForm(false)}
                    className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter & Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/70">
            {/* Star Filters */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              <button
                onClick={() => setStarFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors shrink-0 ${
                  starFilter === 'all'
                    ? 'bg-primary text-black font-bold shadow-sm'
                    : 'bg-secondary/70 text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({reviews.length})
              </button>
              {[5, 4, 3].map(stars => {
                const count = reviews.filter(r => r.rating === stars).length;
                return (
                  <button
                    key={stars}
                    onClick={() => setStarFilter(starFilter === stars ? 'all' : stars)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors flex items-center gap-1 shrink-0 ${
                      starFilter === stars
                        ? 'bg-primary text-black font-bold shadow-sm'
                        : 'bg-secondary/70 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-current text-[#D4AF37]" />
                    <span className="text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 self-end sm:self-auto">
              <SlidersHorizontal className="w-3 h-3" />
              <select
                value={reviewSort}
                onChange={e => setReviewSort(e.target.value as any)}
                className="bg-secondary/60 border border-border text-foreground px-2 py-1 rounded-lg text-[11px] font-mono focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* List of Reviews */}
          <div className="space-y-3.5">
            {filteredReviews.length === 0 ? (
              <div className="py-12 text-center bg-secondary/30 rounded-xl border border-dashed border-border p-6 space-y-2">
                <MessageSquare className="w-6 h-6 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-foreground">No reviews matching filter</p>
                <button
                  onClick={() => setStarFilter('all')}
                  className="text-[11px] font-mono text-primary hover:underline"
                >
                  Clear star filter
                </button>
              </div>
            ) : (
              filteredReviews.map(review => {
                const hasVoted = Boolean(votedReviews[review.id]);

                return (
                  <div
                    key={review.id}
                    className="p-4 bg-secondary/30 border border-border rounded-xl space-y-2.5 transition-colors hover:border-border/90"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-xs">{review.author}</span>
                          {review.verifiedPurchase && (
                            <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5">
                          {review.location && <span>{review.location}</span>}
                          {review.location && <span>·</span>}
                          <span>{review.date}</span>
                        </div>
                      </div>

                      {/* Stars & Fit */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center text-[#D4AF37]">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating ? 'fill-current text-[#D4AF37]' : 'text-border'
                              }`}
                            />
                          ))}
                        </div>
                        {review.fitFeedback && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-secondary text-foreground/80 rounded border border-border">
                            {review.fitFeedback}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground text-xs">{review.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>

                    {/* Helpful Button */}
                    <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/30">
                      <span className="font-mono text-[10px] text-muted-foreground/70">
                        Atelier Certified
                      </span>
                      <button
                        onClick={() => {
                          if (hasVoted) return;
                          onVoteHelpful(product.id, review.id);
                        }}
                        disabled={hasVoted}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                          hasVoted
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800'
                            : 'bg-secondary/70 text-muted-foreground hover:text-foreground border-border'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{hasVoted ? 'Helpful' : 'Helpful'}</span>
                        <span className="tabular-nums font-mono">
                          ({(review.helpfulCount || 0) + (hasVoted ? 1 : 0)})
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs font-mono text-muted-foreground">
            Showing <strong className="text-foreground">{filteredReviews.length}</strong> of{' '}
            <strong>{reviews.length}</strong> comments
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-medium rounded-lg transition-colors"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
