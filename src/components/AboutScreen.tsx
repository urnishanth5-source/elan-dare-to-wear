import React, { useState } from 'react';
import { STORE_INFO } from '../data/products';
import { MapPin, Clock, Phone, Navigation, MessageCircle, Star, Sparkles, ShieldCheck } from 'lucide-react';

interface AboutScreenProps {
  openWhatsAppModal: (topic?: string) => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ openWhatsAppModal }) => {
  const [activeSubTab, setActiveSubTab] = useState<'story' | 'stores'>('story');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
        <button
          onClick={() => setActiveSubTab('story')}
          className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
            activeSubTab === 'story'
              ? 'bg-blue-600 text-white'
              : 'text-zinc-400 hover:text-white bg-white/5'
          }`}
        >
          Our Story
        </button>
        <button
          onClick={() => setActiveSubTab('stores')}
          className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
            activeSubTab === 'stores'
              ? 'bg-blue-600 text-white'
              : 'text-zinc-400 hover:text-white bg-white/5'
          }`}
        >
          Stores & Visit
        </button>
      </div>

      {/* Main Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Coimbatore's Fashion Destination</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          The elan. Story
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          A commitment to curated quality and honest pricing. We believe in providing premium style without the unnecessary markup, creating a haven for modern fashion in the heart of Coimbatore.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Store Aesthetic Image Card */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative rounded-2xl overflow-hidden bg-[#12151d] border border-white/[0.08] aspect-[4/3] sm:aspect-[16/10] shadow-2xl flex-1">
            <img
              src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1200&auto=format&fit=crop"
              alt="elan. Coimbatore Store Interior"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent" />
            
            {/* Overlay Badge */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 space-y-1 text-white">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" />
                  <span>4.9★ from 174 Google Reviews</span>
                  <span className="text-zinc-400 hidden sm:inline">• Curated for men & kids</span>
                </div>
                <p className="text-xs text-zinc-300">
                  Guided by our helpful staff to find your perfect fit in Sukrawarpet, Town Hall.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visit Us Card */}
        <div className="lg:col-span-5 rounded-2xl bg-[#12151d] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Visit Us
              </h2>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                Open Daily
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-300">
              {/* Address */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Sukrawarpet Store</p>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    {STORE_INFO.address}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-white">Business Hours</p>
                  <span className="text-xs text-zinc-400">{STORE_INFO.hours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Directions & WhatsApp */}
          <div className="space-y-2.5 pt-2">
            <a
              href={STORE_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>

            <button
              onClick={() => openWhatsAppModal('Store Visit Inquiry')}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
            >
              <MessageCircle className="w-4 h-4" />
              <span>+91 {STORE_INFO.phone}</span>
            </button>
          </div>

          {/* Guarantee pill */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Honest, transparent pricing with zero artificial markups.</span>
          </div>
        </div>

      </div>

      {/* Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#12151d] border border-white/[0.08] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h3 className="text-base font-bold text-white">Honest Pricing</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            By partnering directly with certified textile weavers and garment craftsmen, we bring you modern tailored garments without the middleman markup.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12151d] border border-white/[0.08] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h3 className="text-base font-bold text-white">Thoughtful Materials</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Breathable organic linens, 240gsm heavyweight combed cottons, and soft blends chosen specifically for comfort in tropical climates.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12151d] border border-white/[0.08] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h3 className="text-base font-bold text-white">In-Store Experience</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Whether you walk in or message on WhatsApp, our Sukrawarpet stylists take pride in finding the ideal size, fit, and color for your lifestyle.
          </p>
        </div>
      </div>

    </div>
  );
};
