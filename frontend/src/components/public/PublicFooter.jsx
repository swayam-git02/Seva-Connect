// Ye public site ka shared footer navigation aur support links dikhata hai.

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white text-lg">
                SC
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Seva<span className="text-brand-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your Trusted Local Service Partner. Connecting households across Delhi NCR & Faridabad with certified, background-verified home service professionals.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Dual OTP Code Protection</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/search?category=electrician" className="hover:text-white transition-colors">Electrician Services</Link></li>
              <li><Link to="/search?category=plumbing" className="hover:text-white transition-colors">Plumber & Pipe Repairs</Link></li>
              <li><Link to="/search?category=home-cleaning" className="hover:text-white transition-colors">Deep Home Cleaning</Link></li>
              <li><Link to="/search?category=ac-repair" className="hover:text-white transition-colors">AC Foam Jet Service</Link></li>
              <li><Link to="/search?category=carpentry" className="hover:text-white transition-colors">Carpentry & Lock Repair</Link></li>
              <li><Link to="/search?category=appliance-repair" className="hover:text-white transition-colors">Washing Machine & RO</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to={ROUTES.HOW_IT_WORKS} className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to={ROUTES.ABOUT} className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to={ROUTES.CONTACT} className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to={ROUTES.FAQ} className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to={ROUTES.PROVIDER_SIGNUP} className="hover:text-white transition-colors text-brand-400 font-medium">Join as Service Partner</Link></li>
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              NCR Support Desk
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Sector 15 Main Market, Faridabad, Haryana - 121007</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-400 shrink-0" />
                <span>+91 (0129) 482-9000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-400 shrink-0" />
                <span>support@sevaconnect.in</span>
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Operating Hours: 08:00 AM – 09:00 PM (All 7 Days)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SevaConnect Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
