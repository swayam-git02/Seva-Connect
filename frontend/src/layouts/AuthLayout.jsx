// Ye layout login aur signup screens ke liye focused authentication frame provide karta hai.

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-surface-white">
      {/* Left Banner: Rich Photography & Value Props (Visible on Desktop/Tablet) */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        {/* Brand logo top left */}
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white text-lg shadow-md">
              SC
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Seva<span className="text-brand-400">Connect</span>
            </span>
          </Link>
        </div>

        {/* Testimonial & Benefits bottom left */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Dual-OTP Safe Service Guarantee</span>
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight">
            Safe, verified doorstep repairs for every Indian home.
          </h2>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Background-verified electricians, plumbers & technicians</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Transparent fixed rate cards with no surprise charges</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Starting & Ending Code security to protect your payment</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 pt-4 border-t border-slate-800">
            Trusted by over 15,000+ happy households across Faridabad, Gurugram & Delhi NCR.
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-16 xl:px-24">
        {/* Mobile brand header */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-surface-border">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white text-base">
              SC
            </div>
            <span className="text-lg font-bold text-content-dark">
              Seva<span className="text-brand-500">Connect</span>
            </span>
          </Link>
          <Link to={ROUTES.HOME} className="text-xs font-medium text-brand-600">
            ← Home
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
