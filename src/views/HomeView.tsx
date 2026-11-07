import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, ShieldCheck, Sparkles, Truck, Award, MapPin, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { handleImageError } from '../utils/images';

export const HomeView: React.FC = () => {
  const { navigateTo, products, settings } = useStore();
  const [wholesaleMode, setWholesaleMode] = useState(false);

  const featuredProducts = products.filter(p => p.isFeatured && p.isActive).slice(0, 4);

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

      {/* Featured Collection Section */}
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

        {/* 4-column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} wholesaleView={wholesaleMode} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigateTo('catalog')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-primary text-foreground hover:text-primary rounded-lg text-sm font-medium transition-colors"
          >
            <span>View Complete 2026 Catalog ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Wholesale & Bank Verification Value Strip */}
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

      {/* Lagos Island Flagship Atelier Showcase */}
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
    </div>
  );
};
