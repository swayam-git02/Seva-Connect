// Ye home page ka hero section hai, jo visitor ko service search ya next action tak guide karta hai.

import React from 'react';
import ServiceSearch from './ServiceSearch';
import ImageWithFallback from '../common/ImageWithFallback';
import { HERO_IMAGE } from '../../utils/imageHelpers';
import { ShieldCheck, Star, Users, CheckCircle } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-surface-white to-surface-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          {/* Trust badge pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/70 border border-brand-200 text-xs font-semibold text-brand-800 animate-in fade-in">
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            <span>Faridabad & Delhi NCR's Certified Service Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-content-dark tracking-tight leading-[1.15]">
            Find trusted professionals for your home.
          </h1>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed max-w-2xl mx-auto">
            Discover local experts for repairs, cleaning, and everyday home services. Fast doorstep arrivals with verified Starting & Ending OTP protection.
          </p>

          {/* Search bar component */}
          <div className="pt-4">
            <ServiceSearch />
          </div>
        </div>

        {/* Hero Visual Banner & Key Stats */}
        <div className="mt-12 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-surface-border aspect-[16/8] sm:aspect-[21/9]">
            <ImageWithFallback
              src={HERO_IMAGE}
              alt="SevaConnect verified service professionals at work in Indian home"
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Subtle Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            {/* Floating overlay stats on the hero image */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-lg">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Background Verification</p>
                  <p className="text-sm font-bold text-white">100% Police & Skill Checked</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-lg">
                <div className="h-9 w-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Star className="h-5 w-5 fill-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Customer Rating</p>
                  <p className="text-sm font-bold text-white">4.87 / 5 (12,400+ reviews)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-lg">
                <div className="h-9 w-9 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-300">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Transparent Pricing</p>
                  <p className="text-sm font-bold text-white">Fixed Rates, No Hidden Fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
