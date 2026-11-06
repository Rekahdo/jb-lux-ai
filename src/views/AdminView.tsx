import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Shield,
  DollarSign,
  Clock,
  Package,
  Layers,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Building,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Mail,
  Eye,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Order, OrderStatus, Product } from '../types';
import { SEO } from '../components/SEO';

export const AdminView: React.FC = () => {
  const {
    orders,
    products,
    settings,
    updateSettings,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    navigateTo,
    viewEmail,
    sentEmails,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [searchOrder, setSearchOrder] = useState('');

  // Selected Order for Side-by-Side Review Modal (FR-ADMIN-5)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  // Bank Settings Form State
  const [bankName, setBankName] = useState(settings.bankName);
  const [accountName, setAccountName] = useState(settings.accountName);
  const [accountNumber, setAccountNumber] = useState(settings.accountNumber);
  const [transferInstructions, setTransferInstructions] = useState(settings.transferInstructions);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('streetwear');
  const [newProductPrice, setNewProductPrice] = useState(65000);
  const [newProductStock, setNewProductStock] = useState(50);
  const [newProductTagline, setNewProductTagline] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');

  // KPI Metrics computation
  const totalRevenue = orders
    .filter(o => o.status !== 'rejected')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingApprovals = orders.filter(o => o.status === 'pending_verification').length;
  const verifiedOrders = orders.filter(o => o.status === 'verified' || o.status === 'processing' || o.status === 'shipped').length;

  // Filtered orders
  const filteredOrders = orders.filter(ord => {
    if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
    if (searchOrder.trim()) {
      const q = searchOrder.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchName = ord.customer.name.toLowerCase().includes(q);
      const matchEmail = ord.customer.email.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchEmail) return false;
    }
    return true;
  });

  const handleSaveBankSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      bankName,
      accountName,
      accountNumber,
      transferInstructions,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, status, reviewNote || undefined);
    setSelectedOrder(prev => (prev ? { ...prev, status } : null));
    setReviewNote('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    addProduct({
      name: newProductName,
      slug: `jb-${newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      tagline: newProductTagline || 'Authentic JB Lux Lagos tailoring',
      category: newProductCategory,
      description: newProductDesc || 'Handcrafted urban tailoring from Gbode Ventures Plaza atelier.',
      fullDescription: newProductDesc || 'Expertly finished in our Lagos Island studio with premium fabrics.',
      images: ['/src/assets/images/product_urban_bomber_1793964581140.jpg'],
      retailPrice: Number(newProductPrice),
      wholesaleTiers: [
        { minQty: 5, discountPercent: 15 },
        { minQty: 20, discountPercent: 25 },
        { minQty: 50, discountPercent: 35 },
      ],
      stock: Number(newProductStock),
      isActive: true,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Onyx Black', 'Gold Accents'],
      fabric: 'Fine Cotton & Silk Thread',
      craftsmanshipOrigin: 'Gbode Plaza, Lagos Island',
      isFeatured: false,
    });

    setShowAddProductModal(false);
    setNewProductName('');
    setNewProductTagline('');
    setNewProductDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO
        title="Store Operations & Verification Desk"
        description="JB Lux Enterprises Store Management and Financial Receipt Verification Portal."
        type="website"
      />
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>JB Lux Operations & Financial Verification</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Store Management Console
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gbode Ventures Plaza, Nnamdi Azikiwe Street, Lagos Island Desk
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-secondary rounded-lg border border-border text-xs font-medium">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              activeTab === 'orders' ? 'bg-primary text-black font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Orders & Receipts ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              activeTab === 'products' ? 'bg-primary text-black font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-md transition-colors ${
              activeTab === 'settings' ? 'bg-primary text-black font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bank Details & Store
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics (FR-ADMIN-6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-card border border-border rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            Total Revenue (Verified)
          </span>
          <div className="text-2xl font-bold font-mono text-primary tabular-nums">
            ₦{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-muted-foreground">Settled via Manual Bank Transfer</span>
        </div>

        <div className="p-5 bg-card border border-border rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-amber-500 uppercase font-semibold flex items-center justify-between">
            <span>Pending Receipts</span>
            <Clock className="w-4 h-4" />
          </span>
          <div className="text-2xl font-bold font-mono text-amber-500 tabular-nums">
            {pendingApprovals}
          </div>
          <span className="text-[10px] text-muted-foreground">Require financial desk verification</span>
        </div>

        <div className="p-5 bg-card border border-border rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            Total Orders Logged
          </span>
          <div className="text-2xl font-bold font-mono text-foreground tabular-nums">
            {orders.length}
          </div>
          <span className="text-[10px] text-emerald-500 font-mono">
            {verifiedOrders} Approved / Dispatched
          </span>
        </div>

        <div className="p-5 bg-card border border-border rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            Official Store Bank
          </span>
          <div className="text-base font-bold text-foreground truncate">
            {settings.bankName}
          </div>
          <span className="text-[11px] font-mono text-primary font-semibold">
            {settings.accountNumber}
          </span>
        </div>
      </div>

      {/* Tab Content: Orders & Receipts Review */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['all', 'pending_verification', 'verified', 'processing', 'shipped', 'rejected'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap uppercase ${
                    orderStatusFilter === st
                      ? 'bg-primary text-black font-semibold'
                      : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {st.replace('_', ' ')}
                  {st === 'pending_verification' && pendingApprovals > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-black rounded-full font-bold text-[10px]">
                      {pendingApprovals}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchOrder}
                onChange={e => setSearchOrder(e.target.value)}
                placeholder="Search order # or customer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/70 border-b border-border text-[11px] font-mono uppercase text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items / Mode</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Receipt</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No orders matching this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(ord => (
                      <tr key={ord.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-primary">
                          {ord.orderNumber}
                          <span className="block text-[10px] text-muted-foreground font-normal">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-foreground block">{ord.customer.name}</strong>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {ord.customer.phone} · {ord.customer.city}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-foreground">
                            {ord.items.reduce((s, it) => s + it.qty, 0)} items
                          </span>
                          <span className="block text-[10px] font-mono text-muted-foreground">
                            {ord.items[0]?.name} {ord.items.length > 1 && `+${ord.items.length - 1} more`}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-foreground">
                          ₦{ord.total.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-primary font-mono text-[11px]">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[120px]">{ord.receiptFileName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                              ord.status === 'verified'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : ord.status === 'pending_verification'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                                : ord.status === 'shipped'
                                ? 'bg-sky-950 text-sky-400 border border-sky-800'
                                : ord.status === 'processing'
                                ? 'bg-purple-950 text-purple-400 border border-purple-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {ord.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 bg-primary text-black font-semibold rounded text-xs hover:opacity-90 inline-flex items-center gap-1 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Verify Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">
              Product Catalog & Stock Management
            </h2>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-primary text-black font-semibold text-xs rounded-lg hover:opacity-90 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(prod => (
              <div
                key={prod.id}
                className="p-4 bg-card border border-border rounded-xl space-y-3 relative group"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-secondary">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      onClick={() => updateProduct(prod.id, { isActive: !prod.isActive })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        prod.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {prod.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-mono">
                    <span>{prod.category}</span>
                    <span>Stock: {prod.stock}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm line-clamp-1">{prod.name}</h3>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-primary text-sm">
                      ₦{prod.retailPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Wholesale: {prod.wholesaleTiers?.length || 0} tiers
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newStock = prompt('Enter updated stock count:', prod.stock.toString());
                        if (newStock !== null) {
                          updateProduct(prod.id, { stock: parseInt(newStock) || prod.stock });
                        }
                      }}
                      className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded border border-border text-foreground"
                    >
                      Edit Stock
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete product ${prod.name}?`)) {
                          deleteProduct(prod.id);
                        }
                      }}
                      className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Bank Details & Store Settings (FR-ADMIN-3) */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-card border border-border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1 border-b border-border pb-4">
            <h2 className="font-display text-xl font-bold text-foreground">
              Official Store Bank Account Settings
            </h2>
            <p className="text-xs text-muted-foreground">
              Any changes made here dynamically update the bank account details displayed to customers at checkout.
            </p>
          </div>

          <form onSubmit={handleSaveBankSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-foreground mb-1">
                Bank Institution Name *
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="e.g. Zenith Bank PLC"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Official Account Beneficiary Name *
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder="JB LUX ENTERPRISES"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                NUBAN Account Number (10 Digits) *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="1018934522"
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono text-base font-bold text-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-foreground mb-1">
                Transfer & Receipt Submission Instructions
              </label>
              <textarea
                rows={3}
                value={transferInstructions}
                onChange={e => setTransferInstructions(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-black font-semibold rounded-lg hover:opacity-90 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Official Bank Details</span>
              </button>
            </div>

            {settingsSaved && (
              <p className="text-xs font-mono text-emerald-500 pt-1">
                ✓ Bank account configuration updated. Live on checkout page immediately.
              </p>
            )}
          </form>
        </div>
      )}

      {/* Side-by-Side Receipt Verification Modal (FR-ADMIN-5) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card text-foreground border border-border rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-secondary/80 border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary text-sm">
                    {selectedOrder.orderNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      selectedOrder.status === 'verified'
                        ? 'bg-emerald-950 text-emerald-400'
                        : selectedOrder.status === 'pending_verification'
                        ? 'bg-amber-950 text-amber-400'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    Current: {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Placed by {selectedOrder.customer.name} · {selectedOrder.customer.phone}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Side-by-Side Body */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Left Column: Order Line Items & Customer Details */}
              <div className="lg:col-span-6 p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-foreground">
                  Order Details & Billing Total
                </h3>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1.5 border-b border-border/50">
                      <div>
                        <strong className="text-foreground block">{it.name}</strong>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {it.size} · {it.color} · Qty: {it.qty} ({it.mode})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-foreground">
                        ₦{(it.unitPrice * it.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-xs font-mono pt-2 border-t border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>₦{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-500">
                      <span>Wholesale Discount:</span>
                      <span>-₦{selectedOrder.discountTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping:</span>
                    <span>₦{selectedOrder.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border">
                    <span>Verified Total Required:</span>
                    <span className="text-primary">₦{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-secondary/40 rounded-lg text-xs space-y-1">
                  <strong className="text-foreground block">Customer & Shipping Information:</strong>
                  <p className="text-muted-foreground">{selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
                  <p className="text-muted-foreground font-mono">Email: {selectedOrder.customer.email}</p>
                  <p className="text-muted-foreground font-mono">Phone: {selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.notes && (
                    <p className="text-amber-400 font-mono text-[11px] mt-1">
                      Notes: {selectedOrder.customer.notes}
                    </p>
                  )}
                </div>

                {/* Audit History */}
                <div className="space-y-1 text-xs">
                  <span className="font-mono text-muted-foreground text-[10px] uppercase block">
                    Audit Trail:
                  </span>
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="text-[11px] text-muted-foreground font-mono">
                      <span className="text-primary font-bold">[{h.status}]</span> {h.note}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Uploaded Receipt Image & Actions */}
              <div className="lg:col-span-6 p-6 space-y-4 bg-secondary/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-base font-bold text-foreground">
                      Attached Payment Receipt
                    </h3>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {selectedOrder.receiptFileName}
                    </span>
                  </div>

                  {/* Receipt Preview Box with zoom/full height */}
                  <div className="bg-black/80 rounded-xl p-2 border border-border flex items-center justify-center max-h-[360px] overflow-hidden">
                    {selectedOrder.receiptDataUrl ? (
                      <img
                        src={selectedOrder.receiptDataUrl}
                        alt="Customer uploaded receipt"
                        className="max-h-[340px] w-full object-contain rounded"
                      />
                    ) : (
                      <div className="py-16 text-center text-xs text-muted-foreground">
                        <FileText className="w-10 h-10 text-primary mx-auto mb-2" />
                        <span>Attached file: {selectedOrder.receiptFileName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Decision Buttons */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div>
                    <label className="block text-[11px] font-medium text-foreground mb-1">
                      Verification Note / Bank Credit Alert Reference:
                    </label>
                    <input
                      type="text"
                      value={reviewNote}
                      onChange={e => setReviewNote(e.target.value)}
                      placeholder="e.g. Zenith Credit Alert #9201 matched. Approved."
                      className="w-full px-3 py-1.5 text-xs bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleUpdateStatus('verified')}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Receipt</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('processing')}
                      className="py-2.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      <span>Send to Tailoring</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('shipped')}
                      className="py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Dispatched</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus('rejected')}
                      className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-card text-foreground border border-border rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-display text-lg font-bold">Add New Luxury Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={e => setNewProductName(e.target.value)}
                  placeholder="e.g. Royal Agbada Monarch"
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={e => setNewProductCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="streetwear">Urban Streetwear</option>
                    <option value="traditional">Bespoke Senator & Agbada</option>
                    <option value="menswear">Sartorial Menswear</option>
                    <option value="accessories">Luxury Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Retail Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={e => setNewProductPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Initial Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={newProductStock}
                  onChange={e => setNewProductStock(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={newProductTagline}
                  onChange={e => setNewProductTagline(e.target.value)}
                  placeholder="e.g. 500 GSM loopback cotton"
                  className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-black font-semibold rounded-lg hover:opacity-90"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
