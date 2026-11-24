// Ye customer account registration page hai; form data validation ke baad signup request bheji jati hai.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LanguageToggle from '../../components/common/LanguageToggle';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import { isValidEmail, isValidIndianMobile } from '../../utils/validators';

export const CustomerSignupPage = () => {
  const { t, isHindi } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Faridabad',
    password: '',
    confirmPassword: '',
    termsAgreed: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signupCustomer } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      showError('Required Fields', isHindi ? 'कृपया सभी आवश्यक फ़ील्ड भरें।' : 'Please complete all required fields.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      showError('Invalid Email', isHindi ? 'कृपया मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }

    if (!isValidIndianMobile(formData.phone)) {
      showError('Invalid Mobile', isHindi ? 'कृपया मान्य 10-अंकीय भारतीय फ़ोन नंबर दर्ज करें।' : 'Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (formData.password.length < 6) {
      showError('Weak Password', isHindi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Password Mismatch', isHindi ? 'पासवर्ड मेल नहीं खा रहे हैं।' : 'The passwords you entered do not match.');
      return;
    }

    if (!formData.termsAgreed) {
      showError('Terms Required', isHindi ? 'कृपया आगे बढ़ने के लिए सेवा की शर्तें स्वीकार करें।' : 'Please accept the SevaConnect terms to create your account.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await signupCustomer({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city,
        password: formData.password,
      });

      showSuccess(
        isHindi ? 'खाता सफलतापूर्वक बना!' : 'Account Created!',
        isHindi ? `सेवाकनेक्ट में स्वागत है, ${user.name}!` : `Welcome to SevaConnect, ${user.name}!`
      );
      navigate(ROUTES.CUSTOMER_DASHBOARD, { replace: true });
    } catch (err) {
      showError('Registration Failed', err.message || (isHindi ? 'पंजीकरण विफल रहा।' : 'Unable to create account.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prominent Language Choice: English / Hindi */}
      <LanguageToggle variant="card" />

      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          {t('auth.createCustomerTitle')}
        </h1>
        <p className="mt-1 text-xs text-content-secondary">
          {t('auth.createCustomerSubtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('auth.fullName')}
          placeholder={isHindi ? 'उदा. आदर्श शर्मा' : 'e.g. Adarsh Sharma'}
          leftIcon={User}
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('auth.email')}
            type="email"
            placeholder="adarsh@example.com"
            leftIcon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label={t('auth.phoneNumber')}
            type="tel"
            placeholder="98765 43210"
            leftIcon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-content-dark mb-1.5">
            {t('auth.city')}
          </label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
          >
            <option value="Faridabad">{isHindi ? 'फरीदाबाद (सभी सेक्टर)' : 'Faridabad (All Sectors)'}</option>
            <option value="Gurugram">{isHindi ? 'गुरुग्राम (डीएलएफ / साइबर सिटी)' : 'Gurugram (DLF / Cyber City)'}</option>
            <option value="Noida">{isHindi ? 'नोएडा / ग्रेटर नोएडा' : 'Noida / Greater Noida'}</option>
            <option value="South Delhi">{isHindi ? 'दक्षिण दिल्ली' : 'South Delhi'}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            placeholder={isHindi ? 'कम से कम 6 अक्षर' : 'Min 6 characters'}
            leftIcon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label={t('auth.confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            placeholder={isHindi ? 'पासवर्ड दोबारा डालें' : 'Re-enter password'}
            leftIcon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={formData.termsAgreed}
            onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-content-secondary cursor-pointer select-none">
            {t('auth.termsAgree')}
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          {t('auth.createCustomerTitle')}
        </Button>
      </form>

      <div className="pt-4 border-t border-surface-border text-center text-xs text-content-secondary">
        <p>
          {t('auth.haveAccount')}{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerSignupPage;
