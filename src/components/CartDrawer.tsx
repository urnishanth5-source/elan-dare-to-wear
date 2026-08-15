import React from 'react';
import { Product, STORE_INFO } from '../data/products';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, Check } from 'lucide-react';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: 'INR' | 'USD';
  onUpdateQuantity: (productId: string, delta: number, size?: string) => void;
  onRemoveItem: (productId: string, size?: string) => void;
  onClearCart: () => void;
  onInquireWhatsAppBag: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onInquireWhatsAppBag,
}) => {
  if (!isOpen) return null;

  const totalINR = items.reduce((acc, item) => acc + item.product.priceINR * item.quantity, 0);
  const totalUSD = items.reduce((acc, item) => acc + item.product.priceUSD * item.quantity, 0);

  const formattedTotal = currency === 'INR' ? `₹${totalINR.toLocaleString('en-IN')}` : `$${totalUSD}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e1118] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          
          {/* Top Bar */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Shopping Bag ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 divide-y divide-white/[0.06]">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
                <p className="text-sm text-zinc-400">Your bag is currently empty.</p>
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const itemPrice = currency === 'INR' 
                  ? `₹${(item.product.priceINR * item.quantity).toLocaleString('en-IN')}` 
                  : `$${item.product.priceUSD * item.quantity}`;

                return (
                  <div key={`${item.product.id}-${item.selectedSize || 'default'}-${idx}`} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                    {/* Thumbnail */}
                    <div className="w-16 h-20 rounded-xl bg-[#161a24] overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between h-20 py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                            className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.selectedSize && (
                          <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded inline-block mt-0.5">
                            Size: {item.selectedSize}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1 border border-white/10">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1, item.selectedSize)}
                            className="p-0.5 text-zinc-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1, item.selectedSize)}
                            className="p-0.5 text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-blue-400">{itemPrice}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Checkout & WhatsApp Inquiry */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/[0.08] bg-[#090b10] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Total</span>
                <span className="text-xl font-bold text-white">{formattedTotal}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                <span>Free trial & store pickup available at Sukrawarpet, Coimbatore.</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onInquireWhatsAppBag();
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reserve & Inquire on WhatsApp</span>
                </button>

                <button
                  onClick={onClearCart}
                  className="w-full py-1.5 text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
