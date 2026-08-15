import React, { useState } from 'react';
import { Product, STORE_INFO } from '../data/products';
import { X, Star, MessageCircle, ShoppingBag, Check } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: 'INR' | 'USD';
  onInquireWhatsApp: (product: Product, selectedSize?: string) => void;
  onAddToCart: (product: Product, size?: string) => void;
  isInCart: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  currency,
  onInquireWhatsApp,
  onAddToCart,
  isInCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  React.useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const hasSale = Boolean(product.salePriceINR && product.salePriceINR < product.priceINR);
  
  const currentPriceFormatted = currency === 'INR'
    ? `₹${(hasSale && product.salePriceINR ? product.salePriceINR : product.priceINR).toLocaleString('en-IN')}`
    : `$${hasSale && product.salePriceUSD ? product.salePriceUSD : product.priceUSD}`;

  const originalPriceFormatted = currency === 'INR'
    ? `₹${product.priceINR.toLocaleString('en-IN')}`
    : `$${product.priceUSD}`;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0e1118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-zinc-400 hover:text-white border border-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left: Image */}
          <div className="md:col-span-6 bg-[#161a24] relative aspect-square md:aspect-auto">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasSale && (
              <span className="absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded bg-rose-600 text-white uppercase tracking-wider">
                SALE
              </span>
            )}
          </div>

          {/* Right: Info */}
          <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Rating & Category */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {product.category}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-blue-400">
                    {currentPriceFormatted}
                  </span>
                  {hasSale && (
                    <span className="text-sm text-zinc-500 line-through">
                      {originalPriceFormatted}
                    </span>
                  )}
                </div>
              </div>

              {/* Specs Box */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Availability:</span>
                  <span className={`font-semibold ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isOutOfStock ? 'Out of Stock' : `${product.stock} units in stock`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Fabric:</span>
                  <span>{product.fabric || '100% Cotton'}</span>
                </div>
                <p className="flex items-center gap-1 text-emerald-400 pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Available for immediate trial at {STORE_INFO.shortAddress}</span>
                </p>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Select Size</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                          selectedSize === sz
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/25'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2.5 pt-3 border-t border-white/[0.08]">
              {/* WhatsApp Direct */}
              <button
                onClick={() => {
                  onInquireWhatsApp(product, selectedSize);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp (Size {selectedSize || 'All'})</span>
              </button>

              {/* Add to Bag */}
              <button
                onClick={() => onAddToCart(product, selectedSize)}
                disabled={isOutOfStock}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/5 text-zinc-500'
                    : isInCart
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : isInCart ? 'In Bag (Add Another)' : 'Add to Bag'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
