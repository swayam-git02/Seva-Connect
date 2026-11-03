import React, { useState } from 'react';
import { Bell, IndianRupee, ShieldCheck, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import { useNotifications } from '../../hooks/useNotifications';

export const ProviderNotificationsPage = () => {
  const { showSuccess } = useNotifications();
  const [alerts, setAlerts] = useState([
    {
      id: 'p-notif-1',
      title: 'New Service Request: Sector 15',
      message: 'Adarsh Sharma requested Ceiling Fan Installation & MCB check for today 03:00 PM.',
      time: '25 mins ago',
      type: 'request',
    },
    {
      id: 'p-notif-2',
      title: 'Weekly Payout Deposited',
      message: '₹8,400 has been transferred to your HDFC bank account ****4910.',
      time: 'Yesterday',
      type: 'payout',
    },
    {
      id: 'p-notif-3',
      title: 'KYC Document Verification Status',
      message: 'Your Aadhar & ITI Trade Certificate have been approved by SevaConnect Administrator.',
      time: '3 days ago',
      type: 'kyc',
    },
  ]);

  const markAllRead = () => {
    showSuccess('Alerts Cleared', 'All notifications marked as read.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content-dark tracking-tight">
            Partner Alerts & Job Notifications
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Real-time job requests and bank payout notifications.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} leftIcon={Check}>
          Mark All Read
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-card divide-y divide-slate-100 overflow-hidden">
        {alerts.map((a) => (
          <div key={a.id} className="p-5 flex items-start gap-4">
            <div className={`p-2 rounded-xl shrink-0 ${
              a.type === 'payout' ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-50 text-brand-600'
            }`}>
              {a.type === 'payout' ? <IndianRupee className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-content-dark">{a.title}</h4>
                <span className="text-[10px] text-content-muted">{a.time}</span>
              </div>
              <p className="text-xs text-content-secondary mt-1 leading-relaxed">{a.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderNotificationsPage;
