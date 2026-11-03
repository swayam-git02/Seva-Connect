import React from 'react';
import { ShieldCheck, HeartHandshake, Award, Users, Target } from 'lucide-react';

export const AboutPage = () => {
  const leadership = [
    {
      name: 'Adarsh Sharma',
      role: 'Founder & CEO',
      bio: 'Passionate about organizing the unorganized local services economy across India with transparent digital workflows.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Rohan Mehta',
      role: 'Head of Partner Operations',
      bio: 'Leading our on-ground police background verification, technician trade onboarding, and safety training programs.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Customer Experience Lead',
      bio: 'Dedicated to ensuring 100% satisfaction guarantee and seamless Dual-OTP security across every doorstep repair.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="py-16 bg-surface-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Mission section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            Our Purpose
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-dark tracking-tight">
            Building India’s Most Trusted Neighborhood Services Marketplace
          </h1>
          <p className="text-sm sm:text-base text-content-secondary leading-relaxed">
            Finding a reliable electrician or plumber in India should never be a gamble of random phone numbers, inflated estimates, or safety doubts. SevaConnect was created to bring standardized pricing, vetted trade professionals, and dual-code security right to your doorstep.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-content-dark mb-2">Safety & Verification</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Every partner is verified through government photo ID (Aadhar/PAN), criminal background verification, and trade skill assessment before their first customer job.
            </p>
          </div>

          <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-content-dark mb-2">Fair Pricing Standard</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              We publish clear, fixed upfront rate cards so you never have to haggle at your doorway or worry about hidden post-repair charges.
            </p>
          </div>

          <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
            <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-content-dark mb-2">Dignity for Tradespeople</h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              We empower local Indian technicians with digital tools, weekly direct bank payouts, health insurance access, and respect in their local communities.
            </p>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="pt-8 border-t border-slate-100">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
              Leadership
            </span>
            <h2 className="text-2xl font-bold text-content-dark mt-1">
              Meet the Team Behind SevaConnect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-20 w-20 rounded-full mx-auto object-cover border-2 border-brand-500/20 mb-4"
                />
                <h4 className="text-base font-bold text-content-dark">{member.name}</h4>
                <p className="text-xs font-semibold text-brand-600 mb-2">{member.role}</p>
                <p className="text-xs text-content-secondary leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
