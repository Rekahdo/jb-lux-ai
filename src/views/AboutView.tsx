import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Award, Sparkles, Scissors, Users, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { handleImageError } from '../utils/images';

export const AboutView: React.FC = () => {
  const { navigateTo, settings } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SEO
        title="Lagos Island Flagship Studio & Atelier Heritage"
        description="Experience JB Lux at Gbode Ventures Plaza, Nnamdi Azikiwe Street, Lagos Island. Master-tailored urban luxury, bespoke ceremonial Senator attire, and wholesale production."
        image="/images/store_lagos_flagship_1793964582670.jpg"
        type="website"
      />
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
          Brand Heritage & Craftsmanship
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight">
          Crafting Nigeria’s Defining Contemporary Luxury & Urban Menswear
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Founded on Lagos Island, JB Lux Enterprises embodies the bold, unapologetic ambition of contemporary African style. From bespoke ceremonial Senator suits to heavy-weight luxury streetwear, each piece is engineered for presence, permanence, and prestige.
        </p>
      </div>

      {/* Flagship Visual Showcase */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border shadow-xl">
        <img
          src="/images/store_lagos_flagship_1793964582670.jpg"
          alt="JB Lux Flagship Atelier Lagos Island"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 sm:p-12">
          <div className="text-white space-y-2 max-w-xl">
            <span className="px-2.5 py-1 rounded bg-primary text-black font-mono text-[11px] font-bold uppercase tracking-wider">
              Flagship Studio
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Gbode Ventures Plaza Atelier
            </h3>
            <p className="text-xs sm:text-sm text-white/80">
              Nnamdi Azikiwe Street, Lagos Island — the historic epicentre of West African textiles, tailoring, and global commerce.
            </p>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-card border border-border rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Bespoke Tailoring Standard
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every garment begins with hand-selected textiles—from 500 GSM loopback Egyptian cottons to Super 150s Italian wools. Our master pattern-makers cut each garment with geometric precision to deliver a commanding silhouette.
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Wholesale Reseller Network
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Beyond individual retail clients, JB Lux powers high-end boutiques and regional resellers across Nigeria and the diaspora. Our transparent tiered wholesale discounts allow partners to build thriving retail operations.
          </p>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Trusted Financial Verification
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We prioritize mutual trust. Our direct bank transfer settlement model ensures safe commercial transactions without intermediary processing failures, backed by dedicated human receipt verification within 24 hours.
          </p>
        </div>
      </div>

      {/* Lagos Island Invitation */}
      <div className="p-8 sm:p-12 bg-secondary/50 border border-border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Experience Our Tailoring Firsthand
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Visit our flagship studio on Nnamdi Azikiwe Street or discuss a custom commission with our lead styling concierge.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity"
          >
            Direct WhatsApp Chat
          </a>
          <button
            onClick={() => navigateTo('contact')}
            className="px-6 py-3 bg-card border border-border text-foreground text-xs font-semibold rounded-lg hover:bg-secondary transition-colors"
          >
            Store Directions & Contact
          </button>
        </div>
      </div>
    </div>
  );
};
