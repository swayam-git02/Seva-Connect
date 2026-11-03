// Ye section platform ke trust aur safety benefits ko visitor ke liye summarize karta hai.

import React from 'react';
import { ShieldCheck, Lock, Award, Clock, AlertCircle } from 'lucide-react';

export const TrustSection = () => {
  const trustPoints = [
    {
      icon: ShieldCheck,
      title: '100% Background-Verified',
      description: 'Every professional undergoes strict government ID (Aadhar/PAN), criminal history check, and trade skill testing.',
    },
    {
      icon: Lock,
      title: 'Dual-OTP Anti-Fraud Security',
      description: 'Technicians cannot start or close your booking without your personal Starting Code and Ending Code OTPs.',
    },
    {
      icon: Award,
      title: '30-Day Service Warranty',
      description: 'If a repaired appliance, switchboard, or tap develops the same issue within 30 days, we fix it for free.',
    },
    {
      icon: Clock,
      title: 'On-Time Arrival Guarantee',
      description: 'Track your technician in real time. If we arrive late without prior heads-up, get ₹100 discount on your bill.',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Trust & Safety First
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Why Delhi NCR Families Rely on SevaConnect
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Unlike unverified local classifieds or roadside contractors, we hold full accountability for every repair done in your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dual Code Safety Banner Warning as requested in master prompt */}
        <div className="mt-12 bg-emerald-950/60 border border-emerald-700/50 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-bold text-white">
              The SevaConnect Safety Promise
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-emerald-200 leading-relaxed">
              <strong>“Never share your Ending Code before the service has been completed.”</strong> The Ending Code releases payment to the provider. Retaining it until your thorough inspection ensures you always receive 100% satisfactory work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
