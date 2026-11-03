import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Wrench,
  Calendar,
  IndianRupee,
  Star,
  UserCheck,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const ProviderSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Partner Dashboard', icon: LayoutDashboard, path: ROUTES.PROVIDER_DASHBOARD },
    { label: 'Booking Requests', icon: Inbox, path: ROUTES.PROVIDER_BOOKINGS },
    { label: 'My Services & Rates', icon: Wrench, path: ROUTES.PROVIDER_SERVICES },
    { label: 'Calendar / Slots', icon: Calendar, path: ROUTES.PROVIDER_CALENDAR },
    { label: 'My Customers', icon: Users, path: ROUTES.PROVIDER_CUSTOMERS },
    { label: 'Earnings & Revenue', icon: IndianRupee, path: ROUTES.PROVIDER_EARNINGS },
    { label: 'Withdraw & Payouts', icon: CreditCard, path: ROUTES.PROVIDER_PAYOUTS },
    { label: 'Customer Reviews', icon: Star, path: ROUTES.PROVIDER_REVIEWS },
    { label: 'KYC & Verification', icon: UserCheck, path: ROUTES.PROVIDER_VERIFICATION },
    { label: 'Business Profile', icon: ShieldCheck, path: ROUTES.PROVIDER_PROFILE },
    { label: 'Settings', icon: Settings, path: ROUTES.PROVIDER_SETTINGS },
    { label: 'Partner Help', icon: HelpCircle, path: ROUTES.PROVIDER_HELP },
  ];

  return (
    <aside className="w-64 bg-white border-r border-surface-border flex flex-col shrink-0 min-h-[calc(100vh-80px)]">
      {/* Provider brand & status */}
      <div className="p-5 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
            alt={user?.name}
            className="h-11 w-11 rounded-full object-cover border-2 border-brand-500"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-content-dark truncate">{user?.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-brand-700">Online & Ready</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>View Public Marketplace</span>
        </button>
      </div>

      {/* Nav items */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === ROUTES.PROVIDER_DASHBOARD}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500 text-white font-semibold shadow-sm'
                    : 'text-content-secondary hover:text-content-dark hover:bg-surface-subtle'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-surface-border">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate(ROUTES.LOGIN);
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-state-error hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out Partner</span>
        </button>
      </div>
    </aside>
  );
};

export default ProviderSidebar;
