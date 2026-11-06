import React, { useState } from 'react';
import { MapPin, Phone, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const { settings } = useStore();

  if (!visible) return null;

  return (
    <div className="bg-[#151518] border-b border-[#282830] text-[#A1A1AA] text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 text-[#F5F3EC]">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="truncate">Gbode Ventures Plaza, Nnamdi Azikiwe St, Lagos Island</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#A1A1AA]">
            <span>·</span>
            <span>Wholesale Tiers & Retail Luxury</span>
            <span>·</span>
            <span>Manual Bank Transfer with Instant Receipt Verification</span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-[#F5F3EC]">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#D4AF37]" />
            <span className="font-mono text-[11px]">{settings.contactPhone}</span>
          </a>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss banner"
            className="text-[#666666] hover:text-[#F5F3EC] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
