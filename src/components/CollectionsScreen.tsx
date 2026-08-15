import React, { useState } from 'react';
import { Product, CATEGORY_METADATA } from '../data/products';
import { ProductCard } from './ProductCard';
import { CATEGORY_OPTIONS, ProductCategory } from '../lib/supabase';
import { Filter, Sparkles, RefreshCw, ShoppingBag } from 'lucide-react';

interface CollectionsScreenProps {
  products: Product[];
  loading: boolean;
  currency: 'INR' | 'USD';
  openWhatsAppModal: (productName?: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartProductIds: string[];
}

export const CollectionsScreen: React.FC<CollectionsScreenProps> = ({
  products,
  loading,
  currency,
  openWhatsAppModal,
  onProductClick,
  onAddToCart,
  cartProductIds,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'name'>('featured');

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePriceINR || a.priceINR;
    const priceB = b.salePriceINR || b.priceINR;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
      
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Catalogue</span>
          <span className="text-xs text-zinc-500">•</span>
          <span className="text-xs text-zinc-400">Live Inventory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          All Collections
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
          Explore ready-made garments for men and children. Real-time availability from our store on Sukrawarpet Street.
        </p>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-[#12151d] text-zinc-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            All Pieces ({products.length})
          </button>

          {CATEGORY_OPTIONS.map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all ${
                  selectedFilter === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-[#12151d] text-zinc-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-400 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-[#12151d] text-zinc-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="featured">Featured / Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-24 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="text-sm font-semibold text-zinc-300">Loading catalog from database...</p>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#12151d] rounded-2xl border border-white/[0.08] p-8 space-y-3">
          <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No products found in this category</h3>
          <p className="text-xs text-zinc-400">
            Products added to Supabase in this category will appear here instantly.
          </p>
          <button
            onClick={() => setSelectedFilter('all')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider pt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onInquire={() => onProductClick(product)}
              onQuickView={() => onProductClick(product)}
              onAddToCart={onAddToCart}
              isInCart={cartProductIds.includes(product.id)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
