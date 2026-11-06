import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Upload,
  Check,
  Copy,
  Building,
  AlertCircle,
  FileText,
  ShieldCheck,
  ArrowLeft,
  X,
  UserCheck,
  Lock,
} from 'lucide-react';
import { IncompleteProfileModal } from '../components/IncompleteProfileModal';
import { AuthModal } from '../components/AuthModal';
import { SEO } from '../components/SEO';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartTotal,
    settings,
    user,
    createOrder,
    navigateTo,
  } = useStore();

  const [isGuest, setIsGuest] = useState(!user);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || 'Lagos');
  const [notes, setNotes] = useState('');

  // Keep synced if user updates
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(user.address);
      setCity(user.city || 'Lagos');
      setIsGuest(false);
    }
  }, [user]);

  // Bank Copy feedback
  const [copiedBank, setCopiedBank] = useState(false);

  // Receipt File State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [receiptFile, setReceiptFile] = useState<{
    name: string;
    type: string;
    size: number;
    dataUrl: string;
  } | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isWholesale = cart.some(it => it.mode === 'wholesale');
  const freeShipping = isWholesale && cartTotal >= settings.freeShippingWholesaleMin;
  const shippingFee = cart.length === 0 ? 0 : freeShipping ? 0 : 3500;
  const grandTotal = cartTotal + shippingFee;

  // Copy Account Number
  const handleCopyAccount = () => {
    navigator.clipboard.writeText(settings.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  // Handle Receipt Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiptError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setReceiptError('Receipt file size exceeds 8MB. Please upload a smaller image or PDF.');
      return;
    }

    // Validate type (image or pdf)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setReceiptError('Invalid format. Please attach a JPG, PNG, WEBP, or PDF bank transfer receipt.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptFile({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result as string,
      });
    };
    reader.onerror = () => {
      setReceiptError('Failed to read the file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Order Handler
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      navigateTo('catalog');
      return;
    }

    // Check FR-AUTH-6: Incomplete profile check if user is logged in
    if (user && (!user.name || !user.phone || !user.address)) {
      setShowIncompleteModal(true);
      return;
    }

    // Check receipt presence (FR-PAY-4)
    if (!receiptFile) {
      setReceiptError('A valid payment receipt is strictly required before submitting this order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customer: {
          name,
          email,
          phone,
          address,
          city,
          notes,
        },
        receiptFile,
      });

      // Navigate to confirmation page
      navigateTo('order-confirmation', { orderId: order.id });
    } catch (err) {
      console.error(err);
      setReceiptError('An error occurred while creating your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-muted-foreground">Your shopping bag is empty.</p>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-2.5 bg-primary text-black font-semibold text-xs rounded-lg"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO
        title="Secure Bank Transfer Checkout"
        description="Official Zenith Bank transfer instructions and mandatory receipt verification for JB Lux Enterprises orders."
        type="website"
      />
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <button
            onClick={() => navigateTo('cart')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bag</span>
          </button>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Bank Transfer Checkout
          </h1>
        </div>

        {/* Member Status Pill */}
        <div>
          {user ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-mono">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Signed In: {user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-xs text-primary hover:underline font-medium"
            >
              Have a JB Lux account? Sign In
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Customer & Delivery Info */}
        <div className="lg:col-span-6 space-y-6">
          {/* Customer Details Box */}
          <div className="p-6 bg-card border border-border rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-display text-lg font-bold text-foreground">
                1. Delivery & Contact Details
              </h2>
              <span className="text-[11px] font-mono text-muted-foreground">
                {isGuest ? 'Guest Checkout' : 'Member Prefilled'}
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Full Name / Reseller Representative *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Richard Okafor"
                  className="w-full px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Email Address (For Confirmation) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="client@domain.com"
                    className="w-full px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Phone (WhatsApp Active) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 803 123 4567"
                    className="w-full px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Delivery Destination Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street Address, Building / Apartment / Plaza, Area"
                  className="w-full px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    City / State *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Lagos, Abuja, Port Harcourt..."
                    className="w-full px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Order / Tailoring Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Special fit measurements, gate instructions..."
                    className="w-full px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bank Transfer Instructions Box (FR-PAY-1 & FR-PAY-2) */}
          <div className="p-6 bg-[#151518] border border-[#282830] rounded-xl space-y-4 text-[#F5F3EC]">
            <div className="flex items-center justify-between border-b border-[#282830] pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-bold text-white">
                  2. Official Store Bank Account
                </h2>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary border border-primary/30 px-2 py-0.5 rounded">
                Direct Settlement
              </span>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              {settings.transferInstructions}
            </p>

            {/* Prominent Bank Details Box */}
            <div className="p-4 bg-[#0E0E10] border border-[#282830] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A1A1AA]">Bank Name:</span>
                <strong className="text-white text-sm">{settings.bankName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A1A1AA]">Account Name:</span>
                <strong className="text-white text-sm font-mono">{settings.accountName}</strong>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#202024]">
                <span className="text-xs text-[#A1A1AA]">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono tracking-wider text-primary">
                    {settings.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="p-1.5 rounded bg-[#202024] hover:bg-[#282830] text-xs text-[#A1A1AA] hover:text-white transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedBank ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Total Transfer Highlight */}
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-between">
              <span className="text-xs text-white">Exact Transfer Amount:</span>
              <span className="text-lg font-bold font-mono text-primary">
                ₦{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Receipt Upload & Order Submission */}
        <div className="lg:col-span-6 space-y-6">
          {/* Order Snapshot Card */}
          <div className="p-6 bg-card border border-border rounded-xl space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground border-b border-border pb-3">
              Order Items ({cart.length})
            </h2>

            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded bg-secondary"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-foreground line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {item.size} · {item.color} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-foreground shrink-0">
                    ₦{(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Items Subtotal:</span>
                <span className="font-mono text-foreground">₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping / Logistics:</span>
                <span className="font-mono text-foreground">
                  {shippingFee === 0 ? 'FREE' : `₦${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                <span>Total Payable:</span>
                <span className="text-primary font-mono tabular-nums">
                  ₦{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Payment Receipt Upload (FR-PAY-3 & FR-PAY-4) */}
          <div className="p-6 bg-card border-2 border-primary/40 rounded-xl space-y-4 relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold block">
                  Mandatory Verification Step
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  3. Attach Bank Payment Receipt
                </h3>
              </div>
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Per store policy, orders will only be routed to cutting & dispatch once your bank transfer receipt is uploaded and verified.
            </p>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {!receiptFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border hover:border-primary/70 rounded-xl p-8 text-center cursor-pointer transition-colors bg-secondary/30 hover:bg-secondary/50 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  Click or drag payment screenshot / PDF here
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Supports PNG, JPG, WEBP, or PDF up to 8MB
                </p>
              </div>
            ) : (
              <div className="p-4 bg-secondary/60 border border-primary rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {receiptFile.name}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {(receiptFile.size / 1024).toFixed(1)} KB · {receiptFile.type}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeReceipt}
                    className="p-1 rounded-full text-muted-foreground hover:text-red-400 hover:bg-secondary transition-colors"
                    title="Remove and replace receipt"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Image Preview if it's an image */}
                {receiptFile.type.startsWith('image/') && (
                  <div className="max-h-48 overflow-hidden rounded-lg border border-border bg-black/40 flex items-center justify-center">
                    <img
                      src={receiptFile.dataUrl}
                      alt="Uploaded transfer receipt"
                      className="max-h-48 object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-mono">
                  <Check className="w-3.5 h-3.5" />
                  <span>Valid receipt attached. Ready to place order.</span>
                </div>
              </div>
            )}

            {receiptError && (
              <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{receiptError}</span>
              </div>
            )}

            {/* Place Order Button (Strictly Disabled Until Receipt Attached - FR-PAY-4) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!receiptFile || isSubmitting}
                className={`w-full py-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  receiptFile && !isSubmitting
                    ? 'bg-primary text-black hover:opacity-90 shadow-xl shadow-primary/20 cursor-pointer'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                }`}
              >
                {isSubmitting ? (
                  <span>Submitting Order & Verifying Receipt...</span>
                ) : !receiptFile ? (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Attach Payment Receipt to Place Order</span>
                  </span>
                ) : (
                  <span>Submit Order (₦{grandTotal.toLocaleString()})</span>
                )}
              </button>

              {!receiptFile && (
                <p className="text-[11px] text-center text-muted-foreground mt-2">
                  "Place Order" button is locked until a bank transfer receipt is uploaded.
                </p>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Incomplete Profile Modal (FR-AUTH-6) */}
      <IncompleteProfileModal
        isOpen={showIncompleteModal}
        onClose={() => setShowIncompleteModal(false)}
        onSaved={() => {
          setShowIncompleteModal(false);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};
