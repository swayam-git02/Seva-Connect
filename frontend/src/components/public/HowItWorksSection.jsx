// Ye section booking se service completion tak ka simple customer workflow samjhata hai.

import React from 'react';
import { Search, CalendarCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Service & Technician',
      description: 'Select your required service category, browse transparent price cards, and pick verified pros near you.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Pick Date & Slot',
      description: 'Choose your preferred date and time slot. Enter your home address and confirm your booking instantly.',
      icon: CalendarCheck,
    },
    {
      step: '03',
      title: 'Share Starting Code on Arrival',
      description: 'When the technician reaches your door, share your confidential 4-digit Starting Code to initiate work safely.',
      icon: ShieldCheck,
      highlight: true,
    },
    {
      step: '04',
      title: 'Satisfied? Release Ending Code',
      description: 'Inspect the completed repair. Only when satisfied, share the Ending Code to finalize and release payment.',
      icon: CheckCircle2,
      highlight: true,
    },
  ];

  return (
    <section className="py-20 bg-surface-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-content-dark tracking-tight mt-1">
            How SevaConnect Protects Your Home
          </h2>
          <p className="mt-2 text-sm text-content-secondary leading-relaxed">
            Our proprietary Dual-Code verification ensures work only begins when you confirm and only closes when you are happy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`relative p-6 rounded-2xl border transition-all duration-200 ${
                  item.highlight
                    ? 'bg-brand-50/40 border-brand-200 shadow-card'
                    : 'bg-white border-surface-border shadow-subtle'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                      item.highlight
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-subtle text-brand-600'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-300">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-content-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {item.description}
                </p>

                {item.highlight && (
                  <div className="mt-4 pt-3 border-t border-brand-100 flex items-center gap-1.5 text-[11px] font-semibold text-brand-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Protected by SevaShield</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
