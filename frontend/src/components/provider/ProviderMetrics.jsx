import React from 'react';
import { IndianRupee, Briefcase, Star, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const ProviderMetrics = ({ stats }) => {
  const metrics = [
    {
      title: "Today's Earnings",
      value: formatCurrency(stats?.todayEarnings || 2450),
      subtitle: '3 jobs completed',
      icon: IndianRupee,
      color: 'text-brand-600 bg-brand-50 border-brand-100',
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 2,
      subtitle: 'Awaiting your response',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Jobs This Month',
      value: stats?.monthlyJobs || 24,
      subtitle: '98% on-time arrival',
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Partner Rating',
      value: `${stats?.rating || 4.9} / 5`,
      subtitle: 'Based on 142 reviews',
      icon: Star,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="bg-white rounded-xl border border-surface-border p-5 shadow-subtle hover:shadow-card transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-content-muted uppercase tracking-wider">
                {item.title}
              </span>
              <div className={`p-2 rounded-lg border ${item.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-content-dark mt-3">{item.value}</p>
            <p className="text-xs text-content-muted mt-1">{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProviderMetrics;
