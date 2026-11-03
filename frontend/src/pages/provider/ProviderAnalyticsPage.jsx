import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const ProviderAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Performance & Analytics
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Detailed metrics tracking your customer satisfaction and job acceptance velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
          <span className="text-xs font-semibold text-content-muted">Acceptance Rate</span>
          <p className="text-2xl font-bold text-content-dark mt-2">96.8%</p>
          <span className="text-[11px] text-emerald-600 font-medium">Top 5% in Faridabad</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
          <span className="text-xs font-semibold text-content-muted">Average Arrival Time</span>
          <p className="text-2xl font-bold text-content-dark mt-2">24 mins</p>
          <span className="text-[11px] text-emerald-600 font-medium">Under 30 min target</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
          <span className="text-xs font-semibold text-content-muted">Ending Code Release</span>
          <p className="text-2xl font-bold text-content-dark mt-2">100%</p>
          <span className="text-[11px] text-content-muted">Zero dispute holdbacks</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
          <span className="text-xs font-semibold text-content-muted">Repeat Customers</span>
          <p className="text-2xl font-bold text-content-dark mt-2">38%</p>
          <span className="text-[11px] text-brand-600 font-medium">Strong local trust</span>
        </div>
      </div>

      {/* Monthly Chart Card */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-content-dark flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-brand-600" />
            <span>Completed Jobs by Month (2026)</span>
          </h3>
          <span className="text-xs text-content-muted">Updated real-time</span>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4">
          {[
            { month: 'Jun', count: 18, height: '40%' },
            { month: 'Jul', count: 26, height: '60%' },
            { month: 'Aug', count: 32, height: '75%' },
            { month: 'Sep', count: 38, height: '85%' },
            { month: 'Oct', count: 44, height: '95%' },
          ].map((bar) => (
            <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-content-dark">{bar.count}</span>
              <div
                className="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600"
                style={{ height: bar.height }}
              />
              <span className="text-xs text-content-muted font-medium">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalyticsPage;
