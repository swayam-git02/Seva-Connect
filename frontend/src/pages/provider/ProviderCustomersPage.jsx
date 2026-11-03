import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Phone, MapPin, ChevronRight, Calendar } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export const ProviderCustomersPage = () => {
  const [customers] = useState([
    {
      id: 'cust-1',
      name: 'Adarsh Sharma',
      phone: '+91 98765 43210',
      address: 'House 412, Sector 15 Main Market, Faridabad',
      lastService: 'Ceiling Fan Installation',
      lastDate: '2026-10-21',
      totalJobs: 2,
    },
    {
      id: 'cust-2',
      name: 'Vikas Malhotra',
      phone: '+91 98112 00112',
      address: 'Sector 16A, Faridabad',
      lastService: 'MCB Tripping Fix',
      lastDate: '2026-10-12',
      totalJobs: 1,
    },
    {
      id: 'cust-3',
      name: 'Neha Grover',
      phone: '+91 97170 33445',
      address: 'Sector 14, Faridabad',
      lastService: 'Switchboard Socket Replacement',
      lastDate: '2026-10-01',
      totalJobs: 3,
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Customer Directory
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Directory of households you have served with repeat service records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-content-dark">{c.name}</h3>
                <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                  {c.totalJobs} Orders
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs text-content-secondary">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-content-muted" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-content-muted" />
                  <span className="truncate">{c.address}</span>
                </div>
                <div className="flex items-center gap-2 text-content-muted text-[11px] pt-1">
                  <Calendar className="h-3 w-3" />
                  <span>Last served: {c.lastDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <Link
                to={`/provider/customers/${c.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
              >
                <span>View Job History</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderCustomersPage;
