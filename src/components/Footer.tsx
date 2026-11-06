import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { navigateTo, settings } = useStore();

  return (
    <footer className="bg-[#0E0E10] text-[#F5F3EC] border-t border-[#282830] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#202024]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-[0.15em] text-[#D4AF37]">
                JB LUX
              </span>
              <span className="text-xs tracking-[0.25em] text-[#A1A1AA] uppercase">
                ENTERPRISES
              </span>
            </div>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-sm">
              Distinctive Nigerian contemporary luxury & urban menswear. Direct atelier craftsmanship, tailored sartorial elegance, and wholesale distribution from Lagos Island to the global stage.
            </p>
            <div className="pt-2 text-xs text-[#A1A1AA] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Certified Lagos Commercial Entity · Bank Verified Orders</span>
            </div>
          </div>

          {/* Location & Atelier */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">
              Lagos Island Flagship
            </h4>
            <div className="text-xs text-[#A1A1AA] space-y-2 leading-relaxed">
              <p className="text-[#F5F3EC] font-medium">Gbode Ventures Plaza</p>
              <p>Nnamdi Azikiwe Street,</p>
              <p>Lagos Island, Lagos, Nigeria</p>
              <p className="pt-1 text-[#666666]">Mon – Sat: 8:30 AM – 6:30 PM</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">
              Storefront
            </h4>
            <ul className="text-xs space-y-2 text-[#A1A1AA]">
              <li>
                <button
                  onClick={() => navigateTo('catalog')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  All Menswear & Streetwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Wholesale Bulk Discounts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Atelier Craftsmanship
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('profile')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Track Order by Receipt
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">
              Client Concierge
            </h4>
            <div className="text-xs text-[#A1A1AA] space-y-2.5">
              <a
                href={`tel:${settings.contactPhone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-mono">{settings.contactPhone}</span>
              </a>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{settings.contactEmail}</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-2 bg-[#202024] hover:bg-[#282830] text-[#D4AF37] rounded text-xs font-medium border border-[#282830] transition-colors"
              >
                <span>WhatsApp Atelier</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
          <p>© {new Date().getFullYear()} JB Lux Enterprises. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Official Bank Settlement: {settings.bankName}</span>
            <span>·</span>
            <span>Wholesale & Retail</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
