// Ye admin screens ke liye shared wrapper hai, jisse management navigation consistently dikh sake.

import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import AdminSidebar from '../components/navigation/AdminSidebar';
import MobileNavigation from '../components/navigation/MobileNavigation';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { Bell, ShieldAlert } from 'lucide-react';

export const AdminLayout = () => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  // Authorize only admins
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ returnUrl: window.location.pathname }} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Admin Top Navigation Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-2">
            <span className="font-bold text-white text-lg tracking-tight">
              SevaConnect <span className="text-emerald-400 font-normal">| Admin Portal</span>
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
            PROD_NCR_V1
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Systems Normal</span>
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name}
              className="h-8 w-8 rounded-full border border-emerald-500 object-cover"
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-white">{user?.name}</p>
              <p className="text-[10px] text-emerald-400">Master Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex w-full pb-16 sm:pb-0">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 bg-slate-950 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
};

export default AdminLayout;
