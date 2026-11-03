import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import authService from '../../services/authService';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      showError('Password Too Short', 'Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword('token_xyz', password);
      showSuccess('Password Updated', 'Your password has been changed. Please log in.');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      showError('Error', err.message || 'Unable to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Create New Password
        </h1>
        <p className="mt-1 text-xs text-content-secondary">
          Enter a strong, secure password for your SevaConnect account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min 6 characters"
          leftIcon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Re-enter new password"
          leftIcon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Update Password & Log In
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
