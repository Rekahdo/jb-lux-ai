import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  SlidersHorizontal,
  Layers,
  Check,
  Star,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { SEO } from '../components/SEO';

type GenderFilter = 'all' | 'unisex' | 'men' | 'women';
type PricePreset = 'all' | 'under-50k' | '50k-100k' | '100k-180k' | '180k-plus' | 'custom';
type WearLineFilter = 'all' | 'traditional' | 'streetwear' | 'tailoring';
type SortOption = 'featured' | 'rating-high' | 'reviews-high' | 'price-low' | 'price-high' | 'alpha-asc';

export const CatalogView: React.FC = () => {
  const { products } = useStore();

  // Primary filtering state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<GenderFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wholesaleMode, setWholesaleMode] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Advanced refine drawer / panel state
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [pricePreset, setPricePreset] = useState<PricePreset>('all');
  const [customMinPrice, setCustomMinPrice] = useState<string>('');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [wearLineFilter, setWearLineFilter] = useState<WearLineFilter>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Collections' },
    { id: 'traditional', label: 'Ready-to-Wear Senator & Agbada' },
    { id: 'streetwear', label: 'Unisex Streetwear (RTW)' },
    { id: 'tailoring', label: 'Sartorial Tailoring' },
    { id: 'accessories', label: 'Luxury Accessories' },
  ];

  const genderOptions: Array<{ id: GenderFilter; label: string }> = [
    { id: 'all', label: 'All Wear' },
    { id: 'unisex', label: 'Unisex' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
  ];

  const pricePresets: Array<{ id: PricePreset; label: string }> = [
    { id: 'all', label: 'All Prices' },
    { id: 'under-50k', label: 'Under ₦50,000' },
    { id: '50k-100k', label: '₦50k – ₦100k' },
    { id: '100k-180k', label: '₦100k – ₦180k' },
    { id: '180k-plus', label: '₦180,000+' },
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4.8, label: '★ 4.8 & Above' },
    { value: 4.5, label: '★ 4.5 & Above' },
    { value: 4.0, label: '★ 4.0 & Above' },
  ];

  const sizeOptions = ['all', 'S', 'M', 'L', 'XL', 'XXL', '38R', '40R', '42R', '44R'];

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedGender !== 'all') count++;
    if (searchQuery.trim()) count++;
    if (pricePreset !== 'all') count++;
    if (pricePreset === 'custom' && (customMinPrice || customMaxPrice)) count++;
    if (minRating > 0) count++;
    if (wearLineFilter !== 'all') count++;
    if (selectedSize !== 'all') count++;
    if (inStockOnly) count++;
    return count;
  }, [
    selectedCategory,
    selectedGender,
    searchQuery,
    pricePreset,
    customMinPrice,
    customMaxPrice,
    minRating,
    wearLineFilter,
    selectedSize,
    inStockOnly,
  ]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSearchQuery('');
    setPricePreset('all');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setMinRating(0);
    setWearLineFilter('all');
    setSelectedSize('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  // Filtered & sorted product list
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (!p.isActive) return false;

        // 1. Category Filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'tailoring') {
            if (p.category !== 'tailoring' && p.category !== 'menswear') return false;
          } else if (p.category !== selectedCategory) {
            return false;
          }
        }

        // 2. Gender / Department Filter
        if (selectedGender !== 'all') {
          if (selectedGender === 'unisex') {
            if (p.gender !== 'unisex') return false;
          } else if (selectedGender === 'men') {
            if (p.gender === 'women') return false;
          } else if (selectedGender === 'women') {
            if (p.gender === 'men') return false;
          }
        }

        // 3. Search Query (Name, Description, Fabric, Tagline)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFabric = p.fabric.toLowerCase().includes(q);
          const matchTag = p.tagline?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchFabric && !matchTag) return false;
        }

        // 4. Price Filter
        const price = p.retailPrice;
        if (pricePreset === 'under-50k' && price >= 50000) return false;
        if (pricePreset === '50k-100k' && (price < 50000 || price > 100000)) return false;
        if (pricePreset === '100k-180k' && (price < 100000 || price > 180000)) return false;
        if (pricePreset === '180k-plus' && price < 180000) return false;
        if (pricePreset === 'custom') {
          const min = customMinPrice ? parseFloat(customMinPrice) : 0;
          const max = customMaxPrice ? parseFloat(customMaxPrice) : Infinity;
          if (price < min || price > max) return false;
        }

        // 5. Star Rating Filter
        if (minRating > 0) {
          const productRating = p.rating || 0;
          if (productRating < minRating) return false;
        }

        // 6. Ready-to-Wear Collection Line Filter
        if (wearLineFilter !== 'all') {
          if (wearLineFilter === 'tailoring') {
            if (p.category !== 'tailoring' && p.category !== 'menswear') return false;
          } else if (p.category !== wearLineFilter) {
            return false;
          }
        }

        // 7. Standard Size Run Filter
        if (selectedSize !== 'all') {
          const hasSize = p.sizes.some(s => s.toLowerCase().includes(selectedSize.toLowerCase()));
          if (!hasSize) return false;
        }

        // 8. In Stock Only Filter
        if (inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating-high') {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          if (ratingB !== ratingA) return ratingB - ratingA;
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        if (sortBy === 'reviews-high') {
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        if (sortBy === 'price-low') {
          return a.retailPrice - b.retailPrice;
        }
        if (sortBy === 'price-high') {
          return b.retailPrice - a.retailPrice;
        }
        if (sortBy === 'alpha-asc') {
          return a.name.localeCompare(b.name);
        }
        // Default 'featured': featured items first, then highest rating
        if (a.isFeatured !== b.isFeatured) {
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
        return (b.rating || 0) - (a.rating || 0);
      });
  }, [
    products,
    selectedCategory,
    selectedGender,
    searchQuery,
    pricePreset,
    customMinPrice,
    customMaxPrice,
    minRating,
    wearLineFilter,
    selectedSize,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO
        title="Apparel Storefront & Wholesale Tiers"
        description="Browse Nigerian already-made luxury menswear, womenswear, unisex streetwear, and ready-to-wear ceremonial attire. All items in stock for immediate dispatch."
        image="/images/product_urban_bomber_1793964581140.jpg"
        type="website"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-1">
            <span>JB Lux Catalog</span>
            <span>·</span>
            <span>Direct Lagos Island Production</span>
            <span>·</span>
            <span>100% In-Stock Ready-to-Wear</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Apparel Storefront & Wholesale
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Already-made ceremonial attires for men and women, ready-to-wear unisex streetwear, and volume wholesale tiers in stock for immediate dispatch or in-store collection.
          </p>
        </div>

        {/* Wholesale Switch */}
        <div className="flex items-center gap-2 p-1 bg-secondary/80 rounded-xl border border-border shrink-0">
          <button
            onClick={() => setWholesaleMode(false)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              !wholesaleMode
                ? 'bg-card text-foreground shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Retail Catalog
          </button>
          <button
            onClick={() => setWholesaleMode(true)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              wholesaleMode
                ? 'bg-primary text-black shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wholesale Tiers (Bulk Rates)</span>
          </button>
        </div>
      </div>

      {/* Wholesale Banner if active */}
      {wholesaleMode && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-foreground animate-in fade-in duration-200">
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

      {/* Primary Search, Gender & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search garments by name, fabric, cut (e.g. wool, bomber, senator)..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Gender Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-secondary/60 rounded-xl border border-border overflow-x-auto scrollbar-none shrink-0">
            {genderOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSelectedGender(option.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedGender === option.id
                    ? 'bg-card text-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Sort & Filter Toggle Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="pl-8 pr-7 py-2 text-xs bg-secondary/60 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary font-medium appearance-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="rating-high">Top Rated (Highest ★)</option>
                <option value="reviews-high">Most Reviewed</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="alpha-asc">Alphabetical: A – Z</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 pointer-events-none" />
            </div>

            <button
              onClick={() => setIsFilterPanelOpen(prev => !prev)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors ${
                isFilterPanelOpen || activeFiltersCount > 0
                  ? 'bg-primary/10 border-primary text-primary font-semibold'
                  : 'bg-secondary/60 border-border text-foreground hover:bg-secondary'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-black font-mono text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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

        {/* Expandable Refine Filter Drawer / Panel */}
        {isFilterPanelOpen && (
          <div className="p-5 bg-card/90 rounded-2xl border border-border shadow-md space-y-5 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-display text-sm font-bold text-foreground">Refine Selection</h3>
                {activeFiltersCount > 0 && (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    ({activeFiltersCount} active {activeFiltersCount === 1 ? 'filter' : 'filters'})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors font-mono"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              {/* Filter 1: Customer Rating */}
              <div className="space-y-2.5">
                <span className="font-semibold text-foreground tracking-wide block uppercase text-[11px] font-mono text-muted-foreground">
                  Minimum Star Rating
                </span>
                <div className="space-y-1.5">
                  {ratingOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setMinRating(opt.value)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left transition-colors ${
                        minRating === opt.value
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Star
                          className={`w-3.5 h-3.5 ${
                            opt.value > 0 ? 'fill-primary text-primary' : 'text-muted-foreground'
                          }`}
                        />
                        <span>{opt.label}</span>
                      </span>
                      {minRating === opt.value && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 2: Price Range */}
              <div className="space-y-2.5">
                <span className="font-semibold text-foreground tracking-wide block uppercase text-[11px] font-mono text-muted-foreground">
                  Price Range (NGN)
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {pricePresets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setPricePreset(preset.id);
                        if (preset.id !== 'custom') {
                          setCustomMinPrice('');
                          setCustomMaxPrice('');
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-center transition-colors truncate font-mono text-[11px] ${
                        pricePreset === preset.id
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                {/* Custom price inputs */}
                <div className="pt-1.5 flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1.5 text-muted-foreground font-mono text-[11px]">₦</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={customMinPrice}
                      onChange={e => {
                        setCustomMinPrice(e.target.value);
                        setPricePreset('custom');
                      }}
                      className="w-full pl-6 pr-2 py-1 text-[11px] font-mono bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <span className="text-muted-foreground text-xs">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1.5 text-muted-foreground font-mono text-[11px]">₦</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={customMaxPrice}
                      onChange={e => {
                        setCustomMaxPrice(e.target.value);
                        setPricePreset('custom');
                      }}
                      className="w-full pl-6 pr-2 py-1 text-[11px] font-mono bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Filter 3: Crafting & Tailoring Type */}
              <div className="space-y-2.5">
                <span className="font-semibold text-foreground tracking-wide block uppercase text-[11px] font-mono text-muted-foreground">
                  Ready-to-Wear Line
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setWearLineFilter('all')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left transition-colors ${
                      wearLineFilter === 'all'
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                    }`}
                  >
                    <span>All Ready-to-Wear Lines</span>
                    {wearLineFilter === 'all' && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                  <button
                    onClick={() => setWearLineFilter('traditional')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left transition-colors ${
                      wearLineFilter === 'traditional'
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>Senator & Agbada (Pre-Tailored)</span>
                    </span>
                    {wearLineFilter === 'traditional' && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                  <button
                    onClick={() => setWearLineFilter('streetwear')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left transition-colors ${
                      wearLineFilter === 'streetwear'
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                    }`}
                  >
                    <span>Urban Streetwear (RTW)</span>
                    {wearLineFilter === 'streetwear' && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                  <button
                    onClick={() => setWearLineFilter('tailoring')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left transition-colors ${
                      wearLineFilter === 'tailoring'
                        ? 'bg-primary/10 border-primary text-primary font-semibold'
                        : 'bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                    }`}
                  >
                    <span>Sartorial Blazers & Suits (RTW)</span>
                    {wearLineFilter === 'tailoring' && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                </div>
              </div>

              {/* Filter 4: Sizing & Stock Availability */}
              <div className="space-y-2.5">
                <span className="font-semibold text-foreground tracking-wide block uppercase text-[11px] font-mono text-muted-foreground">
                  Size & Availability
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sizeOptions.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition-colors ${
                        selectedSize === sz
                          ? 'bg-primary text-black font-bold border-primary'
                          : 'bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                      }`}
                    >
                      {sz === 'all' ? 'All Sizes' : sz}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={e => setInStockOnly(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4 bg-secondary"
                    />
                    <span className="text-foreground text-xs font-medium">In-Stock Only (Ready to Dispatch)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider">Active:</span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground font-mono text-[11px]">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-primary">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground font-mono text-[11px]">
                Category: {categories.find(c => c.id === selectedCategory)?.label}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-primary">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedGender !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground font-mono text-[11px]">
                Department: {genderOptions.find(g => g.id === selectedGender)?.label}
                <button onClick={() => setSelectedGender('all')} className="hover:text-primary">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground font-mono text-[11px]">
                Rating: ★ {minRating}+
                <button onClick={() => setMinRating(0)} className="hover:text-primary">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {pricePreset !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground font-mono text-[11px]">
                Price:{' '}
                {pricePreset === 'custom'
                  ? `₦${customMinPrice || '0'} - ₦${customMaxPrice || '∞'}`
                  : pricePresets.find(p => p.id === pricePreset)?.label}
                <button
                  onClick={() => {
                    setPricePreset('all');
                    setCustomMinPrice('');
                    setCustomMaxPrice('');
                  }}
                  className="hover:text-primary"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {wearLineFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground font-mono text-[11px]">
                Line: {wearLineFilter === 'traditional' ? 'Senator & Agbada' : wearLineFilter === 'streetwear' ? 'Streetwear' : 'Blazers & Suiting'}
                <button onClick={() => setWearLineFilter('all')} className="hover:text-primary">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSize !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground font-mono text-[11px]">
                Size: {selectedSize}
                <button onClick={() => setSelectedSize('all')} className="hover:text-primary">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-secondary border border-border text-foreground font-mono text-[11px]">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} className="hover:text-primary">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="text-primary hover:underline font-mono text-[11px] font-medium ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count & Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-3">
        <span className="font-mono">
          Showing <span className="text-foreground font-semibold tabular-nums">{filteredProducts.length}</span> of{' '}
          <span className="tabular-nums">{products.length}</span> luxury pieces
        </span>
        <span className="hidden sm:inline font-mono text-[11px]">
          Direct Atelier Dispatch · Lagos Island
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-secondary/30 rounded-2xl border border-dashed border-border p-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">No garments match your filters</h3>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-md mx-auto">
              We couldn't find any pieces matching your specific combination of price, rating, or category filters.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-primary text-black font-semibold rounded-lg text-xs hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} wholesaleView={wholesaleMode} />
          ))}
        </div>
      )}
    </div>
  );
};
