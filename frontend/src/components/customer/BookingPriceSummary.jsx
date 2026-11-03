import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export const BookingPriceSummary = ({
  basePrice = 399,
  taxes = 71,
  platformFee = 29,
  discount = 0,
}) => {
  const calculatedTaxes = taxes || Math.round(basePrice * 0.18);
  const total = basePrice + calculatedTaxes + platformFee - discount;

  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-subtle">
      <h3 className="text-sm font-semibold text-content-dark mb-4">
        Price Breakdown
      </h3>

      <div className="space-y-2.5 text-xs text-content-secondary">
        <div className="flex justify-between">
          <span>Service Visiting / Labour Charge</span>
          <span className="font-medium text-content-dark">{formatCurrency(basePrice)}</span>
        </div>

        <div className="flex justify-between">
          <span>GST / State Taxes (18%)</span>
          <span className="font-medium text-content-dark">{formatCurrency(calculatedTaxes)}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <span>Safety & Platform Fee</span>
            <Info className="h-3 w-3 text-content-muted" />
          </span>
          <span className="font-medium text-content-dark">{formatCurrency(platformFee)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-state-success font-medium">
            <span>Promotional Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-content-dark block">Total Payable</span>
          <span className="text-[10px] text-content-muted">Inclusive of all taxes</span>
        </div>
        <span className="text-lg font-bold text-brand-700">
          {formatCurrency(total)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>SevaConnect Upfront Guarantee: No hidden arrival charges</span>
      </div>
    </div>
  );
};

export default BookingPriceSummary;
