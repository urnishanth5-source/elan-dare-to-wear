import React from 'react';
import { Product, CATEGORY_METADATA } from '../data/products';
import { ProductCard } from './ProductCard';
import { RefreshCw, ShoppingBag } from 'lucide-react';

interface PantsScreenProps {
  products: Product[];
  loading: boolean;
  currency: 'INR' | 'USD';
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartProductIds: string[];
}

export const PantsScreen: React.FC<PantsScreenProps> = ({
  products,
  loading,
  currency,
  onProductClick,
  onAddToCart,
  cartProductIds,
}) => {
  const pantsItems = products.filter((p) => p.category === 'Pants');
  const meta = CATEGORY_METADATA.Pants;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
      <div className="border-b border-white/[0.08] pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{meta.badge}</span>
          <span className="text-xs text-zinc-500">•</span>
          <span className="text-xs text-zinc-400">{pantsItems.length} in-store items</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{meta.title}</h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">{meta.subtitle}</p>
      </div>

      {loading ? (
        <div className="text-center py-24 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="text-sm font-semibold text-zinc-300">Loading Pants collection from Supabase...</p>
        </div>
      ) : pantsItems.length === 0 ? (
        <div className="text-center py-20 bg-[#12151d] rounded-2xl border border-white/[0.08] p-8 space-y-3">
          <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Pants currently in stock</h3>
          <p className="text-xs text-zinc-400">Add items under category "Pants" in the Admin Dashboard to show them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pantsItems.map((product) => (
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
