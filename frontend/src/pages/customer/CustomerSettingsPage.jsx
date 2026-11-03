import React, { useState } from 'react';
import { Lock, Bell, Shield, Smartphone } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useNotifications } from '../../hooks/useNotifications';

export const CustomerSettingsPage = () => {
  const { showSuccess } = useNotifications();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    showSuccess('Password Updated', 'Your account security credentials have been updated.');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Configure security, Dual-OTP alerts, and SMS notification preferences.
        </p>
      </div>

      {/* Security & Password */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-content-dark flex items-center gap-2">
          <Lock className="h-4 w-4 text-brand-600" />
          <span>Change Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Min 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit" variant="primary" size="sm">
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-content-dark flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand-600" />
          <span>Notification & Verification Channels</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-content-dark">SMS Starting/Ending Code Delivery</p>
              <p className="text-[11px] text-content-muted">Receive OTP codes on your mobile via SMS upon booking confirmation</p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-4 w-4 text-brand-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-content-dark">WhatsApp Status Alerts</p>
              <p className="text-[11px] text-content-muted">Real-time alerts when the technician is On The Way</p>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="h-4 w-4 text-brand-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-content-dark">Email Tax Invoices</p>
              <p className="text-[11px] text-content-muted">Automatically receive GST receipt after Ending Code verification</p>
            </div>
            <input
              type="checkbox"
              checked={emailInvoices}
              onChange={(e) => setEmailInvoices(e.target.checked)}
              className="h-4 w-4 text-brand-600 rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettingsPage;
