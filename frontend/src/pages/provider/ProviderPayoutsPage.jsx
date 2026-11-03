import React, { useState } from 'react';
import { IndianRupee, ArrowDownToLine, CheckCircle2, Building, Clock } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useNotifications } from '../../hooks/useNotifications';

export const ProviderPayoutsPage = () => {
  const { showSuccess, showError } = useNotifications();
  const [walletBalance, setWalletBalance] = useState(12450);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 'TXN-9021', type: 'Credit (Job #SC-8402)', amount: 899, date: '2026-10-14', status: 'COMPLETED' },
    { id: 'TXN-8812', type: 'Withdrawal to HDFC Bank', amount: -8400, date: '2026-10-15', status: 'TRANSFERRED' },
    { id: 'TXN-8740', type: 'Credit (Job #SC-8210)', amount: 499, date: '2026-10-11', status: 'COMPLETED' },
  ]);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      showError('Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }
    if (amount > walletBalance) {
      showError('Insufficient Balance', 'Withdrawal amount exceeds your current wallet balance.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setWalletBalance(walletBalance - amount);
      const newTxn = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'Withdrawal to HDFC Bank ****4910',
        amount: -amount,
        date: new Date().toISOString().split('T')[0],
        status: 'PROCESSING',
      };
      setTransactions([newTxn, ...transactions]);
      setWithdrawAmount('');
      setIsLoading(false);
      showSuccess('Withdrawal Processed', `${formatCurrency(amount)} initiated to your HDFC bank account.`);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          Wallet Balance & Bank Withdrawals
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Withdraw funds anytime or let our auto-payout system transfer them every Tuesday.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-800 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-between md:col-span-1">
          <div>
            <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
              Withdrawable Wallet Balance
            </span>
            <p className="text-3xl font-extrabold mt-2 tracking-tight">
              {formatCurrency(walletBalance)}
            </p>
          </div>

          <div className="pt-4 border-t border-brand-600/60 mt-4 text-[11px] text-brand-100 flex items-center gap-2">
            <Building className="h-4 w-4 shrink-0 text-emerald-300" />
            <span>HDFC Bank A/C: ****4910</span>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-content-dark">
            Request Manual Withdrawal
          </h3>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <Input
              label="Withdrawal Amount (₹)"
              type="number"
              placeholder="e.g. 5000"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs text-content-muted">
              <span>Transfer Destination:</span>
              <strong className="text-content-dark">HDFC Bank Sector 15 Branch</strong>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
              leftIcon={ArrowDownToLine}
            >
              Transfer Funds to Bank
            </Button>
          </form>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-content-dark">
          Wallet Transaction Ledger
        </h3>

        <div className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <div key={t.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-content-dark">{t.type}</p>
                <p className="text-content-muted">{formatDate(t.date)} • Ref #{t.id}</p>
              </div>

              <div className="text-right">
                <span className={`text-sm font-bold block ${
                  t.amount > 0 ? 'text-emerald-700' : 'text-slate-800'
                }`}>
                  {t.amount > 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
                </span>
                <span className="text-[10px] text-content-muted uppercase font-semibold">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderPayoutsPage;
