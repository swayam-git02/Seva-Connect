// Ye call-to-action qualified service professionals ko provider signup workflow tak guide karta hai.

import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const ProviderCTA = () => {
  return (
    <section className="py-16 bg-brand-50/50 border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Ambient circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-white">
              <Briefcase className="h-3.5 w-3.5" />
              <span>For Electricians, Plumbers & Technicians</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Grow your local service business with SevaConnect.
            </h2>

            <p className="text-sm sm:text-base text-brand-100 leading-relaxed">
              Join 500+ verified professionals in Faridabad and Delhi NCR. Get genuine job requests, direct bank settlements every Tuesday, and zero commission on your first 10 jobs.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-brand-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>Weekly Bank Direct Deposit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>Choose Your Service Sectors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>Keep 100% of Cash Tips</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to={ROUTES.PROVIDER_SIGNUP}
              className="inline-flex items-center gap-2.5 px-6 py-4 bg-white text-brand-800 hover:bg-brand-50 font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95"
            >
              <span>Register as Partner</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderCTA;
