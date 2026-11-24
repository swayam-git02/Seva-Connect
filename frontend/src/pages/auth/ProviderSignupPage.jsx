// Ye provider registration page hai, jo service professional ka account aur profile information collect karta hai.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import { SERVICE_CATEGORIES } from '../../constants/serviceCategories';
import { isValidEmail, isValidIndianMobile } from '../../utils/validators';
import LanguageToggle from '../../components/common/LanguageToggle';
import { useLanguage } from '../../hooks/useLanguage';

export const ProviderSignupPage = () => {
  const { t, isHindi } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    category: 'electrician',
    experienceYears: '5',
    email: '',
    phone: '',
    city: 'Faridabad',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signupProvider } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.businessName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password
    ) {
      showError('Required Fields', 'Please complete all required fields.');
      return;
    }

    if (!isValidEmail(formData.email.trim())) {
      showError('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!isValidIndianMobile(formData.phone.trim())) {
      showError('Invalid Mobile', 'Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (formData.password.length < 6) {
      showError('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const provider = await signupProvider({
        name: formData.fullName.trim(),
        fullName: formData.fullName.trim(),
        businessName: formData.businessName.trim(),
        category: formData.category,
        experienceYears: Number(formData.experienceYears) || 1,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city,
        password: formData.password,
      });
      showSuccess('Registration Successful!', 'Welcome partner! Complete your onboarding KYC next.');
      navigate(ROUTES.PROVIDER_ONBOARDING, { replace: true });
    } catch (err) {
      const detailedMsg =
        err.data?.details?.map((d) => d.message).join(', ') ||
        err.data?.message ||
        err.message ||
        'Unable to register partner account.';
      showError('Registration Failed', detailedMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LanguageToggle variant="card" />
      <div>
        <div className="inline-flex items-center gap-1.5 bg-brand-50 px-2.5 py-1 rounded-md text-[11px] font-semibold text-brand-700 mb-2">
          <Briefcase className="h-3.5 w-3.5" />
          <span>{isHindi ? 'पार्टनर ऑनबोर्डिंग पोर्टल' : 'Partner Onboarding Portal'}</span>
        </div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          {isHindi ? 'SevaConnect के साथ अपना स्थानीय सेवा व्यवसाय बढ़ाएँ।' : 'Grow your local service business with SevaConnect.'}
        </h1>
        <p className="mt-1 text-xs text-content-secondary">
          {isHindi ? 'अपने क्षेत्र में सत्यापित काम पाएँ, हर मंगलवार सीधे बैंक भुगतान और पहले 10 ऑर्डर पर कोई प्लेटफ़ॉर्म शुल्क नहीं।' : 'Get verified jobs in your sector, direct bank payouts every Tuesday, and zero platform fee on your first 10 orders.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={isHindi ? 'आपका पूरा नाम' : 'Your Full Name'}
            placeholder="e.g. Ramesh Kumar"
            leftIcon={User}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <Input
            label={isHindi ? 'व्यवसाय / सेवा का नाम' : 'Business / Enterprise Name'}
            placeholder="e.g. Ramesh Electricals"
            leftIcon={Briefcase}
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-content-dark mb-1.5">
              {isHindi ? 'मुख्य सेवा श्रेणी' : 'Primary Trade Category'}
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
            >
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-content-dark mb-1.5">
              {t('auth.experience')}
            </label>
            <select
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
            >
              <option value="1">1-2 Years</option>
              <option value="3">3-5 Years</option>
              <option value="6">6-10 Years</option>
              <option value="10">10+ Years Master</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={isHindi ? 'मोबाइल नंबर (काम के SMS के लिए)' : 'Mobile Number (For Job SMS)'}
            type="tel"
            placeholder="98112 34567"
            leftIcon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <Input
            label={t('auth.email')}
            type="email"
            placeholder="ramesh@gmail.com"
            leftIcon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-content-dark mb-1.5">
              {isHindi ? 'सेवा का मुख्य शहर' : 'Service Base City'}
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
            >
              <option value="Faridabad">Faridabad</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Noida">Noida</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          <Input
            label={isHindi ? 'पासवर्ड बनाएँ' : 'Set Password'}
            type={showPassword ? 'text' : 'password'}
            placeholder="Min 6 characters"
            leftIcon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-content-muted hover:text-content-dark"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          {isHindi ? 'पार्टनर पंजीकरण करें और KYC जारी रखें' : 'Register Partner & Continue KYC'}
        </Button>
      </form>

      <div className="pt-4 border-t border-surface-border text-center text-xs text-content-secondary">
        <p>
          {isHindi ? 'पहले से पार्टनर हैं? ' : 'Already registered as a partner? '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:underline">
            {isHindi ? 'पार्टनर लॉग इन' : 'Partner Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ProviderSignupPage;
