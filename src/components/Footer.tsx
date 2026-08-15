import React from 'react';
import { STORE_INFO } from '../data/products';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  openWhatsAppModal: (topic?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, openWhatsAppModal }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080c] text-zinc-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/[0.08]">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-white">elan.</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              Men's & Kids' Ready-made Garments — honest prices and curated quality in Coimbatore.
            </p>
            <div className="text-xs text-zinc-400 space-y-2 pt-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                <span>{STORE_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: +91 {STORE_INFO.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{STORE_INFO.hours}</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">4 Categories</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><button onClick={() => { setActiveTab('tshirts'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">T-Shirts & Drop Shoulders</button></li>
              <li><button onClick={() => { setActiveTab('shirts'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Linen Shirts & Pants</button></li>
              <li><button onClick={() => { setActiveTab('summer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Summer Collection</button></li>
              <li><button onClick={() => { setActiveTab('kids'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">Kids' Wear</button></li>
              <li><button onClick={() => { setActiveTab('collections'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-white transition-colors">All Collections</button></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Support & Store</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Need size recommendations or want to hold pieces at Sukrawarpet before visiting? Chat directly with our store team.
            </p>
            <button
              onClick={() => openWhatsAppModal('Store Visit & Size Assistance')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-950"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Store (+91 {STORE_INFO.phone})</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span>© 2024 elan. Coimbatore.</span>
            <span>•</span>
            <span>Honest pricing, curated quality.</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400 text-xs">
            <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">Our Store</button>
            <button onClick={() => openWhatsAppModal('Exchange Policy')} className="hover:text-white transition-colors">Exchange Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
