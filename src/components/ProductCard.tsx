import React from 'react';
import { Product } from '../data/products';
import { MessageCircle, Eye, Star, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  currency: 'INR' | 'USD';
  onInquire: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onInquire,
  onQuickView,
  onAddToCart,
  isInCart = false,
}) => {
  const hasSale = Boolean(product.salePriceINR && product.salePriceINR < product.priceINR);
  
  const currentPriceFormatted = currency === 'INR'
    ? `₹${(hasSale && product.salePriceINR ? product.salePriceINR : product.priceINR).toLocaleString('en-IN')}`
    : `$${hasSale && product.salePriceUSD ? product.salePriceUSD : product.priceUSD}`;

  const originalPriceFormatted = currency === 'INR'
    ? `₹${product.priceINR.toLocaleString('en-IN')}`
    : `$${product.priceUSD}`;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group flex flex-col bg-[#12151d] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/25 p-3 sm:p-3.5 transition-all duration-300 shadow-xl justify-between">
      
      {/* Image Wrapper */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative aspect-[4/5] sm:aspect-[3/4] bg-[#161a24] rounded-xl overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {hasSale && (
            <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase shadow-sm bg-rose-600 text-white">
              SALE
            </span>
          )}

          {isOutOfStock ? (
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase shadow-sm bg-zinc-800 text-zinc-300 border border-white/10">
              OUT OF STOCK
            </span>
          ) : product.stock <= 3 ? (
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase shadow-sm bg-amber-500 text-black font-extrabold">
              ONLY {product.stock} LEFT
            </span>
          ) : product.tag && !hasSale ? (
            <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase shadow-sm ${
              product.tag === 'NEW' 
                ? 'bg-blue-600 text-white' 
                : 'bg-zinc-800 text-zinc-200 border border-white/10'
            }`}>
              {product.tag}
            </span>
          ) : null}

          {product.rating && (
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-amber-300 border border-white/10">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            </span>
          )}
        </div>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-2.5 right-2.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 bg-black/80 backdrop-blur-md text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:text-black border border-white/20 flex items-center gap-1"
        >
          <Eye className="w-3 h-3" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between space-y-3 pt-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onQuickView(product)}
              className="text-sm font-semibold text-white tracking-tight hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
            >
              {product.name}
            </h3>
            
            <div className="flex flex-col items-end shrink-0">
              <span className="text-sm font-bold text-blue-400">
                {currentPriceFormatted}
              </span>
              {hasSale && (
                <span className="text-[11px] text-zinc-500 line-through">
                  {originalPriceFormatted}
                </span>
              )}
            </div>
          </div>

          {/* Sub details: Category & Stock info */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-normal mt-1">
            <span className="truncate">{product.category}</span>
            <span className="text-zinc-500 shrink-0">
              {isOutOfStock ? 'Sold Out' : `${product.stock} in stock`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
          {/* WhatsApp Inquiry Button */}
          <button
            onClick={() => onInquire(product)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600/90 hover:bg-emerald-500 py-2 px-3 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-950"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Inquire</span>
          </button>

          {/* Add to Bag icon button */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            aria-label={isInCart ? 'In bag' : 'Add to bag'}
            title={isOutOfStock ? 'Out of stock' : isInCart ? 'Added to Bag' : 'Add to Bag'}
            className={`p-2 rounded-lg transition-colors border shrink-0 ${
              isOutOfStock 
                ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-zinc-500'
                : isInCart
                ? 'bg-blue-600/30 border-blue-500 text-blue-400'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
};
