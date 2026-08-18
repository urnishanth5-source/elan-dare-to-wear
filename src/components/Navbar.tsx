import React from 'react';
import { ShoppingBag, MessageCircle, Menu, X } from 'lucide-react';
import { STORE_INFO } from '../data/products';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  currency: 'INR' | 'USD';
  toggleCurrency: () => void;
  openWhatsAppModal: (productName?: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, cartCount, openCart, currency, toggleCurrency, openWhatsAppModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'collections', label: 'Collections' },
    { id: 'tshirts', label: 'T-Shirts' },
    { id: 'shirts', label: 'Shirts' },
    { id: 'pants', label: 'Pants' },
    { id: 'summer', label: 'Summer' },
    { id: 'kids', label: 'Kids' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 group focus:outline-none" aria-label="elan. home">
          <img src="/elan-logo.svg" alt="elan Dare to Wear" className="w-24 sm:w-28 h-auto object-contain" />
        </button>

        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`transition-all duration-150 relative py-1.5 focus:outline-none ${isActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`}>
                {item.label}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-full" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={toggleCurrency} className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 transition-colors uppercase tracking-wider" title="Toggle Currency">
            {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>
          <button onClick={() => openWhatsAppModal()} className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded-full transition-all duration-200 bg-white/5 hover:bg-white/10">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stylist</span>
          </button>
          <button onClick={openCart} aria-label="Shopping Bag" className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors focus:outline-none">
            <ShoppingBag className="w-4 h-4 stroke-[2]" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-scaleIn shadow-xs">{cartCount}</span>}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-zinc-400 hover:text-white focus:outline-none" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1118] border-b border-white/10 px-6 py-5 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} className={`text-left py-1.5 ${activeTab === 'home' ? 'text-blue-400' : 'text-zinc-300'}`}>Home</button>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} className={`text-left py-1.5 ${activeTab === item.id ? 'text-blue-400' : 'text-zinc-300'}`}>{item.label}</button>
            ))}
          </div>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <button onClick={() => { openWhatsAppModal(); setMobileMenuOpen(false); }} className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Store (+91 {STORE_INFO.phone})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
