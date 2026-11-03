import React, { useState } from 'react';
import { ShieldCheck, Check, X, FileText, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { formatDateTime } from '../../utils/formatDate';
import { useNotifications } from '../../hooks/useNotifications';

export const VerificationReviewPanel = ({ verification, onApprove, onReject }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess } = useNotifications();

  const handleApprove = async () => {
    setIsLoading(true);
    await onApprove(verification.id);
    setIsLoading(false);
    showSuccess('KYC Approved', `${verification.providerName} has been verified and granted blue badge.`);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setIsLoading(true);
    await onReject(verification.id, rejectReason);
    setIsLoading(false);
    setShowRejectInput(false);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
            REF #{verification.id}
          </span>
          <h3 className="text-base font-bold text-white mt-1">
            {verification.providerName}
          </h3>
          <p className="text-xs text-slate-400">
            Trade: {verification.category} • {verification.city} • Phone: {verification.phone}
          </p>
        </div>

        <span className="text-xs text-slate-500">
          Submitted {formatDateTime(verification.submittedAt)}
        </span>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Uploaded Identification & Certificates
        </h4>
        <div className="flex flex-wrap gap-2">
          {(verification.documents || []).map((doc, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-xs text-slate-200"
            >
              <FileText className="h-4 w-4 text-emerald-400" />
              <span>{doc}</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded">
                VALID
              </span>
            </div>
          ))}
        </div>
      </div>

      {showRejectInput ? (
        <div className="p-3 bg-red-950/30 border border-red-900 rounded-lg space-y-2">
          <label className="block text-xs font-semibold text-red-300">
            Reason for Rejection:
          </label>
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Aadhar card photo is blurred or name mismatch..."
            className="w-full text-xs px-3 py-2 rounded border border-red-800 bg-slate-900 text-white focus:outline-none"
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => setShowRejectInput(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleReject} isLoading={isLoading}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      ) : (
        <div className="pt-2 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRejectInput(true)}
            leftIcon={X}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Reject KYC
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApprove}
            leftIcon={Check}
            isLoading={isLoading}
          >
            Approve & Verify Partner
          </Button>
        </div>
      )}
    </div>
  );
};

export default VerificationReviewPanel;
