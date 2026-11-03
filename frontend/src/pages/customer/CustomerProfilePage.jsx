import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, ShieldCheck, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export const CustomerProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content-dark tracking-tight">
            Customer Profile
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Manage your personal contact info and default doorstep service addresses.
          </p>
        </div>

        <Link to={ROUTES.CUSTOMER_PROFILE_EDIT}>
          <Button variant="primary" size="sm" leftIcon={Edit3}>
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
          alt={user?.name}
          className="h-24 w-24 rounded-2xl object-cover border-2 border-brand-500/20 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="text-xl font-bold text-content-dark">{user?.name || 'Customer'}</h2>
          <p className="text-xs text-brand-600 font-semibold">{user?.email}</p>
          <p className="text-xs text-content-muted">{user?.phone || '+91 98765 43210'}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified Mobile
            </span>
            <span className="text-[11px] text-content-muted bg-slate-100 px-2.5 py-0.5 rounded-full">
              Member since Nov 2025
            </span>
          </div>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-content-dark flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-600" />
            <span>Saved Service Address (Default)</span>
          </h3>
          <Link to={ROUTES.CUSTOMER_PROFILE_EDIT} className="text-xs font-semibold text-brand-600 hover:underline">
            Update
          </Link>
        </div>

        <div className="p-4 bg-surface-muted rounded-xl border border-slate-200 text-xs text-content-secondary space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-content-dark">Home (Faridabad)</span>
            <span className="bg-brand-100 text-brand-800 text-[10px] font-bold px-1.5 py-0.2 rounded">PRIMARY</span>
          </div>
          <p className="text-content-dark font-medium">
            {user?.address || 'House 412, Sector 15 Main Market, Faridabad, Haryana - 121007'}
          </p>
          <p className="text-content-muted">Landmark: Near HDFC Bank Sector 15 branch</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
