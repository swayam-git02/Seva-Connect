// Ye layout public website pages ko common navbar/footer ke saath dikhata hai.

import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import MobileNavigation from '../components/navigation/MobileNavigation';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-white selection:bg-brand-100 selection:text-brand-900 pb-16 sm:pb-0">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <MobileNavigation />
    </div>
  );
};

export default PublicLayout;
