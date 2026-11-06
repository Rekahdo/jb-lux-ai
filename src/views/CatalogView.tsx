import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory } from '../types';
import { Search, SlidersHorizontal, Layers, Check } from 'lucide-react';
import { SEO } from '../components/SEO';

export const CatalogView: React.FC = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wholesaleMode, setWholesaleMode] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Collections' },
    { id: 'traditional', label: 'Bespoke Senator & Agbada' },
    { id: 'streetwear', label: 'Urban Streetwear' },
    { id: 'menswear', label: 'Sartorial Menswear' },
    { id: 'accessories', label: 'Luxury Accessories' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (!p.isActive) return false;
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFabric = p.fabric.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchFabric) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.retailPrice - b.retailPrice;
        if (sortBy === 'price-high') return b.retailPrice - a.retailPrice;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO
        title="Apparel Storefront & Wholesale Tiers"
        description="Browse Nigerian bespoke luxury menswear, 500 GSM loopback streetwear hoodies, and tailored blazers. Volume wholesale discount tiers available."
        image="/src/assets/images/product_urban_bomber_1793964581140.jpg"
        type="website"
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-1">
            <span>JB Lux Catalog</span>
            <span>·</span>
            <span>Direct Lagos Island Production</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Apparel Storefront & Wholesale
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Individual bespoke pieces and volume order tiers for boutiques, retailers, and corporate fraternities.
          </p>
        </div>

        {/* Wholesale Switch */}
        <div className="flex items-center gap-3 p-1.5 bg-secondary/80 rounded-xl border border-border">
          <button
            onClick={() => setWholesaleMode(false)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
              !wholesaleMode ? 'bg-card text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Retail Catalog
          </button>
          <button
            onClick={() => setWholesaleMode(true)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              wholesaleMode ? 'bg-primary text-black shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wholesale Tiers (Bulk Rates)</span>
          </button>
        </div>
      </div>

      {/* Wholesale Banner if active */}
      {wholesaleMode && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-primary text-black flex items-center justify-center font-bold font-mono text-xs shrink-0">
              %
            </div>
            <div>
              <strong className="text-primary font-semibold block">Wholesale Mode Active</strong>
              <span className="text-muted-foreground">
                Tiered bulk volume pricing (up to 45% discount) applies automatically based on order quantities.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-primary shrink-0">
            Free shipping on orders &gt; ₦500,000
          </span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-primary text-black font-semibold shadow-sm'
                  : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search fabric, style..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs bg-secondary/50 border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:border-primary font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-secondary/30 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm">No products found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} wholesaleView={wholesaleMode} />
          ))}
        </div>
      )}
    </div>
  );
};
