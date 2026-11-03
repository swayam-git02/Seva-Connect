import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import authService from '../../services/authService';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showError('Email Required', 'Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      showSuccess('Reset Link Dispatched', 'Check your inbox for password recovery instructions.');
    } catch (err) {
      showError('Error', err.message || 'Unable to process reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Reset Your Password
        </h1>
        <p className="mt-1 text-xs text-content-secondary">
          Enter your registered email address and we'll send a secure reset link.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-emerald-900">Recovery Email Sent</h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            We have sent password reset instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
          </p>
          <div className="pt-2">
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" size="sm">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registered Email"
            type="email"
            placeholder="your.email@example.com"
            leftIcon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Send Password Reset Link
          </Button>
        </form>
      )}

      <div className="pt-4 border-t border-surface-border text-center">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
