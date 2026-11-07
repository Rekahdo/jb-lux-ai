import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Mail,
  ArrowRight,
  Phone,
  Printer,
  PackageCheck,
  AlertTriangle,
} from 'lucide-react';
import { OrderStatus } from '../types';
import { SEO } from '../components/SEO';
import { getImageSrc, handleImageError } from '../utils/images';

export const OrderConfirmationView: React.FC = () => {
  const { routeParams, getOrderById, navigateTo, sentEmails, viewEmail } = useStore();
  const orderId = routeParams.orderId;
  const order = getOrderById(orderId) || getOrderById('ord-10492');

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-muted-foreground">Order reference not found.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-primary text-black font-semibold text-xs rounded-lg"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Find associated email
  const orderEmail = sentEmails.find(e => e.orderNumber === order.orderNumber);

  // Status timeline stages
  const stages: Array<{ key: OrderStatus; label: string; desc: string }> = [
    {
      key: 'pending_verification',
      label: 'Receipt Submitted',
      desc: 'Bank transfer receipt attached and queued for audit.',
    },
    {
      key: 'verified',
      label: 'Payment Verified',
      desc: 'Funds confirmed in Zenith Bank account.',
    },
    {
      key: 'processing',
      label: 'Atelier Tailoring / Packing',
      desc: 'Garments cut, tailored, or packed at Gbode Plaza.',
    },
    {
      key: 'shipped',
      label: 'Dispatched for Delivery',
      desc: 'Handed over to carrier for doorstep handover.',
    },
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending_verification':
        return 0;
      case 'verified':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'rejected':
        return -1;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEO
        title={`Order ${order.orderNumber} Confirmation`}
        description={`Order ${order.orderNumber} placed with JB Lux Enterprises. Status: ${order.status.replace('_', ' ')}.`}
        type="website"
      />
      {/* Success Banner */}
      <div className="p-8 bg-card border border-border rounded-2xl text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border border-primary/20 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-primary">
            Order Successfully Placed
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Thank You, {order.customer.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Your bank transfer receipt is now under verification by our Lagos Island financial desk.
          </p>
        </div>

        {/* Order Reference Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-xs font-mono">
          <span className="text-muted-foreground">Order Identifier:</span>
          <strong className="text-primary font-bold">{order.orderNumber}</strong>
        </div>

        {orderEmail && (
          <div className="pt-2">
            <button
              onClick={() => viewEmail(orderEmail)}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Preview Automated Order Confirmation Email Sent to {order.customer.email}</span>
            </button>
          </div>
        )}
      </div>

      {/* Verification Status Timeline (FR-CONF-1) */}
      <div className="p-6 bg-card border border-border rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">
              Verification & Fulfillment Timeline
            </h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-secondary text-primary border border-border uppercase font-semibold">
            Status: {order.status.replace('_', ' ')}
          </span>
        </div>

        {order.status === 'rejected' ? (
          <div className="p-4 bg-red-950/40 border border-red-800 text-red-200 rounded-lg text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Receipt Verification Issue</strong>
              <span>
                Our finance team was unable to reconcile this transfer receipt. Please check your order history to re-upload your valid bank transfer proof or contact us on WhatsApp (+234 906 124 0069).
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {stages.map((stage, idx) => {
              const isPassed = currentStageIdx >= idx;
              const isCurrent = currentStageIdx === idx;

              return (
                <div
                  key={stage.key}
                  className={`p-4 rounded-xl border transition-all text-left space-y-1.5 ${
                    isCurrent
                      ? 'bg-primary/10 border-primary text-foreground'
                      : isPassed
                      ? 'bg-secondary/40 border-border text-foreground'
                      : 'bg-secondary/20 border-border/40 text-muted-foreground opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold">STAGE 0{idx + 1}</span>
                    {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{stage.label}</h4>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Audit event history */}
        <div className="pt-2 border-t border-border space-y-1.5">
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            Audit Activity Log:
          </span>
          <div className="space-y-1">
            {order.statusHistory.map((ev, i) => (
              <div key={i} className="text-xs text-muted-foreground font-mono flex items-start gap-2">
                <span className="text-primary">·</span>
                <span className="text-foreground">{ev.note}</span>
                <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Order Summary + Attached Receipt Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Summary */}
        <div className="lg:col-span-7 bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-foreground border-b border-border pb-2">
            Itemized Purchase Summary
          </h3>

          <div className="space-y-3">
            {order.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <img
                    src={getImageSrc(it.image)}
                    alt={it.name}
                    className="w-12 h-12 object-cover rounded bg-secondary shrink-0"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                  />
                  <div>
                    <strong className="text-foreground text-xs block">{it.name}</strong>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {it.size} · {it.color} · Qty {it.qty}
                    </span>
                    {it.tierApplied && (
                      <span className="text-[10px] text-emerald-500 font-mono block">
                        {it.tierApplied}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-mono font-bold text-foreground">
                  ₦{(it.unitPrice * it.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span>₦{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>Wholesale Savings:</span>
                <span>-₦{order.discountTotal.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Logistics:</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `₦${order.shippingFee.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
              <span>Amount Paid:</span>
              <span className="text-primary font-bold">₦{order.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-3 bg-secondary/50 rounded-lg text-xs space-y-1 border border-border">
            <strong className="text-foreground block">Delivery Address:</strong>
            <p className="text-muted-foreground">{order.customer.address}, {order.customer.city}</p>
            <p className="text-muted-foreground font-mono">Phone: {order.customer.phone}</p>
          </div>
        </div>

        {/* Right: Uploaded Receipt Preview */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-display text-base font-bold text-foreground">
              Uploaded Payment Receipt
            </h3>
            <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
              Audited by Admin
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <FileText className="w-4 h-4 text-primary" />
            <span className="truncate">{order.receiptFileName}</span>
          </div>

          {/* Receipt Image / Document Box */}
          <div className="bg-secondary/40 border border-border rounded-lg p-2 overflow-hidden flex items-center justify-center">
            {order.receiptDataUrl ? (
              <img
                src={order.receiptDataUrl}
                alt="Payment receipt proof"
                className="max-h-72 w-full object-contain rounded"
              />
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                <span>PDF receipt attached for verification</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Need urgent dispatch? Send your order reference (<strong>{order.orderNumber}</strong>) directly to our WhatsApp concierge.
          </p>

          <a
            href={`https://wa.me/2349061240069?text=${encodeURIComponent(
              `Hello JB Lux, I just submitted transfer receipt for order ${order.orderNumber} (₦${order.total.toLocaleString()}). Please expedite verification.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 bg-[#25D366] text-black font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Notify Atelier on WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <button
          onClick={() => navigateTo('catalog')}
          className="text-xs text-primary hover:underline font-medium"
        >
          &larr; Return to Storefront
        </button>
        <button
          onClick={() => navigateTo('profile')}
          className="px-5 py-2 bg-secondary text-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80"
        >
          View All My Orders
        </button>
      </div>
    </div>
  );
};
