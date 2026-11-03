// Ye provider portal ka common layout hai, jahan provider apne jobs, services aur earnings screens access karta hai.

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';
import ProviderSidebar from '../components/navigation/ProviderSidebar';
import MobileNavigation from '../components/navigation/MobileNavigation';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

export const ProviderLayout = () => {
  const { isAuthenticated, isProvider, loading } = useAuth();

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
