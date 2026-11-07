import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getImageSrc, handleImageError } from '../utils/images';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    navigateTo,
    settings,
  } = useStore();

  const isWholesaleEligible = cart.some(it => it.mode === 'wholesale');
  const freeShipping = isWholesaleEligible && cartTotal >= settings.freeShippingWholesaleMin;
  const shippingFee = cart.length === 0 ? 0 : freeShipping ? 0 : 3500;
  const finalOrderTotal = cartTotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-secondary text-muted-foreground mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Explore our sartorial tuxedos, bespoke Senator outfits, and heavyweight luxury streetwear.
        </p>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-6 py-3 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
        >
          <span>Browse Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO
        title="Shopping Bag & Wholesale Volume Discounts"
        description="Review your retail and wholesale apparel selections before proceeding to manual bank transfer checkout."
        type="website"
      />
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Shopping Bag</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review your retail and wholesale selections prior to manual bank transfer checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => {
            const lineTotal = item.unitPrice * item.quantity;
            const lineSavings = (item.retailPrice - item.unitPrice) * item.quantity;

            return (
              <div
                key={item.id}
                className="p-4 bg-card border border-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all"
              >
                {/* Image */}
                <img
                  src={getImageSrc(item.image)}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-secondary/50 shrink-0"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-red-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span>Fit: {item.size}</span>
                    <span>·</span>
                    <span>Color: {item.color}</span>
                    <span>·</span>
                    <span className="capitalize">{item.mode} Mode</span>
                  </div>

                  {item.discountPercent > 0 && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-semibold bg-emerald-950/30 px-2 py-0.5 rounded">
                      <Tag className="w-3 h-3" />
                      <span>{item.discountPercent}% Wholesale Tier Discount</span>
                    </div>
                  )}

                  {/* Quantity Stepper & Price */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center border border-border rounded-lg bg-secondary/40 overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-foreground hover:bg-secondary"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-mono font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs text-foreground hover:bg-secondary"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-foreground">
                        ₦{lineTotal.toLocaleString()}
                      </div>
                      {lineSavings > 0 && (
                        <span className="text-[10px] font-mono text-emerald-500 block">
                          Saved ₦{lineSavings.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => navigateTo('catalog')}
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-foreground border-b border-border pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Gross Retail Subtotal</span>
              <span className="font-mono text-foreground">₦{cartSubtotal.toLocaleString()}</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-500 font-medium">
                <span>Wholesale Tier Savings</span>
                <span className="font-mono">-₦{cartDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Delivery & Logistics</span>
                {freeShipping && (
                  <span className="text-[10px] text-emerald-400 font-mono">(Free Promo)</span>
                )}
              </div>
              <span className="font-mono text-foreground">
                {shippingFee === 0 ? 'FREE' : `₦${shippingFee.toLocaleString()}`}
              </span>
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-foreground">Final Order Total</span>
                <p className="text-[10px] text-muted-foreground">Bank transfer required</p>
              </div>
              <span className="text-xl font-bold text-primary font-mono tabular-nums">
                ₦{finalOrderTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3 bg-secondary/60 rounded-lg text-xs space-y-1.5 border border-border">
            <span className="font-medium text-foreground block">Payment Terms</span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              JB Lux operates on direct manual bank transfer into our official <strong>{settings.bankName}</strong> account. You will attach your payment receipt in the next step to finalize verification.
            </p>
          </div>

          <button
            onClick={() => navigateTo('checkout')}
            className="w-full py-3.5 bg-primary text-black font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
          >
            <span>Proceed to Bank Transfer & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-[11px] text-muted-foreground flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>24h Receipt Verification Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
