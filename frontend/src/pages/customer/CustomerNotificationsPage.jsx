import React, { useState } from 'react';
import { Bell, CheckCircle2, ShieldCheck, Tag, Info, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import { useNotifications } from '../../hooks/useNotifications';

export const CustomerNotificationsPage = () => {
  const { showSuccess } = useNotifications();
  const [items, setItems] = useState([
    {
      id: 'notif-1',
      title: 'Technician Dispatched',
      message: 'Ramesh Kumar (Electrician) is on the way to your Sector 15 house. Keep your Starting Code ready.',
      time: '15 mins ago',
      read: false,
      type: 'dispatch',
    },
    {
      id: 'notif-2',
      title: 'Starting Code Reminder',
      message: 'Never disclose your Ending Code until repair work is completely finished.',
      time: '2 hours ago',
      read: false,
      type: 'security',
    },
    {
      id: 'notif-3',
      title: '15% Festive Discount Applied',
      message: 'Use code SEVANCR on your next AC servicing or plumbing job.',
      time: 'Yesterday',
      read: true,
      type: 'promo',
    },
  ]);

  const markAllRead = () => {
    setItems(items.map((i) => ({ ...i, read: true })));
    showSuccess('Updated', 'All notifications marked as read.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content-dark tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-xs text-content-secondary mt-1">
            Real-time updates regarding technician arrival and booking security.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead} leftIcon={Check}>
          Mark All as Read
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-card divide-y divide-slate-100 overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-5 flex items-start gap-4 transition-colors ${
              item.read ? 'bg-white' : 'bg-brand-50/30'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              item.type === 'security'
                ? 'bg-amber-100 text-amber-700'
                : item.type === 'dispatch'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {item.type === 'security' ? (
                <ShieldCheck className="h-5 w-5" />
              ) : item.type === 'dispatch' ? (
                <Bell className="h-5 w-5" />
              ) : (
                <Tag className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-content-dark">{item.title}</h4>
                <span className="text-[10px] text-content-muted">{item.time}</span>
              </div>
              <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerNotificationsPage;
