// Ye customer account registration page hai; form data validation ke baad signup request bheji jati hai.

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';
import { isValidEmail, isValidIndianMobile } from '../../utils/validators';

export const CustomerSignupPage = () => {
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
      showError('Required Fields', 'Please complete all required fields.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      showError('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!isValidIndianMobile(formData.phone)) {
      showError('Invalid Mobile', 'Please enter a valid 10-digit Indian phone number.');
      return;
    }

    if (formData.password.length < 6) {
      showError('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Password Mismatch', 'The passwords you entered do not match.');
      return;
    }

    if (!formData.termsAgreed) {
      showError('Terms Required', 'Please accept the SevaConnect terms to create your account.');
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
      showSuccess('Account Created!', `Welcome to SevaConnect, ${user.name}!`);
      navigate(ROUTES.CUSTOMER_DASHBOARD, { replace: true });
    } catch (err) {
      showError('Signup Failed', err.message || 'Unable to register account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Create Customer Account
        </h1>
        <p className="mt-1 text-xs text-content-secondary">
          Join thousands of Indian families enjoying trusted home doorstep services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Adarsh Sharma"
          leftIcon={User}
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="adarsh@example.com"
            leftIcon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Mobile Number"
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
            City / Region
          </label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-surface-border bg-white focus:outline-none focus:border-brand-500"
          >
            <option value="Faridabad">Faridabad (All Sectors)</option>
            <option value="Gurugram">Gurugram (DLF / Cyber City)</option>
            <option value="Noida">Noida / Greater Noida</option>
            <option value="South Delhi">South Delhi</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min 6 characters"
            leftIcon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter password"
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
            I agree to SevaConnect’s <span className="text-brand-600 underline">Terms of Service</span> and <span className="text-brand-600 underline">Safety Policies</span>.
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Create Customer Account
        </Button>
      </form>

      <div className="pt-4 border-t border-surface-border text-center text-xs text-content-secondary">
        <p>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerSignupPage;
