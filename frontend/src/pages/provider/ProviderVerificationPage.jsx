// Ye provider ke liye verification workflow ka page hai, jahan service start/end confirmation actions milte hain.

import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';

export const ProviderVerificationPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight">
          KYC & Trade Verification Status
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Verification documents submitted to SevaConnect compliance administration.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <span className="inline-block bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
            Status: Fully Verified & Active
          </span>
          <h2 className="text-base font-bold text-emerald-950 mt-1">
            SevaConnect Blue Shield Partner Verified
          </h2>
          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
            Your government identification and trade certifications have passed police and trade screening. Your profile carries the verified badge for all customers.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-content-dark">
          Verified Documentation Records
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-surface-muted rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand-600" />
              <div>
                <p className="font-bold text-content-dark">Aadhar Card Verification</p>
                <p className="text-[11px] text-content-muted">Number: 4920 **** 9014</p>
              </div>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full text-[11px]">
              VERIFIED ✓
            </span>
          </div>

          <div className="p-4 bg-surface-muted rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand-600" />
              <div>
                <p className="font-bold text-content-dark">PAN Card (Tax Compliance)</p>
                <p className="text-[11px] text-content-muted">PAN: ABCDE1234F</p>
              </div>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full text-[11px]">
              VERIFIED ✓
            </span>
          </div>

          <div className="p-4 bg-surface-muted rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-brand-600" />
              <div>
                <p className="font-bold text-content-dark">ITI Electrical & Wireman Certificate</p>
                <p className="text-[11px] text-content-muted">Govt ITI Faridabad (2017)</p>
              </div>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full text-[11px]">
              VERIFIED ✓
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderVerificationPage;
