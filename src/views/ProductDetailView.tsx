import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, MapPin, Truck, Sparkles } from 'lucide-react';
import { SEO } from '../components/SEO';
import { getImageSrc, handleImageError } from '../utils/images';

export const ProductDetailView: React.FC = () => {
  const { routeParams, navigateTo, products, addToCart } = useStore();
  const slug = routeParams.slug;
  const product = products.find(p => p.slug === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState<string>(product?.images[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || 'Default');
  const [quantity, setQuantity] = useState<number>(1);
  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail');
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p>Product not found.</p>
        <button onClick={() => navigateTo('catalog')} className="text-primary mt-4 hover:underline">
          Return to Catalog
        </button>
      </div>
    );
  }

  // Calculate live unit price based on quantity and wholesale tiers
  const activeTier = product.wholesaleTiers?.length
    ? [...product.wholesaleTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(t => quantity >= t.minQty)
    : null;

  const currentDiscount = mode === 'wholesale' && activeTier ? activeTier.discountPercent : 0;
  const currentUnitPrice = Math.round(product.retailPrice * (1 - currentDiscount / 100));
  const totalItemCost = currentUnitPrice * quantity;
  const savingsTotal = (product.retailPrice - currentUnitPrice) * quantity;

  const handleAddToCart = () => {
    addToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
      mode,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SEO
        title={product.name}
        description={`${product.tagline}. ${product.description.slice(0, 150)}`}
        image={getImageSrc(product.images[0])}
        type="product"
        slug={product.slug}
        price={currentUnitPrice}
        category={product.category}
        availability={product.stock > 0 ? 'InStock' : 'OutOfStock'}
      />
      {/* Back Link */}
      <button
        onClick={() => navigateTo('catalog')}
        className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Catalog</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-secondary/40 rounded-xl overflow-hidden border border-border">
            <img
              src={getImageSrc(selectedImage || product.images[0])}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded text-[11px] font-mono text-[#D4AF37] border border-[#D4AF37]/30">
                Signature Collection
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    (selectedImage === img || getImageSrc(selectedImage) === getImageSrc(img))
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getImageSrc(img)}
                    alt={`View ${i + 1}`}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Atelier Craftsmanship Card */}
          <div className="p-6 bg-secondary/30 rounded-xl border border-border space-y-4 text-xs text-muted-foreground">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Atelier Construction Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block font-medium text-foreground">Fabric & Composition</span>
                <span>{product.fabric}</span>
              </div>
              <div>
                <span className="block font-medium text-foreground">Provenance</span>
                <span>{product.craftsmanshipOrigin}</span>
              </div>
            </div>
            <p className="pt-2 border-t border-border leading-relaxed">
              {product.fullDescription}
            </p>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl p-6 lg:p-8 space-y-6 sticky top-28 shadow-sm">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-mono mb-1">
              <span>{product.category}</span>
              <span>Stock: {product.stock} units</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {product.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {product.tagline}
            </p>
          </div>

          {/* Pricing Box & Wholesale Switch */}
          <div className="p-4 bg-secondary/60 rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary font-mono tabular-nums">
                    ₦{currentUnitPrice.toLocaleString()}
                  </span>
                  {currentDiscount > 0 && (
                    <span className="text-xs text-muted-foreground line-through font-mono">
                      ₦{product.retailPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">/ unit</span>
                </div>
                {currentDiscount > 0 && (
                  <span className="text-[11px] font-mono font-semibold text-emerald-500 block">
                    {currentDiscount}% Wholesale Discount Applied
                  </span>
                )}
              </div>

              {/* Mode switch button */}
              <div className="flex items-center gap-1 p-1 bg-background rounded-lg border border-border text-xs">
                <button
                  onClick={() => {
                    setMode('retail');
                    setQuantity(1);
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    mode === 'retail' ? 'bg-primary text-black font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  Retail
                </button>
                <button
                  onClick={() => {
                    setMode('wholesale');
                    if (product.wholesaleTiers[0] && quantity < product.wholesaleTiers[0].minQty) {
                      setQuantity(product.wholesaleTiers[0].minQty);
                    }
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    mode === 'wholesale' ? 'bg-primary text-black font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  Wholesale
                </button>
              </div>
            </div>

            {/* Wholesale Tier Matrix Table */}
            {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                  Wholesale Volume Discount Schedule
                </p>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  {product.wholesaleTiers.map((tier, idx) => {
                    const tierPrice = Math.round(product.retailPrice * (1 - tier.discountPercent / 100));
                    const isTierActive = mode === 'wholesale' && quantity >= tier.minQty && (
                      !product.wholesaleTiers[idx + 1] || quantity < product.wholesaleTiers[idx + 1].minQty
                    );

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setMode('wholesale');
                          setQuantity(tier.minQty);
                        }}
                        className={`p-2 rounded-lg border cursor-pointer transition-all ${
                          isTierActive
                            ? 'bg-primary/10 border-primary text-foreground ring-1 ring-primary'
                            : 'bg-background/80 border-border text-muted-foreground hover:border-foreground/30'
                        }`}
                      >
                        <span className="font-mono text-[11px] block text-foreground font-semibold">
                          {tier.minQty}+ units
                        </span>
                        <span className="font-mono text-xs text-primary font-bold">
                          ₦{tierPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-500 font-mono block">
                          -{tier.discountPercent}% OFF
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Select Size / Fit</span>
              <span className="text-muted-foreground font-mono">Bespoke available</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedSize === size
                      ? 'bg-foreground text-background font-bold border border-foreground'
                      : 'bg-secondary/60 text-foreground border border-border hover:border-foreground/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-foreground">Color Finish: <strong className="text-primary">{selectedColor}</strong></span>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    selectedColor === color
                      ? 'bg-primary text-black font-semibold shadow-sm'
                      : 'bg-secondary/60 text-muted-foreground border border-border hover:text-foreground'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-foreground">Order Quantity</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg bg-secondary/40 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-xs font-mono font-bold bg-transparent text-foreground focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>

              {/* Total calculation indicator */}
              <div className="flex-1 text-right text-xs">
                <span className="text-muted-foreground">Line Total: </span>
                <strong className="text-foreground font-mono text-sm">
                  ₦{totalItemCost.toLocaleString()}
                </strong>
                {savingsTotal > 0 && (
                  <span className="block text-[10px] text-emerald-500 font-mono">
                    You save ₦{savingsTotal.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-primary text-black font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {quantity} to Shopping Bag</span>
            </button>

            {addedNotice && (
              <div className="p-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs text-center rounded-lg flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Added to your bag! Ready to review in Cart.</span>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-border space-y-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Official JB Lux Bank Transfer with 24h Receipt Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-primary" />
              <span>Insured dispatch from Gbode Ventures Plaza, Lagos Island</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
