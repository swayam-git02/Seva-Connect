// Ye SevaConnect frontend ka central route map hai.
// Ismein public pages aur customer/provider portal ke alag navigation paths jode gaye hain.

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from './constants/routes';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import CustomerLayout from './layouts/CustomerLayout';
import ProviderLayout from './layouts/ProviderLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import SearchResultsPage from './pages/public/SearchResultsPage';
import PublicProviderProfilePage from './pages/public/PublicProviderProfilePage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import FAQPage from './pages/public/FAQPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import CustomerSignupPage from './pages/auth/CustomerSignupPage';
import ProviderSignupPage from './pages/auth/ProviderSignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Customer Pages
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import FindServicePage from './pages/customer/FindServicePage';
import CustomerSearchResultsPage from './pages/customer/CustomerSearchResultsPage';
import CustomerProviderProfilePage from './pages/customer/CustomerProviderProfilePage';
import BookingCreatePage from './pages/customer/BookingCreatePage';
import BookingSuccessPage from './pages/customer/BookingSuccessPage';
import CustomerBookingsPage from './pages/customer/CustomerBookingsPage';
import CustomerBookingDetailsPage from './pages/customer/CustomerBookingDetailsPage';
import FavoritesPage from './pages/customer/FavoritesPage';
import CustomerMessagesPage from './pages/customer/CustomerMessagesPage';
import CustomerNotificationsPage from './pages/customer/CustomerNotificationsPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';
import EditCustomerProfilePage from './pages/customer/EditCustomerProfilePage';
import CustomerSettingsPage from './pages/customer/CustomerSettingsPage';
import CustomerHelpPage from './pages/customer/CustomerHelpPage';

// Provider Pages
import ProviderDashboardPage from './pages/provider/ProviderDashboardPage';
import ProviderOnboardingPage from './pages/provider/ProviderOnboardingPage';
import ProviderProfilePage from './pages/provider/ProviderProfilePage';
import ProviderServicesPage from './pages/provider/ProviderServicesPage';
import AddProviderServicePage from './pages/provider/AddProviderServicePage';
import EditProviderServicePage from './pages/provider/EditProviderServicePage';
import ProviderBookingsPage from './pages/provider/ProviderBookingsPage';
import ProviderBookingDetailsPage from './pages/provider/ProviderBookingDetailsPage';
import ProviderCalendarPage from './pages/provider/ProviderCalendarPage';
import ProviderCustomersPage from './pages/provider/ProviderCustomersPage';
import ProviderCustomerDetailsPage from './pages/provider/ProviderCustomerDetailsPage';
import ProviderMessagesPage from './pages/provider/ProviderMessagesPage';
import ProviderNotificationsPage from './pages/provider/ProviderNotificationsPage';
import ProviderReviewsPage from './pages/provider/ProviderReviewsPage';
import ProviderEarningsPage from './pages/provider/ProviderEarningsPage';
import ProviderAnalyticsPage from './pages/provider/ProviderAnalyticsPage';
import ProviderVerificationPage from './pages/provider/ProviderVerificationPage';
import ProviderPayoutsPage from './pages/provider/ProviderPayoutsPage';

// NotFound
import NotFoundPage from './pages/NotFoundPage';

// Ye helper har naya page khulne par screen ko top par le aata hai,
// taaki user purane page ki scroll position par na rahe.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Ye main component URL ke hisaab se sahi layout aur page render karta hai.
// Public routes kisi bhi visitor ke liye hain, jabki portal layouts apne role ke screens group karte hain.
export const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SERVICES} element={<ServicesPage />} />
          <Route path={ROUTES.SEARCH} element={<SearchResultsPage />} />
          <Route path={ROUTES.PUBLIC_PROVIDER_PROFILE} element={<PublicProviderProfilePage />} />
          <Route path={ROUTES.HOW_IT_WORKS} element={<HowItWorksPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.FAQ} element={<FAQPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<CustomerSignupPage />} />
          <Route path={ROUTES.PROVIDER_SIGNUP} element={<ProviderSignupPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* Customer Portal Routes */}
        <Route path={ROUTES.CUSTOMER_ROOT} element={<CustomerLayout />}>
          <Route index element={<Navigate to={ROUTES.CUSTOMER_DASHBOARD} replace />} />
          <Route path="dashboard" element={<CustomerDashboardPage />} />
          <Route path="services" element={<FindServicePage />} />
          <Route path="search" element={<CustomerSearchResultsPage />} />
          <Route path="providers/:id" element={<CustomerProviderProfilePage />} />
          <Route path="book/:providerId" element={<BookingCreatePage />} />
          <Route path="booking/success" element={<BookingSuccessPage />} />
          <Route path="bookings" element={<CustomerBookingsPage />} />
          <Route path="bookings/:id" element={<CustomerBookingDetailsPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="messages" element={<CustomerMessagesPage />} />
          <Route path="notifications" element={<CustomerNotificationsPage />} />
          <Route path="profile" element={<CustomerProfilePage />} />
          <Route path="profile/edit" element={<EditCustomerProfilePage />} />
          <Route path="settings" element={<CustomerSettingsPage />} />
          <Route path="help" element={<CustomerHelpPage />} />
        </Route>

        {/* Provider Portal Routes */}
        <Route path={ROUTES.PROVIDER_ROOT} element={<ProviderLayout />}>
          <Route index element={<Navigate to={ROUTES.PROVIDER_DASHBOARD} replace />} />
          <Route path="dashboard" element={<ProviderDashboardPage />} />
          <Route path="onboarding" element={<ProviderOnboardingPage />} />
          <Route path="profile" element={<ProviderProfilePage />} />
          <Route path="profile/edit" element={<ProviderProfilePage />} />
          <Route path="services" element={<ProviderServicesPage />} />
          <Route path="services/add" element={<AddProviderServicePage />} />
          <Route path="services/:id/edit" element={<EditProviderServicePage />} />
          <Route path="bookings" element={<ProviderBookingsPage />} />
          <Route path="bookings/:id" element={<ProviderBookingDetailsPage />} />
          <Route path="calendar" element={<ProviderCalendarPage />} />
          <Route path="customers" element={<ProviderCustomersPage />} />
          <Route path="customers/:id" element={<ProviderCustomerDetailsPage />} />
          <Route path="messages" element={<ProviderMessagesPage />} />
          <Route path="notifications" element={<ProviderNotificationsPage />} />
          <Route path="reviews" element={<ProviderReviewsPage />} />
          <Route path="earnings" element={<ProviderEarningsPage />} />
          <Route path="analytics" element={<ProviderAnalyticsPage />} />
          <Route path="verification" element={<ProviderVerificationPage />} />
          <Route path="payouts" element={<ProviderPayoutsPage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
