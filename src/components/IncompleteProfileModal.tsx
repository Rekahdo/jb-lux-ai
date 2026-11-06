import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface IncompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const IncompleteProfileModal: React.FC<IncompleteProfileModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const { user, updateProfile } = useStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Lagos');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !city) return;

    updateProfile({
      name,
      phone,
      address,
      city,
    });
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card text-foreground border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">
              Complete Your Client Profile
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Before submitting your bank receipt, we require your verified delivery address and phone number for dispatch logistics.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Richard Okafor"
              className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Phone Number (WhatsApp) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+234 803 456 7890"
                className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                City / State *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Lagos"
                className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Delivery Street Address *
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Suite / House number, Street name, Area / Estate"
              className="w-full px-3 py-2 text-sm bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Proceed to Checkout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
