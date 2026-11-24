// Ye login form user ki credentials collect karke authentication state create karta hai.

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LanguageToggle from '../../components/common/LanguageToggle';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import { USER_ROLES } from '../../constants/userRoles';

export const LoginPage = () => {
  const { t, isHindi } = useLanguage();
  const [role, setRole] = useState(USER_ROLES.CUSTOMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = location.state?.returnUrl;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Validation Error', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login({ email, password, role });
      showSuccess('Welcome back!', `Logged in successfully as ${user.name}.`);

      if (returnUrl) {
        navigate(returnUrl, { replace: true });
      } else if (user.role === USER_ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else if (user.role === USER_ROLES.PROVIDER) {
        navigate(ROUTES.PROVIDER_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.CUSTOMER_DASHBOARD, { replace: true });
      }
    } catch (err) {
      showError('Login Failed', err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleType) => {
    setRole(roleType);
    if (roleType === USER_ROLES.CUSTOMER) {
      setEmail('customer@sevaconnect.in');
      setPassword('password123');
    } else if (roleType === USER_ROLES.PROVIDER) {
      setEmail('provider@sevaconnect.in');
      setPassword('password123');
    } else if (roleType === USER_ROLES.ADMIN) {
      setEmail('admin@sevaconnect.in');
      setPassword('admin123');
    }
  };

  return (
    <div className="space-y-6">
      {/* Prominent Language Choice: English / Hindi */}
      <LanguageToggle variant="card" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          {t('auth.welcome')}
        </h1>
        <p className="mt-1 text-xs text-content-secondary">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      {/* Role Selector Tabs (Customer / Provider / Admin) */}
      <div className="flex bg-surface-muted p-1 rounded-xl border border-surface-border">
        <button
          type="button"
          onClick={() => {
            setRole(USER_ROLES.CUSTOMER);
            setEmail('');
            setPassword('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            role === USER_ROLES.CUSTOMER
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-content-secondary hover:text-content-dark'
          }`}
        >
          {t('auth.customer')}
        </button>
        <button
          type="button"
          onClick={() => {
            setRole(USER_ROLES.PROVIDER);
            setEmail('');
            setPassword('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            role === USER_ROLES.PROVIDER
              ? 'bg-brand-500 text-white shadow-sm'
              : 'text-content-secondary hover:text-content-dark'
          }`}
        >
          {t('auth.provider')}
        </button>
        <button
          type="button"
          onClick={() => {
            setRole(USER_ROLES.ADMIN);
            setEmail('');
            setPassword('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            role === USER_ROLES.ADMIN
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-content-secondary hover:text-content-dark'
          }`}
        >
          {t('auth.admin')}
        </button>
      </div>

      {/* Quick Test Credential Banner */}
      <div className="bg-brand-50/70 border border-brand-200 rounded-xl p-3 text-xs text-brand-900 flex items-center justify-between">
        <span>
          {isHindi
            ? `${t('auth.' + role.toLowerCase())} क्रेडेंशियल ऑटो-फिल करें:`
            : `Click to auto-fill ${role} credentials:`}
        </span>
        <button
          type="button"
          onClick={() => handleQuickFill(role)}
          className="font-bold underline text-brand-700 hover:text-brand-800"
        >
          {isHindi ? 'ऑटो फिल' : 'Auto Fill'}
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('auth.email')}
          type="email"
          placeholder="your.email@example.com"
          leftIcon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div>
          <Input
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-content-muted hover:text-content-dark"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            required
          />

          <div className="flex justify-end mt-1.5">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          {isHindi
            ? `${role === USER_ROLES.PROVIDER ? 'पार्टनर पोर्टल' : role === USER_ROLES.ADMIN ? 'एडमिन पोर्टल' : 'सेवाकनेक्ट'} में लॉग इन करें`
            : `Sign In to ${role === USER_ROLES.PROVIDER ? 'Partner Portal' : role === USER_ROLES.ADMIN ? 'Admin Portal' : 'SevaConnect'}`}
        </Button>
      </form>

      {/* Footer links */}
      <div className="pt-4 border-t border-surface-border text-center text-xs text-content-secondary">
        {role === USER_ROLES.PROVIDER ? (
          <p>
            {isHindi ? 'नए सेवा कारीगर / तकनीशियन हैं? ' : 'New service professional? '}
            <Link to={ROUTES.PROVIDER_SIGNUP} className="font-semibold text-brand-600 hover:underline">
              {isHindi ? 'पार्टनर के रूप में पंजीकरण करें' : 'Register as Partner'}
            </Link>
          </p>
        ) : (
          <p>
            {isHindi ? 'अभी तक खाता नहीं है? ' : "Don't have an account yet? "}
            <Link to={ROUTES.SIGNUP} className="font-semibold text-brand-600 hover:underline">
              {isHindi ? 'ग्राहक खाता बनाएं' : 'Create Customer Account'}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
