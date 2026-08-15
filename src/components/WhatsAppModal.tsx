import React, { useState } from 'react';
import { STORE_INFO, Product } from '../data/products';
import { MessageCircle, Star, X, Send, ArrowRight, Copy, Check } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct?: Product | null;
  customTopic?: string;
  cartItems?: { product: Product; quantity: number; selectedSize?: string }[];
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  customTopic,
  cartItems = [],
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build appropriate pre-filled message
  let defaultMessage = `Hi elan.! I would like to inquire about your collections at the Coimbatore store.`;
  
  if (selectedProduct) {
    defaultMessage = `Hi elan.! I'm interested in the *${selectedProduct.name}* (₹${selectedProduct.priceINR.toLocaleString('en-IN')}). Could you please share available sizes, colors, and in-store availability at Sukrawarpet?`;
  } else if (cartItems.length > 0) {
    const itemsList = cartItems
      .map((item) => `- ${item.product.name} (Qty: ${item.quantity}${item.selectedSize ? `, Size: ${item.selectedSize}` : ''})`)
      .join('\n');
    defaultMessage = `Hi elan.! I have selected the following items from your catalogue:\n${itemsList}\n\nCan you confirm availability and payment/pickup options at the Sukrawarpet store?`;
  } else if (customTopic) {
    defaultMessage = `Hi elan.! I have an inquiry regarding *${customTopic}*. Can you assist me?`;
  }

  const activeMessage = userQuery.trim() || defaultMessage;
  const whatsappUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(activeMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPrompts = [
    'Check size & stock in Sukrawarpet store',
    'Do you have Linen Shirts in Size 40 / L?',
    'Show me trending Kids wear for 4-5 Years',
    'Store location & parking in Town Hall',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e1118] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* WhatsApp Big Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <MessageCircle className="w-7 h-7" />
        </div>

        {/* Headings */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Chat with elan.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
            We're here to help you find the perfect fit. Our team is available on WhatsApp for real-time sizing advice and collection queries.
          </p>
        </div>

        {/* Rating Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
          <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>4.9★ rating on Google (Coimbatore)</span>
        </div>

        {/* Inquiry Message Box Preview */}
        <div className="text-left space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Your Message Preview</span>
            <button
              onClick={handleCopy}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy text'}</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={userQuery || defaultMessage}
            onChange={(e) => setUserQuery(e.target.value)}
            className="w-full text-xs bg-black/40 text-zinc-200 p-3 rounded-xl border border-white/10 focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
            placeholder="Type your question or custom request here..."
          />

          {/* Quick chip prompts */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickPrompts.slice(0, 2).map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setUserQuery(chip)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/5 transition-colors"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
          >
            <span>Open in WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-[11px] text-zinc-500">
            Typical reply time: Under 15 mins
          </p>
        </div>

      </div>
    </div>
  );
};
