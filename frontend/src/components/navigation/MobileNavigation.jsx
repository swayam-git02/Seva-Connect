import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Calendar, User, LayoutDashboard, Wrench, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

export const MobileNavigation = () => {
  const { isCustomer, isProvider, isAdmin } = useAuth();

  let navItems = [
    { label: 'Home', icon: Home, path: ROUTES.HOME },
    { label: 'Services', icon: Search, path: ROUTES.SERVICES },
    { label: 'How It Works', icon: Calendar, path: ROUTES.HOW_IT_WORKS },
    { label: 'Sign In', icon: User, path: ROUTES.LOGIN },
  ];

  if (isCustomer) {
    navItems = [
      { label: 'Home', icon: Home, path: ROUTES.HOME },
      { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.CUSTOMER_DASHBOARD },
      { label: 'Bookings', icon: Calendar, path: ROUTES.CUSTOMER_BOOKINGS },
      { label: 'Profile', icon: User, path: ROUTES.CUSTOMER_PROFILE },
    ];
  } else if (isProvider) {
    navItems = [
      { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.PROVIDER_DASHBOARD },
      { label: 'Bookings', icon: Calendar, path: ROUTES.PROVIDER_BOOKINGS },
      { label: 'My Services', icon: Wrench, path: ROUTES.PROVIDER_SERVICES },
      { label: 'Profile', icon: User, path: ROUTES.PROVIDER_PROFILE },
    ];
  } else if (isAdmin) {
    navItems = [
      { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
      { label: 'Users', icon: User, path: ROUTES.ADMIN_USERS },
      { label: 'Providers', icon: Wrench, path: ROUTES.ADMIN_PROVIDERS },
      { label: 'KYC Verif', icon: ShieldCheck, path: ROUTES.ADMIN_VERIFICATIONS },
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-border py-2 px-3 sm:hidden shadow-elevated">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-brand-600' : 'text-content-muted hover:text-content-dark'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
