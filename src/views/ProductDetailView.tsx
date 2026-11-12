import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ShieldCheck,
  MapPin,
  Truck,
  Sparkles,
  Star,
  ThumbsUp,
  MessageSquare,
  PenTool,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getImageSrc, handleImageError } from '../utils/images';
import { ProductReviewsDrawer } from '../components/ProductReviewsDrawer';

export const ProductDetailView: React.FC = () => {
  const { routeParams, navigateTo, products, addToCart, addReview, voteReviewHelpful, user } = useStore();
  const slug = routeParams.slug;
  const product = products.find(p => p.slug === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState<string>(product?.images[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail');
  const [addedNotice, setAddedNotice] = useState(false);

  // Reviews filtering, sorting, side panel & creation state
  const [isReviewsDrawerOpen, setIsReviewsDrawerOpen] = useState(false);
  const [starFilter, setStarFilter] = useState<'all' | number>('all');
  const [reviewSort, setReviewSort] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formRating, setFormRating] = useState<number>(5);
  const [formAuthor, setFormAuthor] = useState<string>(user?.name || '');
  const [formLocation, setFormLocation] = useState<string>(user?.city ? `${user.city}, Nigeria` : 'Lagos, Nigeria');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');
  const [formFit, setFormFit] = useState<'Runs small' | 'True to size' | 'Runs large'>('True to size');
  const [reviewSuccessNotice, setReviewSuccessNotice] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Record<string, boolean>>({});

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Product not found.</p>
        <button onClick={() => navigateTo('catalog')} className="text-primary mt-4 hover:underline">
          Return to Catalog
        </button>
      </div>
    );
  }

  // Calculate live unit price based on quantity and wholesale tiers
  const activeTier = product.wholesaleTiers?.length
    ? [...product.wholesaleTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(t => quantity >= t.minQty)
    : null;

  const currentDiscount = mode === 'wholesale' && activeTier ? activeTier.discountPercent : 0;
  const currentUnitPrice = Math.round(product.retailPrice * (1 - currentDiscount / 100));
  const totalItemCost = currentUnitPrice * quantity;
  const savingsTotal = (product.retailPrice - currentUnitPrice) * quantity;

  const handleAddToCart = () => {
    addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
      mode,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SEO
        title={product.name}
        description={`${product.tagline}. ${product.description.slice(0, 150)}`}
        image={getImageSrc(product.images[0])}
        type="product"
        slug={product.slug}
        price={currentUnitPrice}
        category={product.category}
        availability={product.stock > 0 ? 'InStock' : 'OutOfStock'}
      />
      {/* Back Link */}
      <button
        onClick={() => navigateTo('catalog')}
        className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Catalog</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-secondary/40 rounded-xl overflow-hidden border border-border">
            <img
              src={getImageSrc(selectedImage || product.images[0])}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded text-[11px] font-mono text-[#D4AF37] border border-[#D4AF37]/30">
                Signature Collection
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    (selectedImage === img || getImageSrc(selectedImage) === getImageSrc(img))
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getImageSrc(img)}
                    alt={`View ${i + 1}`}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Atelier Craftsmanship Card */}
          <div className="p-6 bg-secondary/30 rounded-xl border border-border space-y-4 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Atelier Construction Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block font-medium text-foreground">Fabric & Composition</span>
                <span>{product.fabric}</span>
              </div>
              <div>
                <span className="block font-medium text-foreground">Provenance</span>
                <span>{product.craftsmanshipOrigin}</span>
              </div>
            </div>
            <p className="pt-2 border-t border-border leading-relaxed">
              {product.fullDescription}
            </p>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 lg:p-8 space-y-6 sticky top-28 shadow-sm">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-mono mb-1">
              <span>{product.category}</span>
              <span>Stock: {product.stock} units</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {product.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {product.tagline}
            </p>

            {/* Live Rating & Reviews Quick Anchor */}
            <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(product.rating || 4.9)
                        ? 'fill-current text-[#D4AF37]'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold font-mono text-foreground tabular-nums">
                {(product.rating || 4.9).toFixed(1)}
              </span>
              <span className="text-muted-foreground/60 text-[10px]" aria-hidden="true">·</span>
              <button
                onClick={() => setIsReviewsDrawerOpen(true)}
                className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-4 flex items-center gap-1"
                title="Open verified client reviews side panel"
              >
                <span>{product.reviewCount || product.reviews?.length || 24} Verified Client Reviews</span>
              </button>
            </div>
          </div>

          {/* Pricing Box & Wholesale Switch */}
          <div className="p-4 bg-secondary/60 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary font-mono tabular-nums">
                    ₦{currentUnitPrice.toLocaleString()}
                  </span>
                  {currentDiscount > 0 && (
                    <span className="text-xs text-muted-foreground line-through font-mono">
                      ₦{product.retailPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">/ unit</span>
                </div>
                {currentDiscount > 0 && (
                  <span className="text-[11px] font-mono font-semibold text-emerald-500 block">
                    {currentDiscount}% Wholesale Discount Applied
                  </span>
                )}
              </div>

              {/* Mode switch button */}
              <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border text-xs">
                <button
                  onClick={() => {
                    setMode('retail');
                    setQuantity(1);
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    mode === 'retail' ? 'bg-primary text-black font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  Retail
                </button>
                <button
                  onClick={() => {
                    setMode('wholesale');
                    if (product.wholesaleTiers[0] && quantity < product.wholesaleTiers[0].minQty) {
                      setQuantity(product.wholesaleTiers[0].minQty);
                    }
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    mode === 'wholesale' ? 'bg-primary text-black font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  Wholesale
                </button>
              </div>
            </div>

            {/* Wholesale Tier Matrix Table */}
            {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                  Wholesale Volume Discount Schedule
                </p>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  {product.wholesaleTiers.map((tier, idx) => {
                    const tierPrice = Math.round(product.retailPrice * (1 - tier.discountPercent / 100));
                    const isTierActive = mode === 'wholesale' && quantity >= tier.minQty && (
                      !product.wholesaleTiers[idx + 1] || quantity < product.wholesaleTiers[idx + 1].minQty
                    );

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setMode('wholesale');
                          setQuantity(tier.minQty);
                        }}
                        className={`p-2 rounded-lg border cursor-pointer transition-all ${
                          isTierActive
                            ? 'bg-primary/10 border-primary text-foreground ring-1 ring-primary'
                            : 'bg-background/80 border-border text-muted-foreground hover:border-foreground/30'
                        }`}
                      >
                        <span className="font-mono text-[11px] block text-foreground font-semibold">
                          {tier.minQty}+ units
                        </span>
                        <span className="font-mono text-xs text-primary font-bold">
                          ₦{tierPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-500 font-mono block">
                          -{tier.discountPercent}% OFF
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Select Size / Fit</span>
              {product.category === 'traditional' || product.sizes.some(s => s.toLowerCase().includes('bespoke') || s.toLowerCase().includes('custom')) ? (
                <span className="text-[#D4AF37] font-mono text-[11px] font-medium">Bespoke Fitting Available</span>
              ) : (
                <span className="text-muted-foreground font-mono text-[11px]">Ready-to-Wear (RTW)</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedSize === size
                      ? 'bg-foreground text-background font-bold border border-foreground'
                      : 'bg-secondary/60 text-foreground border border-border hover:border-foreground/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-foreground">Color Finish: <strong className="text-primary">{selectedColor}</strong></span>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    selectedColor === color
                      ? 'bg-primary text-black font-semibold shadow-sm'
                      : 'bg-secondary/60 text-muted-foreground border border-border hover:text-foreground'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-foreground">Order Quantity</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg bg-secondary/40 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-xs font-mono font-bold bg-transparent text-foreground focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>

              {/* Total calculation indicator */}
              <div className="flex-1 text-right text-xs">
                <span className="text-muted-foreground">Line Total: </span>
                <strong className="text-foreground font-mono text-sm">
                  ₦{totalItemCost.toLocaleString()}
                </strong>
                {savingsTotal > 0 && (
                  <span className="block text-[10px] text-emerald-500 font-mono">
                    You save ₦{savingsTotal.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-primary text-black font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {quantity} to Shopping Bag</span>
            </button>

            {addedNotice && (
              <div className="p-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs text-center rounded-lg flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Added to your bag! Ready to review in Cart.</span>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-border space-y-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Official JB Lux Bank Transfer with 24h Receipt Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-primary" />
              <span>Insured dispatch from Gbode Ventures Plaza, Lagos Island</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Client Reviews & Atelier Ratings Section */}
      <section id="client-reviews-section" className="pt-10 border-t border-border space-y-8 scroll-mt-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Verified Patron Feedback</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Client Reviews & Atelier Ratings
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Authentic reviews from discerning gentlemen, dignitaries, and streetwear collectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setIsReviewsDrawerOpen(true)}
              className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 border border-border text-foreground font-medium text-xs rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              title="Open full reviews ledger side panel"
            >
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              <span>Open Side Panel ({product.reviews?.length || 0})</span>
            </button>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2.5 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{showReviewForm ? 'Cancel Review' : 'Drop a Review'}</span>
            </button>
          </div>
        </div>

        {/* Rating Breakdown Dashboard Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-card border border-border rounded-xl p-6 lg:p-8">
          {/* Overall Score */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-3 md:border-r border-border md:pr-6">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-foreground tabular-nums">
                {(product.rating || 4.9).toFixed(1)}
              </span>
              <span className="text-sm font-mono text-muted-foreground">/ 5.0</span>
            </div>

            <div className="flex items-center gap-1 text-[#D4AF37]">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(product.rating || 4.9)
                      ? 'fill-current text-[#D4AF37]'
                      : 'text-border'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on <strong className="text-foreground font-mono tabular-nums">{product.reviews?.length || 24}</strong> verified client experiences.
              <span className="block text-emerald-500 font-mono text-[11px] mt-0.5">
                96% of patrons recommend this atelier design.
              </span>
            </p>

            {/* Fit Feedback indicator */}
            <div className="pt-2 border-t border-border/60 text-xs space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                Patron Fit Consensus:
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">
                  {product.reviews?.some(r => r.fitFeedback === 'Runs small')
                    ? 'True to Size (88%)'
                    : 'True to Size (94%)'}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  (Based on client measurements)
                </span>
              </div>
            </div>
          </div>

          {/* Star Distribution Histogram */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-2.5 md:pl-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="font-mono text-[11px] uppercase tracking-wider">Rating Distribution</span>
              <span className="text-[11px] font-mono">Click a bar to filter</span>
            </div>

            {[5, 4, 3, 2, 1].map(stars => {
              const currentCount = product.reviews ? product.reviews.filter(r => r.rating === stars).length : (stars === 5 ? 20 : stars === 4 ? 4 : 0);
              const totalCount = product.reviews?.length || 24;
              const pct = totalCount > 0 ? Math.round((currentCount / totalCount) * 100) : 0;
              const isSelected = starFilter === stars;

              return (
                <button
                  key={stars}
                  onClick={() => setStarFilter(isSelected ? 'all' : stars)}
                  className={`flex items-center gap-3 text-xs w-full text-left group p-1 rounded-md transition-colors ${
                    isSelected ? 'bg-secondary' : 'hover:bg-secondary/40'
                  }`}
                >
                  <span className="w-12 font-mono text-[11px] text-foreground flex items-center gap-1 shrink-0">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-current text-[#D4AF37]" />
                  </span>

                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden border border-border/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected ? 'bg-primary' : 'bg-[#D4AF37]/80 group-hover:bg-primary'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span className="w-10 text-right font-mono text-[11px] text-muted-foreground tabular-nums shrink-0">
                    {pct}%
                  </span>
                  <span className="w-8 text-right font-mono text-[10px] text-muted-foreground/70 tabular-nums shrink-0">
                    ({currentCount})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Review Form */}
        {showReviewForm && (
          <div className="bg-card border border-primary/40 rounded-xl p-6 lg:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Submit Atelier Feedback for {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Share your experience regarding fabric weight, hand-stitching, and fit fidelity.
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!formTitle.trim() || !formComment.trim()) return;
                addReview(product.id, {
                  author: formAuthor.trim() || 'Verified Client',
                  location: formLocation.trim() || 'Lagos, Nigeria',
                  rating: formRating,
                  title: formTitle,
                  comment: formComment,
                  fitFeedback: formFit,
                });
                setShowReviewForm(false);
                setFormTitle('');
                setFormComment('');
                setReviewSuccessNotice(true);
                setTimeout(() => setReviewSuccessNotice(false), 6000);
              }}
              className="space-y-4 text-xs"
            >
              {/* Star Rating Picker */}
              <div className="space-y-1.5">
                <label className="block font-medium text-foreground">
                  Your Overall Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="p-1 text-2xl text-[#D4AF37] hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formRating ? 'fill-current text-[#D4AF37]' : 'text-border'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground ml-2">
                    {formRating === 5 && '5 Stars · Exceptional Luxury'}
                    {formRating === 4 && '4 Stars · Very High Quality'}
                    {formRating === 3 && '3 Stars · Meets Expectations'}
                    {formRating === 2 && '2 Stars · Minor Imperfections'}
                    {formRating === 1 && '1 Star · Below Standard'}
                  </span>
                </div>
              </div>

              {/* Author & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Your Name or Alias
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Richard Okafor"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Lekki Phase 1, Lagos"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Sizing Fit Feedback */}
              <div className="space-y-1.5">
                <label className="block font-medium text-foreground">
                  How does the garment fit?
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Runs small', 'True to size', 'Runs large'] as const).map(fit => (
                    <button
                      type="button"
                      key={fit}
                      onClick={() => setFormFit(fit)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors border ${
                        formFit === fit
                          ? 'bg-primary text-black font-semibold border-primary'
                          : 'bg-secondary text-foreground border-border hover:border-foreground/30'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Review Headline <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Peerless tailoring and substantial fabric weight"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary"
                />
              </div>

              {/* Detailed Feedback */}
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Your Detailed Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="Describe the fabric texture, stitching precision, button accents, and wear experience..."
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground text-xs focus:outline-none focus:border-primary resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-border text-muted-foreground hover:text-foreground text-xs rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Publish Client Review</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Toast */}
        {reviewSuccessNotice && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Thank you for your feedback! Your review has been published and incorporated into the atelier rating.</span>
          </div>
        )}

        {/* Review List Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Star Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-secondary/80 rounded-xl border border-border text-xs">
            <button
              onClick={() => setStarFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-mono text-[11px] ${
                starFilter === 'all'
                  ? 'bg-card text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Reviews ({product.reviews?.length || 0})
            </button>
            {[5, 4, 3].map(stars => {
              const count = product.reviews ? product.reviews.filter(r => r.rating === stars).length : 0;
              return (
                <button
                  key={stars}
                  onClick={() => setStarFilter(starFilter === stars ? 'all' : stars)}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-mono text-[11px] ${
                    starFilter === stars
                      ? 'bg-card text-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{stars}</span>
                  <Star className="w-3 h-3 fill-current text-[#D4AF37]" />
                  <span className="text-[10px] text-muted-foreground/80">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground self-end sm:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">Sort By:</span>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value as any)}
              className="bg-card border border-border text-foreground px-2.5 py-1 rounded-lg text-xs font-mono focus:outline-none focus:border-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Reviews List (Minimum 3 comments shown with side panel trigger) */}
        {(() => {
          const allFilteredReviews = (product.reviews || [])
            .filter(r => starFilter === 'all' || r.rating === starFilter)
            .sort((a, b) => {
              if (reviewSort === 'highest') return b.rating - a.rating;
              if (reviewSort === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });

          const displayedReviews = allFilteredReviews.slice(0, 3);
          const hasMoreThanThree = allFilteredReviews.length > 3;
          const remainingCount = allFilteredReviews.length - 3;

          return (
            <div className="space-y-4">
              {allFilteredReviews.length === 0 ? (
                <div className="p-12 text-center bg-card border border-border rounded-xl space-y-2">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                  <p className="text-sm font-semibold text-foreground">Be the first to review this garment</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Leave your rating on craftsmanship, fabric drape, and bespoke fit fidelity.
                  </p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="mt-2 px-4 py-2 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Drop First Review</span>
                  </button>
                </div>
              ) : (
                <>
                  {displayedReviews.map(review => {
                    const hasVoted = Boolean(votedReviews[review.id]);

                    return (
                      <div
                        key={review.id}
                        className="p-6 bg-card border border-border rounded-xl space-y-3 transition-colors hover:border-border/80"
                      >
                        {/* Header info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-sm">{review.author}</span>
                              {review.verifiedPurchase && (
                                <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Verified Buyer</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono text-[11px]">
                              {review.location && <span>{review.location}</span>}
                              {review.location && <span aria-hidden="true">·</span>}
                              <span>{review.date}</span>
                            </div>
                          </div>

                          {/* Stars & Fit badge */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center text-[#D4AF37]">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= review.rating ? 'fill-current text-[#D4AF37]' : 'text-border'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.fitFeedback && (
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-secondary text-foreground/80 rounded border border-border">
                                Fit: {review.fitFeedback}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Review Body */}
                        <div className="space-y-1.5">
                          <h4 className="font-semibold text-foreground text-sm">
                            {review.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        </div>

                        {/* Helpful Action */}
                        <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="text-[11px] font-mono text-muted-foreground/80">
                            Atelier Certified Review
                          </span>

                          <button
                            onClick={() => {
                              if (hasVoted) return;
                              voteReviewHelpful(product.id, review.id);
                              setVotedReviews(prev => ({ ...prev, [review.id]: true }));
                            }}
                            disabled={hasVoted}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                              hasVoted
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800 cursor-default'
                                : 'bg-secondary/60 text-muted-foreground hover:text-foreground border-border hover:bg-secondary'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{hasVoted ? 'Marked Helpful' : 'Helpful'}</span>
                            <span className="tabular-nums">({(review.helpfulCount || 0) + (hasVoted ? 1 : 0)})</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Show More Comments Trigger */}
                  {hasMoreThanThree ? (
                    <div className="p-5 bg-card border border-border/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-xs">
                            Showing 3 of {allFilteredReviews.length} comments
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold">
                            +{remainingCount} more in ledger
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Open the atelier ledger side panel to browse all verified client reviews, filter by rating, and read fit experiences.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsReviewsDrawerOpen(true)}
                        className="px-5 py-2.5 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Show More Comments ({remainingCount} more)</span>
                        <span>→</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground border-t border-border/40">
                      <span className="font-mono text-[11px]">
                        Showing all {allFilteredReviews.length} {allFilteredReviews.length === 1 ? 'comment' : 'comments'} matching filter
                      </span>
                      <button
                        onClick={() => setIsReviewsDrawerOpen(true)}
                        className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Open Atelier Ledger Side Panel</span>
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}
      </section>

      {/* Reviews Side Panel Drawer */}
      <ProductReviewsDrawer
        isOpen={isReviewsDrawerOpen}
        onClose={() => setIsReviewsDrawerOpen(false)}
        product={product}
        onAddReview={addReview}
        onVoteHelpful={(productId, reviewId) => {
          voteReviewHelpful(productId, reviewId);
          setVotedReviews(prev => ({ ...prev, [reviewId]: true }));
        }}
        votedReviews={votedReviews}
        userName={user?.name}
        userCity={user?.city}
      />
    </div>
  );
};
