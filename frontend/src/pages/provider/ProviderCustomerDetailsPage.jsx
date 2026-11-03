import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const ProviderCustomerDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={ROUTES.PROVIDER_CUSTOMERS} className="p-2 rounded-lg hover:bg-slate-200 transition-colors">
          <ArrowLeft className="h-5 w-5 text-content-secondary" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-content-dark">Customer History Details</h1>
          <p className="text-xs text-content-secondary">Past jobs completed for Adarsh Sharma</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-content-dark">Adarsh Sharma</h2>
            <p className="text-xs text-content-secondary">House 412, Sector 15 Main Market, Faridabad</p>
          </div>
          <a
            href="tel:+919876543210"
            className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Call Customer</span>
          </a>
        </div>

        <h3 className="text-sm font-bold text-content-dark pt-2">Service History</h3>
        <div className="space-y-3">
          <div className="p-3 bg-surface-muted rounded-xl border border-slate-200 text-xs flex justify-between items-center">
            <div>
              <p className="font-semibold text-content-dark">Ceiling Fan Installation & MCB Check (#SC-8921)</p>
              <p className="text-content-muted">21 Oct 2026 • Status: In Progress</p>
            </div>
            <span className="font-bold text-brand-700">₹439</span>
          </div>

          <div className="p-3 bg-surface-muted rounded-xl border border-slate-200 text-xs flex justify-between items-center">
            <div>
              <p className="font-semibold text-content-dark">Switchboard Socket Repair (#SC-7210)</p>
              <p className="text-content-muted">05 Sep 2026 • Status: Completed & Verified</p>
            </div>
            <span className="font-bold text-brand-700">₹299</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCustomerDetailsPage;
