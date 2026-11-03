import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Calendar,
  Heart,
  MessageSquare,
  Bell,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

export const CustomerSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard, path: ROUTES.CUSTOMER_DASHBOARD },
    { label: 'Find a Service', icon: Search, path: ROUTES.CUSTOMER_SERVICES },
    { label: 'My Bookings', icon: Calendar, path: ROUTES.CUSTOMER_BOOKINGS },
    { label: 'Favorite Pros', icon: Heart, path: ROUTES.CUSTOMER_FAVORITES },
    { label: 'Messages', icon: MessageSquare, path: ROUTES.CUSTOMER_MESSAGES },
    { label: 'Notifications', icon: Bell, path: ROUTES.CUSTOMER_NOTIFICATIONS },
    { label: 'My Profile', icon: User, path: ROUTES.CUSTOMER_PROFILE },
    { label: 'Settings', icon: Settings, path: ROUTES.CUSTOMER_SETTINGS },
    { label: 'Help & Support', icon: HelpCircle, path: ROUTES.CUSTOMER_HELP },
  ];

  return (
    <aside className="w-64 bg-white border-r border-surface-border flex flex-col shrink-0 min-h-[calc(100vh-80px)]">
      {/* Customer summary card */}
      <div className="p-5 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={user?.name}
            className="h-11 w-11 rounded-full object-cover border-2 border-brand-500/20"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-content-dark truncate">{user?.name || 'Customer'}</h4>
            <p className="text-xs text-content-muted truncate">{user?.city || 'Faridabad'}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Navigation links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === ROUTES.CUSTOMER_DASHBOARD}
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
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
