// Ye public home page SevaConnect ke main discovery sections ko assemble karta hai.

import React from 'react';
import HeroSection from '../../components/public/HeroSection';
import ServiceCategoryGrid from '../../components/public/ServiceCategoryGrid';
import FeaturedProviders from '../../components/public/FeaturedProviders';
import HowItWorksSection from '../../components/public/HowItWorksSection';
import TrustSection from '../../components/public/TrustSection';
import ProviderCTA from '../../components/public/ProviderCTA';
import { Star, Quote } from 'lucide-react';

export const HomePage = () => {
  const genuineTestimonials = [
    {
      name: 'Pooja Bhatia',
      location: 'Sector 15, Faridabad',
      review: 'My split AC stopped cooling on a Sunday afternoon. Amit arrived within 40 minutes, showed his ID, and asked for the Starting Code before opening the outdoor unit. Very professional and fixed the gas leak smoothly!',
      service: 'AC Repair',
      rating: 5,
    },
    {
      name: 'Rajeev Singhal',
      location: 'Green Field Colony, Faridabad',
      review: 'We had a severe bathroom pipe leak behind the tiles. Ramesh was honest about the parts needed, gave a transparent estimate upfront, and I only gave the Ending Code after water was flowing cleanly.',
      service: 'Plumbing',
      rating: 5,
    },
    {
      name: 'Sunita Mehra',
      location: 'DLF Phase 3, Gurugram',
      review: 'Booked deep kitchen cleaning before Diwali. Sunita and her crew brought commercial scrubbers and left the exhaust and tiles sparkling. Best home service experience in NCR.',
      service: 'Home Cleaning',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Popular Categories */}
      <ServiceCategoryGrid limit={8} />

      {/* 3. Featured Verified Professionals */}
      <FeaturedProviders />

      {/* 4. How it works (4-Step process with Starting & Ending Code OTP) */}
      <HowItWorksSection />

      {/* 5. Trust and Safety Section */}
      <TrustSection />

      {/* 6. Customer Testimonials */}
      <section className="py-16 bg-surface-muted border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
              Real Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-content-dark tracking-tight mt-1">
              Trusted by NCR Homeowners
            </h2>
            <p className="mt-1.5 text-sm text-content-secondary">
              Read how our verified technicians and dual-OTP security deliver peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {genuineTestimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-surface-border p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-content-secondary italic leading-relaxed">
                    "{t.review}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-content-dark">{t.name}</h4>
                    <p className="text-content-muted">{t.location}</p>
                  </div>
                  <span className="font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full text-[11px]">
                    {t.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Provider Registration CTA */}
      <ProviderCTA />
    </div>
  );
};

export default HomePage;
