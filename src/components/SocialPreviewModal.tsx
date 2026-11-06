import React, { useState } from 'react';
import { Eye, X, Globe, Share2, Code, Check, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface SocialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialPreviewModal: React.FC<SocialPreviewModalProps> = ({ isOpen, onClose }) => {
  const { currentRoute, routeParams, products } = useStore();
  const [activePlatform, setActivePlatform] = useState<'google' | 'whatsapp' | 'twitter' | 'schema'>('twitter');

  if (!isOpen) return null;

  // Resolve current dynamic title, description, and image based on route
  let pageTitle = 'JB Lux Enterprises | Luxury Urban Apparel & Menswear';
  let pageDesc =
    'Premium clothing brand offering stylish urban apparel and menswear in wholesale and retail. Gbode Ventures Plaza, Nnamdi Azikiwe St, Lagos Island, Nigeria.';
  let pageImage = '/src/assets/images/hero_luxury_apparel_1793964581310.jpg';

  if (currentRoute === 'catalog') {
    pageTitle = 'Apparel Storefront & Wholesale Tiers | JB Lux Enterprises';
    pageDesc =
      'Explore bespoke Senator outfits, luxury streetwear hoodies, and tailored tuxedos. Wholesale volume discounts up to 45% with bank receipt verification.';
    pageImage = '/src/assets/images/product_urban_bomber_1793964581140.jpg';
  } else if (currentRoute === 'product-detail') {
    const prod = products.find(p => p.slug === routeParams.slug) || products[0];
    if (prod) {
      pageTitle = `${prod.name} | JB Lux Enterprises`;
      pageDesc = `${prod.tagline} — ${prod.description.slice(0, 140)}... Retail: ₦${prod.retailPrice.toLocaleString()}`;
      pageImage = prod.images[0] || pageImage;
    }
  } else if (currentRoute === 'about') {
    pageTitle = 'Atelier Heritage & Lagos Island Studio | JB Lux Enterprises';
    pageDesc =
      'Discover the craftsmanship of JB Lux at Gbode Ventures Plaza, Nnamdi Azikiwe Street, Lagos Island. Master-tailored urban luxury and sartorial excellence.';
    pageImage = '/src/assets/images/store_lagos_flagship_1793964582670.jpg';
  } else if (currentRoute === 'contact') {
    pageTitle = 'Contact & WhatsApp Atelier Concierge | JB Lux Enterprises';
    pageDesc =
      'Connect directly with JB Lux on Lagos Island for wholesale bulk inquiries, bespoke fittings, and order support via WhatsApp (+234 906 124 0069).';
  } else if (currentRoute === 'cart') {
    pageTitle = 'Shopping Bag & Bulk Volume Discounts | JB Lux Enterprises';
    pageDesc = 'Review your retail and wholesale selections prior to manual bank transfer checkout and receipt submission.';
  } else if (currentRoute === 'checkout') {
    pageTitle = 'Secure Bank Transfer Checkout | JB Lux Enterprises';
    pageDesc = 'Direct Zenith Bank settlement with mandatory receipt verification. 24-hour verification turnaround.';
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jbluxenterprises.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#151518] text-[#F5F3EC] border border-[#282830] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#0E0E10] border-b border-[#282830] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <span>React Helmet SEO & Social Card Live Inspector</span>
              </h3>
              <p className="text-[11px] font-mono text-[#A1A1AA]">
                Active Route: <strong className="text-primary">/{currentRoute}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-[#202024] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="px-4 py-2.5 bg-[#1A1A20] border-b border-[#282830] flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActivePlatform('twitter')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activePlatform === 'twitter' ? 'bg-primary text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            X / Twitter Card
          </button>
          <button
            onClick={() => setActivePlatform('whatsapp')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activePlatform === 'whatsapp' ? 'bg-primary text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            WhatsApp / iMessage
          </button>
          <button
            onClick={() => setActivePlatform('google')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activePlatform === 'google' ? 'bg-primary text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Google SERP
          </button>
          <button
            onClick={() => setActivePlatform('schema')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activePlatform === 'schema' ? 'bg-primary text-black font-semibold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            JSON-LD Schema
          </button>
        </div>

        {/* Body Visualizer */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0E0E10] space-y-6">
          {/* Twitter Card Preview */}
          {activePlatform === 'twitter' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-[#A1A1AA] block">
                Rendered Twitter "summary_large_image" Preview:
              </span>
              <div className="bg-[#000000] border border-[#2F3336] rounded-2xl overflow-hidden max-w-lg mx-auto shadow-xl">
                <div className="aspect-[1.91/1] w-full bg-[#16181C] overflow-hidden relative">
                  <img
                    src={pageImage}
                    alt={pageTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white">
                    JB LUX
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-[11px] text-[#71767B] font-mono">
                    jbluxenterprises.com
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-1 leading-snug">
                    {pageTitle}
                  </h4>
                  <p className="text-xs text-[#71767B] line-clamp-2 leading-relaxed">
                    {pageDesc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp / iMessage Preview */}
          {activePlatform === 'whatsapp' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-[#A1A1AA] block">
                Rendered OpenGraph Chat Bubble Preview:
              </span>
              <div className="max-w-md mx-auto p-3 bg-[#0B141A] rounded-xl border border-[#202C33]">
                <div className="bg-[#1F2C34] rounded-lg overflow-hidden border border-[#2A3942]">
                  <div className="aspect-[1.91/1] w-full overflow-hidden bg-black/40">
                    <img
                      src={pageImage}
                      alt={pageTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2.5 space-y-1">
                    <h4 className="text-xs font-semibold text-[#E9EDEF] line-clamp-1">
                      {pageTitle}
                    </h4>
                    <p className="text-[11px] text-[#8696A0] line-clamp-2">
                      {pageDesc}
                    </p>
                    <span className="text-[10px] text-[#00A884] font-mono block">
                      https://jbluxenterprises.com/{currentRoute}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-[#8696A0] font-mono text-right mt-1">
                  10:42 AM · Delivered
                </div>
              </div>
            </div>
          )}

          {/* Google Search Result Preview */}
          {activePlatform === 'google' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-[#A1A1AA] block">
                Rendered Google Search Snippet Preview:
              </span>
              <div className="bg-[#202124] p-5 rounded-xl border border-[#3C4043] max-w-lg mx-auto space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                    JB
                  </div>
                  <div>
                    <span className="text-xs text-[#BDC1C6] font-medium block leading-none">
                      JB Lux Enterprises
                    </span>
                    <span className="text-[11px] text-[#9AA0A6] font-mono">
                      https://jbluxenterprises.com &rsaquo; {currentRoute}
                    </span>
                  </div>
                </div>
                <h4 className="text-base text-[#8AB4F8] hover:underline font-normal cursor-pointer line-clamp-1">
                  {pageTitle}
                </h4>
                <p className="text-xs text-[#BDC1C6] line-clamp-2 leading-relaxed">
                  {pageDesc}
                </p>
              </div>
            </div>
          )}

          {/* Schema JSON-LD Code */}
          {activePlatform === 'schema' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-[#A1A1AA] block">
                Active Schema.org JSON-LD Structured Data:
              </span>
              <pre className="p-4 bg-[#151518] border border-[#282830] rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72">
{`{
  "@context": "https://schema.org",
  "@type": "${currentRoute === 'product-detail' ? 'Product' : 'ClothingStore'}",
  "name": "${pageTitle.replace(/"/g, '\\"')}",
  "description": "${pageDesc.replace(/"/g, '\\"')}",
  "url": "https://jbluxenterprises.com/${currentRoute}",
  "image": "https://jbluxenterprises.com${pageImage}",
  "telephone": "+234 906 124 0069",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Gbode Ventures Plaza, Nnamdi Azikiwe Street",
    "addressLocality": "Lagos Island",
    "addressRegion": "Lagos",
    "addressCountry": "NG"
  }
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#151518] border-t border-[#282830] flex items-center justify-between text-xs text-[#A1A1AA]">
          <span>Generated dynamically via React Helmet for this route</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-primary text-black font-semibold rounded-lg hover:opacity-90"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
