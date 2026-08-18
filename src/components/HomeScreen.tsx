import React from 'react';
import { STORE_INFO, REVIEWS, Product } from '../data/products';
import { ProductCard } from './ProductCard';
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Navigation, 
  ShoppingBag, 
  Tag, 
  Users, 
  Check, 
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface HomeScreenProps {
  products: Product[];
  loading: boolean;
  currency: 'INR' | 'USD';
  setActiveTab: (tab: string) => void;
  openWhatsAppModal: (productName?: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartProductIds: string[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  loading,
  currency,
  setActiveTab,
  openWhatsAppModal,
  onProductClick,
  onAddToCart,
  cartProductIds,
}) => {
  // Get top 4 trending / featured products from the dynamic database
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pt-4 sm:pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Ready-Made Fashion · 2024 Collection</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
            Ready-made garments.<br />
            <span className="text-zinc-300">Modern tailored fits.</span><br />
            <span className="text-blue-500">Honest prices</span> in Coimbatore.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed font-normal">
            Men's & kids' wear curated for everyday comfort and summer trends. Premium cottons, breathable linens, and durable children's styles right on Sukrawarpet Street.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('collections');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openWhatsAppModal('General Inquiry')}
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us</span>
            </button>
          </div>

          {/* Trust proof */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span className="font-bold">4.9 / 5</span>
              <span className="text-zinc-400 font-normal">· 174 Google Reviews</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free trials & sizing in-store</span>
            </div>
          </div>
        </div>

        {/* Right Hero Visual Banner */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#12151d] shadow-2xl group aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop"
              alt="elan. Coimbatore hero fashion"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/40 to-transparent" />

            {/* Floating Top Tag */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/15">
                Featured Drop · Summer 24
              </span>
            </div>

            {/* Bottom Card Content */}
            <div className="absolute bottom-6 left-6 right-6 space-y-2 z-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Linen & Drop Shoulder Basics
              </h3>
              <p className="text-xs text-zinc-300">
                Crafted for lightweight, all-day ease in Coimbatore's climate.
              </p>
              <button
                onClick={() => {
                  setActiveTab('summer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 pt-1 uppercase tracking-wider"
              >
                <span>View Summer Edit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* 2. VALUE PROPOSITION ROW */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl bg-[#12151d] border border-white/[0.08] flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Star className="w-4 h-4 fill-blue-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">4.9★ Rating</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">174 Google reviews</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#12151d] border border-white/[0.08] flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Curated Lines</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Men's & Kids' ready-made</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#12151d] border border-white/[0.08] flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Honest Pricing</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Transparent value always</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#12151d] border border-white/[0.08] flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">Store Guidance</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">Walk in, we find your fit</p>
          </div>
        </div>

      </section>

      {/* 3. 4 MAIN CATEGORIES DIRECT ACCESS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/[0.08] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Curated Wardrobe</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            Four signature lines designed for modern lifestyle and warm climates in Coimbatore.
          </p>
        </div>

        {/* 4 Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: T-Shirts */}
          <div 
            onClick={() => {
              setActiveTab('tshirts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer rounded-2xl bg-[#12151d] border border-white/[0.08] hover:border-white/20 overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div className="aspect-[4/4] overflow-hidden bg-[#181c26] relative">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
                alt="T-Shirts Category"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151d] via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded text-zinc-300 border border-white/10">
                Heavyweight 240gsm
              </span>
            </div>
            <div className="p-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  T-Shirts
                </h3>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-zinc-400 mt-1">Everyday basics & drop shoulder fits.</p>
            </div>
          </div>

          {/* Card 2: Shirts and Pant */}
          <div 
            onClick={() => {
              setActiveTab('shirts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer rounded-2xl bg-[#12151d] border border-white/[0.08] hover:border-white/20 overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div className="aspect-[4/4] overflow-hidden bg-[#181c26] relative">
              <img
                src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop"
                alt="Shirts and Pant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151d] via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded text-zinc-300 border border-white/10">
                100% Pure Linen
              </span>
            </div>
            <div className="p-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Shirts and Pant
                </h3>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-zinc-400 mt-1">Breezy comfort for warm Coimbatore days.</p>
            </div>
          </div>

          {/* Card 3: Summer Collection */}
          <div 
            onClick={() => {
              setActiveTab('summer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer rounded-2xl bg-[#12151d] border border-white/[0.08] hover:border-white/20 overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div className="aspect-[4/4] overflow-hidden bg-[#181c26] relative">
              <img
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop"
                alt="Summer Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151d] via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-blue-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded text-white shadow-xs">
                Editorial Drop
              </span>
            </div>
            <div className="p-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Summer Collection
                </h3>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-zinc-400 mt-1">Fresh, airy styles curated for the season.</p>
            </div>
          </div>

          {/* Card 4: Kids' Wear */}
          <div 
            onClick={() => {
              setActiveTab('kids');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer rounded-2xl bg-[#12151d] border border-white/[0.08] hover:border-white/20 overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div className="aspect-[4/4] overflow-hidden bg-[#181c26] relative">
              <img
                src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop"
                alt="Kids' Wear"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12151d] via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-amber-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded text-black">
                Ages 1 - 12Y
              </span>
            </div>
            <div className="p-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  Kids' Wear
                </h3>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-zinc-400 mt-1">Cute, gentle & durable for active little ones.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC PRODUCTS PREVIEW (Direct from Supabase) */}
      {featuredProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">In-Store Now</span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Featured Highlights
              </h2>
            </div>
            <button
              onClick={() => {
                setActiveTab('collections');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                currency={currency}
                onInquire={() => onProductClick(p)}
                onQuickView={() => onProductClick(p)}
                onAddToCart={onAddToCart}
                isInCart={cartProductIds.includes(p.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. REVIEWS SECTION */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Loved by Coimbatore Shoppers
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real feedback verified on Google Maps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.slice(0, 3).map((rev) => (
            <div 
              key={rev.id}
              className="p-6 rounded-2xl bg-[#12151d] border border-white/[0.08] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 font-normal leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {rev.initials}
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white">{rev.name}</span>
                  <p className="text-[10px] text-zinc-500">{rev.source} · {rev.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VISIT US SECTION */}
      <section>
        <div className="rounded-2xl bg-[#12151d] border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Sukrawarpet, Coimbatore
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Drop by the store in Town Hall
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                Come browse in comfort — our friendly staff will happily assist you with custom sizes, trials, and kids' apparel.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Store Address</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    1158, Sukrawarpet St, opp. Rajendrasuri Jain Trust, Coimbatore 641001
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Business Hours</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Open daily 10:00 AM – 9:30 PM
                  </p>
                  <p className="text-[10px] text-emerald-400 font-medium mt-1">Open 7 days a week</p>
                </div>
              </div>
            </div>

            {/* Right Action Stack */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
              
              {/* WhatsApp Card */}
              <button
                onClick={() => openWhatsAppModal('Direct Store Chat')}
                className="w-full p-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-between group shadow-lg shadow-emerald-950"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/20 text-white flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      WhatsApp Store
                    </h4>
                    <p className="text-xs text-emerald-100 font-semibold">
                      +91 {STORE_INFO.phone}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Get Directions Card */}
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-between group shadow-lg shadow-blue-600/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-black/20 text-white flex items-center justify-center">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Google Maps
                    </h4>
                    <p className="text-xs text-blue-100">
                      Get Turn-by-Turn Directions
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Trust Badge */}
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>4.9★ Average Rating · 174 Reviews</span>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
