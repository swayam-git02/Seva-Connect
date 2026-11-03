import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UploadCloud, CheckCircle2, FileText, ArrowRight, Building } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import { useNotifications } from '../../hooks/useNotifications';
import { ROUTES } from '../../constants/routes';

export const ProviderOnboardingPage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    aadharNumber: '4920 8129 9014',
    panNumber: 'ABCDE1234F',
    bankAccount: '5010029481920',
    ifscCode: 'HDFC0000240',
    bankName: 'HDFC Bank, Sector 15 Faridabad',
    uploadedAadhar: true,
    uploadedCert: true,
  });

  const handleComplete = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showSuccess('KYC Submitted', 'Documents sent for admin review. Verification completes within 24 hours.');
      navigate(ROUTES.PROVIDER_DASHBOARD);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
          Partner Verification
        </span>
        <h1 className="text-2xl font-bold text-content-dark tracking-tight mt-1">
          Partner KYC & Bank Payout Setup
        </h1>
        <p className="text-xs text-content-secondary mt-1">
          Required by platform safety standards before receiving live customer bookings.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-card space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-semibold">
          <span className={step >= 1 ? 'text-brand-600' : 'text-content-muted'}>1. Identity ID</span>
          <span className="text-slate-300">→</span>
          <span className={step >= 2 ? 'text-brand-600' : 'text-content-muted'}>2. Document Upload</span>
          <span className="text-slate-300">→</span>
          <span className={step >= 3 ? 'text-brand-600' : 'text-content-muted'}>3. Bank Account</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-content-dark">Government Identification</h3>
            <Input
              label="12-Digit Aadhar Card Number"
              placeholder="XXXX XXXX XXXX"
              value={formData.aadharNumber}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              required
            />
            <Input
              label="PAN Card Number"
              placeholder="ABCDE1234F"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
              required
            />
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="md" onClick={() => setStep(2)} rightIcon={ArrowRight}>
                Continue to Documents
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-content-dark">Upload Identification & Trade Cert</h3>

            <div className="p-4 border-2 border-dashed border-brand-300 bg-brand-50/40 rounded-xl text-center space-y-2">
              <UploadCloud className="h-8 w-8 text-brand-600 mx-auto" />
              <p className="text-xs font-bold text-content-dark">Aadhar Card (Front & Back)</p>
              <p className="text-[11px] text-content-muted">PNG, JPG or PDF up to 5MB</p>
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                <CheckCircle2 className="h-3 w-3" />
                <span>aadhar_doc_verified.pdf attached</span>
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-slate-200 bg-surface-muted rounded-xl text-center space-y-2">
              <FileText className="h-8 w-8 text-content-muted mx-auto" />
              <p className="text-xs font-bold text-content-dark">Trade Certificate / ITI / Skill Proof</p>
              <p className="text-[11px] text-content-muted">Optional but boosts customer booking rank</p>
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                <CheckCircle2 className="h-3 w-3" />
                <span>iti_electrician_cert.pdf attached</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="md" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(3)} rightIcon={ArrowRight}>
                Continue to Bank Setup
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleComplete} className="space-y-4">
            <h3 className="text-sm font-bold text-content-dark">Bank Details for Direct Deposits</h3>
            <Input
              label="Bank Account Number"
              value={formData.bankAccount}
              onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                required
              />
              <Input
                label="Bank & Branch Name"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                required
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Earnings are settled automatically every Tuesday at 10:00 AM.</span>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="md" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
                Submit for KYC Approval
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProviderOnboardingPage;
