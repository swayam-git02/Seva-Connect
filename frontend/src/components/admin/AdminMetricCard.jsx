import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AdminMetricCard = ({ title, value, change, isPositive = true, icon: Icon, color = 'emerald' }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-card hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <p className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
        {value}
      </p>

      {change && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
          )}
          <span className={isPositive ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
            {change}
          </span>
          <span className="text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default AdminMetricCard;
