// Ye provider portal ka common layout hai, jahan provider apne jobs, services aur earnings screens access karta hai.

import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { AlertTriangle, UserCheck } from 'lucide-react';
import PublicNavbar from '../components/navigation/PublicNavbar';
import ProviderSidebar from '../components/navigation/ProviderSidebar';
import MobileNavigation from '../components/navigation/MobileNavigation';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export const ProviderLayout = () => {
  const { user, isAuthenticated, isProvider, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  // Client-side guard for service provider
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ returnUrl: window.location.pathname }} />;
  }

  // Agar user customer ke roop mein logged in hai, toh provider actions par 403 error se bachane ke liye clear message dikhate hain
  if (!isProvider) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-muted">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 max-w-md w-full shadow-card text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-content-dark">Partner Portal Access</h2>
            <p className="text-xs text-content-secondary leading-relaxed">
              You are currently logged in with a Customer account (<strong>{user?.name || user?.email}</strong>).
              The Provider Portal and service actions (uploading photos, verifying OTP codes) require a registered Service Partner account.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Link to={ROUTES.LOGIN} state={{ role: 'provider', returnUrl: window.location.pathname }}>
                <Button variant="primary" size="sm" className="w-full" leftIcon={UserCheck}>
                  Sign in as Provider Partner
                </Button>
              </Link>
              <Link to={ROUTES.CUSTOMER_DASHBOARD}>
                <Button variant="outline" size="sm" className="w-full">
                  Go to Customer Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-muted">
      <PublicNavbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 sm:pb-0">
        <div className="hidden md:block">
          <ProviderSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
};

export default ProviderLayout;
