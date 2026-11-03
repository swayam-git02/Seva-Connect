import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  Calendar,
  Grid,
  CreditCard,
  Star,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Admin Dashboard', icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
    { label: 'User Directory', icon: Users, path: ROUTES.ADMIN_USERS },
    { label: 'Service Providers', icon: Briefcase, path: ROUTES.ADMIN_PROVIDERS },
    { label: 'KYC Verifications', icon: ShieldCheck, path: ROUTES.ADMIN_VERIFICATIONS },
    { label: 'Platform Bookings', icon: Calendar, path: ROUTES.ADMIN_BOOKINGS },
    { label: 'Service Categories', icon: Grid, path: ROUTES.ADMIN_CATEGORIES },
    { label: 'Payments & Cut', icon: CreditCard, path: ROUTES.ADMIN_PAYMENTS },
    { label: 'Customer Reviews', icon: Star, path: ROUTES.ADMIN_REVIEWS },
    { label: 'Disputes & Support', icon: AlertTriangle, path: ROUTES.ADMIN_COMPLAINTS },
    { label: 'Market Analytics', icon: BarChart3, path: ROUTES.ADMIN_ANALYTICS },
    { label: 'Platform Settings', icon: Settings, path: ROUTES.ADMIN_SETTINGS },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-80px)] border-r border-slate-800">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white text-base">
            SC
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Admin Control</h4>
            <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Super Administrator</span>
          </div>
        </div>

        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit to Main Site</span>
        </button>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === ROUTES.ADMIN_DASHBOARD}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate(ROUTES.LOGIN);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
