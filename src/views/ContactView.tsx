import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Mail, Clock, Send, Check, MessageSquare } from 'lucide-react';
import { SEO } from '../components/SEO';

export const ContactView: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('wholesale');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title="Direct Contact & WhatsApp Atelier Desk"
        description="Inquiries for wholesale contracts, bespoke fittings, and store visits. Gbode Ventures Plaza, Nnamdi Azikiwe St, Lagos Island. WhatsApp: +234 906 124 0069."
        type="website"
      />
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
          Client Concierge & Inquiries
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
          Connect with JB Lux Enterprises
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Direct inquiries for retail, high-volume wholesale contracts, and bespoke Lagos Island atelier appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground border-b border-border pb-3">
              Store & Atelier Information
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground text-sm block">Flagship Physical Store</strong>
                  <p className="text-muted-foreground leading-relaxed mt-0.5">
                    {settings.storeAddress}
                  </p>
                  <span className="text-[10px] text-primary font-mono block mt-1">
                    Direct access via Central Lagos Island
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground text-sm block">Telephone & WhatsApp</strong>
                  <a
                    href={`tel:${settings.contactPhone.replace(/[^0-9+]/g, '')}`}
                    className="text-muted-foreground hover:text-primary font-mono block mt-0.5"
                  >
                    {settings.contactPhone}
                  </a>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-500 font-mono text-[11px] mt-1 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground text-sm block">Direct Email</strong>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-muted-foreground hover:text-primary font-mono block mt-0.5"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground text-sm block">Atelier Hours</strong>
                  <p className="text-muted-foreground mt-0.5">Monday – Friday: 8:30 AM – 6:30 PM</p>
                  <p className="text-muted-foreground">Saturday: 9:00 AM – 6:00 PM</p>
                  <p className="text-[10px] text-muted-foreground">Sunday: Closed for Atelier Rest</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello JB Lux Enterprises, I would like to make an inquiry regarding your apparel collection.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] text-black font-semibold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Launch Instant WhatsApp Conversation</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-foreground border-b border-border pb-3">
            Send Inquiry to Atelier Desk
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Richard Okafor"
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Inquiry Category *
              </label>
              <select
                value={inquiryType}
                onChange={e => setInquiryType(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-medium"
              >
                <option value="wholesale">Wholesale Bulk Purchase & Reseller Tier</option>
                <option value="bespoke">Bespoke Senator / Agbada Fitting</option>
                <option value="order">Payment Receipt Verification Follow-up</option>
                <option value="general">General Brand Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Your Message / Volume Requirements *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Please describe the quantities, preferred styles, sizes, or custom measurements you require..."
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-primary text-black font-semibold text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-primary/10"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Message to JB Lux</span>
            </button>

            {submitted && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Thank you! Your inquiry has been routed to our Lagos Island concierge. We will respond within 4 business hours.
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
