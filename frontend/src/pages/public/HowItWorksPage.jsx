import React, { useState } from 'react';
import { Search, Calendar, ShieldCheck, CheckCircle2, IndianRupee, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const HowItWorksPage = () => {
  const [activeRole, setActiveRole] = useState('customer'); // 'customer' | 'provider'

  return (
    <div className="py-12 bg-surface-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            The Safe Marketplace Process
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-dark tracking-tight mt-1">
            How SevaConnect Works
          </h1>
          <p className="mt-2 text-sm text-content-secondary leading-relaxed">
            Engineered from ground up to deliver safe, transparent, and verified home service delivery across Indian neighborhoods.
          </p>

          {/* Role switcher pills */}
          <div className="mt-6 inline-flex bg-surface-muted p-1 rounded-xl border border-surface-border">
            <button
              type="button"
              onClick={() => setActiveRole('customer')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeRole === 'customer'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-content-secondary hover:text-content-dark'
              }`}
            >
              For Home Customers
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('provider')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeRole === 'provider'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-content-secondary hover:text-content-dark'
              }`}
            >
              For Service Partners
            </button>
          </div>
        </div>

        {/* Customer Journey Process */}
        {activeRole === 'customer' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
                <span className="text-2xl font-black text-brand-600">01</span>
                <h3 className="text-base font-bold text-content-dark mt-2">
                  Browse & Choose Verified Technicians
                </h3>
                <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                  Search by specific problem (e.g. fan wobbling, split AC foam jet, tap leakage) or choose a highly recommended professional in your sector with real customer reviews.
                </p>
              </div>

              <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
                <span className="text-2xl font-black text-brand-600">02</span>
                <h3 className="text-base font-bold text-content-dark mt-2">
                  Select Convenient Date & Time Slot
                </h3>
                <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                  Choose a slot that works around your schedule. Receive an instant booking confirmation with your provider's name, phone number, and photo ID.
                </p>
              </div>

              <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200">
                <span className="text-2xl font-black text-emerald-700">03</span>
                <h3 className="text-base font-bold text-content-dark mt-2 flex items-center gap-2">
                  <span>Share Starting Code on Arrival</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </h3>
                <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                  When the technician arrives at your door, share your confidential 4-digit Starting Code. The technician inputs it on their phone to verify authorization and start work.
                </p>
              </div>

              <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200">
                <span className="text-2xl font-black text-emerald-700">04</span>
                <h3 className="text-base font-bold text-content-dark mt-2 flex items-center gap-2">
                  <span>Inspect Repair & Release Ending Code</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </h3>
                <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                  Test the repaired switch, check AC cooling, or inspect cleaning thoroughly. Once completely happy, share your 4-digit Ending Code to finalize the job and release payment.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                to={ROUTES.SERVICES}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
              >
                <span>Find a Professional Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
                <span className="text-2xl font-black text-brand-600">01</span>
                <h3 className="text-base font-bold text-content-dark mt-2">
                  Sign Up & Submit KYC Documents
                </h3>
                <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                  Provide your business name, trade experience, and upload Aadhar card and ITI / trade certifications. Our team completes verification within 24 business hours.
                </p>
              </div>

              <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
                <span className="text-2xl font-black text-brand-600">02</span>
                <h3 className="text-base font-bold text-content-dark mt-2">
                  Accept Real Job Requests in Your Area
                </h3>
                <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                  Receive customer booking requests directly in your provider dashboard. View customer location and job requirements before deciding to accept.
                </p>
              </div>

              <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
                <span className="text-2xl font-black text-brand-600">03</span>
                <h3 className="text-base font-bold text-content-dark mt-2">
                  Doorstep Verification via OTP
                </h3>
                <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                  Enter customer's Starting Code to begin the job. Once work is completed, enter the customer's Ending Code to instantly complete the job on the system.
                </p>
              </div>

              <div className="bg-surface-muted p-6 rounded-2xl border border-surface-border">
                <span className="text-2xl font-black text-brand-600">04</span>
                <h3 className="text-base font-bold text-content-dark mt-2">
                  Weekly Guaranteed Bank Payouts
                </h3>
                <p className="text-xs text-content-secondary mt-1.5 leading-relaxed">
                  Earnings are credited directly to your registered bank account every Tuesday morning without delays or excessive deductions.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                to={ROUTES.PROVIDER_SIGNUP}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
              >
                <span>Register as a Professional Partner</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HowItWorksPage;
