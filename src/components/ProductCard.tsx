import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { getImageSrc, handleImageError } from '../utils/images';

interface ProductCardProps {
  product: Product;
  wholesaleView?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, wholesaleView = false }) => {
  const { navigateTo, addToCart } = useStore();

  const maxDiscount = product.wholesaleTiers?.length
    ? Math.max(...product.wholesaleTiers.map(t => t.discountPercent))
    : 0;

  const lowestWholesalePrice = maxDiscount
    ? Math.round(product.retailPrice * (1 - maxDiscount / 100))
    : product.retailPrice;

  return (
    <div
      onClick={() => navigateTo('product-detail', { slug: product.slug })}
      className="group cursor-pointer flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-secondary/50 overflow-hidden">
        <img
          src={getImageSrc(product.images[0])}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Subtle metadata tags (anti-slop, clean minimal) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.isFeatured && (
            <span className="text-[11px] font-mono tracking-wider uppercase px-2 py-0.5 bg-black/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 rounded">
              Atelier Signature
            </span>
          )}
          {wholesaleView && maxDiscount > 0 && (
            <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 bg-primary text-black font-semibold rounded">
              Wholesale Tier -{maxDiscount}%
            </span>
          )}
        </div>

        {/* Quick view button on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
          <span className="text-xs text-white/90 font-medium flex items-center gap-1">
            View Fabric & Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({
                product,
                size: product.sizes[0] || 'Standard',
                color: product.colors[0] || 'Default',
                quantity: wholesaleView && product.wholesaleTiers[0] ? product.wholesaleTiers[0].minQty : 1,
                mode: wholesaleView ? 'wholesale' : 'retail',
              });
            }}
            className="p-1.5 rounded bg-primary text-black hover:opacity-90 transition-opacity"
            title="Add default variant to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            <span className="font-mono text-[11px]">{product.stock} in stock</span>
          </div>

          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 text-base">
            {product.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {product.tagline}
          </p>
        </div>

        <div className="pt-2 border-t border-border flex items-baseline justify-between">
          <div>
            {wholesaleView && maxDiscount > 0 ? (
              <div>
                <span className="text-xs text-muted-foreground line-through font-mono mr-2">
                  ₦{product.retailPrice.toLocaleString()}
                </span>
                <span className="text-base font-bold text-primary font-mono tabular-nums">
                  from ₦{lowestWholesalePrice.toLocaleString()}
                </span>
                <p className="text-[10px] text-muted-foreground font-mono">
                  Bulk order pricing
                </p>
              </div>
            ) : (
              <div>
                <span className="text-base font-bold text-foreground font-mono tabular-nums">
                  ₦{product.retailPrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground ml-2">Retail</span>
              </div>
            )}
          </div>

          <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors flex items-center">
            Details &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
