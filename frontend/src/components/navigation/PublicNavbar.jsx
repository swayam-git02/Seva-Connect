import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Menu, X, User, ChevronDown, LogOut, ShieldCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { SERVICE_LOCATIONS } from '../../constants/serviceCategories';

export const PublicNavbar = () => {
  const { user, isAuthenticated, logout, isCustomer, isProvider, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Sector 15, Faridabad');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handlePortalRedirect = () => {
    if (isAdmin) navigate(ROUTES.ADMIN_DASHBOARD);
    else if (isProvider) navigate(ROUTES.PROVIDER_DASHBOARD);
    else navigate(ROUTES.CUSTOMER_DASHBOARD);
  };

  const navLinks = [
    { name: 'Services', path: ROUTES.SERVICES },
    { name: 'How It Works', path: ROUTES.HOW_IT_WORKS },
    { name: 'About', path: ROUTES.ABOUT },
    { name: 'Contact', path: ROUTES.CONTACT },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 1. Left: Brand Logo & Wordmark */}
          <div className="flex items-center gap-6">
            <Link to={ROUTES.HOME} className="flex items-center gap-3 group">
              <img
                src="/logo.svg"
                alt="SevaConnect"
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Location selector dropdown for desktop */}
            <div className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-content-secondary bg-surface-muted border border-surface-border rounded-full hover:bg-surface-subtle transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-500 shrink-0" />
                <span className="truncate max-w-[130px]">{selectedLocation}</span>
                <ChevronDown className="h-3 w-3 text-content-muted" />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-elevated border border-surface-border z-50 animate-in fade-in zoom-in-95">
                  <p className="px-3 py-1.5 text-[11px] font-semibold text-content-muted uppercase tracking-wider">
                    Select Your Area (Delhi-NCR)
                  </p>
                  <div className="max-h-56 overflow-y-auto">
                    {SERVICE_LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                          selectedLocation === loc
                            ? 'bg-brand-50 text-brand-700 font-semibold'
                            : 'text-content-secondary hover:bg-surface-subtle'
                        }`}
                      >
                        <span>{loc}</span>
                        {selectedLocation === loc && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-600 font-semibold'
                      : 'text-content-secondary hover:text-content-dark'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* 3. Right: CTA Actions & Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.PROVIDER_SIGNUP}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                >
                  <Briefcase className="h-3.5 w-3.5 text-brand-600" />
                  <span>Join as Professional</span>
                </Link>

                <Link
                  to={ROUTES.LOGIN}
                  className="px-3.5 py-2 text-sm font-medium text-content-dark hover:text-brand-600 transition-colors"
                >
                  Sign in
                </Link>

                <Link
                  to={ROUTES.SERVICES}
                  className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 active:bg-brand-700 rounded-lg shadow-sm transition-all"
                >
                  Book a Service
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-surface-border hover:bg-surface-muted transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full object-cover border border-brand-200"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-content-dark leading-tight">{user?.name}</p>
                    <p className="text-[10px] text-brand-600 font-medium capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-content-muted" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-2 shadow-elevated border border-surface-border z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-surface-border mb-1">
                      <p className="text-xs font-semibold text-content-dark">{user?.name}</p>
                      <p className="text-[11px] text-content-muted truncate">{user?.email}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        handlePortalRedirect();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-brand-700 hover:bg-brand-50 rounded-lg flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4 text-brand-600" />
                      <span>Go to My Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        logout();
                        navigate(ROUTES.HOME);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-state-error hover:bg-red-50 rounded-lg flex items-center gap-2 mt-1"
                    >
                      <LogOut className="h-4 w-4 text-state-error" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-content-secondary hover:bg-surface-subtle"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 py-2 px-3 bg-surface-muted rounded-lg text-xs text-content-secondary">
            <MapPin className="h-3.5 w-3.5 text-brand-500" />
            <span>Serving: {selectedLocation}</span>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-content-dark hover:bg-surface-subtle"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-surface-border space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 text-sm font-semibold text-content-dark border border-surface-border rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.PROVIDER_SIGNUP}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 text-sm font-semibold text-brand-700 bg-brand-50 rounded-lg"
                >
                  Join as Professional
                </Link>
                <Link
                  to={ROUTES.SERVICES}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-lg"
                >
                  Book a Service
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handlePortalRedirect();
                  }}
                  className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-brand-500 rounded-lg"
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                    navigate(ROUTES.HOME);
                  }}
                  className="block w-full text-center py-2.5 text-sm font-medium text-state-error border border-red-200 rounded-lg"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
