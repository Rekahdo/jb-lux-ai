import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Award,
  MapPin,
  Phone,
  Star,
  Check,
  ChevronDown,
  Mail,
  Scissors,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Quote,
  Clock,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { getImageSrc, handleImageError } from '../utils/images';

export const HomeView: React.FC = () => {
  const { navigateTo, products, settings } = useStore();
  const [wholesaleMode, setWholesaleMode] = useState(false);

  // FAQ Accordion State (multiple openable or single open)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const featuredProducts = products.filter(p => p.isFeatured && p.isActive).slice(0, 4);

  // Core Categories for Section 1
  const apparelCategories = [
    {
      id: 'traditional',
      title: 'Tailored Senator Attires',
      subtitle: 'Ceremonial & Diplomatic Wear',
      count: '14 Masterpieces',
      tag: 'Bespoke Available',
      image: '/images/product_senator_suit_1793964581978.jpg',
      categoryKey: 'traditional',
    },
    {
      id: 'streetwear',
      title: 'Luxury Streetwear & Hoodies',
      subtitle: '500 GSM Heavyweight French Terry',
      count: '18 Styles',
      tag: 'Unisex RTW',
      image: '/images/product_oversized_hoodie_1793964582212.jpg',
      categoryKey: 'streetwear',
    },
    {
      id: 'outerwear',
      title: 'Outerwear & Bomber Jackets',
      subtitle: 'Japanese Matte Technical Satin',
      count: '8 Silhouettes',
      tag: 'Signature Hardware',
      image: '/images/product_urban_bomber_1793964581140.jpg',
      categoryKey: 'streetwear',
    },
    {
      id: 'bottoms',
      title: 'Denim & Casual Bottoms',
      subtitle: 'Raw Selvedge Denim & Fleece Joggers',
      count: '12 Cuts',
      tag: 'Tailored Taper',
      image: '/images/product_denim_shorts.jpg',
      categoryKey: 'streetwear',
    },
    {
      id: 'bespoke',
      title: 'Bespoke Atelier Fittings',
      subtitle: 'In-Person Consultation & Private Cut',
      count: 'Custom Craft',
      tag: 'Gbode Plaza',
      image: '/images/store_lagos_flagship_1793964582670.jpg',
      isService: true,
    },
  ];

  // Best-selling casual and streetwear popular products (Section 2)
  const popularProducts = products
    .filter(p => p.isActive && (p.isSale || p.originalPrice || ['prod-009', 'prod-010', 'prod-011', 'prod-002'].includes(p.id)))
    .slice(0, 4);

  // Fallback if not found in filtered list
  const displayPopular = popularProducts.length >= 3 ? popularProducts : products.slice(0, 4);

  // Client Testimonials (Section 3)
  const testimonials = [
    {
      id: 'test-1',
      author: 'Adekunle Goldson',
      role: 'Boutique Reseller',
      location: 'Lekki Phase 1, Lagos',
      rating: 5,
      headline: 'The wholesale tiered margin & 500 GSM quality are unrivaled',
      comment:
        'Our boutique orders 40 to 60 units every month from JB Lux. The 35% wholesale margin combined with authentic heavyweight fabric gives our retail clients true value. Delivery to our Lekki store is prompt and always verified.',
      verified: true,
      tier: 'Wholesale Tier 3 Patron',
    },
    {
      id: 'test-2',
      author: 'Senator (Barr.) Tunde Adeleke',
      role: 'Verified Client',
      location: 'Maitama, Abuja',
      rating: 5,
      headline: 'Savile Row precision infused with Nigerian royalty',
      comment:
        'The Aurum Monarch Senator suit exceeded my expectations. The solid gilded buttons, hidden placket, and Super 150s merino wool drape commanded total respect at diplomatic sessions in Abuja. Impeccable tailoring.',
      verified: true,
      tier: 'Private Bespoke Client',
    },
    {
      id: 'test-3',
      author: 'Dr. Nneka Okafor',
      role: 'Celebrity Stylist & Creative Director',
      location: 'Victoria Island, Lagos',
      rating: 5,
      headline: 'The only Lagos atelier standing toe-to-toe with Milan',
      comment:
        'I style international musicians and executives across Africa. JB Lux’s Imperium bomber jacket and tailored agbada sets are unmatched in weight and finishing. The bank transfer verification is effortless and trustworthy.',
      verified: true,
      tier: 'Atelier Patron',
    },
    {
      id: 'test-4',
      author: 'Emeka Nnamdi',
      role: 'Fashion Retailer & Boutique Owner',
      location: 'GRA Phase 2, Port Harcourt',
      rating: 5,
      headline: 'Swift insured nationwide delivery & 100% receipt transparency',
      comment:
        'I was skeptical about manual bank transfers at first, but JB Lux confirmed my Zenith transfer in under 15 minutes. The shipment arrived in Port Harcourt via insured freight in immaculate branded packaging. Repeat customer for life.',
      verified: true,
      tier: 'Wholesale Reseller',
    },
  ];

  // Frequently Asked Questions (Section 4)
  const faqs = [
    {
      question: 'How do wholesale tiered discounts work?',
      answer:
        'JB Lux offers automated, transparent volume discounts directly on our digital catalog. When ordering 5+ units of any design, you receive an automatic 15% to 18% discount; 20+ units unlock 25% to 30% off; and 50 to 100+ units enjoy up to 45% off bulk rates. Discounts are calculated live on the invoice without requiring manual coupon codes, ensuring maximum margin for retail boutiques and bulk corporate purchasers.',
    },
    {
      question: 'How does payment and receipt verification work?',
      answer:
        'To eliminate excessive card interchange fees and support seamless Nigerian commerce, we accept direct manual bank transfers to our corporate Zenith Bank PLC account. Once you complete checkout, transfer the exact invoice total via your banking app (Zenith, GTBank, Access, etc.) and upload a clear screenshot or PDF receipt. Our Lagos Island financial admins audit and verify transactions within 2 to 24 hours, notifying you via email and updating your live order tracker.',
    },
    {
      question: 'What are your delivery fees and timelines?',
      answer:
        'All wholesale orders exceeding ₦500,000 qualify for 100% free courier dispatch within Lagos Island and surrounding commercial districts. For orders across Lagos state, doorstep delivery takes 24 to 48 hours. For Nigeria’s remaining 35 states (Abuja, Port Harcourt, Kano, etc.), insured courier dispatch takes 2 to 4 business days. International express air shipping via DHL takes 4 to 7 business days. Free in-person pickup is always available at our Gbode Ventures Plaza flagship on Nnamdi Azikiwe Street.',
    },
    {
      question: 'Can I request bespoke tailoring or custom measurements?',
      answer:
        'Yes. Bespoke ceremonial wear and custom fittings are the bedrock of our atelier heritage. You can visit our flagship atelier at Gbode Ventures Plaza, Lagos Island for a personal measurement session with our master cut-tailors, or schedule a virtual measurement consultation via WhatsApp (+234 906 124 0069) where our senior fitters guide you step-by-step through our structured measurement ledger.',
    },
    {
      question: 'What is your return and exchange policy?',
      answer:
        'We stand behind every hand-stitched seam. If a ready-to-wear garment does not fit as desired, we offer hassle-free size exchanges within 7 business days of delivery, provided the item is unworn, unwashed, and retains all original tags and security ribbons. For bespoke tailored attire, we provide complimentary in-atelier alterations until your silhouette meets complete perfection.',
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('jblux_newsletter_subscribers') || '[]');
      if (!existing.includes(newsletterEmail.trim().toLowerCase())) {
        existing.push(newsletterEmail.trim().toLowerCase());
        localStorage.setItem('jblux_newsletter_subscribers', JSON.stringify(existing));
      }
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 6000);
    } catch {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEO
        title="Royal Heritage & Contemporary Urban Apparel | Men & Women"
        description="Handcrafted African sartorial luxury, bespoke Senator attires, and heavyweight unisex streetwear from Gbode Ventures Plaza, Lagos Island. Retail & wholesale bulk tiers for men and women."
        image="/images/hero_luxury_apparel_1793964581310.jpg"
        type="website"
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-border">
        {/* Background Hero Image with Measured Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_luxury_apparel_1793964581310.jpg"
            alt="JB Lux Luxury Apparel for Men and Women"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-primary/40 text-primary text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lagos Island Bespoke Tailoring & Unisex Streetwear</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto text-balance">
            Where Royal Heritage Meets Contemporary Urban Apparel
          </h1>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Crafted at Gbode Ventures Plaza, Lagos Island. Tailored Senator attires, heavyweight luxury unisex streetwear, and sartorial silhouettes engineered for men and women of distinction. Available in single retail and high-volume wholesale tiers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('catalog')}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary text-black font-semibold text-sm rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setWholesaleMode(true);
                navigateTo('catalog');
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white font-medium text-sm rounded-lg transition-all"
            >
              Wholesale Pricing Tiers
            </button>
          </div>

          {/* Quick Trust Highlights */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-white/10 text-white/70 text-xs">
            <div className="space-y-1">
              <span className="text-primary font-mono font-bold block text-sm">₦ DIRECT TRANSFER</span>
              <span>Manual Bank Transfer with Instant Receipt Approval</span>
            </div>
            <div className="space-y-1">
              <span className="text-primary font-mono font-bold block text-sm">UP TO 45% OFF</span>
              <span>Tiered Wholesale Discounts for Resellers</span>
            </div>
            <div className="space-y-1">
              <span className="text-primary font-mono font-bold block text-sm">LAGOS ATELIER</span>
              <span>Hand-tailored at Gbode Plaza, Lagos Island</span>
            </div>
            <div className="space-y-1">
              <span className="text-primary font-mono font-bold block text-sm">NATIONWIDE & GLOBAL</span>
              <span>Insured dispatch to 36 states & worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-1">
              <span>Atelier Departments</span>
              <span>·</span>
              <span>Lagos Island Craftsmanship</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              From bespoke traditional Senator sets to 500 GSM loopback streetwear and tailored denim bottoms.
            </p>
          </div>

          <button
            onClick={() => navigateTo('catalog')}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary hover:underline self-start md:self-auto group"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {apparelCategories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.isService) {
                  navigateTo('contact');
                } else {
                  navigateTo('catalog');
                }
              }}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg flex flex-col justify-between aspect-[3/4] p-5"
            >
              {/* Background Image with Dark Gradient Scrim */}
              <div className="absolute inset-0 z-0">
                <img
                  src={getImageSrc(cat.image)}
                  alt={cat.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/25 group-hover:via-black/50 transition-colors" />
              </div>

              {/* Top Tag & Number */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-white/80">
                <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 bg-black/70 backdrop-blur-md rounded border border-white/20 text-[#D4AF37]">
                  {cat.tag}
                </span>
                <span className="text-white/60 text-[11px] font-mono">
                  0{idx + 1}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[11px] font-mono text-primary block tracking-wider">
                  {cat.count}
                </span>
                <h3 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors leading-snug">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-white/70 line-clamp-1 font-light">
                  {cat.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore category</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Signature Pieces Section (Existing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-1">
              <span>Curated Essentials</span>
              <span>·</span>
              <span>2026 Sartorial Catalog</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Featured Signature Pieces
            </h2>
          </div>

          {/* Wholesale Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg border border-border">
            <button
              onClick={() => setWholesaleMode(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                !wholesaleMode ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground'
              }`}
            >
              Retail Prices
            </button>
            <button
              onClick={() => setWholesaleMode(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                wholesaleMode ? 'bg-primary text-black shadow-sm font-semibold' : 'text-muted-foreground'
              }`}
            >
              <span>Wholesale Bulk Rates</span>
            </button>
          </div>
        </div>

        {/* 4-column Product Grid (2 cols on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} wholesaleView={wholesaleMode} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigateTo('catalog')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-primary text-foreground hover:text-primary rounded-lg text-sm font-medium transition-colors"
          >
            <span>View Complete 2026 Catalog ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 2: Popular Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-1">
              <span>Best-Selling Urban Line</span>
              <span>·</span>
              <span>Limited Stock Run</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Popular Products & Casual Essentials
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              High-rotation denim cuts, heavyweight fleece joggers, and graphic pique polos crafted for everyday distinction.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>Special Promotional Tiers</span>
            <span>·</span>
            <span className="text-primary font-semibold">Immediate Dispatch</span>
          </div>
        </div>

        {/* 4-Column Popular Grid (2 cols on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayPopular.map(product => {
            const hasSale = Boolean(product.isSale || product.originalPrice);
            const originalPrice = product.originalPrice || Math.round(product.retailPrice * 1.35);
            const categoryLabel = product.subCategory || (product.category === 'traditional' ? 'Senator & Agbada' : 'Streetwear');

            return (
              <div
                key={product.id}
                onClick={() => navigateTo('product-detail', { slug: product.slug })}
                className="group cursor-pointer flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
              >
                {/* Image Wrap */}
                <div className="relative aspect-[4/3] bg-secondary/60 overflow-hidden">
                  <img
                    src={getImageSrc(product.images[0])}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 items-start">
                    {hasSale && (
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 bg-red-600 text-white rounded shadow-sm">
                        SALE
                      </span>
                    )}
                    <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase px-1.5 sm:px-2 py-0.5 bg-black/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 rounded truncate max-w-[110px] sm:max-w-none">
                      {categoryLabel}
                    </span>
                  </div>

                  {/* Stock counter */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 bg-black/60 backdrop-blur-md text-white/90 rounded">
                    {product.stock} left
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between gap-2.5 sm:gap-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                      <div className="flex items-center text-[#D4AF37]">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      </div>
                      <span className="font-semibold text-foreground font-mono text-[11px] sm:text-xs tabular-nums">
                        {(product.rating ?? 4.9).toFixed(1)}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground tabular-nums">
                        ({product.reviewCount ?? product.reviews?.length ?? 24})
                      </span>
                      <span className="text-muted-foreground/60 text-[10px]">·</span>
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                        {product.gender === 'unisex' ? 'Unisex' : 'Atelier'}
                      </span>
                    </div>

                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-xs sm:text-base line-clamp-1">
                      {product.name}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-2 sm:pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className="text-xs sm:text-base font-bold text-foreground font-mono tabular-nums">
                          ₦{product.retailPrice.toLocaleString()}
                        </span>
                        {hasSale && (
                          <span className="text-[10px] sm:text-xs text-muted-foreground line-through font-mono tabular-nums">
                            ₦{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-mono text-emerald-500 hidden sm:block">
                        Direct Lagos dispatch
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('product-detail', { slug: product.slug });
                      }}
                      className="w-full sm:w-auto px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-primary text-black font-semibold text-[11px] sm:text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Select options</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wholesale & Bank Verification Value Strip (Existing 3-Card Row) */}
      <section className="bg-secondary/60 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-card border border-border rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Wholesale Tiered Discounts
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Whether purchasing 5, 20, or 100 units for boutique resale or corporate events, our automated tiered pricing automatically applies discounts up to 45% with instant line-item savings.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Manual Bank Transfer & Verification
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Seamlessly transfer via your Nigerian banking app (Zenith, Access, GTB) to our verified business account. Attach your transfer receipt on checkout for 24-hour verification by store admins.
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Gbode Plaza Atelier Logistics
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pick up directly at our Lagos Island store or enjoy rapid doorstep dispatch. Free Lagos Island shipping for wholesale purchases exceeding ₦500,000.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Client Testimonials & Nationwide Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
            <Quote className="w-3.5 h-3.5" />
            <span>Patron & Reseller Endorsements</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Trusted by Dignitaries, Resellers & Stylists Nationwide
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            From Lagos Island to Abuja, Port Harcourt, and international boutiques—authentic reviews from discerning buyers who trust our direct-atelier production.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(item => (
            <div
              key={item.id}
              className="p-6 bg-card border border-border rounded-xl flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors shadow-sm"
            >
              <div className="space-y-3">
                {/* Rating stars & Tier */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#D4AF37]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-primary px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">
                    {item.tier}
                  </span>
                </div>

                <h4 className="font-semibold text-foreground text-sm leading-snug">
                  "{item.headline}"
                </h4>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.comment}
                </p>
              </div>

              {/* Author and location */}
              <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-foreground block text-xs font-semibold">
                    {item.author}
                  </strong>
                  <span className="text-muted-foreground text-[11px] block">
                    {item.role} · {item.location}
                  </span>
                </div>
                {item.verified && (
                  <span className="text-emerald-500 font-mono text-[10px] flex items-center gap-1 shrink-0" title="Verified Customer">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dual Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigateTo('catalog')}
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 bg-secondary hover:bg-secondary/80 border border-border text-foreground font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Scissors className="w-4 h-4 text-primary" />
            <span>Book Atelier Appointment</span>
          </a>
        </div>

        {/* Nationwide Trust Badges Row */}
        <div className="p-6 bg-secondary/40 border border-border rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-foreground font-semibold block text-sm mb-0.5">
                Atelier Crafted
              </strong>
              <p className="text-muted-foreground leading-relaxed">
                Precision-cut and hand-finished at our Gbode Ventures Plaza atelier on Lagos Island using imported Italian wools and heavyweight knits.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-foreground font-semibold block text-sm mb-0.5">
                Insured Nationwide Delivery
              </strong>
              <p className="text-muted-foreground leading-relaxed">
                Protected, tracked doorstep delivery across all 36 Nigerian states. Free Lagos Island dispatch on wholesale orders over ₦500,000.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-foreground font-semibold block text-sm mb-0.5">
                Bank-Verified Orders
              </strong>
              <p className="text-muted-foreground leading-relaxed">
                Direct manual bank transfer to our verified Zenith Bank PLC account with 24-hour receipt auditing by certified store admins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lagos Island Flagship Atelier Showcase (Existing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-card border border-border rounded-2xl overflow-hidden items-stretch shadow-sm">
          {/* Left Column: Image with guaranteed containment and matching height */}
          <div className="relative w-full min-h-[320px] sm:min-h-[400px] lg:min-h-full overflow-hidden bg-secondary">
            <img
              src="/images/store_lagos_flagship_1793964582670.jpg"
              alt="JB Lux Flagship Atelier Lagos Island"
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              onError={handleImageError}
            />
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/80 backdrop-blur-md rounded text-xs font-mono text-[#D4AF37] border border-[#D4AF37]/30">
              Gbode Ventures Plaza · Lagos Island
            </div>
          </div>

          {/* Right Column: Content with generous padding and vertical alignment */}
          <div className="p-8 sm:p-10 lg:p-12 space-y-6 flex flex-col justify-center">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-primary">
                Atelier Heritage & Physical Store
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Experience JB Lux on Lagos Island
              </h2>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Located in the heart of Lagos Island's historic mercantile district on Nnamdi Azikiwe Street, JB Lux Enterprises crafts premium unisex streetwear and bespoke tailoring for men and women with world-class precision.
            </p>

            <div className="space-y-3 border-y border-border py-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">{settings.storeAddress}</strong>
                  <span className="text-muted-foreground">In-person consultations & bulk collections available.</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <strong className="text-foreground">{settings.contactPhone}</strong>
                  <span className="text-muted-foreground ml-2">Direct line / WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity"
              >
                Book Atelier Appointment
              </a>
              <button
                onClick={() => navigateTo('contact')}
                className="px-6 py-2.5 bg-secondary text-foreground text-xs font-medium rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Directions & Contact
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Frequently Asked Questions (FAQs) & Transparent Terms */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Buyer Assurance & Policies</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Frequently Asked Questions & Terms
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Transparent details regarding our automated wholesale volume discounts, manual bank verification, bespoke fittings, and nationwide shipping.
          </p>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <div
                key={index}
                className={`border rounded-xl transition-colors overflow-hidden ${
                  isOpen ? 'bg-card border-primary/40 shadow-sm' : 'bg-card/60 border-border hover:border-border/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm sm:text-base font-semibold text-foreground flex items-center gap-2.5">
                    <span className="font-mono text-xs text-primary font-bold">0{index + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-primary text-black rotate-180' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Terms Summary Badges */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-mono">
          <div className="p-3 bg-secondary/40 border border-border rounded-lg space-y-1">
            <span className="text-primary font-bold block text-sm">₦500,000+</span>
            <span className="text-muted-foreground text-[11px]">Free Lagos Wholesale Dispatch</span>
          </div>
          <div className="p-3 bg-secondary/40 border border-border rounded-lg space-y-1">
            <span className="text-primary font-bold block text-sm">2–24 Hours</span>
            <span className="text-muted-foreground text-[11px]">Direct Receipt Verification</span>
          </div>
          <div className="p-3 bg-secondary/40 border border-border rounded-lg space-y-1">
            <span className="text-primary font-bold block text-sm">7-Day</span>
            <span className="text-muted-foreground text-[11px]">Hassle-Free Size Exchanges</span>
          </div>
          <div className="p-3 bg-secondary/40 border border-border rounded-lg space-y-1">
            <span className="text-primary font-bold block text-sm">36 States</span>
            <span className="text-muted-foreground text-[11px]">Insured Doorstep Freight</span>
          </div>
        </div>
      </section>

      {/* SECTION 5: Newsletter Updates Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl bg-black text-white">
          {/* Subtle Ambient Background Scrim */}
          <div className="absolute inset-0 z-0 opacity-40">
            <img
              src="/images/hero_luxury_apparel_1793964581310.jpg"
              alt="JB Lux Lifestyle"
              className="w-full h-full object-cover object-center"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/75" />
          </div>

          {/* Banner Content Container */}
          <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-12 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
                <Mail className="w-3.5 h-3.5" />
                <span>Private Patron Ledger & Drops</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
                Subscribe to Receive Drops, Restocks & Wholesale Offers
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Be the first to access limited sartorial drops from our Gbode Ventures Plaza atelier, seasonal restocks, and private bulk wholesale catalogs before general release.
              </p>
            </div>

            {/* Newsletter Input Form */}
            <div className="w-full lg:max-w-md shrink-0">
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-white/50 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterStatus === 'error') setNewsletterStatus('idle');
                      }}
                      placeholder="Enter your email address..."
                      className="w-full pl-10 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-xl text-white text-xs sm:text-sm placeholder:text-white/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-black font-semibold text-xs sm:text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-primary/20"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Messages */}
                {newsletterStatus === 'success' && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono animate-in fade-in">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Welcome to the JB Lux Patron List. You are subscribed for private drops!</span>
                  </div>
                )}
                {newsletterStatus === 'error' && (
                  <p className="text-xs text-red-400 font-mono">
                    Please enter a valid email address.
                  </p>
                )}

                <p className="text-[11px] text-white/50 font-mono">
                  Zero spam. Strictly bespoke drop previews, restocks & wholesale terms. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
