import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Phone, MapPin, Mail, Package, Clock, ShieldCheck, Check, LogOut, ArrowRight, FileText } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { SEO } from '../components/SEO';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, logout, orders, navigateTo, toggleAdminMode, isAdmin } = useStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Lagos');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter user orders or all orders if guest
  const userOrders = orders.filter(o => (user ? o.userId === user.id || o.customer.email === user.email : true));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateProfile({
      name,
      phone,
      address,
      city,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-secondary text-primary mx-auto flex items-center justify-center border border-border">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Client Portal & Account
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Sign in to track verified receipts, view order timelines, and save your delivery preferences.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-2.5 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90"
          >
            Sign In / Register
          </button>
          <button
            onClick={() => navigateTo('catalog')}
            className="px-6 py-2.5 bg-secondary text-foreground text-xs font-medium rounded-lg hover:bg-secondary/80"
          >
            Browse Catalog
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEO
        title="Client Portal & Order History"
        description="Manage your JB Lux client preferences, delivery address, and track payment receipt verification in real time."
        type="profile"
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-primary">
              Client Portal
            </span>
            {isAdmin && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">
                Staff Admin Enabled
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {user.name}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            {user.email} · Registered Client
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAdminMode}
            className="px-3.5 py-1.5 text-xs font-mono rounded-lg border border-border hover:border-primary text-foreground transition-colors"
          >
            {isAdmin ? 'Leave Admin View' : 'Switch to Admin Portal'}
          </button>
          <button
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-red-400 rounded-lg border border-border transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Profile Settings (FR-AUTH-4) */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-display text-lg font-bold text-foreground border-b border-border pb-3 flex items-center justify-between">
            <span>Client Profile & Delivery Info</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3 py-2 bg-secondary/20 border border-border rounded-lg text-muted-foreground font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Phone Number (WhatsApp Active)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-foreground mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-medium text-foreground mb-1">
                  Country
                </label>
                <input
                  type="text"
                  disabled
                  value="Nigeria (Global Dispatch)"
                  className="w-full px-3 py-2 bg-secondary/20 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Default Delivery Address
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Profile Preferences</span>
            </button>

            {savedSuccess && (
              <p className="text-center text-[11px] font-mono text-emerald-500">
                Profile updated successfully.
              </p>
            )}
          </form>
        </div>

        {/* Right Column: Order History & Receipts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <span>Order History & Receipt Status ({userOrders.length})</span>
            </h2>
            <button
              onClick={() => navigateTo('catalog')}
              className="text-xs text-primary hover:underline font-medium"
            >
              + Place New Order
            </button>
          </div>

          {userOrders.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border rounded-xl space-y-2">
              <p className="text-sm text-muted-foreground">You have no orders yet.</p>
              <button
                onClick={() => navigateTo('catalog')}
                className="text-xs text-primary hover:underline font-medium"
              >
                Browse collections now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div
                  key={order.id}
                  className="p-5 bg-card border border-border rounded-xl space-y-3 transition-all hover:border-primary/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
                    <div>
                      <span className="font-mono font-bold text-primary text-sm">
                        {order.orderNumber}
                      </span>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        Placed: {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded uppercase ${
                          order.status === 'verified'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : order.status === 'pending_verification'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : order.status === 'shipped'
                            ? 'bg-sky-950 text-sky-400 border border-sky-800'
                            : order.status === 'processing'
                            ? 'bg-purple-950 text-purple-400 border border-purple-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Items snapshot */}
                  <div className="space-y-1.5 text-xs">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-muted-foreground">
                        <span>
                          {it.qty}x {it.name} ({it.size}, {it.color})
                        </span>
                        <span className="font-mono text-foreground">
                          ₦{(it.unitPrice * it.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground font-mono">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span className="truncate max-w-[200px]">{order.receiptFileName}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-foreground text-sm">
                        Total: ₦{order.total.toLocaleString()}
                      </span>
                      <button
                        onClick={() => navigateTo('order-confirmation', { orderId: order.id })}
                        className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded text-xs inline-flex items-center gap-1"
                      >
                        <span>View Tracking</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
