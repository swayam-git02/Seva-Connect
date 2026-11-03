import React, { useState } from 'react';
import { IndianRupee, ArrowDownToLine, CheckCircle2, Clock } from 'lucide-react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useNotifications } from '../../hooks/useNotifications';

export const EarningsSummary = ({ earnings }) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { showSuccess } = useNotifications();

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      showSuccess('Withdrawal Initiated', '₹8,000 sent to HDFC Bank ****4910. Expected in 24 hours.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Card */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-emerald-200 uppercase tracking-wider block">
              Available Wallet Balance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">
              {formatCurrency(earnings?.walletBalance || 12450)}
            </h2>
            <p className="text-xs text-brand-100 mt-2">
              Next scheduled auto-transfer on Tuesday 10:00 AM
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={handleWithdraw}
            isLoading={isWithdrawing}
            leftIcon={ArrowDownToLine}
            className="bg-white text-brand-800 hover:bg-emerald-50 self-start sm:self-center font-bold"
          >
            Instant Withdraw
          </Button>
        </div>
      </div>

      {/* Payout history list */}
      <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card">
        <h3 className="text-sm font-semibold text-content-dark mb-4">
          Recent Bank Payouts
        </h3>

        <div className="divide-y divide-slate-100">
          {(earnings?.recentPayouts || []).map((payout) => (
            <div key={payout.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-content-dark">{payout.bankAccount}</p>
                  <p className="text-content-muted">{formatDate(payout.date)} • Ref #{payout.id}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-sm text-brand-700 block">
                  {formatCurrency(payout.amount)}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  {payout.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsSummary;
